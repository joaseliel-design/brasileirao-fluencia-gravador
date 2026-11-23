/**
 * BRASILEIRÃO DA FLUÊNCIA CVS 2026
 * GitHub Bridge v0.10.14 — L2 por série + TV pública isolada
 *
 * Alteração desta versão:
 * - adiciona a ação POST public_ranking;
 * - inclui Turma no payload público do ranking;
 * - sincroniza automaticamente novas leituras SALVO+áudio na Fila_Analise;
 * - NÃO altera Index.html, Avaliador, Admin ou Modo TV interno;
 * - a ação exige CVS_BRIDGE_TOKEN e retorna apenas o ranking sanitizado.
 */

/**
 * BRASILEIRÃO DA FLUÊNCIA CVS 2026
 * GitHub Bridge v0.10.5
 *
 * Ponte privada:
 * Google Drive / Apps Script
 *        ↓
 * GitHub Actions + Faster-Whisper
 *        ↓
 * Apps Script / Base Central
 *
 * IMPORTANTE:
 * - nenhum áudio fica armazenado no GitHub;
 * - nenhum nome de aluno é enviado ao GitHub;
 * - o áudio é usado temporariamente durante a execução;
 * - precisão oficial v1 é gravada automaticamente;
 * - ritmo automático v1 é gravado oficialmente;
 * - prosódia automática oficial v1 é gravada via Praat/Parselmouth;
 * - Total_100 oficial é calculado e sincronizado na aba Leituras;
 * - ranking acumulado e snapshots Top 20 são atualizados após cada análise completa;
 * - ranking Admin exige token administrativo válido;
 * - ranking TV público expõe somente posição, nome, leitura, variação e destaque;
 * - leituras incompletas passam a ser avaliadas automaticamente;
 * - menos de 10 palavras canônicas reconhecidas em leitura não concluída = SEM_LEITURA_CONECTADA;
 * - SEM_LEITURA_CONECTADA recebe velocidade, ritmo e prosódia = 0; precisão continua oficial.
 */

const BF81 = Object.freeze({

  SS_ID:
    '19ehxAAxFBxQCGBr8P4XNVB6khhHjzws66-FXqj0w1L4',

  FILA:
    'Fila_Analise',

  RESULTADOS:
    'Analise_Resultados',

  TEXTOS:
    'Textos_Canonicos',

  LEITURAS:
    'Leituras',

  SNAPSHOTS:
    'Snapshots_Ranking',

  // Limite de segurança da ponte.
  MAX_AUDIO_BYTES:
    12 * 1024 * 1024

});


/**
 * EXECUTAR UMA VEZ.
 *
 * Cria automaticamente uma chave privada
 * para comunicação entre GitHub e Apps Script.
 */
function BF81_setup() {

  const props =
    PropertiesService
      .getScriptProperties();

  let token =
    props.getProperty(
      'CVS_BRIDGE_TOKEN'
    );

  if (!token) {

    token =
      Utilities.getUuid() +
      Utilities
        .getUuid()
        .replace(/-/g, '');

    props.setProperty(
      'CVS_BRIDGE_TOKEN',
      token
    );

  }

  return {

    ok: true,

    message:
      'Ponte GitHub preparada.',

    token: token

  };

}


/**
 * Endpoint utilizado pelo GitHub Actions.
 *
 * O projeto atual não possuía doPost,
 * portanto este módulo pode assumir
 * o endpoint POST.
 */
function doPost(e) {

  return BF81_handlePost_(e);

}


/**
 * Controlador da comunicação.
 */
function BF81_handlePost_(e) {

  try {

    const raw =
      (
        e &&
        e.postData &&
        e.postData.contents
      )
        ? e.postData.contents
        : '{}';

    const body =
      JSON.parse(raw);

    BF81_auth_(
      body.token
    );

    let out;

    switch (
      String(
        body.action || ''
      )
    ) {

      case 'next':

        out =
          BF81_nextJob_();

        break;


      case 'result':

        out =
          BF81_saveResult_(
            body.result || {}
          );

        break;


      case 'error':

        out =
          BF81_saveError_(
            body.leitura_id,
            body.error
          );

        break;


      case 'ping':

        out = {
          ok: true,
          pong: true
        };

        break;


      case 'public_ranking':

        out =
          BF81_getRankingPublic();

        break;


      default:

        throw new Error(
          'Ação inválida.'
        );

    }

    return BF81_json_(out);

  }

  catch (err) {

    return BF81_json_({

      ok: false,

      error:
        String(
          err &&
          err.message
            ? err.message
            : err
        )

    });

  }

}


/**
 * Valida a chave privada enviada
 * pelo GitHub Actions.
 */
function BF81_auth_(token) {

  const expected =
    PropertiesService
      .getScriptProperties()
      .getProperty(
        'CVS_BRIDGE_TOKEN'
      );

  if (
    !expected ||
    String(token || '') !==
    String(expected)
  ) {

    throw new Error(
      'Não autorizado.'
    );

  }

}


