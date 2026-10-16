const CACHE = "kosmiska-katten-mobile-v4";
const ASSETS = ["./", "./index.html", "./apple-touch-icon.png", "./icon-192.png", "./manifest.webmanifest", "./cosmic-book.jpg"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.filter((k)=>k!==CACHE).map((k)=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",(event)=>{
  if(event.request.method!=="GET")return;
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin || u.pathname.includes("/api/"))return;
  event.respondWith(fetch(event.request).then((r)=>{
    if(r.ok) { const copy=r.clone(); event.waitUntil(caches.open(CACHE).then((c)=>c.put(event.request,copy))); }
    return r;
  }).catch(()=>caches.match(event.request).then((r)=>r||caches.match("./index.html"))));
});
