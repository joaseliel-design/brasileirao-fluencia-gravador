import os, re, json, base64, tempfile, unicodedata, difflib, subprocess, math
from pathlib import Path
import requests
import numpy as np
import parselmouth
from faster_whisper import WhisperModel

BRIDGE_URL = os.environ["BRIDGE_URL"].strip()
BRIDGE_TOKEN = os.environ["BRIDGE_TOKEN"].strip()
MODEL_SIZE = os.environ.get("FW_MODEL", "medium").strip()
MAX_JOBS = int(os.environ.get("MAX_JOBS", "2"))

def bridge(action, **payload):
    body = {"token": BRIDGE_TOKEN, "action": action, **payload}
    r = requests.post(BRIDGE_URL, json=body, timeout=180)
    r.raise_for_status()
    data = r.json()
    if not data.get("ok"):
        raise RuntimeError(data.get("error") or f"Bridge error in {action}")
    return data

def tokens(text):
    return re.findall(r"[A-Za-zÀ-ÿ0-9]+(?:[-’'][A-Za-zÀ-ÿ0-9]+)*", text or "")

def norm(text):
    s = unicodedata.normalize("NFD", (text or "").lower())
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    s = s.replace("’", "").replace("'", "")
    return re.sub(r"[^a-z0-9-]", "", s)

def as_bool(value):
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() in ("true", "1", "yes", "sim")

def merge_observed_compounds(raw_canon, timed_words):
    """Merge adjacent ASR tokens when they exactly form a hyphenated canonical word.
    Example: canonical 'segunda-feira' and ASR ['segunda', 'feira'] become one observed token.
    This preserves the official word count while avoiding a false precision error.
    """
    compound_parts = []
    for tok in raw_canon:
        if "-" in tok:
            parts = [norm(p) for p in tok.split("-") if norm(p)]
            if len(parts) >= 2:
                compound_parts.append((parts, tok))

    if not compound_parts:
        return timed_words

    out = []
    i = 0
    while i < len(timed_words):
        matched = False
        for parts, canonical_tok in compound_parts:
            n = len(parts)
            if i + n <= len(timed_words):
                obs_parts = [norm(timed_words[i+j]["text"]) for j in range(n)]
                if obs_parts == parts:
                    out.append({
                        "text": canonical_tok,
                        "start": timed_words[i].get("start"),
                        "end": timed_words[i+n-1].get("end"),
                    })
                    i += n
                    matched = True
                    break
        if not matched:
            out.append(timed_words[i])
            i += 1
    return out

def align(canon, obs):
    n, m = len(canon), len(obs)
    dp = [[0]*(m+1) for _ in range(n+1)]
    bt = [[None]*(m+1) for _ in range(n+1)]
    for i in range(1, n+1):
        dp[i][0], bt[i][0] = i, "DEL"
    for j in range(1, m+1):
        dp[0][j], bt[0][j] = j, "INS"
    for i in range(1, n+1):
        for j in range(1, m+1):
            same = canon[i-1] == obs[j-1]
            choices = [
                (dp[i-1][j-1] + (0 if same else 1), "MATCH" if same else "SUB"),
                (dp[i-1][j] + 1, "DEL"),
                (dp[i][j-1] + 1, "INS"),
            ]
            dp[i][j], bt[i][j] = min(choices, key=lambda x: x[0])
    ops = []
    i, j = n, m
    while i > 0 or j > 0:
        op = bt[i][j]
        if op in ("MATCH", "SUB"):
            ops.append({"type": op, "ci": i-1, "oj": j-1, "canon": canon[i-1], "obs": obs[j-1]})
            i -= 1; j -= 1
        elif op == "DEL":
            ops.append({"type": "DEL", "ci": i-1, "oj": None, "canon": canon[i-1], "obs": None})
            i -= 1
        else:
            ops.append({"type": "INS", "ci": None, "oj": j-1, "canon": None, "obs": obs[j-1]})
            j -= 1
    ops.reverse()
    return ops

