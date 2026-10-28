import fs from 'node:fs';

const path='app/studio-v4.tsx';
let source=fs.readFileSync(path,'utf8');

if(!source.includes('VITRA_BROWSER_PREVIEW')){
  const anchor=' function setField<K extends keyof Project>';
  if(!source.includes(anchor))throw new Error('VITRA preview anchor not found');
  const helper=`\n // VITRA_BROWSER_PREVIEW — preview the live project in a real browser tab, not inside the editor frame.\n function openBrowserPreview(){\n  const target=window.open('/preview','_blank');\n  if(!target){setNotice('Permita a abertura de nova aba para visualizar o site.');window.setTimeout(()=>setNotice(''),2600);return;}\n  const payload={project,freeMode};\n  const send=()=>{try{if(!target.closed)target.postMessage({type:'VITRA_PREVIEW_DATA',payload},window.location.origin)}catch{}};\n  const ready=(event:MessageEvent)=>{if(event.origin===window.location.origin&&event.source===target&&event.data?.type==='VITRA_PREVIEW_READY'){send();window.removeEventListener('message',ready)}};\n  window.addEventListener('message',ready);\n  window.setTimeout(send,700);\n  window.setTimeout(()=>window.removeEventListener('message',ready),5000);\n }\n`;
  source=source.replace(anchor,helper+anchor);
}

source=source.replaceAll('setPreviewOpen(true)','openBrowserPreview()');
fs.writeFileSync(path,source);
console.log('VITRA browser preview polish complete.');
