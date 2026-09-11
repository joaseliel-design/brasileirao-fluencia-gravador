import os, re, json, base64, tempfile, unicodedata, difflib
from pathlib import Path
import requests
from faster_whisper import WhisperModel

BRIDGE_URL = os.environ["BRIDGE_URL"].strip()
BRIDGE_TOKEN = os.environ["BRIDGE_TOKEN"].strip()
MODEL_SIZE = os.environ.get("FW_MODEL", "small").strip()
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

    ppm, words60 = speed_from_alignment(
        ops, timed_words, job.get("duration_s"), bool(job.get("concluded_text")), len(raw_canon)
    )
    v_idx = speed_index(ppm, job["turma"], job["categoria"])

    # Precision score is intentionally NOT made official here yet:
    # the project still needs to homologate the denominator/formula.
    lexical_errors = counts["substitutions"] + counts["omissions"] + counts["insertions"]
    precision_candidate = round(max(0, (len(raw_canon)-lexical_errors)/max(1,len(raw_canon))*100), 2)

    return {
        "leitura_id": job["leitura_id"],
        "engine": f"faster-whisper/{MODEL_SIZE}",
        "transcript": transcript,
        "words": timed_words,
        "language_probability": lang_prob,
        "words_60s": words60,
        "ppm": ppm,
        "speed_index": v_idx,
        "precision_candidate_pct": precision_candidate,
        "precision_formula_status": "CANDIDATA_NAO_OFICIAL",
        "counts": counts,
        "events": events,
    }

def main():
    print(f"Starting CVS fluency worker with model={MODEL_SIZE}, max_jobs={MAX_JOBS}")
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
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
