/* Service Worker — Trust Group ERP
   شبكة-أولاً: دايماً بيجيب آخر نسخة من النت (فالتحديثات تظهر فوراً)،
   وبيرجع لآخر نسخة محفوظة بس لو مفيش نت. */
const CACHE='tgerp-cache-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})());});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'){return;}
  const isPage=req.mode==='navigate'||req.destination==='document'||req.url.endsWith('/')||req.url.endsWith('index.html');
  e.respondWith((async()=>{
    try{
      const res=await fetch(req);
      if(isPage){const copy=res.clone();const c=await caches.open(CACHE);c.put('page',copy);}
      return res;
    }catch(err){
      if(isPage){const c=await caches.open(CACHE);const cached=await c.match('page');if(cached)return cached;}
      return Response.error();
    }
  })());
});