def classify_events(ops, raw_canon, raw_obs, timed_words):
    events = []
    counts = {"substitutions": 0, "omissions": 0, "insertions": 0, "repetitions": 0, "autocorrections": 0}
    for k, op in enumerate(ops):
        if op["type"] == "MATCH":
            continue
        if op["type"] == "SUB":
            counts["substitutions"] += 1
            events.append({"tipo":"SUBSTITUICAO","pos":op["ci"]+1,"esperado":raw_canon[op["ci"]],"lido":raw_obs[op["oj"]]})
        elif op["type"] == "DEL":
            counts["omissions"] += 1
            events.append({"tipo":"OMISSAO","pos":op["ci"]+1,"esperado":raw_canon[op["ci"]]})
        else:
            oi = op["oj"]
            inserted = norm(raw_obs[oi])
            next_match = ops[k+1] if k+1 < len(ops) else None
            prev_match = ops[k-1] if k > 0 else None
            adjacent_target = None
            if next_match and next_match["type"] == "MATCH":
                adjacent_target = next_match["canon"]
            elif prev_match and prev_match["type"] == "MATCH":
                adjacent_target = prev_match["canon"]
            if adjacent_target and inserted == adjacent_target:
                counts["repetitions"] += 1
                events.append({"tipo":"REPETICAO","lido":raw_obs[oi]})
            elif next_match and next_match["type"] == "MATCH":
                sim = difflib.SequenceMatcher(None, inserted, next_match["canon"]).ratio()
                if len(inserted) >= 2 and sim >= 0.72:
                    counts["autocorrections"] += 1
                    events.append({"tipo":"AUTOCORRECAO","tentativa":raw_obs[oi],"corrigido_para":raw_canon[next_match["ci"]]})
                else:
                    counts["insertions"] += 1
                    events.append({"tipo":"INSERCAO","lido":raw_obs[oi]})
            else:
                counts["insertions"] += 1
                events.append({"tipo":"INSERCAO","lido":raw_obs[oi]})
    return counts, events

def canonical_marks(text):
    pattern = re.compile(r"[A-Za-zÀ-ÿ0-9]+(?:[-’'][A-Za-zÀ-ÿ0-9]+)*")
    matches = list(pattern.finditer(text or ""))
    marks = []
    for idx, match in enumerate(matches):
        next_start = matches[idx+1].start() if idx + 1 < len(matches) else len(text or "")
        marks.append((text or "")[match.end():next_start])
    return marks

def rhythm_regularity_score(cv):
    if cv <= 0.20:
        score = 35
    elif cv <= 0.30:
        score = 35 - ((cv - 0.20) / 0.10) * 5
    elif cv <= 0.45:
        score = 30 - ((cv - 0.30) / 0.15) * 10
    elif cv <= 0.60:
        score = 20 - ((cv - 0.45) / 0.15) * 10
    else:
        score = max(0, 10 - ((cv - 0.60) / 0.40) * 10)
    return round(max(0, min(35, score)), 2)

