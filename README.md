# NewsFlow — BDD e aceitação com Playwright

Entrega acadêmica com quatro histórias, cenários de negócio em português e domínio executável em memória. Integrantes da dupla: **preencher antes de submeter**.

## Nova etapa: aceitação no navegador

```powershell
npm ci
npx playwright install chromium
npx playwright test
npm run test:acceptance:report
```

O comando `npx playwright test` inicia o app, executa exatamente três testes no Chromium e encerra o servidor automaticamente. Não inicie o app manualmente para rodar a suíte; a porta 5173 deve estar livre. Em uma máquina com o Chromium do Playwright já instalado, o comando de entrega é `npm i && npx playwright test`.

Critérios, rastreabilidade e evidências estão em [ACEITACAO.md](ACEITACAO.md). O relatório fica em `relatorios/playwright/index.html`; para abri-lo use o script acima ou `npx playwright show-report relatorios/playwright`. Para acompanhar os testes, execute `npm run test:acceptance:ui`.

Para explorar a interface manualmente, rode `npm start` e acesse http://127.0.0.1:5173. A interface usa o mesmo domínio dos cenários Cucumber: criação por Ana, revisão por Ana ou Beatriz e envio para Tecnologia e/ou Ciência. O segmento Tecnologia contém Alice e Bruno; Ciência contém Bruno e Carla. Os envios são simulados e exibidos na tela. Cada navegador recebe uma sessão isolada em memória, preservada ao recarregar, descartada ao reiniciar o servidor. Não há autenticação real.

O anti-teste pode ser reproduzido com `npm run test:acceptance:anti`, com o servidor parado e sem outras suítes rodando. Ele remove temporariamente a regra de autoaprovação, exige a falha do C2, restaura o arquivo original e salva `relatorios/anti-teste.txt`. Depois rode `npx playwright test` para comprovar o retorno ao verde. A execução do anti-teste não substitui o relatório HTML da suíte completa.

## Como executar

1. Instale Node.js 22 ou 24 e abra esta pasta no terminal.
2. Execute `npm install` (ou `npm ci` para reproduzir o lockfile).
3. Execute `npm run test:dry` para conferir os passos.
4. Execute `npm test` para testar e gerar `relatorios/cucumber-report.html`.
5. Abra o HTML no navegador; opcionais: `npm run test:smoke` e `npm run test:parallel`.

## Conteúdo

- [Histórias e critérios](docs/historias.md)
- [Análise, checklist e decisões](docs/analise-enunciado.md)
- `features/`: uma funcionalidade por história, tags US/RN, sucesso, exceções e esquemas de fronteira.
- `src/newsflow.js`: implementação do domínio; steps chamam suas operações e verificam resultados e estado.
- `features/support/world.js`: serviço e relógio novos para cada cenário.
- `relatorios/`: evidência da execução completa, HTML e JSON. Dry-run, smoke e paralelo não sobrescrevem essa evidência.

## Fora de escopo

- **RN01 — rascunho e versões:** o salvamento e restauração exigem uma fatia própria; priorizou-se o fluxo de revisão e entrega. Apenas o estado inicial de rascunho é usado como contexto.
- **RN05 — frequência semanal:** adiada para manter o recorte em quatro histórias; não se implementa fila da próxima semana nem contabilização de transacionais.
- **RN07 — falha de entrega:** adiada por exigir política de tentativas e classificação de bounce, independentes do comportamento selecionado.
- **RN08 — push:** adiada por constituir outro canal, com janela de silêncio e limite diário próprios.
- A interface mínima de revisão e envio foi acrescentada para a etapa Playwright. Autenticação real, banco de dados, provedor de e-mail e execução automática de disparos no horário continuam fora do recorte. O envio imediato e o planejamento são operações de domínio; o relógio é simulado. Agendamento e descadastro continuam cobertos pelos cenários Cucumber, sem telas nesta etapa.

## Premissas e rastreabilidade

As tags `@US01`–`@US04` e `@RN02`, `@RN03`, `@RN04`, `@RN06` ligam funcionalidades às histórias e regras. As decisões sobre limites estão na análise. Contas de autora, revisora e gestora são identidades do contexto, sem controle de acesso de produção.

Documentação consultada: [Cucumber.js](https://github.com/cucumber/cucumber-js) e [formatadores oficiais](https://github.com/cucumber/cucumber-js/blob/main/docs/formatters.md).

## Resultado de npm test

Saída real em Node.js 24.14.0, em 04/11/2026 (linha de pontos omitida):

```text
> newsflow-bdd@1.0.0 test
> cucumber-js

37 scenarios (37 passed)
240 steps (240 passed)
0m00.068s (executing steps: 0m00.020s)
```

Também validados: dry-run com 37 cenários e 240 passos reconhecidos (o estado skipped é esperado nessa modalidade); execução paralela em ordem aleatória, 37 cenários aprovados; instalação em cópia sem node_modules com `npm ci`, seguida de `npm test`, 37 cenários aprovados.

## Entrega

O projeto tem repositório Git local e relatório HTML versionado. Para usar em `D:\Cinc. Comp\ES2`, copie ou extraia a pasta `newsflow-bdd` para esse destino e execute os comandos acima dentro dela. Preencha os integrantes, revise as histórias e publique no repositório remoto solicitado pela disciplina. Não há repositório remoto configurado.