/**
 * Mantém a Fila_Analise sincronizada com novas leituras SALVO.
 *
 * A fila passa a ser autossuficiente: cada chamada do worker verifica
 * Leituras e inclui automaticamente registros novos com áudio e sem nota.
 */
function BF81_syncQueueFromLeituras_(ss) {

  const fila =
    ss.getSheetByName(
      BF81.FILA
    );

  const leituras =
    ss.getSheetByName(
      BF81.LEITURAS
    );

  const resultados =
    ss.getSheetByName(
      BF81.RESULTADOS
    );

  if (!fila || !leituras) {
    return;
  }

  const fv =
    fila.getDataRange().getValues();

  const fh =
    BF81_h_(fv[0] || []);

  const existing = {};

  for (let r = 1; r < fv.length; r++) {
    const id =
      String(
        fv[r][fh.Leitura_ID] || ''
      ).trim();

    if (id) {
      existing[id] = true;
    }
  }

  const resultState = {};

  if (resultados && resultados.getLastRow() >= 2) {

    const rv =
      resultados.getDataRange().getValues();

    const rh =
      BF81_h_(rv[0] || []);

    for (let r = 1; r < rv.length; r++) {

      const id =
        String(
          rv[r][rh.Leitura_ID] || ''
        ).trim();

      if (!id) {
        continue;
      }

      resultState[id] =
        String(
          rv[r][rh.Estado] || ''
        ).trim();
    }
  }

  const lv =
    leituras.getDataRange().getValues();

  if (lv.length < 2) {
    return;
  }

  const lh =
    BF81_h_(lv[0]);

  const rows = [];

  for (let r = 1; r < lv.length; r++) {

    const id =
      String(
        lv[r][lh.Leitura_ID] || ''
      ).trim();

    if (!id || existing[id]) {
      continue;
    }

    const status =
      String(
        lv[r][lh.Status] || ''
      ).trim().toUpperCase();

    const audio =
      String(
        lv[r][lh['Áudio_Ref']] || ''
      ).trim();

    const total =
      lv[r][lh.Total_100];

    const estado =
      String(
        resultState[id] || ''
      ).trim();

    if (
      status !== 'SALVO' ||
      !audio ||
      (total !== '' && total !== null && total !== undefined) ||
      estado === 'PROCESSANDO_GITHUB' ||
      estado.indexOf('ANALISADO') === 0 ||
      estado === 'PENDENTE_TEXTO_CANONICO' ||
      estado === 'ERRO_TECNICO'
    ) {
      continue;
    }

    rows.push([
      id,
      lv[r][lh.Nome],
      lv[r][lh.Turma],
      lv[r][lh.Categoria],
      lv[r][lh.Rodada],
      lv[r][lh.Leitura],
      lv[r][lh.Texto],
      lv[r][lh['Duração_s']],
      audio,
      lv[r][lh.Status],
      'AGUARDANDO',
      new Date()
    ]);

    existing[id] = true;
  }

  if (rows.length) {

    fila
      .getRange(
        fila.getLastRow() + 1,
        1,
        rows.length,
        12
      )
      .setValues(rows);
  }
}


/**
 * Busca a próxima leitura aguardando análise.
 *
 * Somente leituras:
 * - SALVO
 * - com áudio
 * - sem resultado
 */