def rhythm_score(ops, timed_words, canonical_text, counts):
    """Ritmo oficial v1 (0–100), separado de velocidade.

    Continuidade 45:
      penaliza pausas residuais entre tokens depois de tolerar pontuação.
    Regularidade 35:
      usa o CV da taxa local em janelas de 5 palavras sem cruzar pontuação.
    Hesitações/Reinícios 20:
      penaliza stalls relevantes, repetições e autocorreções.

    Duração longa dentro de uma palavra NÃO gera penalização direta.
    """
    marks = canonical_marks(canonical_text)
    obs_to_canon = {}
    for op in ops:
        if op.get("oj") is not None and op.get("ci") is not None:
            obs_to_canon[op["oj"]] = op["ci"]

    residuals = []
    continuity_penalty = 0.0

    for j in range(len(timed_words) - 1):
        end = timed_words[j].get("end")
        start_next = timed_words[j+1].get("start")
        if end is None or start_next is None:
            continue

        gap = max(0.0, float(start_next) - float(end))
        ci = obs_to_canon.get(j)
        mark = marks[ci] if ci is not None and ci < len(marks) else ""

        if re.search(r"[.!?;:]", mark):
            allowance = 0.75
        elif "," in mark:
            allowance = 0.45
        else:
            allowance = 0.0

        residual = max(0.0, gap - allowance)
        residuals.append(residual)

        if residual >= 1.0:
            continuity_penalty += 5.0
        elif residual >= 0.60:
            continuity_penalty += 2.5
        elif residual >= 0.35:
            continuity_penalty += 1.0

    continuity = round(max(0.0, 45.0 - continuity_penalty), 2)

    local_rates = []
    for j in range(len(timed_words) - 4):
        crosses_punctuation = False
        for k in range(j, j + 4):
            ci = obs_to_canon.get(k)
            mark = marks[ci] if ci is not None and ci < len(marks) else ""
            if re.search(r"[,\.!?;:]", mark):
                crosses_punctuation = True
                break
        if crosses_punctuation:
            continue

        start = timed_words[j].get("start")
        end = timed_words[j+4].get("end")
        if start is None or end is None:
            continue
        span = float(end) - float(start)
        if span > 0:
            local_rates.append((5.0 / span) * 60.0)

    if local_rates:
        mean_rate = sum(local_rates) / len(local_rates)
        variance = sum((x - mean_rate) ** 2 for x in local_rates) / len(local_rates)
        sd_rate = variance ** 0.5
        cv = (sd_rate / mean_rate) if mean_rate > 0 else 0.0
        regularity = rhythm_regularity_score(cv)
    else:
        mean_rate = 0.0
        cv = 0.0
        regularity = 0.0

    extra_stalls = sum(1 for x in residuals if x >= 0.60)
    repetitions = int(counts.get("repetitions", 0) or 0)
    autocorrections = int(counts.get("autocorrections", 0) or 0)
    hesitation = max(0.0, 20.0 - 2.0 * (extra_stalls + repetitions + autocorrections))
    hesitation = round(hesitation, 2)

    total = round(max(0.0, min(100.0, continuity + regularity + hesitation)), 2)

    return {
        "status": "OFICIAL_V1_TIMESTAMPS",
        "versao": "RITMO_AUTO_V1",
        "continuidade": {
            "nota": continuity,
            "penalidade": round(continuity_penalty, 2),
        },
        "regularidade": {
            "nota": regularity,
            "cv_local": round(cv, 6),
            "taxa_local_media_ppm": round(mean_rate, 2),
        },
        "hesitacoes_reinicios": {
            "nota": hesitation,
            "stalls_extras": extra_stalls,
            "repeticoes": repetitions,
            "autocorrecoes": autocorrections,
        },
        "ritmo_pct": total,
        "regra_duracao_interna": "NAO_PENALIZA_DIRETAMENTE",
    }


