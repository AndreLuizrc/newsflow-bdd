# language: pt
@US01 @RN02
Funcionalidade: Aprovar uma edição antes do envio
  Como revisora
  Quero avaliar a edição de outra pessoa
  Para impedir a divulgação de conteúdo sem revisão independente

  Contexto:
    Dado que Ana cria a edição "Informativo #42"

  @smoke @feliz
  Cenário: Aprovação por outra revisora
    Quando Beatriz aprova a edição
    Então a mensagem é "Edição aprovada"
    E a edição fica "aprovada"

  @excecao
  Cenário: Autora tenta aprovar o próprio conteúdo
    Quando Ana aprova a edição
    Então a mensagem é "O autor não pode aprovar a própria edição"
    E a edição fica "rascunho"

  Cenário: Reprovação com orientação para correção
    Quando Beatriz reprova a edição com o comentário "Corrigir a data do evento"
    Então a mensagem é "Edição reprovada"
    E a edição fica "rascunho"
    E o comentário registrado é "Corrigir a data do evento"

  @excecao
  Esquema do Cenário: Reprovação exige comentário preenchido
    Quando Beatriz reprova a edição com o comentário <comentario>
    Então a mensagem é "A reprovação exige um comentário"
    E nenhum comentário é registrado
    Exemplos:
      | comentario |
      | ""         |
      | "   "      |

  @excecao
  Cenário: Envio sem aprovação
    Dado que o segmento "Premium" contém "ana@example.com"
    Quando a gestora envia a edição para os segmentos escolhidos
    Então a mensagem é "A edição precisa de aprovação"
    E a edição fica "rascunho"
    E são enviados 0 e-mails de newsletter
