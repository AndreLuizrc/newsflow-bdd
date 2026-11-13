const byId = id => document.getElementById(id);
function render(state) {
  byId('message').setAttribute('role', state.error ? 'alert' : 'status');
  byId('message').textContent = state.message;
  byId('create-form').hidden = Boolean(state.edition);
  byId('edition').hidden = !state.edition;
  if (state.edition) {
    byId('edition-title').textContent = state.edition.title;
    byId('edition-status').textContent = `Situação: ${state.edition.status}`;
  }
  // Preserva a escolha dos segmentos ao atualizar o resultado da operação.
  if (!byId('segments').children.length) {
    for (const segment of state.segments) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'segment';
      input.value = segment.name;
      label.append(input, document.createTextNode(segment.name));
      const details = document.createElement('small');
      details.textContent = segment.emails.join(', ');
      byId('segments').append(label, details);
    }
  }
  byId('summary').textContent = `${state.deliveries.length} e-mails de newsletter`;
  byId('deliveries').replaceChildren();
  for (const delivery of state.deliveries) {
    const item = document.createElement('li');
    item.textContent = `${delivery.email} — ${delivery.title}`;
    byId('deliveries').append(item);
  }
}
async function request(data) {
  try {
    const response = await fetch('/api/edition', data ? {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    } : {});
    render(await response.json());
  } catch {
    byId('message').setAttribute('role', 'alert');
    byId('message').textContent = 'Não foi possível acessar o servidor. Tente novamente.';
  }
}
byId('create-form').addEventListener('submit', async event => {
  event.preventDefault();
  await request({ action: 'create', title: byId('title').value });
});
byId('approve-form').addEventListener('submit', async event => {
  event.preventDefault();
  await request({ action: 'approve', reviewer: byId('reviewer').value });
});
byId('send-form').addEventListener('submit', async event => {
  event.preventDefault();
  const segments = [...document.querySelectorAll('input[name="segment"]:checked')].map(input => input.value);
  await request({ action: 'send', segments });
});
// Habilita a interação somente depois de carregar a sessão.
document.querySelectorAll('button').forEach(button => { button.disabled = true; });
request().finally(() => document.querySelectorAll('button').forEach(button => { button.disabled = false; }));
