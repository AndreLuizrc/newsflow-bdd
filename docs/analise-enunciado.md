# Análise da entrega

Fonte: exercicio-newsflow.pdf, 10 páginas, fornecido pelo usuário. O documento é tratado como especificação do exercício.

## O que precisa ser entregue

- Trabalho em dupla, prazo relativo de 3 dias. O PDF não informa a data de início nem a data final de calendário.
- Repositório Git sem node_modules; no máximo 4 histórias US01–US04 em docs/historias.md.
- Cada história: papel–objetivo–benefício, 3 a 5 critérios verificáveis, regras RN associadas, prioridade justificada e caminho do .feature.
- Um arquivo .feature em português por história, com sucesso e exceção; pelo menos um Esquema do Cenário com 3 linhas de fronteira.
- Um Quando por cenário, dados explícitos, linguagem de negócio, cenários independentes e steps reutilizáveis.
- Cucumber.js executável com npm install e npm test; dry-run sem passos indefinidos; estado isolado no World; sem sleep.
- Relatório HTML versionado, README com execução em até cinco linhas, saída real de npm test e seção Fora de escopo justificada.

## Recorte implementado

| História | Regras | Valor |
| --- | --- | --- |
| US01 | RN02 | Revisão independente antes do envio |
| US02 | RN03 e pré-condição RN02 | Planejamento e ajuste do disparo |
| US03 | RN04 | Público correto sem duplicação |
| US04 | RN06 | Controle do consentimento |

O enunciado permite explicitamente um domínio em memória (página 9). Portanto a entrega inclui regras executáveis e testes de domínio, sem necessidade de interface, API, banco ou envio real de e-mails.

## Decisões para pontos não detalhados

- RN03: exatamente 15 minutos permite agendar; exatamente 5 minutos permite cancelar. Reagendamento exige novamente 15 minutos. Cancelar retorna à aprovação e mantém o histórico de reagendamentos.
- RN06: validade do link é o intervalo anterior ao instante de emissão + 48 horas; no instante de vencimento já está expirado. Novo pedido substitui o link anterior. Confirmação consome o link.
- RN04: zero segmentos é inválido; apenas segmentos distintos contam. Segmento sem assinantes ativos é vazio.
- O relógio controlado começa em 04/11/2026 às 09h em São Paulo. Nenhum teste depende do relógio real.
- Aprovação opera sobre a edição em rascunho. E-mail e link são representações em memória para verificação; não há provedor real.

## Revisão humana antes da submissão

Preencher nomes da dupla no README, revisar as decisões acima e publicar o repositório no serviço exigido pela disciplina. A publicação não foi solicitada e não há destino informado. Nenhuma nota ou conformidade com uma data final é presumida.