def prosody_score(job, ops, timed_words, canonical_text):
    """Prosódia automática oficial v1 (0–100).

    Estrutura:
      - Pontuação e pausas: 40
      - Entonação: 35
      - Fraseamento / sentido: 25

    Regra pedagógica:
      Se o áudio é tecnicamente utilizável e a criança não realiza marcação
      prosódica, isso reduz a nota. Só falha real de captura/áudio é tratada
      como erro técnico.
    """
    marks = canonical_marks(canonical_text)
    obs_to_canon = {}
    for op in ops:
        if op.get("oj") is not None and op.get("ci") is not None:
            obs_to_canon[op["oj"]] = op["ci"]

    punctuation_total = sum(
        1 for mark in marks
        if re.search(r"[.!?;:]", mark) or "," in mark
    )
    punctuation_valid = 0
    meaningful_pauses = 0
    located_pauses = 0
    strong_boundaries = []

    for j in range(len(timed_words) - 1):
        end = timed_words[j].get("end")
        start_next = timed_words[j+1].get("start")
        if end is None or start_next is None:
            continue

        end = float(end)
        start_next = float(start_next)
        gap = max(0.0, start_next - end)

        ci = obs_to_canon.get(j)
        mark = marks[ci] if ci is not None and ci < len(marks) else ""
        is_strong = bool(re.search(r"[.!?;:]", mark))
        is_comma = "," in mark

        if is_strong:
            if 0.15 <= gap <= 1.50:
                punctuation_valid += 1
                strong_boundaries.append(end)
        elif is_comma:
            if 0.08 <= gap <= 1.00:
                punctuation_valid += 1

        if gap >= 0.25:
            meaningful_pauses += 1
            if is_strong or is_comma:
                located_pauses += 1

    punctuation = (
        40.0 * punctuation_valid / punctuation_total
        if punctuation_total > 0 else 0.0
    )

    phrasing = (
        25.0 * located_pauses / meaningful_pauses
        if meaningful_pauses > 0 else 0.0
    )

    audio = base64.b64decode(job["audio_b64"])
    mime = (job.get("audio_mime") or "").lower()
    suffix = ".webm"
    if "wav" in mime:
        suffix = ".wav"
    elif "mpeg" in mime or "mp3" in mime:
        suffix = ".mp3"
    elif "mp4" in mime:
        suffix = ".mp4"
    elif "ogg" in mime:
        suffix = ".ogg"

    src_path = None
    wav_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
            f.write(audio)
            src_path = f.name

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as wf:
            wav_path = wf.name

        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-i", src_path,
                "-ac", "1", "-ar", "16000",
                wav_path,
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        snd = parselmouth.Sound(wav_path)
        pitch = snd.to_pitch_ac(
            time_step=0.01,
            pitch_floor=75,
            pitch_ceiling=600,
        )
        freqs = pitch.selected_array["frequency"].astype(float)
        times = pitch.xs()
        voiced = freqs[freqs > 0]

        if len(voiced) < 3:
            raise RuntimeError("Áudio sem frequência fundamental utilizável para prosódia.")

        p10, p90 = np.percentile(voiced, [10, 90])
        if p10 <= 0 or p90 <= 0:
            raise RuntimeError("Áudio sem faixa tonal utilizável para prosódia.")

        pitch_range_st = float(12.0 * np.log2(p90 / p10))

        changes = []
        for bt in strong_boundaries:
            pre = freqs[
                (times >= max(0.0, bt - 0.80))
                & (times <= max(0.0, bt - 0.03))
            ]
            post = freqs[
                (times >= bt + 0.03)
                & (times <= bt + 0.80)
            ]
            pre = pre[pre > 0]
            post = post[post > 0]

            if len(pre) >= 3 and len(post) >= 3:
                a = float(np.median(pre[-min(len(pre), 15):]))
                b = float(np.median(post[:min(len(post), 15)]))
                if a > 0 and b > 0:
                    changes.append(abs(float(12.0 * np.log2(b / a))))

        global_part = 15.0 * min(max(pitch_range_st, 0.0) / 6.0, 1.0)

        if changes:
            arr = np.array(changes, dtype=float)
            share_075 = float(np.mean(arr >= 0.75))
            median_change = float(np.median(arr))
            boundary_part = (
                10.0 * share_075
                + 10.0 * min(max(median_change, 0.0) / 3.0, 1.0)
            )
        else:
            share_075 = 0.0
            median_change = 0.0
            boundary_part = 0.0

        intonation = min(35.0, global_part + boundary_part)
        total = round(max(0.0, min(100.0, punctuation + intonation + phrasing)), 2)

        return {
            "status": "OFICIAL_V1_ACUSTICO",
            "versao": "PROSODIA_AUTO_V1",
            "motor_acustico": "Praat/Parselmouth",
            "pontuacao_pausas": {
                "nota": round(punctuation, 2),
                "limite": 40,
                "limites_canonicos": punctuation_total,
                "limites_validos": punctuation_valid,
                "boundary_valid_ratio": round(
                    punctuation_valid / punctuation_total, 6
                ) if punctuation_total else 0.0,
                "regra": (
                    "Limites canônicos: forte 0,15–1,50 s; "
                    "vírgula 0,08–1,00 s"
                ),
            },
            "entonacao": {
                "nota": round(intonation, 2),
                "limite": 35,
                "pitch_range_p90_p10_semitons": round(pitch_range_st, 3),
                "parte_variacao_global": round(global_part, 2),
                "limites_fortes_acusticamente_validos": len(changes),
                "share_mudanca_tonal_ge_0_75st": round(share_075, 3),
                "mediana_mudanca_tonal_st": round(median_change, 3),
                "parte_modulacao_limites": round(boundary_part, 2),
                "regra": (
                    "15 pts variação tonal global + 20 pts modulação tonal "
                    "somente em limites fortes com pausa prosodicamente plausível"
                ),
            },
            "fraseamento_significado": {
                "nota": round(phrasing, 2),
                "limite": 25,
                "pausas_relevantes": meaningful_pauses,
                "pausas_em_limites": located_pauses,
                "pause_location_ratio": round(
                    located_pauses / meaningful_pauses, 6
                ) if meaningful_pauses else 0.0,
                "regra": (
                    "Pausas relevantes predominantemente em limites canônicos"
                ),
            },
            "prosodia_pct": total,
            "regra_sem_prosodia": (
                "SE_AUDIO_TECNICAMENTE_VALIDO_AUSENCIA_DE_MARCACAO_"
                "PROSODICA_REDUZ_A_NOTA"
            ),
            "regra_falha_tecnica": (
                "REABRIR_SOMENTE_SE_AUDIO_INUTILIZAVEL_POR_FALHA_DE_CAPTURA"
            ),
            "homologacao": "OPERACIONAL_CVS_R1",
        }

    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or b"").decode("utf-8", errors="ignore")[-500:]
        raise RuntimeError("Falha ao preparar áudio para prosódia. " + detail)
    finally:
        for path in (src_path, wav_path):
            if path:
                try:
                    os.unlink(path)
                except OSError:
                    pass


