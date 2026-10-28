'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { Icon } from './vitra-icons';

type Connection={
  user_id:string;
  installation_id:number|null;
  github_login:string|null;
  account_type:'User'|'Organization'|null;
  status:'pending'|'connected'|'revoked'|'error';
  connected_at:string|null;
  verified_at:string|null;
};

function GitBranchMark(){
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="6" r="2.2"/><circle cx="17" cy="18" r="2.2"/><circle cx="7" cy="18" r="2.2"/><path d="M7 8.2v7.6M9.2 6h3.2c2.55 0 4.6 2.05 4.6 4.6v5.2"/></svg>;
}

export default function GitHubConnection(){
  const supabase=useMemo(()=>getSupabase(),[]);
  const [connection,setConnection]=useState<Connection|null>(null);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState('');
  const appSlug=process.env.NEXT_PUBLIC_GITHUB_APP_SLUG||'';

  useEffect(()=>{
    let active=true;
    async function load(){
      if(!supabase){setLoading(false);return;}
      const {data:{user}}=await supabase.auth.getUser();
      if(!user){setLoading(false);return;}

      const params=new URLSearchParams(window.location.search);
      const installation=params.get('installation_id');
      const state=params.get('state');
      const expected=sessionStorage.getItem('vitra-github-state');
      if(installation&&state&&expected&&state===expected){
        const row={user_id:user.id,installation_id:Number(installation),status:'pending' as const,connected_at:new Date().toISOString(),updated_at:new Date().toISOString()};
        const {data,error}=await supabase.from('github_connections').upsert(row,{onConflict:'user_id'}).select().single();
        if(!error&&active){setConnection(data as Connection);setMessage('GitHub recebido. A conexão será validada antes da primeira publicação.');}
        sessionStorage.removeItem('vitra-github-state');
        params.delete('installation_id');params.delete('setup_action');params.delete('state');
        const next=`${location.pathname}${params.toString()?`?${params}`:''}${location.hash}`;
        history.replaceState({},'',next);
      }else{
        const {data}=await supabase.from('github_connections').select('*').eq('user_id',user.id).maybeSingle();
        if(active)setConnection((data||null) as Connection|null);
      }
      if(active)setLoading(false);
    }
    void load();
    return()=>{active=false};
  },[supabase]);

  async function connect(){
    if(!appSlug)return;
    const state=crypto.randomUUID();
    sessionStorage.setItem('vitra-github-state',state);
    window.location.href=`https://github.com/apps/${encodeURIComponent(appSlug)}/installations/new?state=${encodeURIComponent(state)}`;
  }

  async function unlink(){
    if(!supabase)return;
    const {data:{user}}=await supabase.auth.getUser();if(!user)return;
    await supabase.from('github_connections').delete().eq('user_id',user.id);
    setConnection(null);setMessage('GitHub desconectado do VITRA. A instalação pode ser revogada também nas configurações do GitHub.');
  }

  const connected=connection?.status==='connected';
  const pending=connection?.status==='pending';
  const available=Boolean(appSlug);
  return <section className={`vxGithubConnect ${connected?'connected':pending?'pending':!available?'unavailable':''}`}>
    <div className="vxGithubIcon"><GitBranchMark/></div>
    <div className="vxGithubCopy">
      <small>INTEGRAÇÃO / GITHUB</small>
      <b>{connected?(connection?.github_login?`@${connection.github_login}`:'GitHub conectado'):pending?'Conexão em validação':available?'Publique sem baixar ZIP':'Publicação automática em preparação'}</b>
      <p>{connected?'Novos sites e atualizações podem ser enviados ao repositório vinculado.':pending?'Recebemos a instalação. O VITRA valida a permissão antes de publicar.':available?'Conecte sua conta para o VITRA criar e atualizar os repositórios dos seus sites.':'A estrutura já está pronta, mas a GitHub App oficial ainda precisa ser ativada. Até lá, o botão não aparece como uma ação quebrada.'}</p>
      {message&&<span className="vxGithubMessage">{message}</span>}
    </div>
    <div className="vxGithubActions">
      {loading?<span className="vxGithubLoading"/>:connection?<button onClick={unlink} className="secondary">Desconectar</button>:available?<button onClick={connect}>Conectar <Icon name="arrowRight" size={14}/></button>:<span className="vxGithubUnavailable"><i/> Em configuração</span>}
    </div>
  </section>;
}
