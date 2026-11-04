const { randomUUID } = require('node:crypto');
const MINUTE = 60_000;
class NewsFlow {
  constructor(now = '2026-11-04T09:00:00-03:00') {
    this.now = Date.parse(now);
    this.editions = new Map();
    this.segments = new Map();
    this.subscribers = new Map();
    this.outbox = [];
  }
  advance(minutes) { this.now += minutes * MINUTE; }
  createEdition(title, author) {
    const edition = { title, author, status: 'rascunho', comment: null, schedule: null, reschedules: 0, recipients: [] };
    this.editions.set(title, edition);
    return edition;
  }
  approve(edition, reviewer) {
    if (reviewer === edition.author) return 'O autor não pode aprovar a própria edição';
    if (edition.status !== 'rascunho') return 'A edição precisa estar em rascunho';
    edition.status = 'aprovada';
    return 'Edição aprovada';
  }
  reject(edition, comment) {
    if (!comment.trim()) return 'A reprovação exige um comentário';
    if (edition.status !== 'rascunho') return 'A edição precisa estar em rascunho';
    edition.comment = comment.trim();
    edition.status = 'rascunho';
    return 'Edição reprovada';
  }
  addSubscriber(email) {
    const subscriber = { email, active: true, token: null, expires: null };
    this.subscribers.set(email, subscriber);
    return subscriber;
  }
  addSegment(name, emails) { this.segments.set(name, new Set(emails)); }
  audience(names) {
    const unique = [...new Set(names)];
    if (unique.length === 0 || unique.length > 5) return { error: 'Selecione de 1 a 5 segmentos' };
    const recipients = new Set();
    for (const name of unique) {
      if (!this.segments.has(name)) return { error: 'Segmento inexistente' };
      const active = [...this.segments.get(name)].filter(email => this.subscribers.get(email)?.active);
      if (!active.length) return { error: 'Segmento sem assinantes bloqueia o agendamento' };
      active.forEach(email => recipients.add(email));
    }
    return { recipients: [...recipients] };
  }
  schedule(edition, when, names) {
    if (edition.status !== 'aprovada') return 'A edição precisa de aprovação';
    if (!Number.isFinite(when) || when - this.now < 15 * MINUTE) return 'O envio precisa de ao menos 15 minutos';
    const audience = this.audience(names);
    if (audience.error) return audience.error;
    edition.schedule = when;
    edition.segments = [...new Set(names)];
    edition.recipients = audience.recipients;
    edition.status = 'agendada';
    return 'Envio agendado';
  }
  reschedule(edition, when) {
    if (edition.status !== 'agendada' || edition.schedule <= this.now) return 'O envio não pode ser reagendado';
    if (edition.reschedules >= 2) return 'Limite de 2 reagendamentos atingido';
    if (!Number.isFinite(when) || when - this.now < 15 * MINUTE) return 'O envio precisa de ao menos 15 minutos';
    edition.schedule = when;
    edition.reschedules += 1;
    return 'Envio reagendado';
  }
  cancel(edition) {
    if (edition.status !== 'agendada') return 'O envio não está agendado';
    if (edition.schedule - this.now < 5 * MINUTE) return 'O cancelamento exige ao menos 5 minutos';
    edition.status = 'aprovada';
    edition.schedule = null;
    return 'Envio cancelado';
  }
  send(edition, names) {
    if (edition.status !== 'aprovada') return 'A edição precisa de aprovação';
    const audience = this.audience(names);
    if (audience.error) return audience.error;
    edition.recipients = audience.recipients;
    for (const email of edition.recipients) this.outbox.push({ type: 'newsletter', email, title: edition.title, unsubscribeLink: `https://newsflow.example/descadastro/${encodeURIComponent(email)}` });
    edition.status = 'enviada';
    return 'Envio realizado';
  }
  unsubscribe(subscriber) {
    subscriber.active = false;
    subscriber.token = null;
    subscriber.expires = null;
    this.outbox.push({ type: 'confirmacao-descadastro', email: subscriber.email, unsubscribeLink: `https://newsflow.example/descadastro/${encodeURIComponent(subscriber.email)}` });
    return 'Descadastro realizado';
  }
  requestReturn(subscriber) {
    subscriber.token = randomUUID();
    subscriber.expires = this.now + 48 * 60 * MINUTE;
    this.outbox.push({ type: 'confirmacao-retorno', email: subscriber.email, token: subscriber.token, unsubscribeLink: `https://newsflow.example/descadastro/${encodeURIComponent(subscriber.email)}` });
    return subscriber.token;
  }
  confirmReturn(subscriber, token) {
    if (!subscriber.token || token !== subscriber.token || this.now >= subscriber.expires) return 'Link inválido ou expirado';
    subscriber.active = true;
    subscriber.token = null;
    subscriber.expires = null;
    return 'Retorno confirmado';
  }
}
module.exports = { NewsFlow };
