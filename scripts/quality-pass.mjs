import fs from 'node:fs';

const studioPath='app/studio-v4.tsx';
let studio=fs.readFileSync(studioPath,'utf8');

if(!studio.includes("import { uploadProjectAsset } from '../lib/vitra-media';")){
  const anchor="import {applyTemplate,auditProject,copyOptions,createProject,fallback,fontNames,Goal,Niche,nicheCatalog,nicheNames,nicheOrder,palettes,Project,safeProject,sectionNames,SectionKey,templates,TemplateId,upgradeProject} from './vitra-data';";
  if(!studio.includes(anchor))throw new Error('VITRA media import anchor not found');
  studio=studio.replace(anchor,`${anchor}\nimport { uploadProjectAsset } from '../lib/vitra-media';`);
}

if(!studio.includes('VITRA_CLOUD_MEDIA')){
  const old=" async function uploadOne(e:ChangeEvent<HTMLInputElement>,key:'logoUrl'|'heroImage'|'aboutImage'|'beforeImage'|'afterImage'){const file=e.target.files?.[0];if(!file)return;setField(key,await readFile(file));e.target.value=''} async function uploadGallery(e:ChangeEvent<HTMLInputElement>){const files=Array.from(e.target.files||[]).slice(0,8-project.gallery.length);const items=await Promise.all(files.map(readFile));setField('gallery',[...project.gallery,...items].slice(0,8));e.target.value=''} function uploadVideo(e:ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(!f)return;if(project.heroVideo.startsWith('blob:'))URL.revokeObjectURL(project.heroVideo);setField('heroVideo',URL.createObjectURL(f));e.target.value=''} function go(i:number){setStep(Math.max(0,Math.min(steps.length-1,i)));window.scrollTo({top:0,behavior:'smooth'})}";
  if(!studio.includes(old))throw new Error('VITRA cloud media upload anchor not found');
  const next=` // VITRA_CLOUD_MEDIA — project media persists across reloads and devices.\n async function uploadOne(e:ChangeEvent<HTMLInputElement>,key:'logoUrl'|'heroImage'|'aboutImage'|'beforeImage'|'afterImage'){const file=e.target.files?.[0];if(!file)return;try{setNotice('Enviando mídia…');const url=await uploadProjectAsset(file,project.id,key);setField(key,url);setNotice('Mídia salva na nuvem.')}catch(err){setNotice(err instanceof Error?err.message:'Não foi possível enviar a mídia.')}finally{e.target.value='';window.setTimeout(()=>setNotice(''),2200)}}\n async function uploadGallery(e:ChangeEvent<HTMLInputElement>){const files=Array.from(e.target.files||[]).slice(0,8-project.gallery.length);if(!files.length)return;try{setNotice('Enviando galeria…');const urls=await Promise.all(files.map((file,i)=>uploadProjectAsset(file,project.id,\`gallery-${project.gallery.length+i+1}\`)));setField('gallery',[...project.gallery,...urls].slice(0,8));setNotice('Galeria salva na nuvem.')}catch(err){setNotice(err instanceof Error?err.message:'Não foi possível enviar a galeria.')}finally{e.target.value='';window.setTimeout(()=>setNotice(''),2400)}}\n async function uploadVideo(e:ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];if(!file)return;try{setNotice('Enviando vídeo…');const url=await uploadProjectAsset(file,project.id,'hero-video');setField('heroVideo',url);setNotice('Vídeo salvo na nuvem.')}catch(err){setNotice(err instanceof Error?err.message:'Não foi possível enviar o vídeo.')}finally{e.target.value='';window.setTimeout(()=>setNotice(''),2400)}}\n function go(i:number){setStep(Math.max(0,Math.min(steps.length-1,i)));window.scrollTo({top:0,behavior:'smooth'})}`;
  studio=studio.replace(old,next);
}

fs.writeFileSync(studioPath,studio);
console.log('VITRA quality pass complete.');
