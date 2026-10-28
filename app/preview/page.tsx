'use client';

import { useEffect, useState } from 'react';
import SitePreview from '../site-preview-v2';
import { Project, upgradeProject } from '../vitra-data';

type PreviewPayload={project:Project;freeMode:boolean};

export default function PreviewPage(){
  const [payload,setPayload]=useState<PreviewPayload|null>(null);
  const [missing,setMissing]=useState(false);

  useEffect(()=>{
    const receive=(event:MessageEvent)=>{
      if(event.origin!==window.location.origin)return;
      if(event.data?.type!=='VITRA_PREVIEW_DATA')return;
      const raw=event.data.payload as PreviewPayload;
      if(!raw?.project)return;
      setPayload({project:upgradeProject(raw.project),freeMode:Boolean(raw.freeMode)});
      setMissing(false);
      document.title=`Prévia — ${raw.project.name||'VITRA'}`;
    };
    window.addEventListener('message',receive);
    if(window.opener){
      window.opener.postMessage({type:'VITRA_PREVIEW_READY'},window.location.origin);
    }else{
      setMissing(true);
    }
    const timer=window.setTimeout(()=>{if(!window.opener)setMissing(true)},1200);
    return()=>{window.removeEventListener('message',receive);window.clearTimeout(timer)};
  },[]);

  if(!payload)return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#f4f7f6',color:'#17312a',fontFamily:'Arial,sans-serif',padding:24,textAlign:'center'}}><div><b style={{fontSize:22}}>VITRA</b><p style={{opacity:.65,maxWidth:360,lineHeight:1.5}}>{missing?'Abra a prévia pelo botão de visualizar dentro do VITRA.':'Abrindo sua prévia em tamanho real…'}</p></div></main>;

  return <main style={{margin:0,minHeight:'100vh',width:'100%',overflowX:'hidden',background:'#fff'}}><SitePreview project={payload.project} freeMode={payload.freeMode}/></main>;
}
