const V='inkfold-v1';
const CORE=['./','index.html','manifest.json','lib/pdf.min.js','lib/pdf.worker.min.js','lib/jspdf.umd.min.js','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // 本体：ネット優先（更新を取り込む）→ 失敗時はキャッシュ
  if(u.origin===location.origin&&(r.mode==='navigate'||u.pathname.endsWith('index.html'))){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
  // それ以外（ライブラリ・アイコン・Googleフォント）：キャッシュ優先
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