function BF81_nextJob_() {

  const lock =
    LockService
      .getScriptLock();

  lock.waitLock(5000);

  try {

    const ss =
      SpreadsheetApp
        .openById(
          BF81.SS_ID
        );

    BF81_syncQueueFromLeituras_(ss);

    const fila =
      ss.getSheetByName(
        BF81.FILA
      );

    if (!fila) {

      throw new Error(
        'Aba Fila_Analise não encontrada.'
      );

    }

    const vals =
      fila
        .getDataRange()
        .getValues();

    if (
      vals.length < 2
    ) {

      return {
        ok: true,
        job: null
      };

    }

    const h =
      BF81_h_(
        vals[0]
      );


    for (
      let r = 1;
      r < vals.length;
      r++
    ) {

      const leituraId =
        String(
          vals[r][
            h.Leitura_ID
          ] || ''
        ).trim();


      const estado =
        String(
          vals[r][
            h.Estado_Analise
          ] || ''
        ).trim();


      const audioRef =
        String(
          vals[r][
            h['Áudio_Ref']
          ] || ''
        ).trim();


      if (
        !leituraId ||
        !audioRef
      ) {

        continue;

      }


      if (
        estado &&
        estado !==
          'AGUARDANDO' &&
        estado !==
          'ERRO_RETENTAVEL'
      ) {

        continue;

      }


      const leitura =
        BF81_getLeitura_(
          ss,
          leituraId
        );


      if (!leitura) {

        continue;

      }


      if (
        String(
          leitura.Status
        ).toUpperCase()
        !==
        'SALVO'
      ) {

        continue;

      }


      const duracao =
        Number(
          leitura['Duração_s'] || 0
        );


      const concluiuTexto =
        BF81_bool_(
          leitura.Concluiu_Texto
        );


      const canon =
        Number(leitura.Leitura) === 2
          ? BF1014_getTextoL2Bridge_(
              ss,
              String(leitura.ID_Educar_Web || ''),
              Number(leitura.Rodada),
              Number(leitura.Leitura)
            )
          : BF81_getTexto_(
              ss,
              Number(leitura.Rodada),
              Number(leitura.Categoria)
            );


      if (
        !canon ||
        !canon.texto
      ) {

        BF81_upsert_(
          ss,
          {

            Leitura_ID:
              leituraId,

            Estado:
              'PENDENTE_TEXTO_CANONICO',

            Atualizado_em:
              new Date()

          }
        );

        BF81_setQueueState_(
          ss,
          leituraId,
          'PENDENTE_TEXTO_CANONICO'
        );

        continue;

      }


      const fileId =
        BF81_driveId_(
          audioRef
        );


      const file =
        DriveApp
          .getFileById(
            fileId
          );


      const blob =
        file.getBlob();


      const bytes =
        blob.getBytes();


      if (
        bytes.length >
        BF81.MAX_AUDIO_BYTES
      ) {

        BF81_upsert_(
          ss,
          {

            Leitura_ID:
              leituraId,

            Estado:
              'ERRO_TECNICO',

            Erro_Tecnico:
              'Áudio acima do limite técnico da ponte.',

            Atualizado_em:
              new Date()

          }
        );

        BF81_setQueueState_(
          ss,
          leituraId,
          'ERRO_TECNICO'
        );

        continue;

      }


      BF81_upsert_(
        ss,
        {

          Leitura_ID:
            leituraId,

          Estado:
            'PROCESSANDO_GITHUB',

          Audio_File_ID:
            fileId,

          Modelo_STT:
            'faster-whisper/medium',

          Inicio_Analise:
            new Date(),

          Atualizado_em:
            new Date()

        }
      );

      BF81_setQueueState_(
        ss,
        leituraId,
        'PROCESSANDO_GITHUB'
      );


      /*
       * ATENÇÃO:
       * nenhum nome de aluno é enviado.
       */
      return {

        ok: true,

        job: {

          leitura_id:
            leituraId,

          turma:
            String(
              leitura.Turma
            ),

          categoria:
            Number(
              leitura.Categoria
            ),

          ano:
            canon.ano ||
            BF1014_anoPorTurma_(
              leitura.Turma
            ),

          texto_id:
            String(
              canon.texto_id || ''
            ),

          rodada:
            Number(
              leitura.Rodada
            ),

          leitura:
            Number(
              leitura.Leitura
            ),

          duration_s:
            duracao,

          concluded_text:
            concluiuTexto,

          canonical_text:
            canon.texto,

          canonical_word_count:
            Number(
              canon.palavras ||
              leitura
                .Palavras_Texto ||
              0
            ),

          audio_mime:
            blob
              .getContentType() ||
            'audio/webm',

          /*
           * O áudio segue dentro da requisição
           * e é descartado pelo runner
           * depois da execução.
           */
          audio_b64:
            Utilities
              .base64Encode(
                bytes
              )

        }

      };

    }


    return {

      ok: true,

      job: null

    };

  }

  finally {

    lock.releaseLock();

  }

}


/**
 * Recebe o resultado do STT, precisão e ritmo.
 */
