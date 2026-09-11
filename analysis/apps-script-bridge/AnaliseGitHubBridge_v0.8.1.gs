/**
 * BRASILEIRÃO DA FLUÊNCIA CVS 2026 — GitHub Bridge v0.8.1
 *
 * Ponte privada entre o Apps Script e o GitHub Actions/Faster-Whisper.
 * Este módulo NÃO grava áudio no GitHub e NÃO publica dados de alunos.
 *
 * Pré-requisito:
 * - manter as abas Fila_Analise, Analise_Resultados e Textos_Canonicos;
 * - definir a propriedade de script CVS_BRIDGE_TOKEN;
 * - implantar nova versão do Web App oficial após adicionar este arquivo.
 */

const BF81 = Object.freeze({
  SS_ID: '19ehxAAxFBxQCGBr8P4XNVB6khhHjzws66-FXqj0w1L4',
  FILA: 'Fila_Analise',
  RESULTADOS: 'Analise_Resultados',
  TEXTOS: 'Textos_Canonicos',
  LEITURAS: 'Leituras',
  MAX_AUDIO_BYTES: 12 * 1024 * 1024
});

function BF81_setup() {
  const props = PropertiesService.getScriptProperties();
  let token = props.getProperty('CVS_BRIDGE_TOKEN');
  if (!token) {
    token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('CVS_BRIDGE_TOKEN', token);
  }
  return {
    ok: true,
    message: 'Ponte GitHub preparada.',
    token: token
  };
}

/**
 * Endpoint do GitHub Actions.
 * Se o projeto já possuir outro doPost, não duplique: chame BF81_handlePost_(e)
 * dentro do doPost existente.
 */
function doPost(e) {
  return BF81_handlePost_(e);
}

function BF81_handlePost_(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    BF81_auth_(body.token);

    let out;
    switch (String(body.action || '')) {
      case 'next':
        out = BF81_nextJob_();
        break;
      case 'result':
        out = BF81_saveResult_(body.result || {});
        break;
      case 'error':
        out = BF81_saveError_(body.leitura_id, body.error);
        break;
      case 'ping':
        out = {ok:true, pong:true};
        break;
      default:
        throw new Error('Ação inválida.');
    }
    return BF81_json_(out);
  } catch (err) {
    return BF81_json_({ok:false,error:String(err && err.message ? err.message : err)});
  }
}

function BF81_auth_(token) {
  const expected = PropertiesService.getScriptProperties().getProperty('CVS_BRIDGE_TOKEN');
  if (!expected || String(token || '') !== String(expected)) {
    throw new Error('Não autorizado.');
  }
}

function BF81_nextJob_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const ss = SpreadsheetApp.openById(BF81.SS_ID);
    const fila = ss.getSheetByName(BF81.FILA);
    const vals = fila.getDataRange().getValues();
    if (vals.length < 2) return {ok:true, job:null};

    const h = BF81_h_(vals[0]);
    for (let r=1; r<vals.length; r++) {
      const leituraId = String(vals[r][h.Leitura_ID] || '').trim();
      const estado = String(vals[r][h.Estado_Analise] || '').trim();
      const audioRef = String(vals[r][h['Áudio_Ref']] || '').trim();
      if (!leituraId || !audioRef) continue;
      if (estado && estado !== 'AGUARDANDO' && estado !== 'ERRO_RETENTAVEL') continue;

      const leitura = BF81_getLeitura_(ss, leituraId);
      if (!leitura || String(leitura.Status).toUpperCase() !== 'SALVO') continue;

      const canon = BF81_getTexto_(ss, Number(leitura.Rodada), Number(leitura.Categoria));
      if (!canon || !canon.texto) {
        BF81_upsert_(ss, {Leitura_ID:leituraId, Estado:'PENDENTE_TEXTO_CANONICO', Atualizado_em:new Date()});
        continue;
      }

      const fileId = BF81_driveId_(audioRef);
      const file = DriveApp.getFileById(fileId);
      const blob = file.getBlob();
      const bytes = blob.getBytes();
      if (bytes.length > BF81.MAX_AUDIO_BYTES) {
        BF81_upsert_(ss, {Leitura_ID:leituraId, Estado:'ERRO_TECNICO', Erro_Tecnico:'Áudio acima do limite técnico da ponte.', Atualizado_em:new Date()});
        continue;
      }

      BF81_upsert_(ss, {
        Leitura_ID: leituraId,
        Estado: 'PROCESSANDO_GITHUB',
        Audio_File_ID: fileId,
        Modelo_STT: 'faster-whisper/small',
        Inicio_Analise: new Date(),
        Atualizado_em: new Date()
      });

      return {
        ok:true,
        job:{
          leitura_id: leituraId,
          turma: String(leitura.Turma),
          categoria: Number(leitura.Categoria),
          rodada: Number(leitura.Rodada),
          leitura: Number(leitura.Leitura),
          duration_s: Number(leitura['Duração_s'] || 0),
          concluded_text: BF81_bool_(leitura.Concluiu_Texto),
          canonical_text: canon.texto,
          canonical_word_count: Number(canon.palavras || leitura.Palavras_Texto || 0),
          audio_mime: blob.getContentType() || 'audio/webm',
          audio_b64: Utilities.base64Encode(bytes)
        }
      };
    }
    return {ok:true, job:null};
  } finally {
    lock.releaseLock();
  }
}

