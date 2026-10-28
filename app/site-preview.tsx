'use client';

import { CSSProperties } from 'react';
import { Arrow, Icon, Stars } from './vitra-icons';
import { fallback, palettes, Project, SectionKey, templates } from './vitra-data';

function waLink(project:Project){const n=project.whatsapp.replace(/\D/g,'');return n?`https://wa.me/${n}?text=${encodeURIComponent(`Olá, vim pelo site da ${project.name} e gostaria de mais informações.`)}`:'#contact'}

export default function SitePreview({project,compact=false}:{project:Project;compact?:boolean}){
  const palette=palettes.find(p=>p.id===project.paletteId)||palettes[0];
  const preset=templates.find(t=>t.id===project.templateId)||templates[0];
  const fb=fallback[project.niche];
  const hero=project.heroImage||fb.hero;
  const about=project.aboutImage||fb.about;
  const gallery=project.gallery.length?project.gallery:fb.gallery;
  const style={
    '--cs-bg':palette.bg,'--cs-surface':palette.surface,'--cs-text':palette.text,'--cs-muted':palette.muted,
    '--cs-accent':palette.accent,'--cs-secondary':palette.secondary,'--hero-pos':project.heroFocus==='left'?'25% center':project.heroFocus==='right'?'75% center':'50% center'
  } as CSSProperties;
  const sectionSet=new Set(project.sections);
  const clickWa=(e:React.MouseEvent)=>{if(waLink(project)==='#contact')e.preventDefault()};
  const cta=<a className="csCta" href={waLink(project)} target={waLink(project)==='#contact'?undefined:'_blank'} rel="noreferrer" onClick={clickWa}>{project.ctaLabel||'Falar agora'}<Arrow/></a>;

  function renderHero(){
    const media=<div className="csHeroMedia">{project.heroVideo?<video src={project.heroVideo} autoPlay muted loop playsInline/>:<img src={hero} alt="Imagem principal"/>}<div className="csHeroShade"/></div>;
    const copy=<div className="csHeroCopy"><span className="csEyebrow">{project.eyebrow}</span><h1>{project.headline}</h1><p>{project.subheadline}</p><div className="csHeroActions">{cta}<small>Atendimento direto • sem formulário</small></div></div>;
    if(preset.hero==='split')return <section className="csHero csHeroSplit">{copy}{media}<div className="csHeroIndex">01 / {preset.label}</div></section>;
    if(preset.hero==='center')return <section className="csHero csHeroCenter">{media}<div className="csHeroCenterInner">{copy}</div><div className="csHeroIndex">01 / {preset.mood}</div></section>;
    if(preset.hero==='offset')return <section className="csHero csHeroOffset"><div className="csOffsetFrame">{media}</div>{copy}<div className="csHeroIndex">01 / {preset.label}</div></section>;
    if(preset.hero==='poster')return <section className="csHero csHeroPoster">{media}<div className="csPosterNumber">01</div>{copy}<div className="csHeroIndex">{preset.mood}</div></section>;
    return <section className="csHero csHeroFull">{media}{copy}<div className="csHeroIndex">01 / {preset.label}</div></section>;
  }

  function sectionHead(index:string,kicker:string,title:string,text:string){return <div className="csSectionHead"><div><span>{index} / {kicker}</span><h2>{title}</h2></div><p>{text}</p></div>}
  function renderSection(key:SectionKey){
    if(key==='about')return <section className="csAbout" id="about" key={key}><div className="csAboutImage"><img src={about} alt="Sobre a empresa"/></div><div className="csAboutCopy"><span>02 / NOSSO PADRÃO</span><h2>{project.aboutTitle}</h2><p>{project.aboutText}</p><div className="csFacts">{project.benefits.filter(Boolean).slice(0,4).map((b,i)=><span key={i}><Icon name="check" size={13}/>{b}</span>)}</div></div></section>;
    if(key==='services')return <section className={`csServices variant-${project.servicesVariant}`} id="services" key={key}>{sectionHead('03','SERVIÇOS','O que fazemos.','Informação clara, hierarquia forte e percepção de valor.')}
      <div className="csServicesGrid">{project.services.filter(s=>s.title).map((s,i)=><article className="csService" key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{s.title}</h3><p>{s.description}</p></div><footer><b>{s.price||'Sob consulta'}</b><Arrow/></footer></article>)}</div></section>;
    if(key==='beforeAfter')return (project.beforeImage||project.afterImage)?<section className="csBeforeAfter" key={key}>{sectionHead('04','TRANSFORMAÇÃO','Resultado lado a lado.','Mesma proporção, comparação limpa e foco no resultado.')}<div className="csBeforeGrid"><figure>{project.beforeImage?<img src={project.beforeImage} alt="Antes"/>:<div/>}<figcaption>ANTES</figcaption></figure><figure>{project.afterImage?<img src={project.afterImage} alt="Depois"/>:<div/>}<figcaption>DEPOIS</figcaption></figure></div></section>:null;
    if(key==='gallery')return <section className={`csGallery variant-${project.galleryVariant}`} key={key}>{sectionHead('05','PORTFÓLIO','Detalhes que falam por si.','O layout se adapta à quantidade de imagens sem criar espaços vazios.')}<div className="csGalleryGrid">{gallery.slice(0,8).map((url,i)=><figure key={i}><img src={url} alt={`Trabalho ${i+1}`}/><span>{String(i+1).padStart(2,'0')}</span></figure>)}</div></section>;
    if(key==='video')return project.heroVideo?<section className="csVideo" key={key}><video src={project.heroVideo} controls playsInline/><div><span>06 / EM MOVIMENTO</span><h2>Uma marca também se sente.</h2></div></section>:null;
    if(key==='packages')return <section className="csPackages" key={key}>{sectionHead('06','PACOTES','Escolha sua experiência.','Poucas opções, comparação simples e uma escolha principal em destaque.')}<div className={`csPackageGrid count-${Math.min(project.packages.length,4)}`}>{project.packages.filter(p=>p.name).map((p,i)=><article className={p.featured?'featured':''} key={i}>{p.featured&&<span className="csBadge">MAIS ESCOLHIDO</span>}<small>{String(i+1).padStart(2,'0')}</small><h3>{p.name}</h3><p>{p.description}</p><strong>{p.price||'Sob consulta'}</strong>{cta}</article>)}</div></section>;
    if(key==='proof')return <section className={`csProof variant-${project.proofVariant}`} key={key}><div className="csProofIntro"><span>07 / PROVA SOCIAL</span><h2>Confiança construída por quem já viveu a experiência.</h2></div><div className="csProofGrid">{project.testimonials.map((t,i)=><blockquote key={i}><Stars count={t.rating}/><p>“{t.text}”</p><footer>{t.name}</footer></blockquote>)}</div></section>;
    if(key==='hours')return <section className="csLocation" key={key}><div><span>08 / LOCAL</span><h2>Seu próximo atendimento começa aqui.</h2><p>{project.address||'Adicione o endereço para apresentar a localização do negócio.'}</p>{project.mapLink&&<a href={project.mapLink} target="_blank" rel="noreferrer">Abrir no mapa <Arrow/></a>}</div><div className="csHours">{project.hours.map((h,i)=><div key={i}><span>{h.day}</span><b>{h.time}</b></div>)}</div></section>;
    if(key==='faq')return <section className="csFaq" key={key}><div className="csFaqIntro"><span>09 / DÚVIDAS</span><h2>Antes de chamar, talvez esteja aqui.</h2></div><div>{project.faq.filter(f=>f.question).map((f,i)=><details key={i} open={i===0}><summary>{f.question}<Icon name="chevronDown" size={15}/></summary><p>{f.answer}</p></details>)}</div></section>;
    if(key==='contact')return <section className="csClosing" id="contact" key={key}><span>PRONTO PARA COMEÇAR?</span><h2>{project.name}</h2><p>{project.goal==='portfolio'?'Gostou do que viu? Continue a conversa direto com a empresa.':'Atendimento direto, simples e rápido.'}</p>{cta}<div>{project.instagram&&<small>{project.instagram}</small>}{project.address&&<small>{project.address}</small>}</div></section>;
    return null;
  }

  return <article className={`clientSite niche-${project.niche} template-${project.templateId} hero-${preset.hero} font-${project.fontId} mode-${palette.mode} ${compact?'compact':''}`} style={style}>
    <header className="csHeader"><div className="csBrand">{project.logoUrl?<img src={project.logoUrl} alt="Logo"/>:<span>{project.name.slice(0,1)||'V'}</span>}<b>{project.name||'Sua marca'}</b></div><nav><a href="#services">Serviços</a><a href="#about">Sobre</a><a href="#contact">Contato</a></nav><a className="csHeaderCta" href={waLink(project)} target={waLink(project)==='#contact'?undefined:'_blank'} rel="noreferrer" onClick={clickWa}>WhatsApp <Arrow/></a></header>
    {renderHero()}
    <div className="csTrust">{project.benefits.filter(Boolean).slice(0,4).map((b,i)=><span key={i}><Icon name="checkCircle" size={14}/>{b}</span>)}</div>
    {project.sections.filter(k=>sectionSet.has(k)).map(renderSection)}
    <footer className="csFooter"><div><b>{project.name}</b><span>{preset.name} • VITRA</span></div><small>{new Date().getFullYear()} • Todos os direitos reservados</small></footer>
  </article>
}