function BF81_saveResult_(
  result
) {

  const id =
    String(
      result
        .leitura_id || ''
    ).trim();


  if (!id) {

    throw new Error(
      'Resultado sem Leitura_ID.'
    );

  }


  const ss =
    SpreadsheetApp
      .openById(
        BF81.SS_ID
      );


  const leitura =
    BF81_getLeitura_(
      ss,
      id
    );


  if (!leitura) {

    throw new Error(
      'Leitura não encontrada para salvar resultado.'
    );

  }


  const counts =
    result.counts || {};


  const erros =

    Number(
      counts
        .substitutions || 0
    )

    +

    Number(
      counts
        .omissions || 0
    )

    +

    Number(
      counts
        .insertions || 0
    );


  const precisao =
    BF81_numResult_(
      result.precision_pct !== undefined
        ? result.precision_pct
        : result.precision_candidate_pct
    );


  const prosodia =
    BF81_numResult_(
      result.prosody_pct
    );


  const ritmo =
    BF81_numResult_(
      result.rhythm_pct
    );


  const velocidadeIndice =
    BF81_numResult_(
      result.speed_index
    );


  let total =
    BF81_numResult_(
      result.total_100
    );


  if (
    !isFinite(total) &&
    isFinite(precisao) &&
    isFinite(prosodia) &&
    isFinite(ritmo) &&
    isFinite(velocidadeIndice)
  ) {

    total =
      Math.round(
        (
          precisao * 0.35 +
          prosodia * 0.30 +
          ritmo * 0.20 +
          velocidadeIndice * 0.15
        ) *
        100
      ) /
      100;

  }


  if (
    !isFinite(precisao) ||
    !isFinite(prosodia) ||
    !isFinite(ritmo) ||
    !isFinite(velocidadeIndice) ||
    !isFinite(total)
  ) {

    throw new Error(
      'Resultado incompleto: precisão, prosódia, ritmo, velocidade e Total_100 são obrigatórios.'
    );

  }


  const ppm =
    BF81_numResult_(
      result.ppm
    );


  const palavras60 =
    BF81_numResult_(
      result.words_60s
    );


  BF81_upsert_(
    ss,
    {

      Leitura_ID:
        id,

      Estado:
        'ANALISADO_COMPLETO',

      Modelo_STT:
        String(
          result.engine ||
          'faster-whisper/medium'
        ),

      Modelo_Prosodia:
        'Praat/Parselmouth v1',

      Fim_Analise:
        new Date(),

      Transcricao:
        String(
          result.transcript ||
          ''
        ),

      Palavras_60s:
        isFinite(palavras60)
          ? palavras60
          : '',

      Velocidade_PPM_Apurada:
        isFinite(ppm)
          ? ppm
          : '',

      Precisao_pct:
        precisao,

      Prosodia_pct:
        prosodia,

      Ritmo_pct:
        ritmo,

      Total_100:
        total,

      Autocorrecoes:
        Number(
          counts
            .autocorrections ||
          0
        ),

      Erros:
        erros,

      Eventos_Precisao_JSON:
        JSON.stringify({

          formula_status:
            result
              .precision_formula_status
            ||
            'OFICIAL_V1_(N-S-O)/(N+I)',

          speed_index:
            velocidadeIndice,

          reading_classification:
            String(
              result.reading_classification ||
              counts.reading_classification ||
              'LEITURA_COMPLETA'
            ),

          connected_match_words:
            Number(
              result.connected_match_words ||
              counts.connected_match_words ||
              0
            ),

          attempted_canonical_words:
            Number(
              result.attempted_canonical_words ||
              counts.attempted_canonical_words ||
              0
            ),

          counts:
            counts,

          events:
            result.events || [],

          words:
            result.words || []

        }),

      Prosodia_JSON:
        result.prosody_details
          ? JSON.stringify(
              result.prosody_details
            )
          : '',

      Ritmo_JSON:
        result.rhythm_details
          ? JSON.stringify(
              result.rhythm_details
            )
          : '',

      Erro_Tecnico:
        '',

      Atualizado_em:
        new Date()

    }
  );


  BF81_syncLeituraResultado_(
    ss,
    id,
    {
      Velocidade_PPM:
        isFinite(ppm)
          ? ppm
          : '',

      'Precisão_%':
        precisao,

      'Prosódia_%':
        prosodia,

      'Ritmo_%':
        ritmo,

      Palavras_60s:
        isFinite(palavras60)
          ? palavras60
          : '',

      Total_100:
        total,

      'Autocorreções':
        Number(
          counts
            .autocorrections ||
          0
        ),

      Erros:
        erros
    }
  );


  BF81_setQueueState_(
    ss,
    id,
    'ANALISADO_COMPLETO'
  );


  BF81_snapshotRanking_(
    ss,
    Number(
      leitura.Categoria
    )
  );


  return {

    ok: true,

    leitura_id:
      id,

    estado:
      'ANALISADO_COMPLETO',

    total_100:
      total

  };

}


/**
 * Registra erro técnico e libera
 * a leitura para nova tentativa.
 */
function BF81_saveError_(
  leituraId,
  error
) {

  const id =
    String(
      leituraId || ''
    ).trim();


  if (!id) {

    throw new Error(
      'Erro sem Leitura_ID.'
    );

  }


  const ss =
    SpreadsheetApp
      .openById(
        BF81.SS_ID
      );


  BF81_upsert_(
    ss,
    {

      Leitura_ID:
        id,

      Estado:
        'ERRO_RETENTAVEL',

      Erro_Tecnico:
        String(
          error || ''
        ).slice(
          0,
          2000
        ),

      Atualizado_em:
        new Date()

    }
  );


  BF81_setQueueState_(
    ss,
    id,
    'ERRO_RETENTAVEL'
  );

  return {

    ok: true,

    leitura_id:
      id

  };

}


/**
 * Busca uma leitura na Base Central.
 */
function BF81_getLeitura_(
  ss,
  id
) {

  const sh =
    ss.getSheetByName(
      BF81.LEITURAS
    );


  const d =
    sh
      .getDataRange()
      .getValues();


  if (
    d.length < 2
  ) {

    return null;

  }


  const h =
    BF81_h_(
      d[0]
    );


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    if (
      String(
        d[r][
          h.Leitura_ID
        ]
      )
      ===
      String(id)
    ) {

      const o = {};


      Object
        .keys(h)
        .forEach(
          k => {

            o[k] =
              d[r][
                h[k]
              ];

          }
        );


      return o;

    }

  }


  return null;

}


/**
 * Recupera o texto canônico
 * da rodada/categoria.
 */

