/* Service worker – Quiz Concorso Senato */
const CACHE = 'quiz-senato-v3';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "Fonti/Costituzione_testo_vigente_Senato.pdf", "Fonti/Regolamento_Senato_aggiornato_2022_ed_provvisoria.pdf", "Fonti/Modifiche_Regolamento_Senato_2022_scheda_sintetica.pdf", "Senato_della_Repubblica-Bando_concorso_30_posti_Segretario_parlamentare.pdf"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const isPage = req.mode === 'navigate' || req.url.endsWith('index.html');
  if (isPage) { // pagina: prima la rete (per ricevere gli aggiornamenti), poi la copia salvata
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  } else { // file statici: prima la copia salvata
    e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req).then(n => { const cp = n.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return n; })));
  }
});
