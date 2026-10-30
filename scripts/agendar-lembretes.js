// Agenda no ntfy.sh os alertas de insulina dos próximos 3 dias.
// Usa os mesmos ids do app (hHHMM-AAAAMMDD), então reenviar substitui em vez de duplicar.
const fs = require('fs');

const topico = process.env.NTFY_TOPIC;
if (!topico) { console.error('Faltando o segredo NTFY_TOPIC'); process.exit(1); }

const cfg = JSON.parse(fs.readFileSync(__dirname + '/../lembretes.json', 'utf8'));
const agora = Date.now();

// Data de "hoje" no fuso configurado
function partes(ts) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: cfg.fuso, year: 'numeric', month: '2-digit', day: '2-digit' });
  const [y, m, d] = f.format(ts).split('-').map(Number);
  return { y, m, d };
}
// Instante em que "dia + hh:mm" ocorre no fuso (Brasil sem horário de verão: UTC-3)
function instante(y, m, d, hh, mm) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: cfg.fuso, timeZoneName: 'shortOffset' });
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const off = f.formatToParts(guess).find(p => p.type === 'timeZoneName').value; // ex.: GMT-3
  const h = Number((off.match(/GMT([+-]\d+)/) || [0, 0])[1]);
  return guess - h * 3600000;
}

async function main() {
  let ok = 0, falhas = 0;
  for (let dia = 0; dia < 3; dia++) {
    const base = partes(agora + dia * 86400000);
    for (const hora of cfg.horas) {
      const [hh, mm] = hora.split(':').map(Number);
      const alvo = instante(base.y, base.m, base.d, hh, mm);
      const espera = alvo - agora;
      if (espera < 60000 || espera > 71 * 3600000) continue;
      const id = 'h' + hora.replace(':', '') + '-' + base.y + String(base.m).padStart(2, '0') + String(base.d).padStart(2, '0');
      const r = await fetch('https://ntfy.sh/' + topico + '/' + id, {
        method: 'POST',
        headers: { At: String(Math.floor(alvo / 1000)), Title: 'Insulina', Tags: 'syringe' },
        body: 'Hora de tomar insulina'
      });
      if (r.ok) { ok++; console.log('agendado', id); } else { falhas++; console.error('falhou', id, r.status); }
      await new Promise(s => setTimeout(s, 400));
    }
  }
  console.log(ok + ' agendados, ' + falhas + ' falhas');
  if (falhas) process.exit(1);
}
main();