/**
 * v0.10.14 — texto canônico da L2 por aluno/série.
 */
function BF1014_getTextoL2Bridge_(ss, studentId, rodada, leitura) {
  const shAlloc = ss.getSheetByName('L2_Alocacao_Alunos');
  const shText = ss.getSheetByName('L2_Textos_Serie');
  if (!shAlloc || !shText) return null;

  const ad = shAlloc.getDataRange().getValues();
  if (ad.length < 2) return null;
  const ah = BF81_h_(ad[0]);

  let alloc = null;
  for (let r = 1; r < ad.length; r++) {
    if (
      String(ad[r][ah.ID_Educar_Web]) === String(studentId) &&
      Number(ad[r][ah.Rodada]) === Number(rodada) &&
      Number(ad[r][ah.Leitura]) === Number(leitura)
    ) {
      alloc = {
        textoId: String(ad[r][ah.Texto_ID] || ''),
        ano: Number(ad[r][ah.Ano] || 0)
      };
      break;
    }
  }
  if (!alloc || !alloc.textoId) return null;

  const td = shText.getDataRange().getValues();
  if (td.length < 2) return null;
  const th = BF81_h_(td[0]);

  for (let r = 1; r < td.length; r++) {
    const status = String(td[r][th.Status] || '').toUpperCase();
    if (
      String(td[r][th.Texto_ID] || '') === alloc.textoId &&
      Number(td[r][th.Rodada]) === Number(rodada) &&
      Number(td[r][th.Leitura]) === Number(leitura) &&
      Number(td[r][th.Ano]) === Number(alloc.ano) &&
      status === 'ATIVO'
    ) {
      return {
        texto_id: alloc.textoId,
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

function BF1014_anoPorTurma_(turma) {
  const m = String(turma || '').match(/^([2-6])/);
  return m ? Number(m[1]) : 0;
}

function BF81_getTexto_(
  ss,
  rodada,
  categoria
) {

  const sh =
    ss.getSheetByName(
      BF81.TEXTOS
    );


  const d =
    sh
      .getDataRange()
      .getValues();


  if (
    d.length < 2
  ) {

    return null;

  }


  const h =
    BF81_h_(
      d[0]
    );


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    if (

      Number(
        d[r][
          h.Rodada
        ]
      )
      ===
      Number(rodada)

      &&

      Number(
        d[r][
          h.Categoria
        ]
      )
      ===
      Number(categoria)

    ) {

      return {

        titulo:
          String(
            d[r][
              h['Título']
            ] || ''
          ),

        palavras:
          Number(
            d[r][
              h.Palavras
            ] || 0
          ),

        texto:
          String(
            d[r][
              h[
                'Texto_canônico'
              ]
            ] || ''
          ),

        status:
          String(
            d[r][
              h.Status
            ] || ''
          )

      };

    }

  }


  return null;

}


/**
 * Converte resultado numérico sem transformar
 * campo vazio em zero.
 */
function BF81_numResult_(v) {

  if (
    v === '' ||
    v === null ||
    v === undefined
  ) {

    return NaN;

  }


  const n =
    Number(v);


  return isFinite(n)
    ? n
    : NaN;

}


/**
 * Atualiza o estado da leitura na fila.
 */
function BF81_setQueueState_(
  ss,
  leituraId,
  estado
) {

  const sh =
    ss.getSheetByName(
      BF81.FILA
    );


  if (!sh) {
    return;
  }


  const d =
    sh
      .getDataRange()
      .getValues();


  if (d.length < 2) {
    return;
  }


  const h =
    BF81_h_(
      d[0]
    );


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    if (
      String(
        d[r][
          h.Leitura_ID
        ] || ''
      )
      ===
      String(leituraId)
    ) {

      if (
        h.Estado_Analise !==
        undefined
      ) {

        sh.getRange(
          r + 1,
          h.Estado_Analise + 1
        )
        .setValue(
          estado
        );

      }


      if (
        h.Atualizado_em !==
        undefined
      ) {

        sh.getRange(
          r + 1,
          h.Atualizado_em + 1
        )
        .setValue(
          new Date()
        );

      }


      return;

    }

  }

}


/**
 * Sincroniza o resultado oficial na aba Leituras.
 * Esta aba alimenta o painel administrativo/ranking.
 */
function BF81_syncLeituraResultado_(
  ss,
  leituraId,
  obj
) {

  const sh =
    ss.getSheetByName(
      BF81.LEITURAS
    );


  if (!sh) {

    throw new Error(
      'Aba Leituras não encontrada.'
    );

  }


  const d =
    sh
      .getDataRange()
      .getValues();


  const headers =
    d[0].map(String);


  const h =
    BF81_h_(
      headers
    );


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    if (
      String(
        d[r][
          h.Leitura_ID
        ] || ''
      )
      !==
      String(leituraId)
    ) {
      continue;
    }


    const values =
      d[r].slice();


    headers.forEach(
      (name, i) => {

        if (
          Object.prototype
            .hasOwnProperty
            .call(
              obj,
              name
            )
        ) {

          values[i] =
            obj[name];

        }

      }
    );


    sh.getRange(
      r + 1,
      1,
      1,
      headers.length
    )
    .setValues([
      values
    ]);


    return;

  }


  throw new Error(
    'Leitura não encontrada para sincronização.'
  );

}


/**
 * Índices de velocidade por Leitura_ID,
 * recuperados do JSON oficial de precisão.
 */
function BF81_speedIndexMap_(ss) {

  const sh =
    ss.getSheetByName(
      BF81.RESULTADOS
    );


  const out = {};


  if (!sh) {
    return out;
  }


  const d =
    sh
      .getDataRange()
      .getValues();


  if (d.length < 2) {
    return out;
  }


  const h =
    BF81_h_(
      d[0]
    );


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    const id =
      String(
        d[r][
          h.Leitura_ID
        ] || ''
      );


    if (!id) {
      continue;
    }


    try {

      const obj =
        JSON.parse(
          String(
            d[r][
              h.Eventos_Precisao_JSON
            ] || '{}'
          )
        );


      const n =
        Number(
          obj.speed_index
        );


      if (isFinite(n)) {
        out[id] = n;
      }

    }
    catch (e) {
      // Sem índice utilizável nesta leitura.
    }

  }


  return out;

}


