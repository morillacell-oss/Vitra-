'use client';

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';
import { Icon } from './vitra-icons';

type Mode='login'|'signup'|'forgot'|'update';
type Profile={id:string;email:string|null;full_name:string|null;role:'user'|'admin';created_at:string;last_seen_at:string};
type Activity={user_id:string;last_seen_at:string;device:string|null;page:string|null};
type Metrics={users_total:number;active_now:number;active_24h:number;active_7d:number;signups_7d:number;projects_total:number;projects_draft:number;projects_ready:number;projects_published:number};
type LocalProject={id:string;name?:string;niche?:string;templateId?:string;status?:string;paletteId?:string;fontId?:string;whatsapp?:string;instagram?:string;address?:string;headline?:string;subheadline?:string;ctaLabel?:string;heroImage?:string;logoUrl?:string;services?:unknown[];gallery?:unknown[];createdAt?:string;[key:string]:unknown};

const LOCAL_KEY='vitra-projects-cinema-v1';
const FREE_KEY='vitra-free-project-ids';

function deviceLabel(){
  if(typeof navigator==='undefined')return 'web';
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?'mobile':'desktop';
}
function slugify(value:string){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,44)||'site';}
function readLocalProjects():LocalProject[]{try{return JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]') as LocalProject[]}catch{return []}}
function projectRow(p:LocalProject,userId:string){
  const id=String(p.id);
  return {
    id,user_id:userId,name:String(p.name||'Projeto sem nome'),slug:`${slugify(String(p.name||'site'))}-${id.slice(0,8)}`,
    niche:String(p.niche||'free'),template:String(p.templateId||'custom'),status:String(p.status||'draft'),
    theme:String(p.paletteId||'ivory'),font_style:String(p.fontId||'minimal'),whatsapp:String(p.whatsapp||'')||null,
    instagram:String(p.instagram||'')||null,address:String(p.address||'')||null,headline:String(p.headline||'')||null,
    subheadline:String(p.subheadline||'')||null,cta_label:String(p.ctaLabel||'Falar agora'),hero_image:String(p.heroImage||'')||null,
    logo_url:String(p.logoUrl||'')||null,services:Array.isArray(p.services)?p.services:[],gallery:Array.isArray(p.gallery)?p.gallery:[],
    settings:{fullProject:p},updated_at:new Date().toISOString()
  };
}

export default function AuthGate({children}:{children:ReactNode}){
  const supabase=useMemo(()=>getSupabase(),[]);
  const [loading,setLoading]=useState(true);
  const [session,setSession]=useState<Session|null>(null);
  const [profile,setProfile]=useState<Profile|null>(null);
  const [mode,setMode]=useState<Mode>('login');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const [accountOpen,setAccountOpen]=useState(false);
  const [adminOpen,setAdminOpen]=useState(false);
  const [adminLoading,setAdminLoading]=useState(false);
  const [metrics,setMetrics]=useState<Metrics|null>(null);
  const [profiles,setProfiles]=useState<Profile[]>([]);
  const [activities,setActivities]=useState<Activity[]>([]);
  const [projectCounts,setProjectCounts]=useState<Record<string,number>>({});
  const syncRef=useRef('');

  const hydrateCloud=useCallback(async(user:User)=>{
    if(!supabase)return;
    const {data}=await supabase.from('projects').select('id,settings,updated_at').eq('user_id',user.id);
    const cloud=(data||[]).map(row=>((row.settings as {fullProject?:LocalProject}|null)?.fullProject)).filter(Boolean) as LocalProject[];
    const local=readLocalProjects();
    const merged=new Map<string,LocalProject>();
    cloud.forEach(p=>merged.set(p.id,p));
    local.forEach(p=>merged.set(p.id,p));
    const list=[...merged.values()];
    if(list.length){localStorage.setItem(LOCAL_KEY,JSON.stringify(list));await supabase.from('projects').upsert(list.map(p=>projectRow(p,user.id)),{onConflict:'id'});}
    syncRef.current=JSON.stringify(list);
  },[supabase]);

  const loadProfile=useCallback(async(user:User)=>{
    if(!supabase)return;
    const {data}=await supabase.from('profiles').select('*').eq('id',user.id).single();
    setProfile((data||null) as Profile|null);
  },[supabase]);

  useEffect(()=>{
    if(!supabase){setMessage('Conexão do VITRA indisponível.');setLoading(false);return;}
    let active=true;
    supabase.auth.getSession().then(async({data})=>{
      if(!active)return;
      setSession(data.session);
      if(data.session){await hydrateCloud(data.session.user);await loadProfile(data.session.user)}
      setLoading(false);
    });
    const {data:listener}=supabase.auth.onAuthStateChange(async(event,next)=>{
      if(!active)return;
      setSession(next);
      if(event==='PASSWORD_RECOVERY')setMode('update');
      if(next){await hydrateCloud(next.user);await loadProfile(next.user)}else setProfile(null);
      setLoading(false);
    });
    return()=>{active=false;listener.subscription.unsubscribe()};
  },[supabase,hydrateCloud,loadProfile]);

  useEffect(()=>{
    if(!supabase||!session)return;
    const beat=async()=>{
      const now=new Date().toISOString();
      await supabase.from('user_activity').upsert({user_id:session.user.id,last_seen_at:now,updated_at:now,page:location.pathname,device:deviceLabel()},{onConflict:'user_id'});
    };
    beat(); const timer=window.setInterval(beat,60000); return()=>window.clearInterval(timer);
  },[supabase,session]);

  useEffect(()=>{
    if(!supabase||!session)return;
    const sync=async()=>{
      const list=readLocalProjects(); const snapshot=JSON.stringify(list);
      if(snapshot===syncRef.current)return;
      syncRef.current=snapshot;
      if(list.length)await supabase.from('projects').upsert(list.map(p=>projectRow(p,session.user.id)),{onConflict:'id'});
    };
    const timer=window.setInterval(sync,8000); return()=>window.clearInterval(timer);
  },[supabase,session]);

  async function submit(e:FormEvent){
    e.preventDefault(); if(!supabase)return; setBusy(true); setMessage('');
    try{
      if(mode==='login'){
        const {error}=await supabase.auth.signInWithPassword({email,password}); if(error)throw error;
      }else if(mode==='signup'){
        if(password.length<6)throw new Error('Use uma senha com pelo menos 6 caracteres.');
        const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:location.origin}}); if(error)throw error;
        if(!data.session)setMessage('Conta criada. Confira seu e-mail para confirmar o acesso.');
      }else if(mode==='forgot'){
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}?mode=update-password`}); if(error)throw error;
        setMessage('Se existir uma conta com esse e-mail, enviamos o link de recuperação.');
      }else{
        if(password.length<6)throw new Error('Use uma senha com pelo menos 6 caracteres.');
        const {error}=await supabase.auth.updateUser({password}); if(error)throw error;
        setMessage('Senha atualizada. Você já pode continuar no VITRA.'); setMode('login');
      }
    }catch(err){setMessage(err instanceof Error?err.message:'Não foi possível concluir. Tente novamente.')}finally{setBusy(false)}
  }

  async function signOut(){if(!supabase)return;await supabase.auth.signOut();setAccountOpen(false);setAdminOpen(false)}

  async function openAdmin(){
    if(!supabase||profile?.role!=='admin')return;
    setAdminOpen(true);setAccountOpen(false);setAdminLoading(true);
    const [m,p,a,pr]=await Promise.all([
      supabase.rpc('admin_dashboard_metrics'),
      supabase.from('profiles').select('*').order('created_at',{ascending:false}).limit(100),
      supabase.from('user_activity').select('*'),
      supabase.from('projects').select('user_id')
    ]);
    setMetrics((m.data||null) as Metrics|null); setProfiles((p.data||[]) as Profile[]); setActivities((a.data||[]) as Activity[]);
    const counts:Record<string,number>={}; (pr.data||[]).forEach((x:{user_id:string})=>counts[x.user_id]=(counts[x.user_id]||0)+1); setProjectCounts(counts);
    setAdminLoading(false);
  }

  const activityMap=useMemo(()=>new Map(activities.map(a=>[a.user_id,a])),[activities]);

  if(loading)return <main className="vxAuthLoading"><span>V</span><i/><p>Preparando seu estúdio…</p></main>;

  if(!session)return <main className="vxAuthPage">
    <section className="vxAuthBrand"><span className="vxAuthLogo">V</span><div><small>VITRA / SITE STUDIO</small><h1>Seu estúdio de sites.<br/><em>Pronto para criar.</em></h1><p>Direção visual, conteúdo e conversão organizados em um fluxo simples.</p></div><footer><span><Icon name="magic" size={16}/> Direção automática</span><span><Icon name="monitor" size={16}/> Desktop + mobile</span><span><Icon name="shield" size={16}/> Projetos privados</span></footer></section>
    <section className="vxAuthCard">
      <div className="vxAuthCardTop"><span>V</span><small>{mode==='signup'?'CRIAR CONTA':mode==='forgot'?'RECUPERAR ACESSO':mode==='update'?'NOVA SENHA':'ENTRAR NO VITRA'}</small></div>
      <h2>{mode==='signup'?'Crie seu espaço no VITRA.':mode==='forgot'?'Recupere sua conta.':mode==='update'?'Defina uma nova senha.':'Bem-vindo de volta.'}</h2>
      <p>{mode==='signup'?'Seus projetos ficam vinculados à sua conta e disponíveis em qualquer dispositivo.':mode==='forgot'?'Digite seu e-mail e enviaremos as instruções de recuperação.':mode==='update'?'Escolha uma nova senha segura para continuar.':'Entre para continuar seus projetos e criar novos sites.'}</p>
      <form onSubmit={submit}>
        {mode==='signup'&&<label><span>Seu nome</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Como podemos chamar você?" required/></label>}
        {mode!=='update'&&<label><span>E-mail</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com" required autoComplete="email"/></label>}
        {mode!=='forgot'&&<label><span>Senha</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required autoComplete={mode==='login'?'current-password':'new-password'}/></label>}
        {message&&<div className="vxAuthMessage">{message}</div>}
        <button className="vxAuthSubmit" disabled={busy}>{busy?'Processando…':mode==='signup'?'Criar minha conta':mode==='forgot'?'Enviar recuperação':mode==='update'?'Salvar nova senha':'Entrar no VITRA'} <Icon name="arrowRight" size={16}/></button>
      </form>
      <div className="vxAuthLinks">
        {mode==='login'&&<><button onClick={()=>{setMode('forgot');setMessage('')}}>Esqueci minha senha</button><button onClick={()=>{setMode('signup');setMessage('')}}>Criar conta</button></>}
        {mode!=='login'&&mode!=='update'&&<button onClick={()=>{setMode('login');setMessage('')}}><Icon name="arrowLeft" size={13}/> Voltar para entrar</button>}
      </div>
    </section>
  </main>;

  return <>
    {children}
    <button className="vxAccountButton" onClick={()=>setAccountOpen(v=>!v)} aria-label="Abrir conta"><span>{(profile?.full_name||session.user.email||'V').slice(0,1).toUpperCase()}</span><i/></button>
    {accountOpen&&<aside className="vxAccountSheet">
      <header><span>{(profile?.full_name||session.user.email||'V').slice(0,1).toUpperCase()}</span><div><b>{profile?.full_name||'Minha conta'}</b><small>{session.user.email}</small></div><button onClick={()=>setAccountOpen(false)}><Icon name="plus" size={14}/></button></header>
      <div className="vxAccountStatus"><i/> Conta conectada • projetos na nuvem</div>
      {profile?.role==='admin'&&<button className="vxAdminEntry" onClick={openAdmin}><Icon name="shield" size={17}/><div><b>Painel administrativo</b><small>Usuários, atividade e sites</small></div><Icon name="arrowRight" size={15}/></button>}
      <button className="vxSignout" onClick={signOut}><Icon name="arrowLeft" size={15}/> Sair da conta</button>
    </aside>}

    {adminOpen&&<div className="vxAdminOverlay"><main className="vxAdminPanel">
      <header className="vxAdminHeader"><div><small>VITRA / ADMIN</small><h2>Visão geral da plataforma</h2><p>Acompanhe usuários, atividade e criação de sites em tempo real.</p></div><button onClick={()=>setAdminOpen(false)}><Icon name="plus" size={18}/></button></header>
      {adminLoading?<div className="vxAdminLoading"><i/><span>Carregando dados…</span></div>:<>
        <section className="vxMetricGrid">
          <article><small>USUÁRIOS</small><strong>{metrics?.users_total??0}</strong><span>contas cadastradas</span></article>
          <article className="live"><small>ATIVOS AGORA</small><strong>{metrics?.active_now??0}</strong><span><i/> últimos 5 minutos</span></article>
          <article><small>ATIVOS 24H</small><strong>{metrics?.active_24h??0}</strong><span>{metrics?.active_7d??0} nos últimos 7 dias</span></article>
          <article><small>NOVOS 7D</small><strong>{metrics?.signups_7d??0}</strong><span>novas contas</span></article>
          <article><small>SITES</small><strong>{metrics?.projects_total??0}</strong><span>projetos na plataforma</span></article>
          <article><small>PRONTOS</small><strong>{metrics?.projects_ready??0}</strong><span>{metrics?.projects_draft??0} rascunhos</span></article>
        </section>
        <section className="vxAdminSplit">
          <div className="vxAdminUsers"><header><div><small>USUÁRIOS RECENTES</small><h3>Quem está usando o VITRA</h3></div><b>{profiles.length}</b></header>
            <div className="vxUserTable">{profiles.map(p=>{const a=activityMap.get(p.id);const active=a&&Date.now()-new Date(a.last_seen_at).getTime()<300000;return <article key={p.id}><span className="avatar">{(p.full_name||p.email||'U').slice(0,1).toUpperCase()}</span><div><b>{p.full_name||'Usuário VITRA'}</b><small>{p.email}</small></div><span className={`presence ${active?'online':''}`}><i/>{active?'Agora':a?new Date(a.last_seen_at).toLocaleDateString('pt-BR'):'Sem atividade'}</span><strong>{projectCounts[p.id]||0}<small> sites</small></strong></article>})}</div>
          </div>
          <aside className="vxAdminHealth"><small>PLATAFORMA</small><h3>Status operacional</h3><div><span><i/> Autenticação</span><b>Online</b></div><div><span><i/> Banco de dados</span><b>Online</b></div><div><span><i/> Sincronização</span><b>Ativa</b></div><div><span><i/> Sites publicados</span><b>{metrics?.projects_published??0}</b></div></aside>
        </section>
      </>}
    </main></div>}
  </>;
}
