# Aceitação do NewsFlow com Playwright

Integrantes da dupla: **preencher antes de submeter**.

## Execução

Requisito: Node.js 22 ou 24. Na raiz do projeto:

```powershell
npm ci
npx playwright install chromium
npx playwright test
npm run test:acceptance:report
```

A instalação do navegador é necessária apenas na preparação da máquina. No Linux, use `npx playwright install --with-deps chromium` se faltarem bibliotecas. O comando avaliado `npx playwright test` inicia e encerra o servidor via `webServer`, sem passo manual. Deixe a porta 5173 livre. O relatório HTML está em `relatorios/playwright/index.html`; também pode ser aberto com `npx playwright show-report relatorios/playwright`.

## Critério → teste → evidência

| Critério de aceitação (Dado / Quando / Então) | Teste | O que prova / evidência |
| --- | --- | --- |
| **C1 — Caminho principal, US01/RN02 e US03/RN04.** Dado que Ana cria uma edição, quando Beatriz aprova e a gestora envia para Tecnologia, então a tela confirma o envio, mostra a edição enviada e registra os dois destinatários escolhidos. | `tests/newsflow.spec.js:19` — `C1 - cria, aprova e envia uma edição para o público escolhido` | Confirmação, situação enviada, total de 2 e lista exata de Alice e Bruno. Caso C1 no relatório HTML. |
| **C2 — Regra que barra erro, US01/RN02.** Dada uma edição de Ana em rascunho, quando Ana tenta aprová-la e depois enviá-la, então aparecem as duas recusas, a edição permanece em rascunho e nenhum envio é registrado. | `tests/newsflow.spec.js:35` — `C2 - recusa aprovação pela autora e impede envio sem revisão` | Mensagem de autoaprovação recusada, preservação do rascunho, envio sem revisão bloqueado e lista vazia. Caso C2 no relatório HTML e `relatorios/anti-teste.txt`. |
| **C3 — Regra de estado, US03/RN04.** Dada uma edição aprovada, quando são selecionados Tecnologia (Alice e Bruno) e Ciência (Bruno e Carla) e o envio é realizado, então há exatamente 3 destinatários, com apenas um envio para Bruno; após recarregar, o total, a situação enviada e a unicidade permanecem. | `tests/newsflow.spec.js:50` — `C3 - segmentos sobrepostos geram um envio por pessoa e mantêm o resultado ao recarregar` | Lista exata dos três destinatários antes do reload; total 3, situação enviada, 3 registros e somente um Bruno depois do reload. Caso C3 no relatório HTML. |

## Independência e escopo

Cada teste usa um contexto de navegador novo e uma sessão própria, sem compartilhar edições ou envios. Toda preparação ocorre pela interface. Não há acesso à API, ao domínio, a cookies ou ao armazenamento pelos testes. Os seletores usam somente papéis, rótulos e texto; não há espera fixa. Cada cenário contém várias asserções de comportamento.

A interface usa o domínio anterior sem duplicar as regras de aprovação, seleção de público ou envio. A persistência é apenas da sessão em memória durante a vida do servidor: recarregar conserva os registros; reiniciar o servidor os apaga. O seletor de revisora é uma simulação de identidade e os e-mails são registros demonstrativos, sem provedor real. A cobertura Playwright está limitada aos três critérios escolhidos; os demais comportamentos continuam na suíte Cucumber.

Para executar qualquer cenário isoladamente:

```powershell
npx playwright test -g "C1 -"
npx playwright test -g "C2 -"
npx playwright test -g "C3 -"
```

## Anti-teste reproduzível

Com o servidor parado e sem outra suíte em execução, rode `npm run test:acceptance:anti`. O script remove temporariamente de `src/newsflow.js` a proibição de a autora aprovar a própria edição, executa somente C2 e exige uma falha na asserção da mensagem de recusa. O arquivo é restaurado em `finally`, inclusive se a execução falhar. A saída real é salva em `relatorios/anti-teste.txt`; o relatório HTML completo não é sobrescrito. Rode novamente `npx playwright test` para registrar os três casos verdes após a restauração.

## Resultado verificado em 13/11/2026

Ambiente: Windows, Node.js 24.14.0, Playwright 1.65.0 e Chromium instalado pelo Playwright.

| Verificação | Resultado observado |
| --- | --- |
| Suíte completa após restaurar a regra | **3 passed (3.1s)**; relatório HTML em `relatorios/playwright/index.html` |
| C1 isolado | **1 passed (1.7s)** |
| C2 isolado, regra original | **1 passed (8.8s)** |
| C3 isolado | **1 passed (1.6s)** |
| C2 com autoaprovação liberada temporariamente | **1 failed**, na asserção da mensagem de recusa; evidência em `relatorios/anti-teste.txt` |
| Regressão do BDD (`npm run test:parallel`) | **37 cenários e 240 passos aprovados** |

O relatório HTML corresponde à execução completa verde, posterior ao anti-teste. A regra do domínio foi restaurada sem alteração permanente em `src/newsflow.js`.

## Referências técnicas

- [Playwright: inicialização automática com webServer](https://playwright.dev/docs/test-webserver).
- [Playwright: seletores por papel, rótulo e texto](https://playwright.dev/docs/locators).