/**
 * Monta o ranking acumulado oficial por categoria.
 */
function BF81_buildRanking_(ss) {

  const sh =
    ss.getSheetByName(
      BF81.LEITURAS
    );


  const out = {
    1: [],
    2: []
  };


  if (!sh) {
    return out;
  }


  const d =
    sh
      .getDataRange()
      .getValues();


  if (d.length < 2) {
    return out;
  }


  const h =
    BF81_h_(
      d[0]
    );


  const speedMap =
    BF81_speedIndexMap_(
      ss
    );


  const groups = {};


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    const status =
      String(
        d[r][
          h.Status
        ] || ''
      ).toUpperCase();


    if (
      status !==
      'SALVO'
    ) {
      continue;
    }


    const totalRaw =
      d[r][
        h.Total_100
      ];


    if (
      totalRaw === '' ||
      totalRaw === null ||
      totalRaw === undefined ||
      !isFinite(
        Number(totalRaw)
      )
    ) {
      continue;
    }


    const id =
      String(
        d[r][
          h.ID_Educar_Web
        ] || ''
      );


    const categoria =
      Number(
        d[r][
          h.Categoria
        ]
      );


    if (
      !id ||
      !out[categoria]
    ) {
      continue;
    }


    const leituraId =
      String(
        d[r][
          h.Leitura_ID
        ] || ''
      );


    const key =
      categoria + '|' + id;


    if (!groups[key]) {

      groups[key] = {
        categoria:
          categoria,
        id:
          id,
        nome:
          String(
            d[r][
              h.Nome
            ] || ''
          ),
        turma:
          String(
            d[r][
              h.Turma
            ] || ''
          ),
        edicao:
          String(
            d[r][
              h['Edição']
            ] || '2026'
          ),
        pontos:
          0,
        precisao:
          0,
        prosodia:
          0,
        ritmo:
          0,
        velocidade:
          0,
        autocorrecoes:
          0,
        ultimaLeitura:
          0
      };

    }


    const g =
      groups[key];


    g.pontos +=
      Number(totalRaw);


    const pr =
      Number(
        d[r][
          h['Precisão_%']
        ]
      );


    const po =
      Number(
        d[r][
          h['Prosódia_%']
        ]
      );


    const ri =
      Number(
        d[r][
          h['Ritmo_%']
        ]
      );


    const au =
      Number(
        d[r][
          h['Autocorreções']
        ]
      );


    if (isFinite(pr)) {
      g.precisao += pr;
    }


    if (isFinite(po)) {
      g.prosodia += po;
    }


    if (isFinite(ri)) {
      g.ritmo += ri;
    }


    if (isFinite(au)) {
      g.autocorrecoes += au;
    }


    if (
      speedMap[leituraId] !==
      undefined
    ) {
      g.velocidade +=
        Number(
          speedMap[leituraId]
        );
    }


    const rodada =
      Number(
        d[r][
          h.Rodada
        ] || 0
      );


    const leitura =
      Number(
        d[r][
          h.Leitura
        ] || 0
      );


    const etapa =
      (rodada - 1) * 2 +
      leitura;


    if (
      isFinite(etapa) &&
      etapa >
      g.ultimaLeitura
    ) {
      g.ultimaLeitura =
        etapa;
    }

  }


  Object.keys(groups)
    .forEach(
      key => {

        const g =
          groups[key];

        out[g.categoria]
          .push(g);

      }
    );


  [1, 2].forEach(
    categoria => {

      out[categoria]
        .sort(
          (a, b) => {

            return (
              b.pontos - a.pontos
              ||
              b.precisao - a.precisao
              ||
              b.prosodia - a.prosodia
              ||
              b.ritmo - a.ritmo
              ||
              b.velocidade - a.velocidade
              ||
              b.autocorrecoes - a.autocorrecoes
              ||
              String(a.nome)
                .localeCompare(
                  String(b.nome),
                  'pt-BR'
                )
            );

          }
        );


      out[categoria]
        .forEach(
          (item, i) => {
            item.posicao =
              i + 1;
          }
        );

    }
  );


  return out;

}