function BF81_saveResult_(result) {
  const id = String(result.leitura_id || '').trim();
  if (!id) throw new Error('Resultado sem Leitura_ID.');

  const ss = SpreadsheetApp.openById(BF81.SS_ID);
  const counts = result.counts || {};
  const erros = Number(counts.substitutions||0) + Number(counts.omissions||0) + Number(counts.insertions||0);

  BF81_upsert_(ss, {
    Leitura_ID: id,
    Estado: 'ANALISADO_STT_TESTE',
    Modelo_STT: String(result.engine || 'faster-whisper'),
    Fim_Analise: new Date(),
    Transcricao: String(result.transcript || ''),
    Palavras_60s: result.words_60s === undefined ? '' : Number(result.words_60s),
    Velocidade_PPM_Apurada: result.ppm === undefined ? '' : Number(result.ppm),
    Precisao_pct: result.precision_candidate_pct === undefined ? '' : Number(result.precision_candidate_pct),
    Prosodia_pct: '',
    Ritmo_pct: '',
    Total_100: '',
    Autocorrecoes: Number(counts.autocorrections || 0),
    Erros: erros,
    Eventos_Precisao_JSON: JSON.stringify({
      formula_status: result.precision_formula_status || 'CANDIDATA_NAO_OFICIAL',
      speed_index: result.speed_index,
      counts: counts,
      events: result.events || [],
      words: result.words || []
    }),
    Erro_Tecnico: '',
    Atualizado_em: new Date()
  });

  return {ok:true, leitura_id:id, estado:'ANALISADO_STT_TESTE'};
}

function BF81_saveError_(leituraId, error) {
  const id = String(leituraId || '').trim();
  if (!id) throw new Error('Erro sem Leitura_ID.');
  const ss = SpreadsheetApp.openById(BF81.SS_ID);
  BF81_upsert_(ss, {
    Leitura_ID:id,
    Estado:'ERRO_RETENTAVEL',
    Erro_Tecnico:String(error || '').slice(0,2000),
    Atualizado_em:new Date()
  });
  return {ok:true, leitura_id:id};
}

function BF81_getLeitura_(ss, id) {
  const sh = ss.getSheetByName(BF81.LEITURAS);
  const d = sh.getDataRange().getValues();
  if (d.length < 2) return null;
  const h = BF81_h_(d[0]);
  for (let r=1; r<d.length; r++) {
    if (String(d[r][h.Leitura_ID]) === String(id)) {
      const o = {};
      Object.keys(h).forEach(k => o[k] = d[r][h[k]]);
      return o;
    }
  }
  return null;
}

function BF81_getTexto_(ss, rodada, categoria) {
  const sh = ss.getSheetByName(BF81.TEXTOS);
  const d = sh.getDataRange().getValues();
  if (d.length < 2) return null;
  const h = BF81_h_(d[0]);
  for (let r=1; r<d.length; r++) {
    if (Number(d[r][h.Rodada]) === Number(rodada) && Number(d[r][h.Categoria]) === Number(categoria)) {
      return {
        titulo:String(d[r][h['Título']] || ''),
        palavras:Number(d[r][h.Palavras] || 0),
        texto:String(d[r][h['Texto_canônico']] || ''),
        status:String(d[r][h.Status] || '')
      };
    }
  }
  return null;
}

function BF81_upsert_(ss, obj) {
  const sh = ss.getSheetByName(BF81.RESULTADOS);
  const d = sh.getDataRange().getValues();
  const headers = d[0].map(String);
  const h = BF81_h_(headers);
  let row = 0;
  for (let r=1; r<d.length; r++) {
    if (String(d[r][h.Leitura_ID]) === String(obj.Leitura_ID)) {
      row = r+1;
      break;
    }
  }
  if (!row) row = Math.max(2, sh.getLastRow()+1);
  const values = row <= sh.getLastRow()
    ? sh.getRange(row,1,1,headers.length).getValues()[0]
    : Array(headers.length).fill('');
  headers.forEach((name,i) => {
    if (Object.prototype.hasOwnProperty.call(obj,name)) values[i] = obj[name];
  });
  sh.getRange(row,1,1,headers.length).setValues([values]);
}

function BF81_driveId_(ref) {
  const s = String(ref || '');
  if (s.indexOf('|') >= 0) return s.split('|')[0].trim();
  const m = s.match(/\/d\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : s.trim();
}

function BF81_h_(arr) {
  const o = {};
  arr.forEach((v,i) => o[String(v).trim()] = i);
  return o;
}

function BF81_bool_(v) {
  return v === true || String(v).toUpperCase() === 'TRUE' || String(v).toUpperCase() === 'SIM';
}

function BF81_json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
