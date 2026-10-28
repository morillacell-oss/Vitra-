'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import StudioV2 from './studio-v2';
import { Icon } from './vitra-icons';

type SmartHint = { title:string; text:string; signal:string };

const hints: Record<string, SmartHint> = {
  'NEGÓCIO': { title:'Comece pelo contexto certo.', text:'O nicho define estrutura, serviços sugeridos e linguagem visual. Escolha o negócio real antes de personalizar.', signal:'Base do projeto' },
  'OBJETIVO': { title:'Defina o que o visitante deve fazer.', text:'Escolha uma única ação principal. O VITRA usa isso para ajustar CTA, ordem das seções e intensidade da conversão.', signal:'Estratégia de conversão' },
  'MODELO': { title:'Escolha direção, não decoração.', text:'Prefira o modelo que combina com o posicionamento da marca. Cor e tipografia ainda podem mudar depois.', signal:'Direção visual' },
  'IDENTIDADE': { title:'Dê identidade antes de dar volume.', text:'Nome e logo fortes fazem o restante do site parecer uma marca real. Use logo nítido e com bom respiro.', signal:'Percepção de marca' },
  'MENSAGEM': { title:'Promessa clara vence texto bonito.', text:'A headline precisa explicar valor em poucos segundos. Mantenha uma ideia principal e um CTA inequívoco.', signal:'Clareza comercial' },
  'VISUAL': { title:'Consistência vale mais que excesso.', text:'Escolha uma paleta e uma direção tipográfica coerentes. O VITRA já protege contraste e hierarquia.', signal:'Sistema visual' },
  'CAPA': { title:'A primeira imagem vende o padrão.', text:'Use uma foto horizontal, limpa e com espaço para texto. Ajuste o foco para preservar o assunto no mobile.', signal:'Primeira impressão' },
  'GALERIA': { title:'Mostre resultado, não quantidade.', text:'Prefira poucas imagens excelentes a muitas medianas. Varie enquadramentos para criar ritmo visual.', signal:'Portfólio curado' },
  'VÍDEO': { title:'Vídeo só entra se elevar a experiência.', text:'Use cenas curtas e silenciosas que comuniquem processo, acabamento ou ambiente. Se não tiver um bom vídeo, pule.', signal:'Mídia opcional' },
  'SOBRE': { title:'Transforme história em confiança.', text:'Explique padrão de atendimento, processo e diferencial. Evite textos institucionais longos.', signal:'Autoridade' },
  'SERVIÇOS': { title:'Venda entendimento antes de preço.', text:'Nome curto, descrição específica e benefício claro. O layout se adapta à quantidade cadastrada.', signal:'Oferta principal' },
  'PACOTES': { title:'Facilite a escolha.', text:'Use poucas opções e destaque somente uma. O visitante precisa comparar sem sentir que está lendo uma planilha.', signal:'Decisão simples' },
  'ANTES/DEPOIS': { title:'Prova visual precisa ser comparável.', text:'Use imagens com ângulo e proporção semelhantes. Isso aumenta credibilidade e reduz sensação de montagem.', signal:'Prova visual' },
  'AVALIAÇÕES': { title:'Especificidade gera confiança.', text:'Depoimentos curtos e concretos funcionam melhor que elogios genéricos. Priorize resultado e experiência.', signal:'Prova social' },
  'LOCAL': { title:'Remova atrito antes do contato.', text:'Endereço, mapa e horário corretos evitam perguntas básicas e deixam o negócio parecer mais estabelecido.', signal:'Confiança local' },
  'CONTATO': { title:'Um caminho principal.', text:'WhatsApp deve ser direto, com CTA coerente com o objetivo escolhido. Redes sociais entram como apoio.', signal:'Conversão' },
  'FAQ': { title:'Responda objeções reais.', text:'Inclua dúvidas que normalmente atrasam a decisão: prazo, agendamento, pagamento, duração ou manutenção.', signal:'Redução de objeções' },
  'SEO': { title:'Escreva para ser encontrado e clicado.', text:'Título deve combinar marca + serviço. Descrição deve explicar benefício e localização de forma natural.', signal:'Descoberta' },
  'ESTRUTURA': { title:'A ordem também vende.', text:'Coloque prova e oferta antes do contato final. Remova qualquer seção que não tenha conteúdo forte.', signal:'Hierarquia da página' },
  'QUALIDADE': { title:'Última revisão como uma agência faria.', text:'Corrija primeiro os itens de maior impacto. A meta é publicar somente quando mídia, mensagem e contato estiverem sólidos.', signal:'Quality Check' }
};

