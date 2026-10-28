'use client';

import { CSSProperties, useMemo, useState } from 'react';
import { Arrow, Icon, Stars } from './vitra-icons';
import { fallback, palettes, Project, SectionKey, templates } from './vitra-data';

function waLink(project:Project,message?:string){
  const n=project.whatsapp.replace(/\D/g,'');
  const text=message||`Olá, vim pelo site da ${project.name} e gostaria de mais informações.`;
  return n?`https://wa.me/${n}?text=${encodeURIComponent(text)}`:'#contact';
}

export default function SitePreview({project,compact=false}:{project:Project;compact?:boolean}){
  const palette=palettes.find(p=>p.id===project.paletteId)||palettes[0];
  const preset=templates.find(t=>t.id===project.templateId)||templates[0];
  const fb=fallback[project.niche];
  const hero=project.heroImage||fb.hero;
  const about=project.aboutImage||fb.about;
  const gallery=project.gallery.length?project.gallery:fb.gallery;
  const automotive=project.niche==='automotive';
  const [lightboxIndex,setLightboxIndex]=useState<number|null>(null);
  const [compare,setCompare]=useState(52);
  const [leadName,setLeadName]=useState('');
  const [leadService,setLeadService]=useState('');
  const style={
    '--cs-bg':palette.bg,'--cs-surface':palette.surface,'--cs-text':palette.text,'--cs-muted':palette.muted,
    '--cs-accent':palette.accent,'--cs-secondary':palette.secondary,'--hero-pos':project.heroFocus==='left'?'25% center':project.heroFocus==='right'?'75% center':'50% center',
    '--compare':`${compare}%`
  } as CSSProperties;
  const sectionSet=new Set(project.sections);
  const clickWa=(e:React.MouseEvent)=>{if(waLink(project)==='#contact')e.preventDefault()};
  const cta=<a className="csCta" href={waLink(project)} target={waLink(project)==='#contact'?undefined:'_blank'} rel="noreferrer" onClick={clickWa}>{project.ctaLabel||'Falar agora'}<Arrow/></a>;
  const serviceNames=useMemo(()=>project.services.filter(s=>s.title).map(s=>s.title),[project.services]);
  const autoTags=(serviceNames.length?serviceNames:['PPF','Películas','Detailing','Personalização']).slice(0,4);

  function renderHero(){
    const media=<div className="csHeroMedia">{project.heroVideo?<video src={project.heroVideo} autoPlay muted loop playsInline/>:<img src={hero} alt="Imagem principal"/>}<div className="csHeroShade"/></div>;
    const copy=<div className="csHeroCopy"><span className="csEyebrow">{project.eyebrow}</span><h1>{project.headline}</h1><p>{project.subheadline}</p><div className="csHeroActions">{cta}<small>{automotive?'Avaliação rápida • atendimento direto':'Atendimento direto • sem formulário'}</small></div></div>;
    if(preset.hero==='split')return <section className="csHero csHeroSplit">{copy}{media}<div className="csHeroIndex">01 / {preset.label}</div></section>;
    if(preset.hero==='center')return <section className="csHero csHeroCenter">{media}<div className="csHeroCenterInner">{copy}</div><div className="csHeroIndex">01 / {preset.mood}</div></section>;
    if(preset.hero==='offset')return <section className="csHero csHeroOffset"><div className="csOffsetFrame">{media}</div>{copy}<div className="csHeroIndex">01 / {preset.label}</div></section>;
    if(preset.hero==='poster')return <section className="csHero csHeroPoster">{media}<div className="csPosterNumber">01</div>{copy}<div className="csHeroIndex">{preset.mood}</div></section>;
    return <section className="csHero csHeroFull">{media}{copy}<div className="csHeroIndex">01 / {preset.label}</div></section>;
  }

  function sectionHead(index:string,kicker:string,title:string,text:string){return <div className="csSectionHead"><div><span>{index} / {kicker}</span><h2>{title}</h2></div><p>{text}</p></div>}

  function automotiveAbout(){
    return <section className="csAbout csAutoAbout" id="about" key="about">
      <div className="csAboutImage"><img src={about} alt="Sobre a empresa"/><span>02 / PADRÃO DE EXECUÇÃO</span></div>
      <div className="csAboutCopy"><span>MAIS QUE ESTÉTICA. PROCESSO.</span><h2>{project.aboutTitle}</h2><p>{project.aboutText}</p>
        <div className="csAutoTags">{autoTags.map((tag,i)=><span key={i}>{tag}</span>)}</div>
        <div className="csAutoProcess">{project.benefits.filter(Boolean).slice(0,4).map((b,i)=><article key={i}><small>{String(i+1).padStart(2,'0')}</small><div><b>{b}</b><p>{i===0?'Materiais, técnica e acabamento escolhidos para o resultado esperado.':i===1?'Execução organizada para manter padrão, precisão e consistência.':i===2?'Cada atendimento parte da necessidade real do veículo.':'Cuidado final pensado para preservar presença, proteção e valor.'}</p></div></article>)}</div>
      </div>
    </section>;
  }

  function automotiveGallery(){
    const titles=gallery.slice(0,8).map((_,i)=>project.services[i%Math.max(1,project.services.length)]?.title||`Projeto ${String(i+1).padStart(2,'0')}`);
    return <section className="csGallery csAutoGallery" key="gallery">
      {sectionHead('05','PROJETOS EM DESTAQUE','Projetos de destaque. Resultados que falam por si.','Toque em um projeto para abrir a experiência em tela cheia.')}
      <div className="csAutoProjectList">{gallery.slice(0,8).map((url,i)=><button className="csAutoProject" key={i} onClick={()=>setLightboxIndex(i)} type="button">
        <div className="csAutoProjectMedia"><img src={url} alt={`Projeto ${i+1}`}/></div>
        <div className="csAutoProjectCopy"><span>{String(i+1).padStart(2,'0')} / PROJETO</span><h3>{titles[i]}</h3><p>{i%2===0?'Presença, acabamento e proteção em cada detalhe.':'Cuidado técnico com leitura visual de alto padrão.'}</p><small><Icon name="plus" size={11}/> VER FOTOS</small></div>
      </button>)}</div>
    </section>;
  }

  function automotiveCompare(){
    if(!project.beforeImage&&!project.afterImage)return null;
    if(!(project.beforeImage&&project.afterImage))return <section className="csBeforeAfter" key="beforeAfter">{sectionHead('04','TRANSFORMAÇÃO','Cada detalhe. Uma nova perspectiva.','Compare o acabamento e o resultado final.')}<div className="csBeforeGrid"><figure>{project.beforeImage?<img src={project.beforeImage} alt="Antes"/>:<div/>}<figcaption>ANTES</figcaption></figure><figure>{project.afterImage?<img src={project.afterImage} alt="Depois"/>:<div/>}<figcaption>DEPOIS</figcaption></figure></div></section>;
    return <section className="csBeforeAfter csAutoCompare" key="beforeAfter">
      {sectionHead('04','O CUIDADO FAZ A DIFERENÇA','Cada detalhe. Uma nova perspectiva.','Arraste para comparar o antes e o depois.')}
      <div className="csCompareStage" style={{'--compare':`${compare}%`} as CSSProperties}>
        <img className="csCompareBefore" src={project.beforeImage} alt="Antes"/>
        <div className="csCompareAfter"><img src={project.afterImage} alt="Depois"/></div>
        <span className="csCompareLabel before">ANTES</span><span className="csCompareLabel after">DEPOIS</span>
        <div className="csCompareLine"><span><Icon name="arrowLeft" size={12}/><Icon name="arrowRight" size={12}/></span></div>
        <input aria-label="Comparar antes e depois" type="range" min="5" max="95" value={compare} onChange={e=>setCompare(Number(e.target.value))}/>
      </div>
      <footer><b>{project.name}</b><span>Arraste a linha para revelar o acabamento final.</span></footer>
    </section>;
  }

  function automotiveContact(){
    const choices=(serviceNames.length?serviceNames:['PPF','Películas','Personalização','Polimento','Lavagem premium','Detailing']).slice(0,6);
    const leadMessage=`Olá, vim pelo site da ${project.name}.${leadName?` Meu nome é ${leadName}.`:''}${leadService?` Tenho interesse em ${leadService}.`:''} Gostaria de uma avaliação.`;
    const leadHref=waLink(project,leadMessage);
    return <section className="csClosing csAutoClosing" id="contact" key="contact">
      <div className="csAutoClosingMedia"><img src={hero} alt="Atendimento automotivo"/><div/></div>
      <div className="csAutoClosingCopy"><span>VAMOS CONVERSAR?</span><h2>Seu carro nas mãos certas.</h2><p>{project.subheadline}</p><a className="csCta" href="#auto-assessment">Entrar em contato <Arrow/></a></div>
      <form id="auto-assessment" className="csAutoAssessment" onSubmit={e=>{e.preventDefault();if(leadHref!=='#contact')window.open(leadHref,'_blank','noopener,noreferrer')}}>
        <header><span>AVALIAÇÃO PERSONALIZADA</span><h3>Seu carro merece o cuidado certo.</h3><p>Informe seu nome, escolha o serviço e continue no WhatsApp com a mensagem pronta.</p></header>
        <label><small>01</small><input value={leadName} onChange={e=>setLeadName(e.target.value)} placeholder="Digite seu nome"/></label>
        <fieldset><legend>02 / QUAL CUIDADO SEU CARRO PRECISA?</legend><div>{choices.map((choice,i)=><button type="button" className={leadService===choice?'active':''} onClick={()=>setLeadService(choice)} key={i}>{choice}</button>)}</div></fieldset>
        <button className="csAutoWa" type="submit" disabled={leadHref==='#contact'}>CONTINUAR NO WHATSAPP <Icon name="arrowRight" size={14}/></button>
        <small className="csAutoDirect"><i/> Atendimento direto pelo WhatsApp</small>
      </form>
    </section>;
  }

  function renderSection(key:SectionKey){
    if(key==='about')return automotive?automotiveAbout():<section className="csAbout" id="about" key={key}><div className="csAboutImage"><img src={about} alt="Sobre a empresa"/></div><div className="csAboutCopy"><span>02 / NOSSO PADRÃO</span><h2>{project.aboutTitle}</h2><p>{project.aboutText}</p><div className="csFacts">{project.benefits.filter(Boolean).slice(0,4).map((b,i)=><span key={i}><Icon name="check" size={13}/>{b}</span>)}</div></div></section>;
    if(key==='services')return <section className={`csServices ${automotive?'csAutoServices':''} variant-${project.servicesVariant}`} id="services" key={key}>{sectionHead('03','NOSSOS SERVIÇOS',automotive?'Excelência em cada detalhe.':'O que fazemos.',automotive?'Protege. Valoriza. Transforma.':'Informação clara, hierarquia forte e percepção de valor.')}
      <div className="csServicesGrid">{project.services.filter(s=>s.title).map((s,i)=><article className="csService" key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{s.title}</h3><p>{s.description}</p></div><footer><b>{s.price||'Sob consulta'}</b><Arrow/></footer></article>)}</div></section>;
    if(key==='beforeAfter')return automotive?automotiveCompare():(project.beforeImage||project.afterImage)?<section className="csBeforeAfter" key={key}>{sectionHead('04','TRANSFORMAÇÃO','Resultado lado a lado.','Mesma proporção, comparação limpa e foco no resultado.')}<div className="csBeforeGrid"><figure>{project.beforeImage?<img src={project.beforeImage} alt="Antes"/>:<div/>}<figcaption>ANTES</figcaption></figure><figure>{project.afterImage?<img src={project.afterImage} alt="Depois"/>:<div/>}<figcaption>DEPOIS</figcaption></figure></div></section>:null;
    if(key==='gallery')return automotive?automotiveGallery():<section className={`csGallery variant-${project.galleryVariant}`} key={key}>{sectionHead('05','PORTFÓLIO','Detalhes que falam por si.','O layout se adapta à quantidade de imagens sem criar espaços vazios.')}<div className="csGalleryGrid">{gallery.slice(0,8).map((url,i)=><figure key={i}><img src={url} alt={`Trabalho ${i+1}`}/><span>{String(i+1).padStart(2,'0')}</span></figure>)}</div></section>;
    if(key==='video')return project.heroVideo?<section className={`csVideo ${automotive?'csAutoVideo':''}`} key={key}><video src={project.heroVideo} controls={compact?false:true} autoPlay={automotive} muted={automotive} loop={automotive} playsInline/><div><span>06 / EM MOVIMENTO</span><h2>{automotive?'Movimento, luz e acabamento.':'Uma marca também se sente.'}</h2></div></section>:null;
    if(key==='packages')return <section className={`csPackages ${automotive?'csAutoPackages':''}`} key={key}>{sectionHead('06','PACOTES','Escolha sua experiência.','Poucas opções, comparação simples e uma escolha principal em destaque.')}<div className={`csPackageGrid count-${Math.min(project.packages.length,4)}`}>{project.packages.filter(p=>p.name).map((p,i)=><article className={p.featured?'featured':''} key={i}>{p.featured&&<span className="csBadge">MAIS ESCOLHIDO</span>}<small>{String(i+1).padStart(2,'0')}</small><h3>{p.name}</h3><p>{p.description}</p><strong>{p.price||'Sob consulta'}</strong>{cta}</article>)}</div></section>;
    if(key==='proof')return <section className={`csProof ${automotive?'csAutoProof':''} variant-${project.proofVariant}`} key={key}><div className="csProofIntro"><span>07 / PROVA SOCIAL</span><h2>{automotive?'Padrão percebido por quem já viveu a experiência.':'Confiança construída por quem já viveu a experiência.'}</h2></div><div className="csProofGrid">{project.testimonials.map((t,i)=><blockquote key={i}><Stars count={t.rating}/><p>“{t.text}”</p><footer>{t.name}</footer></blockquote>)}</div></section>;
    if(key==='hours')return <section className={`csLocation ${automotive?'csAutoLocation':''}`} key={key}><div><span>08 / LOCAL</span><h2>{automotive?'Estrutura preparada para cuidar de cada detalhe.':'Seu próximo atendimento começa aqui.'}</h2><p>{project.address||'Adicione o endereço para apresentar a localização do negócio.'}</p>{project.mapLink&&<a href={project.mapLink} target="_blank" rel="noreferrer">Abrir no mapa <Arrow/></a>}</div><div className="csHours">{project.hours.map((h,i)=><div key={i}><span>{h.day}</span><b>{h.time}</b></div>)}</div></section>;
    if(key==='faq')return <section className={`csFaq ${automotive?'csAutoFaq':''}`} key={key}><div className="csFaqIntro"><span>09 / PERGUNTAS FREQUENTES</span><h2>{automotive?'Antes de agendar, tire suas dúvidas.':'Antes de chamar, talvez esteja aqui.'}</h2></div><div>{project.faq.filter(f=>f.question).map((f,i)=><details key={i}><summary><span>{String(i+1).padStart(2,'0')}</span>{f.question}<Icon name="plus" size={13}/></summary><p>{f.answer}</p></details>)}</div></section>;
    if(key==='contact')return automotive?automotiveContact():<section className="csClosing" id="contact" key={key}><span>PRONTO PARA COMEÇAR?</span><h2>{project.name}</h2><p>{project.goal==='portfolio'?'Gostou do que viu? Continue a conversa direto com a empresa.':'Atendimento direto, simples e rápido.'}</p>{cta}<div>{project.instagram&&<small>{project.instagram}</small>}{project.address&&<small>{project.address}</small>}</div></section>;
    return null;
  }

  return <article className={`clientSite niche-${project.niche} template-${project.templateId} hero-${preset.hero} font-${project.fontId} mode-${palette.mode} ${compact?'compact':''}`} style={style}>
    <header className="csHeader"><div className="csBrand">{project.logoUrl?<img src={project.logoUrl} alt="Logo"/>:<span>{project.name.slice(0,1)||'V'}</span>}<b>{project.name||'Sua marca'}</b></div><nav><a href="#services">Serviços</a><a href="#about">Sobre</a><a href="#contact">Contato</a></nav><a className="csHeaderCta" href={waLink(project)} target={waLink(project)==='#contact'?undefined:'_blank'} rel="noreferrer" onClick={clickWa}>{automotive?'AVALIAÇÃO':'WhatsApp'} <Arrow/></a></header>
    {renderHero()}
    {automotive?<div className="csAutoRibbon"><span>EXPERIÊNCIA / PROCESSO / RESULTADO</span><div>{autoTags.map((tag,i)=><b key={i}>{tag}</b>)}</div></div>:<div className="csTrust">{project.benefits.filter(Boolean).slice(0,4).map((b,i)=><span key={i}><Icon name="checkCircle" size={14}/>{b}</span>)}</div>}
    {project.sections.filter(k=>sectionSet.has(k)).map(renderSection)}
    <footer className="csFooter"><div><b>{project.name}</b><span>{preset.name} • VITRA</span></div><small>{new Date().getFullYear()} • Todos os direitos reservados</small></footer>

    {automotive&&lightboxIndex!==null&&<div className="csAutoLightbox" role="dialog" aria-modal="true" aria-label="Galeria do projeto">
      <header><div><b>{project.name}</b><span>FOTO {String(lightboxIndex+1).padStart(2,'0')} DE {String(gallery.length).padStart(2,'0')}</span></div><button type="button" onClick={()=>setLightboxIndex(null)} aria-label="Fechar"><Icon name="plus" size={17}/></button></header>
      <main><button type="button" onClick={()=>setLightboxIndex((lightboxIndex-1+gallery.length)%gallery.length)} aria-label="Foto anterior"><Icon name="arrowLeft" size={16}/></button><img src={gallery[lightboxIndex]} alt={`Projeto ${lightboxIndex+1}`}/><button type="button" onClick={()=>setLightboxIndex((lightboxIndex+1)%gallery.length)} aria-label="Próxima foto"><Icon name="arrowRight" size={16}/></button></main>
      <footer><span>Deslize pelas fotos ou use as setas</span><div>{gallery.slice(0,8).map((url,i)=><button type="button" className={i===lightboxIndex?'active':''} onClick={()=>setLightboxIndex(i)} key={i}><img src={url} alt=""/></button>)}</div></footer>
    </div>}
  </article>;
}