def speed_from_alignment(ops, timed_words, duration, concluded, canonical_count):
    duration = float(duration or 0)
    if concluded and duration > 0 and duration <= 60:
        ppm = canonical_count / duration * 60
        words60 = canonical_count
    else:
        progressed = 0
        for op in ops:
            if op["type"] in ("MATCH", "SUB") and op["oj"] is not None:
                w = timed_words[op["oj"]]
                end = w.get("end")
                if end is not None and float(end) <= 60:
                    progressed += 1
        words60 = progressed
        ppm = float(progressed)
    return round(ppm, 2), int(words60)

def speed_index(ppm, turma, categoria):
    turma, categoria = int(turma), int(categoria)
    if turma == 61:
        low, high = 130, 140
    elif categoria == 1:
        low, high = 80, 90
    else:
        low, high = 110, 130
    if ppm < low:
        idx = (ppm / low) * 90 if low else 0
    elif ppm <= high:
        idx = 90 + ((ppm-low)/(high-low))*10
    else:
        idx = 100
    return round(max(0, min(100, idx)), 2)

def transcribe(model, job):
    audio = base64.b64decode(job["audio_b64"])
    suffix = ".webm"
    mime = (job.get("audio_mime") or "").lower()
    if "wav" in mime: suffix = ".wav"
    elif "mpeg" in mime or "mp3" in mime: suffix = ".mp3"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
        f.write(audio)
        path = f.name
    try:
        segments, info = model.transcribe(
            path,
            language="pt",
            task="transcribe",
            beam_size=5,
            temperature=0.0,
            word_timestamps=True,
            vad_filter=False,
            condition_on_previous_text=True,
        )
        timed = []
        text_parts = []
        for seg in segments:
            text_parts.append((seg.text or "").strip())
            for w in (seg.words or []):
                wt = (w.word or "").strip()
                if wt:
                    for tok in tokens(wt):
                        timed.append({"text": tok, "start": round(float(w.start),3) if w.start is not None else None,
                                      "end": round(float(w.end),3) if w.end is not None else None})
        return " ".join(p for p in text_parts if p).strip(), timed, getattr(info, "language_probability", None)
    finally:
        try: os.unlink(path)
        except OSError: pass

