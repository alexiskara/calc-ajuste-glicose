// Service worker: abre sempre a versão mais nova quando há internet e usa a cópia salva quando está offline
const CACHE = 'calc-glicose-v16';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icone.svg',
  './icone-180.png',
  './icone-192.png',
  './icone-512.png',
  './icone-maskable-512.png',
  './lib/pdf.min.js',
  './lib/pdf.worker.min.js'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET') return;
  const url = new URL(evento.request.url);
  if (url.origin !== self.location.origin) return; // ntfy e outros serviços passam direto

  evento.respondWith(
    fetch(evento.request, { cache: 'no-cache' }).then((resposta) => {
      if (resposta.ok) {
        const copia = resposta.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
      }
      return resposta;
    }).catch(() => caches.match(evento.request, { ignoreSearch: true }))
  );
});
