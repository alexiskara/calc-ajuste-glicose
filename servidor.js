#!/usr/bin/env node
/**
 * Mini-servidor para usar a calculadora como aplicativo (PWA).
 *
 * Uso:  node servidor.js
 * Depois abra http://localhost:8350 no navegador. No Chrome/Edge,
 * clique no ícone de instalação na barra de endereço para adicionar
 * a calculadora como aplicativo.
 *
 * Para instalar no CELULAR (mesma rede Wi-Fi): use o endereço IP
 * mostrado ao iniciar o servidor.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORTA = 8350;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

const servidor = http.createServer((req, res) => {
  let arquivo = decodeURIComponent(req.url.split('?')[0]);
  if (arquivo === '/') arquivo = '/index.html';

  const caminho = path.join(__dirname, path.normalize(arquivo));
  if (!caminho.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Acesso negado');
  }

  fs.readFile(caminho, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Arquivo não encontrado');
    }
    const ext = path.extname(caminho).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(conteudo);
  });
});

servidor.listen(PORTA, () => {
  console.log('=== Calculadora de Insulina ===\n');
  console.log(`No computador:  http://localhost:${PORTA}`);

  const redes = os.networkInterfaces();
  for (const nome of Object.keys(redes)) {
    for (const rede of redes[nome]) {
      if (rede.family === 'IPv4' && !rede.internal) {
        console.log(`No celular:     http://${rede.address}:${PORTA}  (mesma rede Wi-Fi)`);
      }
    }
  }
  console.log('\nPara parar o servidor: Ctrl+C');
});