def canonical_prefix_for_words(text, word_count):
    """Return the canonical prefix through the last attempted word.

    Punctuation between attempted words is preserved. Punctuation after the
    final attempted word is intentionally excluded because there is no
    following spoken word with which to evaluate that boundary.
    """
    pattern = re.compile(r"[A-Za-zÀ-ÿ0-9]+(?:[-’'][A-Za-zÀ-ÿ0-9]+)*")
    matches = list(pattern.finditer(text or ""))
    n = int(word_count or 0)
    if not matches or n <= 0:
        return ""
    n = min(n, len(matches))
    return (text or "")[:matches[n-1].end()]


def zero_rhythm(reason, connected_matches, attempted_words):
    return {
        "status": reason,
        "versao": "RITMO_AUTO_V1",
        "continuidade": {"nota": 0.0, "penalidade": 45.0},
        "regularidade": {"nota": 0.0, "cv_local": 0.0, "taxa_local_media_ppm": 0.0},
        "hesitacoes_reinicios": {
            "nota": 0.0,
            "stalls_extras": 0,
            "repeticoes": 0,
            "autocorrecoes": 0,
        },
        "ritmo_pct": 0.0,
        "regra_duracao_interna": "NAO_PENALIZA_DIRETAMENTE",
        "evidencia_leitura_conectada": {
            "palavras_canonicas_reconhecidas": int(connected_matches),
            "palavras_canonicas_tentadas": int(attempted_words),
            "limiar_minimo": 10,
        },
    }


def zero_prosody(reason, connected_matches, attempted_words):
    return {
        "status": reason,
        "versao": "PROSODIA_AUTO_V1",
        "motor_acustico": "NAO_APLICADO",
        "pontuacao_pausas": {"nota": 0.0, "limite": 40},
        "entonacao": {"nota": 0.0, "limite": 35},
        "fraseamento_significado": {"nota": 0.0, "limite": 25},
        "prosodia_pct": 0.0,
        "regra_sem_prosodia": "SEM_LEITURA_CONECTADA_RECEBE_ZERO",
        "evidencia_leitura_conectada": {
            "palavras_canonicas_reconhecidas": int(connected_matches),
            "palavras_canonicas_tentadas": int(attempted_words),
            "limiar_minimo": 10,
        },
        "homologacao": "OPERACIONAL_CVS_R1",
    }


