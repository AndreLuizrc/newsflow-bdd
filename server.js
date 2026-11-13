const http = require('node:http');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { NewsFlow } = require('./src/newsflow');

// Cada navegador tem seu próprio domínio. Recarregar preserva a sessão;
// reiniciar o servidor descarta os dados desta demonstração acadêmica.
const sessions = new Map();
const assets = {
  '/': ['index.html', 'text/html'],
  '/app.js': ['app.js', 'text/javascript'],
  '/style.css': ['style.css', 'text/css'],
};
function createSession() {
  const service = new NewsFlow();
  ['alice@example.com', 'bruno@example.com', 'carla@example.com'].forEach(email => service.addSubscriber(email));
  service.addSegment('Tecnologia', ['alice@example.com', 'bruno@example.com']);
  service.addSegment('Ciência', ['bruno@example.com', 'carla@example.com']);
  return { service, edition: null };
}
function snapshot({ service, edition }, message = '', error = false) {
  return {
    edition,
    segments: [...service.segments].map(([name, emails]) => ({ name, emails: [...emails] })),
    deliveries: service.outbox.filter(mail => mail.type === 'newsletter'),
    message, error,
  };
}
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const asset = assets[req.url];
  if (req.method === 'GET' && asset) {
    res.writeHead(200, { 'Content-Type': `${asset[1]}; charset=utf-8` });
    return res.end(readFileSync(join(__dirname, 'public', asset[0])));
  }
  if (req.url !== '/api/edition') {
    res.writeHead(404);
    return res.end('Não encontrado');
  }
  let id = /(?:^|;\s*)newsflow=([a-f0-9-]+)/.exec(req.headers.cookie || '')?.[1];
  if (!sessions.has(id)) {
    id = randomUUID();
    sessions.set(id, createSession());
    res.setHeader('Set-Cookie', `newsflow=${id}; HttpOnly; SameSite=Strict; Path=/`);
  }
  const session = sessions.get(id);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') return res.end(JSON.stringify(snapshot(session)));
  if (req.method !== 'POST') {
    res.writeHead(405);
    return res.end(JSON.stringify({ message: 'Método não permitido' }));
  }
  try {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 10_000) throw new Error('Pedido muito grande');
    }
    const data = JSON.parse(body);
    let message;
    let success;
    if (data.action === 'create') {
      if (session.edition) throw new Error('Já existe uma edição nesta sessão');
      if (typeof data.title !== 'string' || !data.title.trim()) throw new Error('Informe o título da edição');
      session.edition = session.service.createEdition(data.title.trim(), 'Ana');
      message = success = 'Edição criada';
    } else {
      if (!session.edition) throw new Error('Crie uma edição primeiro');
      if (data.action === 'approve') {
        if (!['Ana', 'Beatriz'].includes(data.reviewer)) throw new Error('Revisora inválida');
        message = session.service.approve(session.edition, data.reviewer);
        success = 'Edição aprovada';
      } else if (data.action === 'send') {
        if (!Array.isArray(data.segments)) throw new Error('Selecione os segmentos');
        message = session.service.send(session.edition, data.segments);
        success = 'Envio realizado';
      } else throw new Error('Operação inválida');
    }
    res.end(JSON.stringify(snapshot(session, message, message !== success)));
  } catch (error) {
    res.writeHead(400);
    res.end(JSON.stringify(snapshot(session, error.message, true)));
  }
});
server.listen(Number(process.env.PORT || 5173), '127.0.0.1', () => {
  console.log(`NewsFlow em http://127.0.0.1:${server.address().port}`);
});
