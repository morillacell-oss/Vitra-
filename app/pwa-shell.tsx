'use client';

import { useEffect, useState } from 'react';
import StudioV3 from './studio-v3';
import { Icon } from './vitra-icons';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome:'accepted'|'dismissed';platform:string}>;
};
type ThemeMode='light'|'dark';

export default function PwaShell(){
  const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
  const [standalone,setStandalone]=useState(false);
  const [builder,setBuilder]=useState(false);
  const [showInstallHint,setShowInstallHint]=useState(false);
  const [theme,setTheme]=useState<ThemeMode>('light');

  useEffect(()=>{
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

    const syncView=()=>setBuilder(Boolean(document.querySelector('.vxBuilder')));
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

  return <div className={`vitraAppShell theme-${theme} ${standalone?'isStandalone':''} ${builder?'isBuilder':''}`}>
    <StudioV3/>
    {!builder&&<button className="vxThemeSwitch" onClick={toggleTheme} aria-label={theme==='light'?'Ativar tema escuro':'Ativar tema claro'} title={theme==='light'?'Tema claro — mudar para escuro':'Tema escuro — mudar para claro'}>
      <Icon name="palette" size={16}/><span>{theme==='light'?'Claro':'Escuro'}</span><i aria-hidden="true"/>
    </button>}
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
  </div>;
}
