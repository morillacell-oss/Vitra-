'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import StudioV2 from './studio-v2';
import { Icon } from './vitra-icons';

type SmartHint = { title:string; text:string; signal:string };
type DirectorGoal='whatsapp'|'booking'|'visit'|'portfolio';
type DirectorNiche='automotive'|'manicure';
type PreviewMode='desktop'|'mobile';
type DirectorPlan={template:string;copy:string;palette:string;font:string;focus:string;services:string;gallery:string;proof:string;sections:string[];label:string};

const hints: Record<string, SmartHint> = {
  'NEGÓCIO': { title:'Comece pelo contexto certo.', text:'O nicho define estrutura, serviços sugeridos e linguagem visual. Escolha o negócio real antes de personalizar.', signal:'Base do projeto' },
  'OBJETIVO': { title:'Defina o que o visitante deve fazer.', text:'Escolha uma única ação principal. O VITRA usa isso para ajustar CTA, ordem das seções e intensidade da conversão.', signal:'Estratégia de conversão' },
  'MODELO': { title:'Escolha direção, não decoração.', text:'Prefira o modelo que combina com o posicionamento da marca. Cor e tipografia ainda podem mudar depois.', signal:'Direção visual' },
  'IDENTIDADE': { title:'Dê identidade antes de dar volume.', text:'Nome e logo fortes fazem o restante do site parecer uma marca real. Use logo nítido e com bom respiro.', signal:'Percepção de marca' },
  'MENSAGEM': { title:'Promessa clara vence texto bonito.', text:'A headline precisa explicar valor em poucos segundos. Mantenha uma ideia principal e um CTA inequívoco.', signal:'Clareza comercial' },
  'VISUAL': { title:'Consistência vale mais que excesso.', text:'Escolha uma paleta e uma direção tipográfica coerentes. O VITRA já protege contraste e hierarquia.', signal:'Sistema visual' },
  'CAPA': { title:'A primeira imagem vende o padrão.', text:'Use uma foto horizontal, limpa e com espaço para texto. Ajuste o foco para preservar o assunto no mobile.', signal:'Primeira impressão' },
  'GALERIA': { title:'Mostre resultado, não quantidade.', text:'Prefira poucas imagens excelentes a muitas medianas. O VITRA decide a composição pela quantidade de mídia.', signal:'Portfólio curado' },
  'VÍDEO': { title:'Vídeo só entra se elevar a experiência.', text:'Use cenas curtas e silenciosas que comuniquem processo, acabamento ou ambiente. Se não tiver um bom vídeo, pule.', signal:'Mídia opcional' },
  'SOBRE': { title:'Transforme história em confiança.', text:'Explique padrão de atendimento, processo e diferencial. Evite textos institucionais longos.', signal:'Autoridade' },
  'SERVIÇOS': { title:'Venda entendimento antes de preço.', text:'Nome curto, descrição específica e benefício claro. O VITRA adapta a apresentação à quantidade cadastrada.', signal:'Oferta principal' },
  'PACOTES': { title:'Facilite a escolha.', text:'Use poucas opções e destaque somente uma. O visitante precisa comparar sem sentir que está lendo uma planilha.', signal:'Decisão simples' },
  'ANTES/DEPOIS': { title:'Prova visual precisa ser comparável.', text:'Use imagens com ângulo e proporção semelhantes. Isso aumenta credibilidade e reduz sensação de montagem.', signal:'Prova visual' },
  'AVALIAÇÕES': { title:'Especificidade gera confiança.', text:'Depoimentos curtos e concretos funcionam melhor que elogios genéricos. Priorize resultado e experiência.', signal:'Prova social' },
  'LOCAL': { title:'Remova atrito antes do contato.', text:'Endereço, mapa e horário corretos evitam perguntas básicas e deixam o negócio parecer mais estabelecido.', signal:'Confiança local' },
  'CONTATO': { title:'Um caminho principal.', text:'WhatsApp deve ser direto, com CTA coerente com o objetivo escolhido. Redes sociais entram como apoio.', signal:'Conversão' },
  'FAQ': { title:'Responda objeções reais.', text:'Inclua dúvidas que normalmente atrasam a decisão: prazo, agendamento, pagamento, duração ou manutenção.', signal:'Redução de objeções' },
  'SEO': { title:'Escreva para ser encontrado e clicado.', text:'Título deve combinar marca + serviço. Descrição deve explicar benefício e localização de forma natural.', signal:'Descoberta' },
  'ESTRUTURA': { title:'A ordem também vende.', text:'O modo automático prioriza oferta, prova e contato conforme o objetivo escolhido, sem apagar seu conteúdo.', signal:'Hierarquia da página' },
  'QUALIDADE': { title:'Última revisão como uma agência faria.', text:'Corrija primeiro os itens de maior impacto. A meta é publicar somente quando mídia, mensagem e contato estiverem sólidos.', signal:'Quality Check' }
};