/**
 * Último snapshot conhecido por estudante/categoria.
 */
function BF81_lastSnapshotMap_(
  ss,
  categoria
) {

  const sh =
    ss.getSheetByName(
      BF81.SNAPSHOTS
    );


  const out = {};


  if (!sh) {
    return out;
  }


  const d =
    sh
      .getDataRange()
      .getValues();


  if (d.length < 2) {
    return out;
  }


  const h =
    BF81_h_(
      d[0]
    );


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    if (
      Number(
        d[r][
          h.Categoria
        ]
      )
      !==
      Number(categoria)
    ) {
      continue;
    }


    const id =
      String(
        d[r][
          h.ID_Educar_Web
        ] || ''
      );


    if (!id) {
      continue;
    }


    out[id] = {
      posicao:
        Number(
          d[r][
            h['Posição']
          ] || 0
        ),
      variacao:
        Number(
          d[r][
            h['Variação']
          ] || 0
        ),
      melhor:
        Number(
          d[r][
            h['Melhor_Posição']
          ] || 0
        ),
      pior:
        Number(
          d[r][
            h['Pior_Posição']
          ] || 0
        )
    };

  }


  return out;

}


/**
 * Salva um snapshot do Top 20 após cada resultado completo.
 */
function BF81_snapshotRanking_(
  ss,
  categoria
) {

  if (
    Number(categoria) !== 1 &&
    Number(categoria) !== 2
  ) {
    return;
  }


  const sh =
    ss.getSheetByName(
      BF81.SNAPSHOTS
    );


  if (!sh) {
    return;
  }


  const ranking =
    BF81_buildRanking_(
      ss
    )[Number(categoria)]
      .slice(0, 20);


  if (!ranking.length) {
    return;
  }


  const prev =
    BF81_lastSnapshotMap_(
      ss,
      categoria
    );


  const headers =
    sh.getRange(
      1,
      1,
      1,
      sh.getLastColumn()
    )
    .getValues()[0]
    .map(String);


  const snapshotId =
    Utilities.getUuid();


  const agora =
    new Date();


  const rows =
    ranking.map(
      item => {

        const old =
          prev[item.id] || null;


        const variacao =
          old && old.posicao
            ? old.posicao - item.posicao
            : 0;


        const melhor =
          old && old.melhor
            ? Math.min(
                old.melhor,
                item.posicao
              )
            : item.posicao;


        const pior =
          old && old.pior
            ? Math.max(
                old.pior,
                item.posicao
              )
            : item.posicao;


        const obj = {
          Snapshot_ID:
            snapshotId,
          Data_Hora:
            agora,
          Categoria:
            Number(categoria),
          ID_Educar_Web:
            item.id,
          Nome:
            item.nome,
          Turma:
            item.turma,
          Pontos_Acumulados:
            Math.round(
              item.pontos * 100
            ) / 100,
          'Posição':
            item.posicao,
          'Posição_Anterior':
            old && old.posicao
              ? old.posicao
              : '',
          'Variação':
            variacao,
          'Melhor_Posição':
            melhor,
          'Pior_Posição':
            pior,
          Entrou_Top20:
            old
              ? 'NAO'
              : 'SIM',
          Saiu_Top20:
            'NAO',
          Rodada:
            item.ultimaLeitura
              ? Math.ceil(
                  item.ultimaLeitura / 2
                )
              : '',
          'Edição':
            item.edicao
        };


        return headers.map(
          name =>
            Object.prototype
              .hasOwnProperty
              .call(
                obj,
                name
              )
              ? obj[name]
              : ''
        );

      }
    );


  sh.getRange(
    sh.getLastRow() + 1,
    1,
    rows.length,
    headers.length
  )
  .setValues(
    rows
  );

}


/**
 * Monta a carga sanitizada do modo TV.
 * Não expõe pontos, componentes técnicos, IDs, áudios ou credenciais.
 */
function BF81_buildRankingTvPublic_(ss) {

  const rankings =
    BF81_buildRanking_(
      ss
    );


  const categorias =
    [1, 2].map(
      categoria => {

        const last =
          BF81_lastSnapshotMap_(
            ss,
            categoria
          );


        return {
          categoria:
            categoria,
          ranking:
            rankings[categoria]
              .slice(0, 20)
              .map(
                item => ({
                  posicao:
                    item.posicao,
                  nome:
                    item.nome,
                  turma:
                    item.turma,
                  leituraAtual:
                    item.ultimaLeitura
                      ? 'L' + item.ultimaLeitura
                      : '',
                  variacao:
                    last[item.id]
                      ? Number(
                          last[item.id]
                            .variacao || 0
                        )
                      : 0,
                  destaque:
                    item.posicao <= 6
                })
              )
        };

      }
    );


  return {
    ok: true,
    somente_leitura: true,
    atualizado_em:
      new Date()
        .toISOString(),
    categorias:
      categorias
  };

}


