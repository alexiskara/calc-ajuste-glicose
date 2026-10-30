// Service worker: deixa a calculadora funcionar offline quando instalada
const CACHE = 'calc-glicose-v11';
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
  evento.respondWith(
    caches.match(evento.request).then((emCache) => {
      if (emCache) return emCache;
      return fetch(evento.request).then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        return resposta;
      });
    })
  );
});
