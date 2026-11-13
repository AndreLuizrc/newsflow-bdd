const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function createEdition(page, title) {
  await page.getByLabel('Título da edição').fill(title);
  await page.getByRole('button', { name: 'Criar edição' }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
}

async function approveEdition(page) {
  await page.getByLabel('Revisora').selectOption('Beatriz');
  await page.getByRole('button', { name: 'Aprovar edição' }).click();
  await expect(page.getByText('Situação: aprovada', { exact: true })).toBeVisible();
}

test('C1 - cria, aprova e envia uma edição para o público escolhido', async ({ page }) => {
  await createEdition(page, 'Boletim de tecnologia');
  await approveEdition(page);
  await page.getByRole('checkbox', { name: 'Tecnologia', exact: true }).check();
  await page.getByRole('button', { name: 'Enviar edição' }).click();

  await expect(page.getByRole('status')).toHaveText('Envio realizado');
  await expect(page.getByText('Situação: enviada', { exact: true })).toBeVisible();
  await expect(page.getByText('2 e-mails de newsletter', { exact: true })).toBeVisible();
  const recipients = page.getByRole('list', { name: 'Destinatários da newsletter' });
  await expect(recipients.getByRole('listitem')).toHaveText([
    'alice@example.com — Boletim de tecnologia',
    'bruno@example.com — Boletim de tecnologia',
  ]);
});

test('C2 - recusa aprovação pela autora e impede envio sem revisão', async ({ page }) => {
  await createEdition(page, 'Edição sem revisão');
  await page.getByLabel('Revisora').selectOption('Ana');
  await page.getByRole('button', { name: 'Aprovar edição' }).click();

  await expect(page.getByRole('alert')).toHaveText('O autor não pode aprovar a própria edição');
  await expect(page.getByText('Situação: rascunho', { exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Tecnologia', exact: true }).check();
  await page.getByRole('button', { name: 'Enviar edição' }).click();
  await expect(page.getByRole('alert')).toHaveText('A edição precisa de aprovação');
  await expect(page.getByText('Situação: rascunho', { exact: true })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Destinatários da newsletter' }).getByRole('listitem')).toHaveCount(0);
  await expect(page.getByText('0 e-mails de newsletter', { exact: true })).toBeVisible();
});

test('C3 - segmentos sobrepostos geram um envio por pessoa e mantêm o resultado ao recarregar', async ({ page }) => {
  await createEdition(page, 'Boletim de ciência e tecnologia');
  await approveEdition(page);
  await page.getByRole('checkbox', { name: 'Tecnologia', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Ciência', exact: true }).check();
  await page.getByRole('button', { name: 'Enviar edição' }).click();

  await expect(page.getByRole('status')).toHaveText('Envio realizado');
  await expect(page.getByText('3 e-mails de newsletter', { exact: true })).toBeVisible();
  const recipients = page.getByRole('list', { name: 'Destinatários da newsletter' });
  await expect(recipients.getByRole('listitem')).toHaveText([
    'alice@example.com — Boletim de ciência e tecnologia',
    'bruno@example.com — Boletim de ciência e tecnologia',
    'carla@example.com — Boletim de ciência e tecnologia',
  ]);
  await page.reload();
  await expect(page.getByText('Situação: enviada', { exact: true })).toBeVisible();
  await expect(page.getByText('3 e-mails de newsletter', { exact: true })).toBeVisible();
  await expect(recipients.getByRole('listitem')).toHaveCount(3);
  await expect(recipients.getByRole('listitem').filter({ hasText: 'bruno@example.com' })).toHaveCount(1);
});
