import { getSupabase } from './supabase';

const BUCKET='vitra-assets';

function safeName(name:string){
  const ext=(name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8)||'bin';
  const stem=name.replace(/\.[^.]+$/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,36)||'asset';
  return `${stem}.${ext}`;
}

export async function uploadProjectAsset(file:File,projectId:string,kind:string){
  const supabase=getSupabase();
  if(!supabase)throw new Error('Armazenamento do VITRA indisponível.');
  const {data:{user},error:userError}=await supabase.auth.getUser();
  if(userError||!user)throw new Error('Entre na sua conta novamente para enviar arquivos.');

  const isVideo=file.type.startsWith('video/');
  const max=isVideo?50*1024*1024:15*1024*1024;
  if(file.size>max)throw new Error(isVideo?'O vídeo pode ter no máximo 50 MB.':'Cada imagem pode ter no máximo 15 MB.');

  const path=`${user.id}/${projectId}/${kind}-${Date.now()}-${crypto.randomUUID().slice(0,8)}-${safeName(file.name)}`;
  const {error}=await supabase.storage.from(BUCKET).upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type||undefined});
  if(error)throw new Error(`Não foi possível enviar o arquivo: ${error.message}`);
  const {data}=supabase.storage.from(BUCKET).getPublicUrl(path);
  if(!data.publicUrl)throw new Error('Não foi possível gerar a URL da mídia.');
  return data.publicUrl;
}
