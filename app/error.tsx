'use client';

import { useEffect } from 'react';

export default function Error({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
  useEffect(()=>{console.error('[VITRA runtime]',error)},[error]);
  return <main style={{minHeight:'100dvh',display:'grid',placeItems:'center',padding:24,background:'#f5f8f7',color:'#10251f',fontFamily:'system-ui,sans-serif'}}><section style={{width:'min(520px,100%)',padding:32,border:'1px solid rgba(16,37,31,.12)',borderRadius:28,background:'#fff',boxShadow:'0 24px 70px rgba(16,37,31,.08)'}}><div style={{width:56,height:56,borderRadius:18,display:'grid',placeItems:'center',background:'#0d4d42',color:'#fff',font:'700 30px Georgia,serif'}}>V</div><p style={{margin:'28px 0 8px',fontSize:12,fontWeight:800,letterSpacing:'.16em'}}>VITRA / RECUPERAÇÃO</p><h1 style={{margin:'0 0 12px',fontSize:32,lineHeight:1.05}}>O estúdio encontrou um erro.</h1><p style={{margin:'0 0 24px',lineHeight:1.6,color:'#63736e'}}>Seus projetos continuam salvos. Tente recarregar o módulo sem sair da sua conta.</p><button onClick={reset} style={{width:'100%',border:0,borderRadius:16,padding:'16px 20px',background:'#0d4d42',color:'#fff',fontWeight:800,fontSize:15,cursor:'pointer'}}>Tentar novamente</button></section></main>;
}
