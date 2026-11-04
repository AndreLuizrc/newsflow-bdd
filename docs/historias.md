# Histórias de usuário

Recorte proposto para revisão da dupla. Quatro histórias completas; regras não selecionadas estão no README.

## US01 — Aprovar uma edição antes do envio

**Como** revisora, **quero** avaliar a edição de outra pessoa, **para** impedir a divulgação de conteúdo sem revisão independente.

**Critérios de aceitação**

- Uma edição criada começa em rascunho; outra revisora pode aprová-la.
- A autora não pode aprovar a própria edição e a tentativa mantém o rascunho.
- A reprovação mantém a edição em rascunho com comentário obrigatório, sem aceitar texto vazio ou só espaços.
- Uma edição sem aprovação não pode ser enviada nem agendada.

**Regras cobertas:** RN02

**Prioridade:** Alta — Evita publicação sem revisão.

**Cenários:** [features/us01-aprovacao.feature](../features/us01-aprovacao.feature)

## US02 — Agendar e ajustar o horário de envio

**Como** gestora, **quero** programar o envio de uma edição aprovada, **para** alcançar o público no horário planejado.

**Critérios de aceitação**

- O agendamento exige aprovação e antecedência mínima de 15 minutos, inclusive no limite.
- O horário é interpretado e apresentado no fuso America/Sao_Paulo.
- São permitidos até 2 reagendamentos, cada um também com pelo menos 15 minutos de antecedência.
- O cancelamento é permitido até 5 minutos antes, inclusive; remove o agendamento e preserva a aprovação.
- Operações recusadas preservam o estado, o horário e o contador anteriores.

**Regras cobertas:** RN03, RN02

**Prioridade:** Alta — Dá previsibilidade aos disparos.

**Cenários:** [features/us02-agendamento.feature](../features/us02-agendamento.feature)

## US03 — Escolher segmentos sem duplicar destinatários

**Como** gestora, **quero** selecionar até 5 segmentos com assinantes, **para** direcionar a edição sem enviar cópias repetidas.

**Critérios de aceitação**

- O agendamento aceita de 1 a 5 segmentos distintos.
- Um segmento sem assinantes ativos bloqueia todo o agendamento.
- Assinantes em segmentos sobrepostos recebem um único e-mail por edição.

**Regras cobertas:** RN04

**Prioridade:** Alta — Evita público incorreto e mensagens duplicadas.

**Cenários:** [features/us03-segmentacao.feature](../features/us03-segmentacao.feature)

## US04 — Sair da lista e confirmar o retorno

**Como** assinante, **quero** interromper as newsletters e confirmar um eventual retorno, **para** controlar meu consentimento de recebimento.

**Critérios de aceitação**

- Toda newsletter inclui um link de descadastro individual.
- O descadastro é imediato, gera confirmação por e-mail e exclui a assinante dos próximos envios.
- Solicitar retorno gera um link de confirmação e mantém a assinante inativa até confirmar.
- O link permite retorno antes de completar 48 horas; no vencimento ou depois é recusado.
- Links incorretos e links já utilizados não alteram o consentimento.

**Regras cobertas:** RN06

**Prioridade:** Alta — Respeita a decisão de recebimento.

**Cenários:** [features/us04-descadastro.feature](../features/us04-descadastro.feature)