/**
 * Ranking sanitizado para o modo TV aberto a partir do painel Admin.
 * Mantém a validação administrativa do fluxo interno.
 */
function BF81_getRankingVivo(authToken) {

  requireAdmin_(authToken);

  const ss =
    SpreadsheetApp
      .openById(
        BF81.SS_ID
      );

  return BF81_buildRankingTvPublic_(ss);

}


/**
 * Ranking TV público, estritamente somente leitura.
 * Pode ser chamado apenas pela interface do Apps Script via google.script.run.
 * A resposta não contém token, PIN, pontos, indicadores técnicos, IDs ou áudio.
 */
function BF81_getRankingPublic() {

  const ss =
    SpreadsheetApp
      .openById(
        BF81.SS_ID
      );

  return BF81_buildRankingTvPublic_(ss);

}


/**
 * Ranking técnico para o painel administrativo.
 */
function BF81_getRankingAdmin(authToken) {

  requireAdmin_(authToken);

  const ss =
    SpreadsheetApp
      .openById(
        BF81.SS_ID
      );


  const rankings =
    BF81_buildRanking_(
      ss
    );


  return {
    ok: true,
    atualizado_em:
      new Date()
        .toISOString(),
    categorias:
      [1, 2].map(
        categoria => ({
          categoria:
            categoria,
          ranking:
            rankings[categoria]
              .slice(0, 20)
              .map(
                item => ({
                  posicao:
                    item.posicao,
                  nome:
                    item.nome,
                  turma:
                    item.turma,
                  leituraAtual:
                    item.ultimaLeitura
                      ? 'L' + item.ultimaLeitura
                      : '',
                  pontos:
                    Math.round(
                      item.pontos * 100
                    ) / 100,
                  precisao:
                    Math.round(
                      item.precisao * 100
                    ) / 100,
                  prosodia:
                    Math.round(
                      item.prosodia * 100
                    ) / 100,
                  ritmo:
                    Math.round(
                      item.ritmo * 100
                    ) / 100,
                  velocidade:
                    Math.round(
                      item.velocidade * 100
                    ) / 100
                })
              )
        }))
  };

}


/**
 * Cria ou atualiza uma linha
 * na aba Analise_Resultados.
 */
function BF81_upsert_(
  ss,
  obj
) {

  const sh =
    ss.getSheetByName(
      BF81.RESULTADOS
    );


  const d =
    sh
      .getDataRange()
      .getValues();


  const headers =
    d[0]
      .map(String);


  const h =
    BF81_h_(
      headers
    );


  let row = 0;


  for (
    let r = 1;
    r < d.length;
    r++
  ) {

    if (
      String(
        d[r][
          h.Leitura_ID
        ]
      )
      ===
      String(
        obj.Leitura_ID
      )
    ) {

      row =
        r + 1;

      break;

    }

  }


  if (!row) {

    row =
      Math.max(
        2,
        sh.getLastRow() + 1
      );

  }


  const values =

    row <=
    sh.getLastRow()

      ?

      sh
        .getRange(
          row,
          1,
          1,
          headers.length
        )
        .getValues()[0]

      :

      Array(
        headers.length
      ).fill('');


  headers
    .forEach(
      (name, i) => {

        if (
          Object
            .prototype
            .hasOwnProperty
            .call(
              obj,
              name
            )
        ) {

          values[i] =
            obj[name];

        }

      }
    );


  sh
    .getRange(
      row,
      1,
      1,
      headers.length
    )
    .setValues([
      values
    ]);

}


/**
 * Extrai o ID do Google Drive.
 */
function BF81_driveId_(
  ref
) {

  const s =
    String(
      ref || ''
    );


  if (
    s.indexOf('|')
    >= 0
  ) {

    return s
      .split('|')[0]
      .trim();

  }


  const m =
    s.match(
      /\/d\/([A-Za-z0-9_-]+)/
    );


  return m
    ? m[1]
    : s.trim();

}


/**
 * Mapeia cabeçalho -> posição.
 */
function BF81_h_(
  arr
) {

  const o = {};


  arr.forEach(
    (v, i) => {

      o[
        String(v)
          .trim()
      ] = i;

    }
  );


  return o;

}


/**
 * Converte valores do Sheet
 * para verdadeiro/falso.
 */
function BF81_bool_(v) {

  return (

    v === true

    ||

    String(v)
      .toUpperCase()
      ===
      'TRUE'

    ||

    String(v)
      .toUpperCase()
      ===
      'SIM'

  );

}


/**
 * Resposta JSON para o GitHub.
 */
function BF81_json_(obj) {

  return ContentService
    .createTextOutput(
      JSON.stringify(obj)
    )
    .setMimeType(
      ContentService
        .MimeType
        .JSON
    );

}