# Análise automática de fluência — CVS 2026

Camada de processamento técnico do Brasileirão da Fluência.

## Privacidade
Este repositório **não armazena áudio, nomes de alunos, transcrições ou resultados individuais**. O GitHub Actions recebe um áudio por HTTPS durante a execução, processa em armazenamento temporário do runner e devolve o resultado à ponte privada do Google Apps Script.

## Estado
- Workflow inicialmente **manual** (workflow_dispatch).
- Modelo inicial: `faster-whisper small`, português.
- Precisão: eventos lexicais e um índice candidato são calculados, mas **não são gravados como nota oficial** até homologação da fórmula/denominador.
- Velocidade: PPM e índice técnico são calculados a partir dos timestamps.
- Prosódia e ritmo: permanecem fora desta primeira etapa até a régua objetiva ser homologada.

## Segredos necessários no GitHub
- `CVS_BRIDGE_URL`
- `CVS_BRIDGE_TOKEN`

Nunca colocar os valores desses segredos em arquivo do repositório.
