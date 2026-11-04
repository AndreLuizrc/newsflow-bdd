# language: pt
@US02 @RN03 @RN02
Funcionalidade: Agendar e ajustar o horário de envio
  Como gestora
  Quero programar o envio de uma edição aprovada
  Para alcançar o público no horário planejado

  Contexto:
    Dado que Ana cria a edição "Informativo #42"
    E que o segmento "Premium" contém "ana@example.com"
    E que Beatriz já aprovou a edição

  @smoke @feliz @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos
    Quando a gestora agenda o envio para daqui a <minutos> minutos
    Então a mensagem é <mensagem>
    E a edição fica <estado>
    Exemplos:
      | minutos | mensagem                                 | estado     |
      | 60      | "Envio agendado"                         | "agendada" |
      | 16      | "Envio agendado"                         | "agendada" |
      | 15      | "Envio agendado"                         | "agendada" |
      | 14      | "O envio precisa de ao menos 15 minutos" | "aprovada" |
      | 0       | "O envio precisa de ao menos 15 minutos" | "aprovada" |
      | -1      | "O envio precisa de ao menos 15 minutos" | "aprovada" |

  Cenário: Horário interpretado no fuso de São Paulo
    Quando a gestora agenda o envio para "2026-11-04T09:30:00-03:00"
    Então a mensagem é "Envio agendado"
    E o horário do envio em São Paulo é "04/11/2026, 09:30"

  @excecao
  Cenário: Agendamento sem aprovação
    Dado que Ana cria a edição "Aviso ainda não revisado"
    Quando a gestora agenda o envio para daqui a 30 minutos
    Então a mensagem é "A edição precisa de aprovação"
    E a edição fica "rascunho"

  @limite
  Esquema do Cenário: Até 2 reagendamentos
    Dado que o envio está agendado para daqui a 60 minutos
    E que a gestora já reagendou o envio <vezes> vezes
    Quando a gestora reagenda o envio para daqui a 120 minutos
    Então a mensagem é <mensagem>
    E o total de reagendamentos é <total>
    E o horário agendado fica a <antecedencia> minutos do momento atual
    Exemplos:
      | vezes | mensagem                                  | total | antecedencia |
      | 0     | "Envio reagendado"                        | 1     | 120          |
      | 1     | "Envio reagendado"                        | 2     | 120          |
      | 2     | "Limite de 2 reagendamentos atingido"     | 2     | 62           |

  @excecao
  Cenário: Reagendamento com antecedência insuficiente preserva o horário
    Dado que o envio está agendado para daqui a 60 minutos
    Quando a gestora reagenda o envio para daqui a 14 minutos
    Então a mensagem é "O envio precisa de ao menos 15 minutos"
    E o total de reagendamentos é 0
    E o horário agendado fica a 60 minutos do momento atual

  @limite
  Esquema do Cenário: Cancelamento até 5 minutos antes
    Dado que o envio está agendado para daqui a 60 minutos
    E que faltam <minutos> minutos para o envio
    Quando a gestora cancela o envio
    Então a mensagem é <mensagem>
    E a edição fica <estado>
    E o agendamento fica <agendamento>
    Exemplos:
      | minutos | mensagem                                     | estado     | agendamento |
      | 6       | "Envio cancelado"                            | "aprovada" | "removido"  |
      | 5       | "Envio cancelado"                            | "aprovada" | "removido"  |
      | 4       | "O cancelamento exige ao menos 5 minutos"    | "agendada" | "mantido"   |
