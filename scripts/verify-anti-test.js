const assert = require('node:assert/strict');
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

// Execute com a árvore de trabalho ociosa: a alteração é temporária e restaurada
// mesmo se o teste ou a verificação da evidência falhar.
const root = join(__dirname, '..');
const domain = join(root, 'src', 'newsflow.js');
const original = readFileSync(domain, 'utf8');
const rule = "    if (reviewer === edition.author) return 'O autor não pode aprovar a própria edição';";
assert.ok(original.includes(rule), 'Regra de aprovação não encontrada; nada foi alterado.');
let result;
try {
  writeFileSync(domain, original.replace(rule, '    // Mutação temporária: aprovação pela autora liberada.'));
  result = spawnSync(process.execPath, [
    require.resolve('@playwright/test/cli'), 'test', '-g', 'C2 -',
    '--reporter=list', '--output=test-results/anti-teste',
  ], { cwd: root, encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '0' } });
} finally {
  writeFileSync(domain, original);
}
if (result.error) throw result.error;
const output = `${result.stdout || ''}\n${result.stderr || ''}`;
assert.equal(result.status, 1, 'O teste deveria falhar com a regra removida.');
assert.match(output, /1 failed/, 'A execução precisa apresentar exatamente um teste reprovado.');
assert.match(output, /O autor não pode aprovar a própria edição/, 'A falha precisa apontar a regra removida.');
assert.match(output, /expect\(locator\)\.toHaveText/, 'A falha precisa ser uma asserção de comportamento.');
mkdirSync(join(root, 'relatorios'), { recursive: true });
writeFileSync(join(root, 'relatorios', 'anti-teste.txt'), [
  `Execução: ${new Date().toISOString()}`,
  'Mutação: removida temporariamente a proibição de a autora aprovar a própria edição.',
  'Comando: npx playwright test -g "C2 -" --reporter=list --output=test-results/anti-teste',
  'Resultado esperado e observado: 1 teste reprovado na asserção da mensagem de recusa.',
  'Código original restaurado automaticamente após a execução.',
  '', output,
].join('\n'));
console.log('Anti-teste confirmado. Regra restaurada. Evidência: relatorios/anti-teste.txt');
