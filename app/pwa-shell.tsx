'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import StudioV4 from './studio-v4';
import AuthGate from './auth-gate';
import './vitra-media-fixes';
import { Icon } from './vitra-icons';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome:'accepted'|'dismissed';platform:string}>;
};
type ThemeMode='light'|'dark';
type AppTab='home'|'projects'|'models';
type NavTarget='home'|'projects'|'create'|'models'|'account';

function ThemeIcon({theme}:{theme:ThemeMode}){
  if(theme==='light')return <svg className="vxThemeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z"/></svg>;
  return <svg className="vxThemeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"/></svg>;
}

export default function PwaShell(){
  const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
  const [standalone,setStandalone]=useState(false);
  const [builder,setBuilder]=useState(false);
  const [workspace,setWorkspace]=useState(false);
  const [activeTab,setActiveTab]=useState<AppTab>('home');
  const [mounted,setMounted]=useState(false);
  const [showInstallHint,setShowInstallHint]=useState(false);
  const [theme,setTheme]=useState<ThemeMode>('light');

  useEffect(()=>{
    setMounted(true);
    try{
      const saved=localStorage.getItem('vitra-ui-theme') as ThemeMode|null;
      if(saved==='dark'||saved==='light')setTheme(saved);
    }catch{}

    const media=window.matchMedia('(display-mode: standalone)');
    const iosStandalone=Boolean((window.navigator as Navigator & {standalone?:boolean}).standalone);
    const updateStandalone=()=>setStandalone(media.matches||iosStandalone);
    updateStandalone();
    media.addEventListener?.('change',updateStandalone);

    if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}

    const beforeInstall=(event:Event)=>{
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
      window.setTimeout(()=>setShowInstallHint(true),700);
    };
    const installed=()=>{setStandalone(true);setPromptEvent(null);setShowInstallHint(false)};
    window.addEventListener('beforeinstallprompt',beforeInstall);
    window.addEventListener('appinstalled',installed);

    const syncView=()=>{
      const inBuilder=Boolean(document.querySelector('.vxBuilder'));
      const inProjects=Boolean(document.querySelector('.vxProjectsPage,.vxDelivery'));
      const inCatalog=Boolean(document.querySelector('.vxCatalog'));
      const inHome=Boolean(document.querySelector('.vxApp'));
      setBuilder(inBuilder);
      setWorkspace(Boolean(inBuilder||inProjects||inCatalog||inHome));
      if(inProjects)setActiveTab('projects');
      else if(inCatalog)setActiveTab('models');
      else if(inHome&&!document.querySelector('.vxProjects:target'))setActiveTab(v=>v==='projects'?v:'home');
    };
    syncView();
    const observer=new MutationObserver(syncView);
    observer.observe(document.body,{childList:true,subtree:true});

    return ()=>{
      media.removeEventListener?.('change',updateStandalone);
      window.removeEventListener('beforeinstallprompt',beforeInstall);
      window.removeEventListener('appinstalled',installed);
      observer.disconnect();
    };
  },[]);

  useEffect(()=>{
    document.documentElement.dataset.vitraTheme=theme;
    document.documentElement.style.colorScheme=theme;
    const themeMeta=document.querySelector('meta[name="theme-color"]');
    themeMeta?.setAttribute('content',theme==='light'?'#F5F8F7':'#090A0D');
    try{localStorage.setItem('vitra-ui-theme',theme)}catch{}
  },[theme]);

  async function install(){
    if(promptEvent){
      await promptEvent.prompt();
      const choice=await promptEvent.userChoice;
      if(choice.outcome==='accepted')setShowInstallHint(false);
      setPromptEvent(null);
      return;
    }
    setShowInstallHint(v=>!v);
  }

  function toggleTheme(){setTheme(v=>v==='light'?'dark':'light')}

  function click(selector:string){
    const element=document.querySelector<HTMLButtonElement>(selector);
    if(!element)return false;
    element.click();
    return true;
  }

  function returnHome(){
    if(document.querySelector('.vxApp'))return true;
    if(click('.vxCatalog > header > button'))return true;
    if(click('.vxDelivery > header > button'))return true;
    if(click('.vxBuilderBrand'))return true;
    return false;
  }

  function afterHome(action:()=>void){
    if(document.querySelector('.vxApp')){action();return;}
    returnHome();
    window.setTimeout(action,80);
  }

  function navigate(target:NavTarget){
    if(target==='account'){
      click('.vxAccountButton');
      return;
    }
    if(target==='home'){
      setActiveTab('home');
      if(document.querySelector('.vxApp'))window.scrollTo({top:0,behavior:'smooth'});
      else returnHome();
      return;
    }
    if(target==='projects'){
      setActiveTab('projects');
      afterHome(()=>{
        const projects=document.querySelector<HTMLElement>('.vxProjects');
        if(projects)projects.scrollIntoView({behavior:'smooth',block:'start'});
      });
      return;
    }
    if(target==='create'){
      afterHome(()=>{
        if(!click('.vxDashTop .vxPrimary'))click('.vxHeroCta');
      });
      return;
    }
    setActiveTab('models');
    if(document.querySelector('.vxCatalog'))return;
    afterHome(()=>{
      if(!click('.vxDashTop .vxGhost'))click('.vxTextBtn');
    });
  }

  const floating=mounted&&workspace&&!builder?createPortal(
    <div className={`vxFloatingUi theme-${theme}`}>
      <button className="vxThemeSwitch" onClick={toggleTheme} aria-label={theme==='light'?'Ativar tema escuro':'Ativar tema claro'} title={theme==='light'?'Mudar para tema escuro':'Mudar para tema claro'}>
        <ThemeIcon theme={theme}/>
      </button>
      <nav className="vxGlobalMobileNav" aria-label="Navegação principal">
        <button className={activeTab==='home'?'active':''} onClick={()=>navigate('home')} aria-current={activeTab==='home'?'page':undefined}><Icon name="home" size={20}/><span>Início</span></button>
        <button className={activeTab==='projects'?'active':''} onClick={()=>navigate('projects')} aria-current={activeTab==='projects'?'page':undefined}><Icon name="briefcase" size={20}/><span>Projetos</span></button>
        <button className="create" onClick={()=>navigate('create')} aria-label="Criar novo site"><span><Icon name="plus" size={22}/></span><b>Criar</b></button>
        <button className={activeTab==='models'?'active':''} onClick={()=>navigate('models')} aria-current={activeTab==='models'?'page':undefined}><Icon name="layers" size={20}/><span>Modelos</span></button>
        <button className="account" onClick={()=>navigate('account')} aria-label="Abrir minha conta"><Icon name="shield" size={20}/><span>Conta</span></button>
      </nav>
    </div>,document.body
  ):null;

  return <>
    <div className={`vitraAppShell theme-${theme} ${standalone?'isStandalone':''} ${builder?'isBuilder':''}`}>
      <AuthGate>
        <StudioV4/>
        {!standalone&&!builder&&<button className="vxInstallFab" onClick={install} aria-label="Instalar VITRA como aplicativo">
          <span><Icon name="globe" size={17}/></span>
          <div><small>WEB APP</small><b>Instalar VITRA</b></div>
          <Icon name="chevronDown" size={14}/>
        </button>}
        {!standalone&&!builder&&showInstallHint&&<aside className="vxInstallSheet" role="status">
          <button className="vxInstallClose" onClick={()=>setShowInstallHint(false)} aria-label="Fechar"><Icon name="plus" size={15}/></button>
          <span className="vxInstallMark">V</span>
          <div><small>VITRA / APP</small><h3>Leve o estúdio para a tela inicial.</h3><p>{promptEvent?'Instale o VITRA e abra como um aplicativo, sem a moldura do navegador.':'No iPhone, use Compartilhar → Adicionar à Tela de Início. No Android, abra o menu do navegador → Instalar aplicativo.'}</p></div>
          {promptEvent&&<button className="vxInstallPrimary" onClick={install}>Instalar agora <Icon name="arrowRight" size={15}/></button>}
        </aside>}
        {standalone&&!builder&&<div className="vxStandaloneBadge"><i/> APP INSTALADO</div>}
      </AuthGate>
    </div>
    {floating}
  </>;
}
