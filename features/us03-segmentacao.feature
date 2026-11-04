# language: pt
@US03 @RN04
Funcionalidade: Escolher segmentos sem duplicar destinatários
  Como gestora
  Quero selecionar até 5 segmentos com assinantes
  Para direcionar a edição sem enviar cópias repetidas

  Contexto:
    Dado que Ana cria a edição "Informativo #42"
    E que Beatriz já aprovou a edição

  @smoke @feliz
  Cenário: Assinante presente em dois segmentos recebe uma única cópia
    Dado que o segmento "Premium" contém "ana@example.com, bia@example.com"
    E que o segmento "Tecnologia" contém "ana@example.com, caio@example.com"
    E que a gestora escolhe os segmentos "Premium, Tecnologia"
    Quando a gestora envia a edição para os segmentos escolhidos
    Então a mensagem é "Envio realizado"
    E são enviados 3 e-mails de newsletter
    E "ana@example.com" recebe 1 e-mail de newsletter

  @limite
  Esquema do Cenário: Quantidade de segmentos permitida
    Dado que a gestora escolhe <quantidade> segmentos com 1 assinante cada
    Quando a gestora agenda o envio para daqui a 30 minutos
    Então a mensagem é <mensagem>
    E a edição fica <estado>
    Exemplos:
      | quantidade | mensagem                         | estado     |
      | 0          | "Selecione de 1 a 5 segmentos"   | "aprovada" |
      | 1          | "Envio agendado"                 | "agendada" |
      | 5          | "Envio agendado"                 | "agendada" |
      | 6          | "Selecione de 1 a 5 segmentos"   | "aprovada" |

  @excecao
  Cenário: Um segmento vazio impede todo o agendamento
    Dado que o segmento "Premium" contém "ana@example.com"
    E que o segmento "Tecnologia" contém ""
    E que a gestora escolhe os segmentos "Premium, Tecnologia"
    Quando a gestora agenda o envio para daqui a 30 minutos
    Então a mensagem é "Segmento sem assinantes bloqueia o agendamento"
    E a edição fica "aprovada"
    E o agendamento fica "removido"