function currentHint(label:string): SmartHint {
  const upper=label.toUpperCase();
  const key=Object.keys(hints).find(k=>upper.includes(k));
  return key?hints[key]:{title:'O VITRA acompanha esta etapa.',text:'Preencha somente o que melhora a entrega. O sistema cuida da composição e da responsividade.',signal:'Direção assistida'};
}

export default function StudioShell(){
  const [builder,setBuilder]=useState(false);
  const [stageLabel,setStageLabel]=useState('');
  const [stageTitle,setStageTitle]=useState('');
  const [emptyCount,setEmptyCount]=useState(0);
  const [smartOpen,setSmartOpen]=useState(false);
  const [actionsTarget,setActionsTarget]=useState<Element|null>(null);
  const saveTimer=useRef<number|undefined>(undefined);
  const hint=useMemo(()=>currentHint(stageLabel),[stageLabel]);

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
    document.addEventListener('input',onInput,true);
    document.addEventListener('change',onInput,true);
    return ()=>{
      observer.disconnect();
      document.removeEventListener('input',onInput,true);
      document.removeEventListener('change',onInput,true);
      window.clearTimeout(saveTimer.current);
    };
  },[]);

  function saveAndExit(){
    document.querySelector<HTMLButtonElement>('.vxSave')?.click();
    window.setTimeout(()=>window.location.assign('/'),120);
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

  return <>
    <StudioV2/>
    {builder&&actionsTarget&&createPortal(<button className="vxExitBuilder" onClick={saveAndExit} aria-label="Salvar e voltar ao menu"><Icon name="home" size={14}/><span>Menu</span></button>,actionsTarget)}
    {builder&&<div className={`vxSmartDock ${smartOpen?'open':''}`}>
      {smartOpen&&<aside className="vxSmartPanel">
        <header><div><span>VITRA SMART</span><b>{hint.signal}</b></div><button className="vxSmartClose" onClick={()=>setSmartOpen(false)} aria-label="Fechar"><Icon name="plus" size={14}/></button></header>
        <div className="vxSmartBody"><small>{stageLabel||'ETAPA ATUAL'}</small><h3>{hint.title}</h3><p>{hint.text}</p>{stageTitle&&<div className="vxSmartStage"><span>AGORA</span><b>{stageTitle}</b></div>}<div className="vxSmartSignals"><span><i/>Auto-save ativo</span><span><i/>Layout adaptativo</span><span><i/>Mobile protegido</span></div></div>
        <footer><div><span>{emptyCount>0?`${emptyCount} item${emptyCount===1?'':'s'} sem conteúdo`:'Etapa preenchida'}</span><small>Revisão local da etapa</small></div><button onClick={reviewStage}>Revisar <Icon name="arrowRight" size={14}/></button></footer>
      </aside>}
      <button className="vxSmartTrigger" onClick={()=>setSmartOpen(v=>!v)} aria-expanded={smartOpen}><span><Icon name="magic" size={16}/></span><div><small>VITRA SMART</small><b>{smartOpen?'Fechar direção':'Direção da etapa'}</b></div><Icon className="vxSmartChevron" name="chevronDown" size={14}/></button>
    </div>}
  </>;
}