const sectionLabel:Record<string,string>={about:'Sobre',services:'Serviços',beforeAfter:'Antes/depois',gallery:'Galeria',video:'Vídeo',packages:'Pacotes',proof:'Avaliações',hours:'Local & horários',faq:'Perguntas',contact:'Contato'};

function currentHint(label:string): SmartHint {
  const upper=label.toUpperCase();
  const key=Object.keys(hints).find(k=>upper.includes(k));
  return key?hints[key]:{title:'O VITRA acompanha esta etapa.',text:'Preencha somente o que melhora a entrega. O sistema cuida da composição e da responsividade.',signal:'Direção assistida'};
}

const sleep=(ms:number)=>new Promise(resolve=>window.setTimeout(resolve,ms));

function planFor(niche:DirectorNiche,goal:DirectorGoal):DirectorPlan{
  if(niche==='automotive'){
    if(goal==='visit') return {template:'Precision White',copy:'LOCAL',palette:'Ice Studio',font:'Minimal',focus:'Centro',services:'Cards',gallery:'Grade',proof:'Cards',sections:['about','proof','gallery','services','hours','faq','contact'],label:'Precisão local'};
    if(goal==='portfolio') return {template:'Mono Studio',copy:'EDITORIAL',palette:'Ivory Ink',font:'Editorial',focus:'Centro',services:'Editorial',gallery:'Editorial',proof:'Editorial',sections:['gallery','beforeAfter','services','proof','about','contact'],label:'Portfólio editorial'};
    return {template:'Carbon Motion',copy:'IMPACTANTE',palette:'Carbon Fire',font:'Modern',focus:'Centro',services:'Numerada',gallery:'Cinema',proof:'Destaque',sections:['services','proof','gallery','beforeAfter','about','packages','hours','faq','contact'],label:'Conversão cinematográfica'};
  }
  if(goal==='portfolio') return {template:'Nude Editorial',copy:'EDITORIAL',palette:'Warm Sand',font:'Editorial',focus:'Centro',services:'Editorial',gallery:'Editorial',proof:'Destaque',sections:['gallery','proof','services','about','packages','contact'],label:'Editorial de portfólio'};
  if(goal==='visit') return {template:'Studio Minimal',copy:'MODERNA',palette:'Ivory Ink',font:'Minimal',focus:'Centro',services:'Numerada',gallery:'Grade',proof:'Destaque',sections:['about','gallery','proof','services','hours','faq','contact'],label:'Studio local premium'};
  if(goal==='whatsapp') return {template:'Noir Beauty',copy:'BOUTIQUE',palette:'Obsidian Gold',font:'Luxury',focus:'Centro',services:'Editorial',gallery:'Cinema',proof:'Editorial',sections:['services','gallery','proof','packages','faq','contact'],label:'Beauty conversion'};
  return {template:'Maison Rose',copy:'LUXURY',palette:'Soft Blush',font:'Luxury',focus:'Centro',services:'Editorial',gallery:'Editorial',proof:'Editorial',sections:['gallery','services','proof','packages','about','faq','hours','contact'],label:'Agendamento boutique'};
}

