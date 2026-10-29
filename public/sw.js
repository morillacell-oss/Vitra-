const CACHE='vitra-shell-v10';
const OFFLINE_SHELL=['/manifest.webmanifest','/vitra-mark.svg','/vitra-maskable.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(OFFLINE_SHELL))
      .catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  // Never serve stale application HTML. A new deployment must win immediately.
  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request,{cache:'no-store'}).catch(()=>caches.match('/') || Response.error())
    );
    return;
  }

  // Next.js hashed assets are immutable. Network-first also protects us from
  // an old service worker holding a stale asset graph after a deployment.
  if(url.pathname.startsWith('/_next/')){
    event.respondWith(
      fetch(request).then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});
        }
        return response;
      }).catch(()=>caches.match(request).then(hit=>hit || Response.error()))
    );
    return;
  }

  // Small static PWA assets may be cached, but refresh them from network first.
  if(OFFLINE_SHELL.includes(url.pathname)){
    event.respondWith(
      fetch(request).then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});
        }
        return response;
      }).catch(()=>caches.match(request).then(hit=>hit || Response.error()))
    );
  }
});
