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
  const next=` // VITRA_CLOUD_MEDIA — project media persists across reloads and devices.\n async function uploadOne(e:ChangeEvent<HTMLInputElement>,key:'logoUrl'|'heroImage'|'aboutImage'|'beforeImage'|'afterImage'){const file=e.target.files?.[0];if(!file)return;try{setNotice('Enviando mídia…');const url=await uploadProjectAsset(file,project.id,key);setField(key,url);setNotice('Mídia salva na nuvem.')}catch(err){setNotice(err instanceof Error?err.message:'Não foi possível enviar a mídia.')}finally{e.target.value='';window.setTimeout(()=>setNotice(''),2200)}}\n async function uploadGallery(e:ChangeEvent<HTMLInputElement>){const files=Array.from(e.target.files||[]).slice(0,8-project.gallery.length);if(!files.length)return;try{setNotice('Enviando galeria…');const urls=await Promise.all(files.map((file,i)=>uploadProjectAsset(file,project.id,'gallery-'+(project.gallery.length+i+1))));setField('gallery',[...project.gallery,...urls].slice(0,8));setNotice('Galeria salva na nuvem.')}catch(err){setNotice(err instanceof Error?err.message:'Não foi possível enviar a galeria.')}finally{e.target.value='';window.setTimeout(()=>setNotice(''),2400)}}\n async function uploadVideo(e:ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];if(!file)return;try{setNotice('Enviando vídeo…');const url=await uploadProjectAsset(file,project.id,'hero-video');setField('heroVideo',url);setNotice('Vídeo salvo na nuvem.')}catch(err){setNotice(err instanceof Error?err.message:'Não foi possível enviar o vídeo.')}finally{e.target.value='';window.setTimeout(()=>setNotice(''),2400)}}\n function go(i:number){setStep(Math.max(0,Math.min(steps.length-1,i)));window.scrollTo({top:0,behavior:'smooth'})}`;
  studio=studio.replace(old,next);
}

// Stamp every explicit save so cloud/local reconciliation can choose the newest copy.
if(!studio.includes('VITRA_SAVE_TIMESTAMP')){
  const oldSave="function save(item=project,message='Projeto salvo.'){const exists=projects.some(p=>p.id===item.id);const next=exists?projects.map(p=>p.id===item.id?item:p):[item,...projects];persist(next);setNotice(message);window.setTimeout(()=>setNotice(''),1800)}";
  const newSave="function save(item=project,message='Projeto salvo.'){/* VITRA_SAVE_TIMESTAMP */const stamped={...item,updatedAt:new Date().toISOString()} as Project & {updatedAt:string};const exists=projects.some(p=>p.id===stamped.id);const next=exists?projects.map(p=>p.id===stamped.id?stamped:p):[stamped,...projects];setProject(stamped);persist(next);setNotice(message);window.setTimeout(()=>setNotice(''),1800)}";
  if(!studio.includes(oldSave))throw new Error('VITRA save timestamp anchor not found');
  studio=studio.replace(oldSave,newSave);
}
fs.writeFileSync(studioPath,studio);

// Preserve real cloud video URLs. Only temporary blob/data media should be removed from local snapshots.
const dataPath='app/vitra-data.ts';
let data=fs.readFileSync(dataPath,'utf8');
if(data.includes("heroVideo:''"))data=data.replace("heroVideo:''","heroVideo:trim(p.heroVideo)");
fs.writeFileSync(dataPath,data);

// Resolve same-project conflicts by most recent updatedAt/database timestamp instead of blindly letting this device win.
const authPath='app/auth-gate.tsx';
let auth=fs.readFileSync(authPath,'utf8');
if(!auth.includes('VITRA_CLOUD_RECONCILIATION')){
  const oldMerge="const cloud=(data||[]).map(row=>((row.settings as {fullProject?:LocalProject}|null)?.fullProject)).filter(Boolean) as LocalProject[];\n    const local=readLocalProjects();\n    const merged=new Map<string,LocalProject>();\n    cloud.forEach(p=>merged.set(p.id,p));\n    local.forEach(p=>merged.set(p.id,p));";
  const newMerge="/* VITRA_CLOUD_RECONCILIATION */\n    const cloud=(data||[]).map(row=>{const full=(row.settings as {fullProject?:LocalProject}|null)?.fullProject;if(!full)return null;return {...full,updatedAt:String(full.updatedAt||row.updated_at||'')}}).filter(Boolean) as LocalProject[];\n    const local=readLocalProjects();\n    const merged=new Map<string,LocalProject>();\n    [...cloud,...local].forEach(p=>{const previous=merged.get(p.id);const currentTime=Date.parse(String(p.updatedAt||''))||0;const previousTime=previous?(Date.parse(String(previous.updatedAt||''))||0):-1;if(!previous||currentTime>=previousTime)merged.set(p.id,p)});";
  if(!auth.includes(oldMerge))throw new Error('VITRA cloud reconciliation anchor not found');
  auth=auth.replace(oldMerge,newMerge);
}
fs.writeFileSync(authPath,auth);

console.log('VITRA quality pass complete.');
