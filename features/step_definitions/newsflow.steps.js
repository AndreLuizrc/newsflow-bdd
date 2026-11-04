const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const list = value => value.split(',').map(s => s.trim()).filter(Boolean);
Given('que Ana cria a edição {string}', function (title) { this.edition = this.service.createEdition(title, 'Ana'); });
Given('que Beatriz já aprovou a edição', function () { assert.equal(this.service.approve(this.edition, 'Beatriz'), 'Edição aprovada'); });
Given('que o segmento {string} contém {string}', function (name, emails) {
  for (const email of list(emails)) if (!this.service.subscribers.has(email)) this.service.addSubscriber(email);
  this.service.addSegment(name, list(emails));
});
Given('que a gestora escolhe os segmentos {string}', function (names) { this.selected = list(names); });
Given('que a gestora escolhe {int} segmentos com 1 assinante cada', function (count) {
  this.selected = [];
  for (let i = 0; i < count; i++) {
    const name = `Segmento ${i}`, email = `assinante${i}@example.com`;
    this.service.addSubscriber(email); this.service.addSegment(name, [email]); this.selected.push(name);
  }
});
Given('que o envio está agendado para daqui a {int} minutos', function (minutes) {
  assert.equal(this.service.schedule(this.edition, this.service.now + minutes * 60000, this.selected), 'Envio agendado');
});
Given('que a gestora já reagendou o envio {int} vezes', function (count) {
  for (let i = 0; i < count; i++) assert.equal(this.service.reschedule(this.edition, this.service.now + (61 + i) * 60000), 'Envio reagendado');
});
Given('que faltam {int} minutos para o envio', function (minutes) { this.service.advance((this.edition.schedule - this.service.now) / 60000 - minutes); });
When('{word} aprova a edição', function (name) { this.result = this.service.approve(this.edition, name); });
When('Beatriz reprova a edição com o comentário {string}', function (comment) { this.result = this.service.reject(this.edition, comment); });
When('a gestora agenda o envio para daqui a {int} minutos', function (minutes) { this.result = this.service.schedule(this.edition, this.service.now + minutes * 60000, this.selected); });
When('a gestora agenda o envio para {string}', function (date) { this.result = this.service.schedule(this.edition, Date.parse(date), this.selected); });
When('a gestora reagenda o envio para daqui a {int} minutos', function (minutes) { this.result = this.service.reschedule(this.edition, this.service.now + minutes * 60000); });
When('a gestora cancela o envio', function () { this.result = this.service.cancel(this.edition); });
When('a gestora envia a edição para os segmentos escolhidos', function () { this.result = this.service.send(this.edition, this.selected); });
Then('a mensagem é {string}', function (message) { assert.equal(this.result, message); });
Then('a edição fica {string}', function (status) { assert.equal(this.edition.status, status); });
Then('o comentário registrado é {string}', function (comment) { assert.equal(this.edition.comment, comment); });
Then('nenhum comentário é registrado', function () { assert.equal(this.edition.comment, null); });
Then('o total de reagendamentos é {int}', function (count) { assert.equal(this.edition.reschedules, count); });
Then('o horário agendado fica a {int} minutos do momento atual', function (minutes) { assert.equal(this.edition.schedule, this.service.now + minutes * 60000); });
Then('o agendamento fica {string}', function (state) { assert.equal(this.edition.schedule === null, state === 'removido'); });
Then('o horário do envio em São Paulo é {string}', function (expected) {
  const actual = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(this.edition.schedule));
  assert.equal(actual, expected);
});
Then('são enviados {int} e-mails de newsletter', function (count) { assert.equal(this.service.outbox.filter(m => m.type === 'newsletter').length, count); });
Then('{string} recebe {int} e-mail(s) de newsletter', function (email, count) { assert.equal(this.service.outbox.filter(m => m.type === 'newsletter' && m.email === email).length, count); });
Given('que {string} é assinante ativa', function (email) { this.subscriber = this.service.addSubscriber(email); });
Given('que a assinante já se descadastrou', function () { this.service.unsubscribe(this.subscriber); });
Given('que solicitou o retorno há {int} minutos', function (minutes) { this.token = this.service.requestReturn(this.subscriber); this.service.advance(minutes); });
Given('que a assinante já confirmou o retorno pelo link recebido', function () {
  this.service.unsubscribe(this.subscriber);
  this.token = this.service.requestReturn(this.subscriber);
  assert.equal(this.service.confirmReturn(this.subscriber, this.token), 'Retorno confirmado');
});
When('a assinante solicita o descadastro', function () { this.result = this.service.unsubscribe(this.subscriber); });
When('a assinante solicita o retorno à lista', function () { this.token = this.service.requestReturn(this.subscriber); });
When('a assinante confirma o retorno pelo link recebido', function () { this.result = this.service.confirmReturn(this.subscriber, this.token); });
When('a assinante confirma o retorno com um link incorreto', function () { this.result = this.service.confirmReturn(this.subscriber, 'incorreto'); });
Then('a assinante fica {string}', function (state) { assert.equal(this.subscriber.active, state === 'ativa'); });
Then('é enviado um e-mail de {string} para a assinante', function (type) {
  const messages = this.service.outbox.filter(m => m.type === type && m.email === this.subscriber.email);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].unsubscribeLink, `https://newsflow.example/descadastro/${encodeURIComponent(this.subscriber.email)}`);
  if (type === 'confirmacao-retorno') assert.equal(messages[0].token, this.subscriber.token);
});
Then('cada newsletter contém um link de descadastro do destinatário', function () {
  const messages = this.service.outbox.filter(m => m.type === 'newsletter');
  assert.ok(messages.length > 0);
  for (const message of messages) assert.equal(message.unsubscribeLink, `https://newsflow.example/descadastro/${encodeURIComponent(message.email)}`);
});
