# language: pt
@US04 @RN06
Funcionalidade: Sair da lista e confirmar o retorno
  Como assinante
  Quero interromper as newsletters e confirmar um eventual retorno
  Para controlar meu consentimento de recebimento

  Contexto:
    Dado que "ana@example.com" é assinante ativa

  @smoke @feliz
  Cenário: Descadastro tem efeito imediato e confirmação
    Quando a assinante solicita o descadastro
    Então a mensagem é "Descadastro realizado"
    E a assinante fica "inativa"
    E é enviado um e-mail de "confirmacao-descadastro" para a assinante

  Cenário: Newsletter contém acesso ao descadastro
    Dado que Ana cria a edição "Informativo #42"
    E que Beatriz já aprovou a edição
    E que o segmento "Premium" contém "ana@example.com"
    Quando a gestora envia a edição para os segmentos escolhidos
    Então cada newsletter contém um link de descadastro do destinatário

  Cenário: Pedido de retorno ainda não autoriza newsletters
    Dado que a assinante já se descadastrou
    Quando a assinante solicita o retorno à lista
    Então a assinante fica "inativa"
    E é enviado um e-mail de "confirmacao-retorno" para a assinante

  @limite
  Esquema do Cenário: Confirmação dentro das 48 horas de validade
    Dado que a assinante já se descadastrou
    E que solicitou o retorno há <minutos> minutos
    Quando a assinante confirma o retorno pelo link recebido
    Então a mensagem é <mensagem>
    E a assinante fica <estado>
    Exemplos:
      | minutos | mensagem                    | estado    |
      | 0       | "Retorno confirmado"        | "ativa"   |
      | 2879    | "Retorno confirmado"        | "ativa"   |
      | 2880    | "Link inválido ou expirado" | "inativa" |
      | 2881    | "Link inválido ou expirado" | "inativa" |

  @excecao
  Cenário: Link incorreto não confirma o retorno
    Dado que a assinante já se descadastrou
    E que solicitou o retorno há 1 minutos
    Quando a assinante confirma o retorno com um link incorreto
    Então a mensagem é "Link inválido ou expirado"
    E a assinante fica "inativa"

  @excecao
  Cenário: Link utilizado não pode ser reutilizado
    Dado que a assinante já confirmou o retorno pelo link recebido
    Quando a assinante confirma o retorno pelo link recebido
    Então a mensagem é "Link inválido ou expirado"
    E a assinante fica "ativa"

  Cenário: Assinante descadastrada é excluída dos próximos envios
    Dado que a assinante já se descadastrou
    E que Ana cria a edição "Informativo #42"
    E que Beatriz já aprovou a edição
    E que o segmento "Premium" contém "ana@example.com, bia@example.com"
    Quando a gestora envia a edição para os segmentos escolhidos
    Então a mensagem é "Envio realizado"
    E "ana@example.com" recebe 0 e-mails de newsletter
    E "bia@example.com" recebe 1 e-mail de newsletter
