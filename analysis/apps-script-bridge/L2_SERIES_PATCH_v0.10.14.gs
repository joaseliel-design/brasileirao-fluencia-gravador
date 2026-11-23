/**
 * BRASILEIRÃO DA FLUÊNCIA CVS 2026
 * PATCH L2 POR SÉRIE — alvo: v0.10.14
 *
 * NÃO ATIVA A L2 sozinho.
 * Requer as abas privadas:
 *   - L2_Alocacao_Alunos
 *   - L2_Textos_Serie
 *
 * Fluxo:
 * ID_Educar_Web -> alocação individual -> Texto_ID -> texto canônico da série.
 *
 * Integração no bridge atual:
 * 1) onde hoje o job busca texto apenas por Rodada+Categoria, chamar:
 *      const canon = BF1014_getTextoDaLeitura_(ss, leitura);
 * 2) incluir no job:
 *      ano: Number(canon.ano || BF1014_anoPorTurma_(leitura.Turma)),
 *      texto_id: String(canon.texto_id || ''),
 *      canonical_word_count: Number(canon.palavras || leitura.Palavras_Texto || 0)
 * 3) o app Avaliador deve usar BF1014_getTextoL2ParaAluno_() ao abrir L2.
 *
 * L1 permanece usando Textos_Canonicos por Rodada+Categoria.
 */

function BF1014_getTextoDaLeitura_(ss, leitura) {
  const rodada = Number(leitura.Rodada || 0);
  const numeroLeitura = Number(leitura.Leitura || 0);
  const categoria = Number(leitura.Categoria || 0);

  if (numeroLeitura === 2) {
    const l2 = BF1014_getTextoL2ParaAluno_(
      ss,
      String(leitura.ID_Educar_Web || ''),
      rodada,
      numeroLeitura
    );
    if (l2 && l2.texto) return l2;
    return null;
  }

  return BF1014_getTextoLegado_(ss, rodada, categoria);
}

function BF1014_getTextoL2ParaAluno_(ss, idEducarWeb, rodada, leitura) {
  const shAlloc = ss.getSheetByName('L2_Alocacao_Alunos');
  const shText = ss.getSheetByName('L2_Textos_Serie');
  if (!shAlloc || !shText) return null;

  const ad = shAlloc.getDataRange().getValues();
  if (ad.length < 2) return null;
  const ah = BF1014_h_(ad[0]);

  let alloc = null;
  for (let r = 1; r < ad.length; r++) {
    if (
      String(ad[r][ah.ID_Educar_Web]) === String(idEducarWeb) &&
      Number(ad[r][ah.Rodada]) === Number(rodada) &&
      Number(ad[r][ah.Leitura]) === Number(leitura)
    ) {
      alloc = {
        texto_id: String(ad[r][ah.Texto_ID] || ''),
        ano: Number(ad[r][ah.Ano] || 0),
        turma: String(ad[r][ah.Turma] || ''),
        status: String(ad[r][ah.Status] || '')
      };
      break;
    }
  }
  if (!alloc || !alloc.texto_id) return null;

  const td = shText.getDataRange().getValues();
  if (td.length < 2) return null;
  const th = BF1014_h_(td[0]);

  for (let r = 1; r < td.length; r++) {
    const status = String(td[r][th.Status] || '').toUpperCase();
    if (
      String(td[r][th.Texto_ID] || '') === alloc.texto_id &&
      Number(td[r][th.Rodada]) === Number(rodada) &&
      Number(td[r][th.Leitura]) === Number(leitura) &&
      Number(td[r][th.Ano]) === Number(alloc.ano) &&
      status === 'ATIVO'
    ) {
      return {
        texto_id: alloc.texto_id,
        ano: alloc.ano,
        titulo: String(td[r][th['Título']] || ''),
        palavras: Number(td[r][th.Palavras_Analise] || 0),
        palavras_prefeitura: Number(td[r][th.Palavras_Prefeitura] || 0),
        texto: String(td[r][th['Texto_canônico']] || ''),
        status: status
      };
    }
  }
  return null;
}

function BF1014_getTextoLegado_(ss, rodada, categoria) {
  const sh = ss.getSheetByName('Textos_Canonicos');
  if (!sh) return null;
  const d = sh.getDataRange().getValues();
  if (d.length < 2) return null;
  const h = BF1014_h_(d[0]);

  for (let r = 1; r < d.length; r++) {
    if (
      Number(d[r][h.Rodada]) === Number(rodada) &&
      Number(d[r][h.Categoria]) === Number(categoria)
    ) {
      return {
        texto_id: '',
        ano: 0,
        titulo: String(d[r][h['Título']] || ''),
        palavras: Number(d[r][h.Palavras] || 0),
        texto: String(d[r][h['Texto_canônico']] || ''),
        status: String(d[r][h.Status] || '')
      };
    }
  }
  return null;
}

function BF1014_anoPorTurma_(turma) {
  const m = String(turma || '').match(/^([2-6])/);
  return m ? Number(m[1]) : 0;
}

function BF1014_h_(headers) {
  const out = {};
  headers.forEach((v, i) => out[String(v)] = i);
  return out;
}