def process_job(model, job):
    transcript, timed_words, lang_prob = transcribe(model, job)
    if not timed_words:
        raise RuntimeError("Whisper returned no usable words")

    raw_canon = tokens(job["canonical_text"])
    timed_words = merge_observed_compounds(raw_canon, timed_words)
    raw_obs = [w["text"] for w in timed_words]
    canon_n = [norm(x) for x in raw_canon]
    obs_n = [norm(x) for x in raw_obs]
    ops = align(canon_n, obs_n)
    counts, events = classify_events(ops, raw_canon, raw_obs, timed_words)

    concluded = as_bool(job.get("concluded_text"))

    # Evidência objetiva de leitura conectada:
    # cada MATCH é uma palavra canônica efetivamente reconhecida pelo ASR
    # em alinhamento monotônico com o texto. Menos de 10 palavras reconhecidas
    # numa leitura não concluída = SEM_LEITURA_CONECTADA.
    connected_matches = sum(1 for op in ops if op["type"] == "MATCH")
    progressed_positions = [
        op["ci"]
        for op in ops
        if op.get("ci") is not None
        and op.get("oj") is not None
        and op["type"] in ("MATCH", "SUB")
    ]
    attempted_words = (max(progressed_positions) + 1) if progressed_positions else 0

    if concluded:
        reading_classification = "LEITURA_COMPLETA"
    elif connected_matches < 10:
        reading_classification = "SEM_LEITURA_CONECTADA"
    else:
        reading_classification = "LEITURA_INCOMPLETA"

    # PRECISÃO OFICIAL v1:
    # P = 100 * (N - S - O) / (N + I)
    # Em leitura incompleta, toda parte canônica não lida permanece como omissão.
    n = len(raw_canon)
    s = counts["substitutions"]
    o = counts["omissions"]
    i = counts["insertions"]
    correct = max(0, n - s - o)
    denominator = max(1, n + i)
    precision_official = round(max(0, min(100, (correct / denominator) * 100)), 2)

    counts["canonical_words"] = n
    counts["precision_correct"] = correct
    counts["precision_denominator"] = denominator
    counts["connected_match_words"] = int(connected_matches)
    counts["attempted_canonical_words"] = int(attempted_words)
    counts["reading_classification"] = reading_classification

    if reading_classification == "SEM_LEITURA_CONECTADA":
        # Soletração, letras isoladas ou fragmentos sem leitura conectada:
        # velocidade, ritmo e prosódia recebem zero. A precisão continua sendo
        # calculada contra o texto canônico, sem intervenção humana.
        ppm = 0.0
        words60 = 0
        v_idx = 0.0
        rhythm = zero_rhythm(reading_classification, connected_matches, attempted_words)
        prosody = zero_prosody(reading_classification, connected_matches, attempted_words)
    else:
        ppm, words60 = speed_from_alignment(
            ops,
            timed_words,
            job.get("duration_s"),
            concluded,
            len(raw_canon),
        )
        v_idx = speed_index(ppm, job["turma"], job["categoria"])

        # Para leitura incompleta, ritmo e prosódia consideram somente o trecho
        # efetivamente tentado. O trecho abandonado penaliza a precisão, não
        # cria pausas ou entonação fictícias.
        analysis_text = (
            job["canonical_text"]
            if concluded
            else canonical_prefix_for_words(job["canonical_text"], attempted_words)
        )
        rhythm = rhythm_score(ops, timed_words, analysis_text, counts)
        prosody = prosody_score(job, ops, timed_words, analysis_text)
        rhythm["reading_classification"] = reading_classification
        rhythm["evidencia_leitura_conectada"] = {
            "palavras_canonicas_reconhecidas": int(connected_matches),
            "palavras_canonicas_tentadas": int(attempted_words),
            "limiar_minimo": 10,
        }
        prosody["reading_classification"] = reading_classification
        prosody["evidencia_leitura_conectada"] = {
            "palavras_canonicas_reconhecidas": int(connected_matches),
            "palavras_canonicas_tentadas": int(attempted_words),
            "limiar_minimo": 10,
        }

    total_100 = round(max(0.0, min(100.0,
        precision_official * 0.35
        + prosody["prosodia_pct"] * 0.30
        + rhythm["ritmo_pct"] * 0.20
        + v_idx * 0.15
    )), 2)

    return {
        "leitura_id": job["leitura_id"],
        "engine": f"faster-whisper/{MODEL_SIZE}",
        "transcript": transcript,
        "words": timed_words,
        "language_probability": lang_prob,
        "reading_classification": reading_classification,
        "connected_match_words": int(connected_matches),
        "attempted_canonical_words": int(attempted_words),
        "words_60s": words60,
        "ppm": ppm,
        "speed_index": v_idx,
        "precision_pct": precision_official,
        "precision_candidate_pct": precision_official,
        "precision_formula_status": "OFICIAL_V1_(N-S-O)/(N+I)",
        "counts": counts,
        "events": events,
        "rhythm_pct": rhythm["ritmo_pct"],
        "rhythm_status": rhythm["status"],
        "rhythm_details": rhythm,
        "prosody_pct": prosody["prosodia_pct"],
        "prosody_status": prosody["status"],
        "prosody_details": prosody,
        "total_100": total_100,
    }


def main():
    print(f"Starting CVS fluency worker with model={MODEL_SIZE}, max_jobs={MAX_JOBS}")
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8", cpu_threads=1, num_workers=1)
    processed = 0
    while processed < MAX_JOBS:
        nxt = bridge("next")
        job = nxt.get("job")
        if not job:
            print("No pending compatible readings.")
            break
        rid = job["leitura_id"]
        print("Processing one queued reading.")
        try:
            result = process_job(model, job)
            bridge("result", result=result)
            print("Completed one queued reading.")
        except Exception as exc:
            bridge("error", leitura_id=rid, error=str(exc)[:2000])
            raise
        processed += 1

if __name__ == "__main__":
    main()
