#!/usr/bin/env node
/**
 * Calculadora de Insulina de Correção (Bolus de Correção)
 *
 * Fórmula: Dose = (Glicose atual - Glicose alvo) / Fator de Sensibilidade (FSI)
 *
 * - Glicose alvo: valor desejado de glicemia (padrão: 150 mg/dL)
 * - Fator de Sensibilidade à Insulina (FSI): quantos mg/dL de glicemia
 *   1 unidade de insulina reduz. Esse valor é INDIVIDUAL e deve ser
 *   definido pelo seu médico (padrão usado aqui: 50 mg/dL por unidade).
 *
 * Uso interativo:
 *   node calculadora.js
 *
 * Uso por argumentos:
 *   node calculadora.js <glicoseAtual> [alvo] [fsi]
 *   Ex.: node calculadora.js 350
 *        node calculadora.js 350 150 50
 */

const readline = require('readline');

const PADRAO = {
  alvo: 150, // mg/dL
  fsi: 50,   // mg/dL por unidade de insulina
};

function calcularCorrecao(glicoseAtual, alvo = PADRAO.alvo, fsi = PADRAO.fsi) {
  if (!Number.isFinite(glicoseAtual) || glicoseAtual <= 0) {
    throw new Error('Glicose atual inválida. Informe um número maior que zero.');
  }
  if (!Number.isFinite(alvo) || alvo <= 0) {
    throw new Error('Glicose alvo inválida. Informe um número maior que zero.');
  }
  if (!Number.isFinite(fsi) || fsi <= 0) {
    throw new Error('Fator de sensibilidade inválido. Informe um número maior que zero.');
  }

  const diferenca = glicoseAtual - alvo;
  const doseExata = diferenca / fsi;

  // Doses são aplicadas em incrementos de 0,5 unidade nas canetas mais comuns.
  // Arredonda para baixo (mais conservador) para o meio ponto mais próximo.
  const doseArredondada = Math.max(0, Math.floor(doseExata * 2) / 2);

  return {
    glicoseAtual,
    alvo,
    fsi,
    diferenca,
    doseExata,
    doseArredondada,
    precisaCorrecao: diferenca > 0,
  };
}

function exibirResultado(r) {
  console.log('\n========== RESULTADO ==========');
  console.log(`Glicose atual:        ${r.glicoseAtual} mg/dL`);
  console.log(`Glicose alvo:         ${r.alvo} mg/dL`);
  console.log(`Fator sensibilidade:  ${r.fsi} mg/dL por unidade`);
  console.log('-------------------------------');

  if (!r.precisaCorrecao) {
    if (r.glicoseAtual < 70) {
      console.log('⚠ ATENÇÃO: glicemia abaixo de 70 mg/dL (HIPOGLICEMIA).');
      console.log('NÃO aplique insulina. Trate a hipoglicemia (ex.: 15g de');
      console.log('carboidrato rápido) e procure orientação médica.');
    } else {
      console.log('Sua glicose está no alvo ou abaixo dele.');
      console.log('Nenhuma insulina de correção é necessária.');
    }
    console.log('===============================\n');
    return;
  }

  console.log(`Excesso de glicose:   ${r.diferenca} mg/dL`);
  console.log(`Cálculo:              ${r.diferenca} ÷ ${r.fsi} = ${r.doseExata.toFixed(2)} unidades`);
  console.log('-------------------------------');
  console.log(`>>> DOSE DE CORREÇÃO: ${r.doseArredondada} unidade(s) <<<`);
  console.log('    (arredondada para baixo, em passos de 0,5 U)');
  console.log('===============================');
  console.log('\n⚠ AVISO: esta calculadora é apenas uma ferramenta de apoio.');
  console.log('O fator de sensibilidade e o alvo devem ser definidos pelo seu');
  console.log('médico. Em caso de dúvida, NÃO aplique e consulte seu médico.\n');
}

function lerNumero(texto) {
  const n = Number(String(texto).trim().replace(',', '.'));
  return n;
}

// ---------- Modo por argumentos ----------
function modoArgumentos(args) {
  const glicoseAtual = lerNumero(args[0]);
  const alvo = args[1] !== undefined ? lerNumero(args[1]) : PADRAO.alvo;
  const fsi = args[2] !== undefined ? lerNumero(args[2]) : PADRAO.fsi;

  try {
    exibirResultado(calcularCorrecao(glicoseAtual, alvo, fsi));
  } catch (erro) {
    console.error(`Erro: ${erro.message}`);
    process.exit(1);
  }
}

// ---------- Modo interativo ----------
function modoInterativo() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const perguntar = (pergunta) =>
    new Promise((resolve) => rl.question(pergunta, resolve));

  (async () => {
    console.log('=== Calculadora de Insulina de Correção ===\n');

    const respostaGlicose = await perguntar('Qual sua glicose atual (mg/dL)? ');
    const respostaAlvo = await perguntar(`Qual a glicose alvo? [padrão ${PADRAO.alvo}] `);
    const respostaFsi = await perguntar(`Qual seu fator de sensibilidade (mg/dL por unidade)? [padrão ${PADRAO.fsi}] `);

    rl.close();

    const glicoseAtual = lerNumero(respostaGlicose);
    const alvo = respostaAlvo.trim() === '' ? PADRAO.alvo : lerNumero(respostaAlvo);
    const fsi = respostaFsi.trim() === '' ? PADRAO.fsi : lerNumero(respostaFsi);

    try {
      exibirResultado(calcularCorrecao(glicoseAtual, alvo, fsi));
    } catch (erro) {
      console.error(`Erro: ${erro.message}`);
      process.exit(1);
    }
  })();
}

// ---------- Início ----------
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    modoArgumentos(args);
  } else {
    modoInterativo();
  }
}

module.exports = { calcularCorrecao, PADRAO };