export default function StudioShell(){
  const [builder,setBuilder]=useState(false);
  const [stageLabel,setStageLabel]=useState('');
  const [stageTitle,setStageTitle]=useState('');
  const [emptyCount,setEmptyCount]=useState(0);
  const [smartOpen,setSmartOpen]=useState(false);
  const [actionsTarget,setActionsTarget]=useState<Element|null>(null);
  const [directorBusy,setDirectorBusy]=useState(false);
  const [directorSummary,setDirectorSummary]=useState('');
  const [theaterOpen,setTheaterOpen]=useState(false);
  const [previewMode,setPreviewMode]=useState<PreviewMode>('desktop');
  const [previewHtml,setPreviewHtml]=useState('');
  const saveTimer=useRef<number|undefined>(undefined);
  const hint=useMemo(()=>currentHint(stageLabel),[stageLabel]);

  const capturePreview=useCallback((mode?:PreviewMode)=>{
    const site=document.querySelector<HTMLElement>('.vxLive .clientSite, .vxDeliveryDevice .clientSite, .vxHeroScreen .clientSite');
    if(!site)return;
    const links=Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).map(link=>`<link rel="stylesheet" href="${link.href}">`).join('');
    const doc=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${links}<style>html,body{margin:0!important;padding:0!important;background:#08090c!important;min-height:100%;}body>.clientSite{min-height:100vh;margin:0!important;box-shadow:none!important;}</style></head><body>${site.outerHTML}</body></html>`;
    setPreviewHtml(doc);
    if(mode)setPreviewMode(mode);
    setTheaterOpen(true);
  },[]);

  useEffect(()=>{
    const sync=()=>{
      const root=document.querySelector('.vxBuilder');
      const active=!!root;
      setBuilder(active);
      if(!active){setActionsTarget(null);return;}
      setActionsTarget(document.querySelector('.vxBuilderActions'));
      setStageLabel(document.querySelector('.vxStepHead > span')?.textContent?.trim()||'');
      setStageTitle(document.querySelector('.vxStepHead > h1')?.textContent?.trim()||'');
      const fields=Array.from(document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('.vxStage input:not([type="file"]):not([type="checkbox"]):not([type="radio"]), .vxStage textarea, .vxStage select'));
      const visible=fields.filter(el=>!el.disabled && el.getClientRects().length>0);
      setEmptyCount(visible.filter(el=>!String(el.value||'').trim()).length);
    };
    sync();
    const observer=new MutationObserver(sync);
    observer.observe(document.body,{childList:true,subtree:true});
    const onInput=(event:Event)=>{
      sync();
      const target=event.target as HTMLInputElement|null;
      if(!document.querySelector('.vxBuilder') || target?.type==='file')return;
      window.clearTimeout(saveTimer.current);
      saveTimer.current=window.setTimeout(()=>document.querySelector<HTMLButtonElement>('.vxSave')?.click(),1100);
    };
    const interceptPreview=(event:Event)=>{
      const target=event.target as HTMLElement|null;
      const button=target?.closest<HTMLButtonElement>('.vxOpenPreview, .vxDeliveryActions .vxPrimary');
      if(!button)return;
      event.preventDefault();
      event.stopPropagation();
      capturePreview();
    };
    document.addEventListener('input',onInput,true);
    document.addEventListener('change',onInput,true);
    document.addEventListener('click',interceptPreview,true);
    return ()=>{
      observer.disconnect();
      document.removeEventListener('input',onInput,true);
      document.removeEventListener('change',onInput,true);
      document.removeEventListener('click',interceptPreview,true);
      window.clearTimeout(saveTimer.current);
    };
  },[capturePreview]);

  function saveAndExit(){
    document.querySelector<HTMLButtonElement>('.vxSave')?.click();
    window.setTimeout(()=>document.querySelector<HTMLButtonElement>('.vxBuilderBrand')?.click(),100);
  }

  function reviewStage(){
    const candidates=Array.from(document.querySelectorAll<HTMLElement>('.vxStage input:not([type="file"]), .vxStage textarea, .vxStage select, .vxStage .vxUpload:not(.hasMedia)'));
    const target=candidates.find(el=>{
      if(el.getClientRects().length===0)return false;
      if(el.matches('.vxUpload:not(.hasMedia)'))return true;
      const input=el as HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement;
      if(input.type==='checkbox'||input.type==='radio')return false;
      return !String(input.value||'').trim();
    }) || document.querySelector<HTMLElement>('.vxStage .vxStepHead');
    if(!target)return;
    target.scrollIntoView({behavior:'smooth',block:'center'});
    target.classList.add('vxSmartFocus');
    if('focus' in target && typeof (target as HTMLInputElement).focus==='function' && !target.matches('.vxUpload'))(target as HTMLInputElement).focus({preventScroll:true});
    window.setTimeout(()=>target.classList.remove('vxSmartFocus'),1800);
    setSmartOpen(false);
  }

  function stepButton(label:string){return Array.from(document.querySelectorAll<HTMLButtonElement>('.vxSteps button')).find(b=>b.querySelector('small')?.textContent?.trim()===label)}
  async function openStep(label:string){stepButton(label)?.click();await sleep(110)}
  function clickByText(selector:string,text:string){const upper=text.toUpperCase();const el=Array.from(document.querySelectorAll<HTMLButtonElement>(selector)).find(b=>b.textContent?.toUpperCase().includes(upper));el?.click();return !!el}
  function clickByHeading(selector:string,heading:string,text:string){const upper=text.toUpperCase();const el=Array.from(document.querySelectorAll<HTMLButtonElement>(selector)).find(b=>b.querySelector(heading)?.textContent?.trim().toUpperCase()===upper);el?.click();return !!el}

  async function applyAutomaticDirection(){
    if(directorBusy)return;
    setDirectorBusy(true);setDirectorSummary('');
    const original=document.querySelector('.vxSteps button.active small')?.textContent?.trim()||'Qualidade';
    try{
      const site=document.querySelector<HTMLElement>('.vxLive .clientSite');
      const niche:DirectorNiche=site?.classList.contains('niche-manicure')?'manicure':'automotive';
      await openStep('Objetivo');
      const goalTitle=document.querySelector<HTMLButtonElement>('.vxGoalGrid button.active b')?.textContent?.toLowerCase()||'';
      let goal:DirectorGoal='whatsapp';
      if(goalTitle.includes('agendar'))goal='booking';else if(goalTitle.includes('visita'))goal='visit';else if(goalTitle.includes('trabalho'))goal='portfolio';
      const plan=planFor(niche,goal);

      await openStep('Modelo');clickByHeading('.vxTemplateGrid button','h3',plan.template);await sleep(100);
      await openStep('Mensagem');clickByText('.vxCopyOptions button',plan.copy);await sleep(90);
      await openStep('Visual');clickByHeading('.vxPaletteGrid button','b',plan.palette);clickByHeading('.vxFontGrid button','b',plan.font);await sleep(90);
      await openStep('Capa');clickByText('.vxSegmented button',plan.focus);await sleep(70);

      await openStep('Galeria');
      const galleryCount=document.querySelectorAll('.vxGalleryEditor figure').length;
      const galleryChoice=galleryCount>=5?'Editorial':galleryCount<=3?'Grade':plan.gallery;
      clickByText('.vxVariantRow button',galleryChoice);await sleep(70);

      await openStep('Serviços');
      const serviceCount=document.querySelectorAll('.vxRepeater > article').length;
      const serviceChoice=serviceCount>=5?'Numerada':serviceCount<=2?'Editorial':plan.services;
      clickByText('.vxVariantRow button',serviceChoice);await sleep(70);

      await openStep('Avaliações');
      const proofCount=document.querySelectorAll('.vxRepeater > article').length;
      const proofChoice=proofCount<=1?'Destaque':proofCount>=3?'Cards':plan.proof;
      clickByText('.vxVariantRow button',proofChoice);await sleep(70);

      document.querySelector<HTMLButtonElement>('.vxSave')?.click();await sleep(100);
      let savedSections:string[]=[];
      try{
        const projectName=document.querySelector('.vxProjectTitle b')?.textContent?.trim();
        const arr=JSON.parse(localStorage.getItem('vitra-projects-cinema-v1')||'[]') as Array<{name:string;sections:string[]}>;
        savedSections=(arr.find(p=>p.name===projectName)?.sections||[]).slice();
      }catch{}

      await openStep('Estrutura');
      for(const key of plan.sections){
        const card=Array.from(document.querySelectorAll<HTMLElement>('.vxSectionManager > div')).find(c=>c.querySelector('b')?.textContent?.trim()===sectionLabel[key]);
        if(card&&!card.classList.contains('active')){const toggle=Array.from(card.children).find(x=>x.tagName==='BUTTON') as HTMLButtonElement|undefined;toggle?.click();savedSections.push(key);await sleep(55)}
      }
      for(let desired=0;desired<plan.sections.length;desired++){
        const key=plan.sections[desired];let current=savedSections.indexOf(key);if(current<0)continue;
        const card=Array.from(document.querySelectorAll<HTMLElement>('.vxSectionManager > div')).find(c=>c.querySelector('b')?.textContent?.trim()===sectionLabel[key]);
        const left=card?.querySelector<HTMLButtonElement>('nav button:first-child');
        while(left&&current>desired){left.click();[savedSections[current-1],savedSections[current]]=[savedSections[current],savedSections[current-1]];current--;await sleep(42)}
      }

      document.querySelector<HTMLButtonElement>('.vxSave')?.click();await sleep(80);
      await openStep(original);
      setDirectorSummary(`${plan.label} • ${plan.template} • ${plan.palette}`);
    }finally{setDirectorBusy(false)}
  }

  function scrollPreview(selector:string){
    const frame=document.querySelector<HTMLIFrameElement>('.vxTheaterFrame');
    const target=frame?.contentDocument?.querySelector<HTMLElement>(selector);
    target?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  return <>
    <StudioV2/>
    {builder&&actionsTarget&&createPortal(<>
      <button className="vxExitBuilder" onClick={saveAndExit} aria-label="Salvar e voltar ao menu"><Icon name="home" size={14}/><span>Menu</span></button>
      <button className="vxTheaterQuick" onClick={()=>capturePreview()} aria-label="Visualizar site em tela cheia"><Icon name="eye" size={14}/><span>Prévia</span></button>
    </>,actionsTarget)}

    {builder&&<div className={`vxSmartDock ${smartOpen?'open':''}`}>
      {smartOpen&&<aside className="vxSmartPanel">
        <header><div><span>VITRA SMART</span><b>{hint.signal}</b></div><button className="vxSmartClose" onClick={()=>setSmartOpen(false)} aria-label="Fechar"><Icon name="plus" size={14}/></button></header>
        <div className="vxSmartBody"><small>{stageLabel||'ETAPA ATUAL'}</small><h3>{hint.title}</h3><p>{hint.text}</p>{stageTitle&&<div className="vxSmartStage"><span>AGORA</span><b>{stageTitle}</b></div>}
          <button className={`vxDirectorBtn ${directorBusy?'busy':''}`} onClick={applyAutomaticDirection} disabled={directorBusy}><span><Icon name="wand" size={18}/></span><div><small>DIREÇÃO AUTOMÁTICA</small><b>{directorBusy?'Dirigindo o site...':'Deixar o VITRA decidir'}</b><p>Modelo, copy, identidade visual, componentes e prioridade das seções.</p></div><Icon name="arrowRight" size={15}/></button>
          {directorSummary&&<div className="vxDirectorResult"><Icon name="checkCircle" size={16}/><div><span>DIREÇÃO APLICADA</span><b>{directorSummary}</b></div></div>}
          <div className="vxSmartSignals"><span><i/>Auto-save ativo</span><span><i/>Layout adaptativo</span><span><i/>Conversão assistida</span><span><i/>Mobile protegido</span></div>
        </div>
        <footer><div><span>{emptyCount>0?`${emptyCount} item${emptyCount===1?'':'s'} sem conteúdo`:'Etapa preenchida'}</span><small>Revisão local da etapa</small></div><button onClick={reviewStage}>Revisar <Icon name="arrowRight" size={14}/></button></footer>
      </aside>}
      <button className="vxSmartTrigger" onClick={()=>setSmartOpen(v=>!v)} aria-expanded={smartOpen}><span><Icon name="magic" size={16}/></span><div><small>VITRA SMART</small><b>{smartOpen?'Fechar direção':'Diretor de criação'}</b></div><Icon className="vxSmartChevron" name="chevronDown" size={14}/></button>
    </div>}

    {theaterOpen&&createPortal(<div className="vxTheater" role="dialog" aria-modal="true">
      <header className="vxTheaterTop"><div><span>VITRA / PRESENTATION MODE</span><b>Prévia cinematográfica</b></div><div className="vxTheaterModes"><button className={previewMode==='desktop'?'active':''} onClick={()=>setPreviewMode('desktop')}><Icon name="monitor" size={15}/> Desktop</button><button className={previewMode==='mobile'?'active':''} onClick={()=>setPreviewMode('mobile')}><Icon name="phone" size={15}/> Mobile</button></div><button className="vxTheaterClose" onClick={()=>setTheaterOpen(false)}><Icon name="plus" size={17}/> Fechar</button></header>
      <nav className="vxTheaterNav"><button onClick={()=>scrollPreview('.csHero')}>Início</button><button onClick={()=>scrollPreview('#about')}>Sobre</button><button onClick={()=>scrollPreview('#services')}>Serviços</button><button onClick={()=>scrollPreview('.csGallery')}>Galeria</button><button onClick={()=>scrollPreview('.csProof')}>Avaliações</button><button onClick={()=>scrollPreview('#contact')}>Contato</button><span/><button onClick={()=>capturePreview(previewMode)}><Icon name="magic" size={13}/> Atualizar prévia</button></nav>
      <main className="vxTheaterCanvas"><div className={`vxTheaterDevice ${previewMode}`}><div className="vxTheaterChrome"><i/><i/><i/><span>{previewMode==='desktop'?'DESKTOP / SITE COMPLETO':'MOBILE / 390 PX'}</span></div><iframe className="vxTheaterFrame" title="Prévia do site" srcDoc={previewHtml}/></div></main>
      <footer className="vxTheaterFooter"><div><Icon name="eye" size={14}/><span>Visualização isolada do editor</span></div><p>Veja o site como o cliente verá, com responsividade real dentro da prévia.</p></footer>
    </div>,document.body)}
  </>;
}
