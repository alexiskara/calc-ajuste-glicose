# Calculadora de Correção de Insulina

Calculadora de insulina de correção e bolus alimentar, em português, que funciona
no navegador e pode ser instalada como aplicativo no celular (PWA).

## Recursos

- **Dose de correção**: `(glicose atual − alvo) ÷ fator de sensibilidade (FSI)`
- **Bolus alimentar** por contagem de carboidratos (razão insulina/carboidrato)
- **Insulina ativa (IOB)**: desconta a insulina da última aplicação que ainda está agindo
- **Alvos diurno e noturno** separados, selecionados automaticamente pelo horário
- **Dose máxima** configurável como teto de segurança
- **Alertas**: hipoglicemia (< 70 mg/dL) e glicose muito alta (≥ 250 mg/dL, verificação de cetonas)
- **Histórico** com gráfico, tabela e exportação em CSV (salvo apenas no aparelho)
- **Estatísticas**: média, tempo no alvo (70–180), HbA1c estimada (GMI) e mín–máx,
  com filtros de 7 dias, 30 dias ou todo o período
- **Dose aplicada editável**: registre o que realmente aplicou, não só o sugerido
- **Lembrete de nova medição** 2 horas após registrar uma dose
- **Backup e restauração** em arquivo JSON (para trocar de aparelho com segurança)
- **Regras 1800 e 500** para estimativa inicial de FSI e ICR
- **Unidades**: mg/dL ou mmol/L
- **Modo escuro** automático, conforme o tema do aparelho
- **Instalável** como aplicativo (PWA), funciona offline

## Como usar

- **No navegador**: abra `index.html` com dois cliques, ou acesse a versão publicada.
- **Como app no celular**: acesse a página publicada e use "Adicionar à tela inicial".
- **No terminal**: `node calculadora.js 350` (ou sem argumentos, para o modo interativo).
- **Servidor local**: `node servidor.js` e acesse `http://localhost:8350`.

## Privacidade

A página não possui servidor de dados: medições, histórico e parâmetros ficam
salvos apenas no navegador do próprio aparelho (localStorage).

## Aviso importante

⚠ Esta calculadora é apenas uma ferramenta de apoio e **não substitui orientação
médica**. Todos os parâmetros (alvos, FSI, ICR, duração da insulina e dose máxima)
devem ser definidos por um profissional de saúde.
