'use client';

import { ChangeEvent, CSSProperties, useEffect, useMemo, useState } from 'react';

type Niche = 'automotive' | 'manicure';
type Status = 'draft' | 'ready';
type PreviewMode = 'desktop' | 'mobile';
type SectionKey = 'about' | 'services' | 'beforeAfter' | 'gallery' | 'video' | 'packages' | 'proof' | 'hours' | 'faq' | 'contact';
type Service = { title: string; description: string; price: string };
type Package = { name: string; description: string; price: string; featured: boolean };
type Testimonial = { name: string; text: string; rating: number };
type FAQ = { question: string; answer: string };
type Hour = { day: string; time: string };
type Palette = { id: string; name: string; mode: 'dark' | 'light'; bg: string; surface: string; text: string; muted: string; accent: string; secondary: string };

type Project = {
  id: string;
  status: Status;
  niche: Niche;
  template: 'atelier' | 'cinema' | 'grid' | 'minimal';
  paletteId: string;
  fontStyle: 'editorial' | 'modern' | 'minimal' | 'bold' | 'luxury' | 'tech';
  name: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  whatsapp: string;
  instagram: string;
  address: string;
  mapLink: string;
  logoUrl: string;
  heroImage: string;
  heroVideo: string;
  gallery: string[];
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  services: Service[];
  packages: Package[];
  beforeImage: string;
  afterImage: string;
  benefits: string[];
  testimonials: Testimonial[];
  hours: Hour[];
  faq: FAQ[];
  seoTitle: string;
  seoDescription: string;
  sections: SectionKey[];
  createdAt: string;
};

const palettes: Palette[] = [
  { id: 'carbon', name: 'Carbon Fire', mode: 'dark', bg: '#0B0D10', surface: '#15181E', text: '#F6F4EF', muted: '#9A9EA7', accent: '#FF5B35', secondary: '#D6D8DD' },
  { id: 'midnight', name: 'Midnight Blue', mode: 'dark', bg: '#070B14', surface: '#101827', text: '#F5F8FF', muted: '#8D98AA', accent: '#4F7CFF', secondary: '#A9C1FF' },
  { id: 'obsidian', name: 'Obsidian Gold', mode: 'dark', bg: '#0D0C0A', surface: '#191612', text: '#F6F0E5', muted: '#A69D90', accent: '#C89B5B', secondary: '#E5CDA8' },
  { id: 'forest', name: 'Forest Sage', mode: 'dark', bg: '#0A110F', surface: '#13201C', text: '#EEF5F1', muted: '#91A29A', accent: '#79B597', secondary: '#C3D8CC' },
  { id: 'ivory', name: 'Ivory Ink', mode: 'light', bg: '#F6F3EC', surface: '#FFFFFF', text: '#151515', muted: '#6C6A66', accent: '#151515', secondary: '#D9D2C6' },
  { id: 'sand', name: 'Warm Sand', mode: 'light', bg: '#F3EDE4', surface: '#FBF8F3', text: '#2A231D', muted: '#7E7166', accent: '#9B6847', secondary: '#D6B89F' },
  { id: 'ice', name: 'Ice Studio', mode: 'light', bg: '#F2F6FA', surface: '#FFFFFF', text: '#14202C', muted: '#71808E', accent: '#3976A8', secondary: '#C6DCEB' },
  { id: 'blush', name: 'Soft Blush', mode: 'light', bg: '#FAF4F4', surface: '#FFFFFF', text: '#2D2022', muted: '#8B7378', accent: '#B66F7B', secondary: '#E9CED3' }
];

const fallback: Record<Niche, { hero: string; about: string; g1: string; g2: string; g3: string }> = {
  automotive: {
    hero: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1800&q=88',
    about: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf18c?auto=format&fit=crop&w=1400&q=85',
    g1: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=84',
    g2: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=84',
    g3: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=84'
  },
  manicure: {
    hero: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1800&q=88',
    about: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1400&q=85',
    g1: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=84',
    g2: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=1200&q=84',
    g3: 'https://images.unsplash.com/photo-1599948128020-9a44505b0d1b?auto=format&fit=crop&w=1200&q=84'
  }
};

const steps = [
  ['base', 'Começo'], ['logo', 'Logo'], ['brand', 'Marca'], ['copy', 'Headline'], ['visual', 'Visual'], ['hero', 'Capa'], ['gallery', 'Galeria'], ['video', 'Vídeo'], ['about', 'Sobre'], ['services', 'Serviços'], ['packages', 'Pacotes'], ['before', 'Antes/depois'], ['proof', 'Prova social'], ['hours', 'Local & horários'], ['contact', 'Contato'], ['faq', 'FAQ'], ['seo', 'SEO'], ['sections', 'Seções'], ['review', 'Revisão']
] as const;

type StepId = typeof steps[number][0];

function freshProject(niche: Niche): Project {
  const auto = niche === 'automotive';
  return {
    id: crypto.randomUUID(), status: 'draft', niche, template: 'atelier', paletteId: auto ? 'carbon' : 'blush', fontStyle: 'editorial',
    name: auto ? 'Apex Detail' : 'Maison Nails',
    eyebrow: auto ? 'DETAILING • PROTEÇÃO • PRESENÇA' : 'NAIL DESIGN • CUIDADO • ESTILO',
    headline: auto ? 'Seu carro, em outro nível.' : 'Detalhes que mudam tudo.',
    subheadline: auto ? 'Estética automotiva premium com acabamento impecável, proteção avançada e atenção real a cada detalhe.' : 'Uma experiência de manicure e nail design feita para valorizar seu estilo com técnica, delicadeza e acabamento impecável.',
    ctaLabel: auto ? 'Solicitar orçamento' : 'Agendar horário', whatsapp: '', instagram: '', address: '', mapLink: '', logoUrl: '', heroImage: '', heroVideo: '', gallery: [],
    aboutTitle: auto ? 'Não é só limpeza. É presença.' : 'Cuidado que aparece nos detalhes.',
    aboutText: auto ? 'Cada etapa do processo é pensada para recuperar brilho, proteger superfícies e entregar uma experiência de alto padrão do primeiro contato à entrega.' : 'Atendimento cuidadoso, técnica precisa e um ambiente pensado para você desacelerar. Cada detalhe é feito para durar e combinar com o seu estilo.',
    aboutImage: '',
    services: auto ? [
      { title: 'Lavagem técnica', description: 'Limpeza detalhada com processo seguro para pintura, rodas e acabamento.', price: '' },
      { title: 'Polimento técnico', description: 'Correção de marcas e recuperação do brilho com acabamento refinado.', price: '' },
      { title: 'Vitrificação', description: 'Proteção avançada com brilho profundo e maior resistência no dia a dia.', price: '' },
      { title: 'Higienização interna', description: 'Limpeza profunda de bancos, carpetes, forros e acabamentos internos.', price: '' }
    ] : [
      { title: 'Manicure premium', description: 'Cuidado completo, preparação e acabamento preciso.', price: '' },
      { title: 'Alongamento em gel', description: 'Estrutura leve, resistente e com acabamento natural.', price: '' },
      { title: 'Blindagem', description: 'Mais resistência e brilho para unhas naturais.', price: '' },
      { title: 'Nail art', description: 'Design personalizado para transformar referências em detalhes únicos.', price: '' }
    ],
    packages: auto ? [
      { name: 'Essencial', description: 'Lavagem técnica + acabamento interno', price: 'Sob consulta', featured: false },
      { name: 'Signature', description: 'Detalhamento completo + proteção', price: 'Sob consulta', featured: true },
      { name: 'Protection', description: 'Correção + vitrificação premium', price: 'Sob consulta', featured: false }
    ] : [
      { name: 'Classic', description: 'Manicure completa', price: 'Sob consulta', featured: false },
      { name: 'Signature', description: 'Alongamento + acabamento premium', price: 'Sob consulta', featured: true },
      { name: 'Art', description: 'Alongamento + nail art personalizada', price: 'Sob consulta', featured: false }
    ],
    beforeImage: '', afterImage: '',
    benefits: auto ? ['Produtos profissionais', 'Processo detalhado', 'Atendimento com hora marcada', 'Acabamento premium'] : ['Materiais selecionados', 'Técnica profissional', 'Atendimento com hora marcada', 'Acabamento impecável'],
    testimonials: [
      { name: 'Cliente verificado', text: auto ? 'O carro ficou com aparência de novo. Atendimento cuidadoso do começo ao fim.' : 'Atendimento impecável e resultado muito delicado. Já saí com o próximo horário marcado.', rating: 5 },
      { name: 'Cliente verificado', text: auto ? 'Serviço muito acima do esperado. Explicaram cada etapa e o acabamento ficou excelente.' : 'Ambiente lindo, atendimento pontual e acabamento perfeito. Recomendo muito.', rating: 5 }
    ],
    hours: [{ day: 'Segunda a sexta', time: '09:00 — 18:00' }, { day: 'Sábado', time: '09:00 — 15:00' }, { day: 'Domingo', time: 'Fechado' }],
    faq: [
      { question: auto ? 'Precisa agendar?' : 'Precisa marcar horário?', answer: 'Sim. Trabalhamos com horário marcado para manter a qualidade e evitar espera.' },
      { question: 'Como faço um orçamento?', answer: 'Clique no botão de WhatsApp e envie sua dúvida. O atendimento continua diretamente por lá.' },
      { question: auto ? 'Quanto tempo leva o serviço?' : 'Quanto tempo dura o atendimento?', answer: 'O tempo varia conforme o serviço escolhido. Confirmamos a estimativa antes do atendimento.' }
    ],
    seoTitle: auto ? 'Apex Detail | Estética Automotiva Premium' : 'Maison Nails | Manicure & Nail Design',
    seoDescription: auto ? 'Estética automotiva premium com lavagem técnica, polimento, vitrificação e higienização.' : 'Manicure, alongamento, blindagem e nail art com atendimento premium.',
    sections: ['about', 'services', 'beforeAfter', 'gallery', 'video', 'packages', 'proof', 'hours', 'faq', 'contact'], createdAt: new Date().toISOString()
  };
}

const fontNames: Record<Project['fontStyle'], string> = { editorial: 'Editorial', modern: 'Modern', minimal: 'Minimal', bold: 'Bold', luxury: 'Luxury', tech: 'Tech' };
const sectionNames: Record<SectionKey, string> = { about: 'Sobre', services: 'Serviços', beforeAfter: 'Antes/depois', gallery: 'Galeria', video: 'Vídeo', packages: 'Pacotes', proof: 'Avaliações', hours: 'Local & horários', faq: 'Perguntas', contact: 'Contato' };

function readFile(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }); }

function safeStoredProject(p: Project) {
  const trimMedia = (v: string) => v.startsWith('data:') && v.length > 180000 ? '' : v.startsWith('blob:') ? '' : v;
  return { ...p, logoUrl: trimMedia(p.logoUrl), heroImage: trimMedia(p.heroImage), heroVideo: '', aboutImage: trimMedia(p.aboutImage), beforeImage: trimMedia(p.beforeImage), afterImage: trimMedia(p.afterImage), gallery: p.gallery.map(trimMedia).filter(Boolean) };
}

function SitePreview({ project, compact = false }: { project: Project; compact?: boolean }) {
  const palette = palettes.find(p => p.id === project.paletteId) || palettes[0];
  const fb = fallback[project.niche];
  const style = { '--site-bg': palette.bg, '--site-surface': palette.surface, '--site-text': palette.text, '--site-muted': palette.muted, '--site-accent': palette.accent, '--site-secondary': palette.secondary } as CSSProperties;
  const sections = new Set(project.sections);
  const gallery = project.gallery.length ? project.gallery : [fb.g1, fb.g2, fb.g3];
  const hero = project.heroImage || fb.hero;
  const aboutImg = project.aboutImage || fb.about;

  return <article className={`siteCanvas ${palette.mode} template-${project.template} font-${project.fontStyle} ${compact ? 'compact' : ''}`} style={style}>
    <header className="siteHeader">
      <div className="siteBrand">{project.logoUrl ? <img src={project.logoUrl} alt="Logo" /> : <span className="siteMonogram">{project.name.slice(0, 1) || 'V'}</span>}<b>{project.name || 'Sua marca'}</b></div>
      <nav><a href="#services">Serviços</a><a href="#about">Sobre</a><a href="#contact">Contato</a></nav>
      <button>WhatsApp ↗</button>
    </header>

    <section className="siteHero" style={{ backgroundImage: `url(${hero})` }}>
      {project.heroVideo && <video src={project.heroVideo} autoPlay muted loop playsInline />}
      <div className="siteHeroShade" />
      <div className="siteHeroCopy"><span>{project.eyebrow}</span><h1>{project.headline || 'Sua headline principal'}</h1><p>{project.subheadline}</p><div><button className="sitePrimary">{project.ctaLabel || 'Falar agora'} ↗</button><small>Atendimento personalizado</small></div></div>
      <div className="siteHeroStamp"><i>01</i><span>EXPERIÊNCIA<br />PREMIUM</span></div>
    </section>

    <div className="trustStrip">{project.benefits.slice(0, 4).map((b, i) => <span key={i}>✓ {b}</span>)}</div>

    {sections.has('about') && <section className="siteAbout" id="about"><div className="sectionIndex">01 / SOBRE</div><div className="aboutCopy"><span>NOSSO PADRÃO</span><h2>{project.aboutTitle}</h2><p>{project.aboutText}</p><button>Conhecer o atendimento ↗</button></div><div className="aboutImage"><img src={aboutImg} alt="Sobre" /><span>QUALIDADE EM CADA DETALHE</span></div></section>}

    {sections.has('services') && <section className="siteServices" id="services"><div className="sectionHead"><div><span>02 / SERVIÇOS</span><h2>O que fazemos.</h2></div><p>Serviços pensados para entregar resultado, confiança e uma experiência que valoriza sua marca.</p></div><div className="serviceGrid">{project.services.filter(s => s.title).map((s, i) => <div className="siteService" key={i}><span>0{i + 1}</span><h3>{s.title}</h3><p>{s.description}</p><div><b>{s.price || 'Consultar'}</b><i>↗</i></div></div>)}</div></section>}

    {sections.has('beforeAfter') && project.beforeImage && project.afterImage && <section className="beforeAfter"><div className="sectionHead lightHead"><div><span>03 / RESULTADO</span><h2>Antes. Depois.</h2></div><p>Uma transformação que explica o serviço antes mesmo de qualquer texto.</p></div><div className="baGrid"><figure><img src={project.beforeImage} alt="Antes" /><figcaption>ANTES</figcaption></figure><figure><img src={project.afterImage} alt="Depois" /><figcaption>DEPOIS</figcaption></figure></div></section>}

    {sections.has('gallery') && <section className="siteGallery"><div className="galleryTitle"><span>04 / TRABALHOS</span><h2>Detalhes que falam por si.</h2></div><div className="galleryGrid">{gallery.slice(0, 6).map((url, i) => <img src={url} alt={`Trabalho ${i + 1}`} key={`${url}-${i}`} />)}</div></section>}

    {sections.has('video') && project.heroVideo && <section className="siteVideo"><video src={project.heroVideo} controls playsInline poster={hero} /><div><span>EM MOVIMENTO</span><h2>Veja a experiência de perto.</h2></div></section>}

    {sections.has('packages') && <section className="sitePackages"><div className="sectionHead"><div><span>05 / PACOTES</span><h2>Escolha sua experiência.</h2></div><p>Apresente opções de forma clara sem transformar o site em uma tabela fria de preços.</p></div><div className="packageGrid">{project.packages.filter(p => p.name).map((p, i) => <div className={`packageCard ${p.featured ? 'featured' : ''}`} key={i}>{p.featured && <span className="packageBadge">MAIS ESCOLHIDO</span>}<small>0{i + 1}</small><h3>{p.name}</h3><p>{p.description}</p><strong>{p.price || 'Sob consulta'}</strong><button>{project.ctaLabel} ↗</button></div>)}</div></section>}

    {sections.has('proof') && <section className="siteProof"><div><span>06 / QUEM JÁ VEIO</span><h2>Confiança se constrói no resultado.</h2></div><div className="testimonialGrid">{project.testimonials.map((t, i) => <blockquote key={i}><div>{'★'.repeat(Math.max(1, Math.min(5, t.rating)))}</div><p>“{t.text}”</p><footer>{t.name}</footer></blockquote>)}</div></section>}

    {sections.has('hours') && <section className="siteLocation"><div className="locationCopy"><span>07 / VISITE</span><h2>Seu próximo atendimento começa aqui.</h2><p>{project.address || 'Adicione o endereço do cliente para mostrar a localização.'}</p>{project.mapLink && <a href={project.mapLink} target="_blank" rel="noreferrer">ABRIR NO MAPA ↗</a>}</div><div className="hoursList">{project.hours.map((h, i) => <div key={i}><span>{h.day}</span><b>{h.time}</b></div>)}</div></section>}

    {sections.has('faq') && <section className="siteFaq"><div className="faqIntro"><span>08 / DÚVIDAS</span><h2>Antes de chamar, talvez esteja aqui.</h2></div><div className="faqList">{project.faq.filter(f => f.question).map((f, i) => <details key={i} open={i === 0}><summary>{f.question}<b>＋</b></summary><p>{f.answer}</p></details>)}</div></section>}

    {sections.has('contact') && <section className="siteClosing" id="contact"><span>PRONTO PARA COMEÇAR?</span><h2>{project.name}</h2><p>{project.instagram ? project.instagram : 'Atendimento rápido pelo WhatsApp.'}</p><button>{project.ctaLabel} ↗</button><div><small>{project.address}</small><small>{project.instagram}</small></div></section>}
  </article>;
}

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'builder'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project>(() => freshProject('automotive'));
  const [step, setStep] = useState(0);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try { const raw = localStorage.getItem('vitra-demo-projects'); if (raw) setProjects(JSON.parse(raw)); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('vitra-demo-projects', JSON.stringify(projects.map(safeStoredProject))); } catch {}
  }, [projects]);

  const palette = useMemo(() => palettes.find(p => p.id === project.paletteId) || palettes[0], [project.paletteId]);
  const current = steps[step];
  const currentId = current[0] as StepId;
  const progress = ((step + 1) / steps.length) * 100;

  function setField<K extends keyof Project>(key: K, value: Project[K]) { setProject(p => ({ ...p, [key]: value })); }
  function start(niche: Niche) { setProject(freshProject(niche)); setStep(0); setNotice(''); setView('builder'); window.scrollTo(0, 0); }
  function edit(p: Project) { setProject({ ...p }); setStep(0); setNotice(''); setView('builder'); }
  function save() {
    setProjects(list => { const exists = list.some(p => p.id === project.id); return exists ? list.map(p => p.id === project.id ? project : p) : [project, ...list]; });
    setNotice('Versão de teste salva neste navegador.'); setTimeout(() => setNotice(''), 2400);
  }
  function duplicate() { const clone = { ...project, id: crypto.randomUUID(), name: `${project.name} — cópia`, status: 'draft' as Status, createdAt: new Date().toISOString() }; setProjects(p => [clone, ...p]); setProject(clone); setNotice('Projeto duplicado.'); }
  function next() { if (step < steps.length - 1) setStep(s => s + 1); }
  function back() { if (step > 0) setStep(s => s - 1); }

  async function uploadOne(e: ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'heroImage' | 'aboutImage' | 'beforeImage' | 'afterImage') {
    const file = e.target.files?.[0]; if (!file) return; const data = await readFile(file); setField(key, data); e.target.value = '';
  }
  async function uploadGallery(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 8 - project.gallery.length); if (!files.length) return; const data = await Promise.all(files.map(readFile)); setField('gallery', [...project.gallery, ...data].slice(0, 8)); e.target.value = '';
  }
  function uploadVideo(e: ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (!file) return; if (project.heroVideo.startsWith('blob:')) URL.revokeObjectURL(project.heroVideo); setField('heroVideo', URL.createObjectURL(file)); e.target.value = ''; }
  function toggleSection(key: SectionKey) { setField('sections', project.sections.includes(key) ? project.sections.filter(s => s !== key) : [...project.sections, key]); }
  function moveSection(index: number, dir: -1 | 1) { const next = [...project.sections]; const target = index + dir; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setField('sections', next); }

  if (view === 'dashboard') return <main className="studioShell">
    <aside className="rail"><button className="railLogo">V</button><div className="railNav"><button className="active"><span>⌂</span><small>Início</small></button><button onClick={() => start('automotive')}><span>＋</span><small>Criar</small></button><button><span>◇</span><small>Modelos</small></button></div><div className="testMode">TEST</div></aside>
    <section className="dashboard">
      <header className="topbar"><div className="topbarBrand"><span className="tinyLabel">VITRA / SITE STUDIO</span><h1>Fábrica de sites premium.</h1></div><button className="newProjectBtn" onClick={() => start('automotive')}>＋ NOVO SITE</button></header>
      <section className="dashboardHero"><div className="dashGlow" /><div className="dashHeroCopy"><span className="kicker">MODO ESTÚDIO • ACESSO LIVRE</span><h2>Crie sites que parecem feitos por uma <em>agência.</em></h2><p>Você coloca a identidade do cliente. O VITRA cuida da hierarquia, proporção, tipografia, responsividade e composição de cada seção.</p><button className="heroCreateBtn" onClick={() => start('automotive')}>COMEÇAR UM SITE <b>↗</b></button><div className="dashBadges"><span>19 etapas guiadas</span><span>8 paletas</span><span>6 tipografias</span><span>10 seções premium</span></div></div><div className="heroDevice"><div className="heroBrowser"><i/><i/><i/><span>preview.vitra</span></div><SitePreview project={freshProject('automotive')} compact /></div></section>
      <section className="metricStrip"><div><span>PROJETOS</span><strong>{String(projects.length).padStart(2, '0')}</strong></div><div><span>NICHOS</span><strong>02</strong></div><div><span>PALETAS</span><strong>08</strong></div><div><span>ETAPAS</span><strong>19</strong></div></section>
      <section className="sectionBlock"><div className="blockTitle"><div><span className="tinyLabel">COMEÇAR</span><h3>Escolha o nicho.</h3></div><span className="indexTag">01 / BASE</span></div><div className="nicheGrid"><button className="nicheCard autoCard" onClick={() => start('automotive')}><div className="cardImage"><span>ESTÉTICA<br/>AUTOMOTIVA</span></div><div className="nicheMeta"><span>PREMIUM / PERFORMANCE</span><b>CRIAR SITE ↗</b></div></button><button className="nicheCard nailsCard" onClick={() => start('manicure')}><div className="cardImage"><span>MANICURE<br/>& NAILS</span></div><div className="nicheMeta"><span>EDITORIAL / SOFT LUXURY</span><b>CRIAR SITE ↗</b></div></button></div></section>
      <section className="sectionBlock projectsBlock"><div className="blockTitle"><div><span className="tinyLabel">SEUS TESTES</span><h3>Projetos recentes.</h3></div><span className="indexTag">02 / PROJETOS</span></div>{projects.length === 0 ? <div className="emptyProjects"><span>V</span><h4>Pronto para o primeiro.</h4><p>Crie um site completo e salve a versão de teste neste navegador.</p><button onClick={() => start('automotive')}>CRIAR PRIMEIRO SITE ↗</button></div> : <div className="projectGrid">{projects.map(p => <button className="projectCard" key={p.id} onClick={() => edit(p)}><div className="projectThumb" style={{ backgroundImage: `linear-gradient(180deg,transparent,rgba(0,0,0,.82)),url(${p.heroImage || fallback[p.niche].hero})` }}><span className={`statusDot ${p.status}`} /><strong>{p.name}</strong></div><div className="projectInfo"><div><span>{p.niche === 'automotive' ? 'ESTÉTICA' : 'MANICURE'}</span><b>{p.status === 'ready' ? 'PRONTO' : 'RASCUNHO'}</b></div><i>↗</i></div></button>)}</div>}</section>
    </section>
  </main>;

  const optional = !['base', 'brand', 'copy', 'visual', 'review'].includes(currentId);

  return <main className="wizardShell">
    <header className="wizardTopbar"><button className="wizardBrand" onClick={() => setView('dashboard')}><span>V</span><b>VITRA</b></button><div className="wizardProjectName"><small>PROJETO EM CRIAÇÃO</small><strong>{project.name || 'Novo site'}</strong></div><div className="wizardTopActions"><span className="saveNotice">{notice}</span><button className="ghostBtn" onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}>{previewMode === 'desktop' ? '▯ MOBILE' : '▭ DESKTOP'}</button><button className="saveBtn" onClick={save}>SALVAR TESTE</button></div></header>
    <div className="wizardProgress"><i style={{ width: `${progress}%` }} /></div>
    <div className="wizardLayout">
      <aside className="stepRail"><span className="stepRailLabel">ETAPAS</span><div className="stepDots">{steps.map((s, i) => <button key={s[0]} className={`${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} onClick={() => setStep(i)}><span>{i < step ? '✓' : String(i + 1).padStart(2, '0')}</span><small>{s[1]}</small></button>)}</div></aside>
      <section className="wizardStage"><div className="stageContent"><Stage step={currentId} project={project} palette={palette} setField={setField} uploadOne={uploadOne} uploadGallery={uploadGallery} uploadVideo={uploadVideo} toggleSection={toggleSection} moveSection={moveSection} setProject={setProject} />
        <footer className="stageFooter"><button className="backStep" onClick={back} disabled={step === 0}>← VOLTAR</button><div>{optional && step < steps.length - 1 && <button className="skipStep" onClick={next}>PULAR</button>}<span>{String(step + 1).padStart(2, '0')} / {steps.length}</span>{step < steps.length - 1 ? <button className="nextStep" onClick={next}>CONTINUAR <b>→</b></button> : <button className="nextStep finish" onClick={() => { setField('status', 'ready'); save(); setNotice('Projeto pronto para o motor de publicação.'); }}>FINALIZAR <b>✓</b></button>}</div></footer>
      </div></section>
      <aside className={`livePreviewPanel ${previewMode}`}><div className="previewPanelTop"><div><i/><i/><i/></div><span>PREVIEW AO VIVO</span><b>{previewMode.toUpperCase()}</b></div><div className="previewViewport"><div className="previewFrame"><SitePreview project={project} /></div></div></aside>
    </div>
  </main>;
}

type StageProps = {
  step: StepId; project: Project; palette: Palette; setField: <K extends keyof Project>(key: K, value: Project[K]) => void;
  uploadOne: (e: ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'heroImage' | 'aboutImage' | 'beforeImage' | 'afterImage') => void;
  uploadGallery: (e: ChangeEvent<HTMLInputElement>) => void; uploadVideo: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleSection: (key: SectionKey) => void; moveSection: (index: number, dir: -1 | 1) => void; setProject: React.Dispatch<React.SetStateAction<Project>>;
};

function Stage({ step, project, palette, setField, uploadOne, uploadGallery, uploadVideo, toggleSection, moveSection, setProject }: StageProps) {
  const heading = (index: string, title: string, text: string, note?: string) => <div className="stageHeading"><span>{index}</span><h1>{title}</h1><p>{text}</p>{note && <small>{note}</small>}</div>;
  const updateService = (i: number, key: keyof Service, value: string) => { const next = [...project.services]; next[i] = { ...next[i], [key]: value }; setField('services', next); };
  const updatePackage = (i: number, key: keyof Package, value: string | boolean) => { const next = [...project.packages]; next[i] = { ...next[i], [key]: value }; setField('packages', next); };
  const updateTestimonial = (i: number, key: keyof Testimonial, value: string | number) => { const next = [...project.testimonials]; next[i] = { ...next[i], [key]: value }; setField('testimonials', next); };
  const updateFAQ = (i: number, key: keyof FAQ, value: string) => { const next = [...project.faq]; next[i] = { ...next[i], [key]: value }; setField('faq', next); };
  const updateHour = (i: number, key: keyof Hour, value: string) => { const next = [...project.hours]; next[i] = { ...next[i], [key]: value }; setField('hours', next); };

  return <>
    {step === 'base' && <>{heading('01 / BASE', 'Que tipo de negócio vamos transformar?', 'O nicho define a estrutura inicial, textos sugeridos, serviços e composição visual. Tudo continua editável depois.')}<div className="stageControl nicheChoice"><button className={project.niche === 'automotive' ? 'active' : ''} onClick={() => setProject(freshProject('automotive'))}><span>🚗</span><div><strong>Estética automotiva</strong><small>Detalhamento, polimento, vitrificação e proteção</small></div><b>↗</b></button><button className={project.niche === 'manicure' ? 'active' : ''} onClick={() => setProject(freshProject('manicure'))}><span>✦</span><div><strong>Manicure & Nails</strong><small>Manicure, alongamento, gel e nail art</small></div><b>↗</b></button></div></>}

    {step === 'logo' && <>{heading('02 / IDENTIDADE', 'Comece pelo logotipo.', 'Envie o logo do cliente. O VITRA preserva a proporção e encaixa a marca sem deformar.', 'PNG ou WebP transparente é o ideal.')}<div className="stageControl"><label className={`dropZone logoDrop ${project.logoUrl ? 'hasMedia' : ''}`}><input type="file" accept="image/*" onChange={e => uploadOne(e, 'logoUrl')} />{project.logoUrl ? <img src={project.logoUrl} alt="Logo" /> : <><span className="uploadIcon">＋</span><strong>Enviar logotipo</strong><small>CLIQUE PARA ESCOLHER</small></>}</label>{project.logoUrl && <button className="removeMedia" onClick={() => setField('logoUrl', '')}>REMOVER LOGO</button>}</div></>}

    {step === 'brand' && <>{heading('03 / MARCA', 'Qual é o nome que vai aparecer?', 'O nome entra no cabeçalho, chamadas finais e estrutura visual do site.')}<div className="stageControl controlStack"><label className="bigInput"><span>NOME DA MARCA</span><input value={project.name} onChange={e => setField('name', e.target.value)} placeholder="Ex.: Apex Detail" /></label><label className="lineInput"><span>LINHA DE POSICIONAMENTO</span><input value={project.eyebrow} onChange={e => setField('eyebrow', e.target.value.toUpperCase())} placeholder="DETAILING • PROTEÇÃO • PRESENÇA" /></label></div></>}

    {step === 'copy' && <>{heading('04 / MENSAGEM', 'A primeira frase precisa vender a percepção.', 'Defina o título, subtítulo e chamada principal. O preview mostra na hora como a hierarquia funciona.')}<div className="stageControl controlStack"><label className="bigTextarea"><span>TÍTULO PRINCIPAL</span><textarea rows={3} maxLength={78} value={project.headline} onChange={e => setField('headline', e.target.value)} /><small>{project.headline.length}/78</small></label><label className="softTextarea"><span>SUBTÍTULO</span><textarea rows={4} maxLength={220} value={project.subheadline} onChange={e => setField('subheadline', e.target.value)} /></label><label className="lineInput"><span>TEXTO DO BOTÃO</span><input value={project.ctaLabel} onChange={e => setField('ctaLabel', e.target.value)} /></label></div></>}

    {step === 'visual' && <>{heading('05 / DIREÇÃO VISUAL', 'Escolha a sensação da marca.', 'Combine layout, paleta e tipografia. As oito paletas já foram balanceadas para contraste e leitura.')}<div className="stageControl visualControl"><div><span className="controlLabel">LAYOUT</span><div className="templateGrid">{(['atelier','cinema','grid','minimal'] as const).map(t => <button key={t} className={project.template === t ? 'active' : ''} onClick={() => setField('template', t)}><span className={`templateMock ${t}`}><i/><i/><i/></span><b>{t}</b></button>)}</div></div><div><span className="controlLabel">PALETA — 4 ESCURAS + 4 CLARAS</span><div className="paletteGrid">{palettes.map(p => <button key={p.id} className={project.paletteId === p.id ? 'active' : ''} onClick={() => setField('paletteId', p.id)}><div className="paletteSwatches"><i style={{background:p.bg}}/><i style={{background:p.surface}}/><i style={{background:p.accent}}/><i style={{background:p.text}}/></div><span>{p.name}</span><small>{p.mode === 'dark' ? 'ESCURO' : 'CLARO'}</small></button>)}</div></div><div><span className="controlLabel">TIPOGRAFIA</span><div className="fontGrid">{(Object.keys(fontNames) as Project['fontStyle'][]).map(f => <button key={f} className={`${project.fontStyle === f ? 'active' : ''} font-${f}`} onClick={() => setField('fontStyle', f)}><strong>Aa</strong><span>{fontNames[f]}</span></button>)}</div></div><div className="selectedPalette"><span>COR PRINCIPAL</span><i style={{background:palette.accent}}/><b>{palette.accent}</b></div></div></>}

    {step === 'hero' && <>{heading('06 / CAPA', 'A imagem que define a primeira impressão.', 'Envie uma imagem horizontal. O site usa recorte inteligente com object-fit: cover e posicionamento responsivo.', 'Recomendado: 1920×1080 ou maior.')}<div className="stageControl"><label className={`dropZone heroDrop ${project.heroImage ? 'hasMedia' : ''}`}><input type="file" accept="image/*" onChange={e => uploadOne(e, 'heroImage')} />{project.heroImage ? <img src={project.heroImage} alt="Capa" /> : <><span className="uploadIcon">▧</span><strong>Enviar imagem de capa</strong><small>HORIZONTAL • ALTA RESOLUÇÃO</small></>}</label>{project.heroImage && <button className="removeMedia" onClick={() => setField('heroImage', '')}>USAR IMAGEM PADRÃO</button>}</div></>}

    {step === 'gallery' && <>{heading('07 / GALERIA', 'Mostre o trabalho sem bagunçar o layout.', 'Envie até oito imagens. O VITRA encaixa tudo automaticamente em uma grade editorial responsiva.')}<div className="stageControl galleryEditor"><label className="addMediaCard"><input type="file" accept="image/*" multiple onChange={uploadGallery} /><span>＋</span><strong>Adicionar fotos</strong><small>{project.gallery.length}/8</small></label>{project.gallery.map((url, i) => <div className="galleryItem" key={i}><img src={url} alt="Galeria" /><button onClick={() => setField('gallery', project.gallery.filter((_, x) => x !== i))}>×</button></div>)}</div></>}

    {step === 'video' && <>{heading('08 / VÍDEO', 'Vídeo quando ele realmente melhora a venda.', 'Adicione um vídeo de apresentação, processo ou resultado. Ele entra em uma seção própria e também pode assumir o fundo da capa.', 'MP4, WebM ou MOV. Até 50 MB no armazenamento final.')}<div className="stageControl"><label className={`dropZone videoDrop ${project.heroVideo ? 'hasMedia' : ''}`}><input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={uploadVideo} />{project.heroVideo ? <video src={project.heroVideo} controls playsInline /> : <><span className="uploadIcon">▶</span><strong>Enviar vídeo</strong><small>16:9 É O FORMATO IDEAL</small></>}</label>{project.heroVideo && <button className="removeMedia" onClick={() => setField('heroVideo', '')}>REMOVER VÍDEO</button>}</div></>}

    {step === 'about' && <>{heading('09 / SOBRE', 'Explique por que escolher esse negócio.', 'Uma seção curta e visual. O objetivo é transmitir padrão, cuidado e confiança sem texto demais.')}<div className="stageControl controlStack"><label className="lineInput"><span>TÍTULO DA SEÇÃO</span><input value={project.aboutTitle} onChange={e => setField('aboutTitle', e.target.value)} /></label><label className="softTextarea"><span>TEXTO</span><textarea rows={5} value={project.aboutText} onChange={e => setField('aboutText', e.target.value)} /></label><label className={`miniDrop ${project.aboutImage ? 'hasMedia' : ''}`}><input type="file" accept="image/*" onChange={e => uploadOne(e, 'aboutImage')} />{project.aboutImage ? <img src={project.aboutImage} alt="Sobre" /> : <><span>＋</span><b>Imagem da seção</b></>}</label></div></>}

    {step === 'services' && <>{heading('10 / SERVIÇOS', 'Serviços com cara de catálogo premium.', 'Título, descrição curta e preço opcional. Se não houver preço, o site mostra “Consultar”.')}<div className="stageControl repeatEditor">{project.services.map((s, i) => <div className="repeatCard" key={i}><div className="repeatNumber">{String(i + 1).padStart(2,'0')}</div><div><input className="repeatTitle" value={s.title} onChange={e => updateService(i,'title',e.target.value)} placeholder="Nome do serviço"/><textarea rows={2} value={s.description} onChange={e => updateService(i,'description',e.target.value)} placeholder="Descrição curta"/><input value={s.price} onChange={e => updateService(i,'price',e.target.value)} placeholder="Preço opcional — ex.: A partir de R$ 120"/></div><button onClick={() => setField('services', project.services.filter((_,x)=>x!==i))}>×</button></div>)}<button className="addRow" onClick={() => setField('services',[...project.services,{title:'Novo serviço',description:'',price:''}])}>＋ ADICIONAR SERVIÇO</button></div></>}

    {step === 'packages' && <>{heading('11 / PACOTES', 'Venda combinações, não só serviços.', 'Crie planos ou pacotes. Um deles pode receber destaque visual como “mais escolhido”.')}<div className="stageControl repeatEditor">{project.packages.map((p,i)=><div className="packageEditor repeatCard" key={i}><div className="repeatNumber">{String(i+1).padStart(2,'0')}</div><div><input className="repeatTitle" value={p.name} onChange={e=>updatePackage(i,'name',e.target.value)} /><textarea rows={2} value={p.description} onChange={e=>updatePackage(i,'description',e.target.value)} /><input value={p.price} onChange={e=>updatePackage(i,'price',e.target.value)} placeholder="Preço ou Sob consulta"/><label className="checkLine"><input type="checkbox" checked={p.featured} onChange={e=>updatePackage(i,'featured',e.target.checked)}/><span>Destacar este pacote</span></label></div><button onClick={()=>setField('packages',project.packages.filter((_,x)=>x!==i))}>×</button></div>)}<button className="addRow" onClick={()=>setField('packages',[...project.packages,{name:'Novo pacote',description:'',price:'Sob consulta',featured:false}])}>＋ ADICIONAR PACOTE</button></div></>}

    {step === 'before' && <>{heading('12 / ANTES E DEPOIS', 'Deixe o resultado fazer parte da venda.', 'Envie uma foto de antes e uma de depois. O VITRA mantém as duas com o mesmo enquadramento visual.')}<div className="stageControl beforeEditor"><label className={`halfDrop ${project.beforeImage?'hasMedia':''}`}><input type="file" accept="image/*" onChange={e=>uploadOne(e,'beforeImage')}/>{project.beforeImage?<img src={project.beforeImage} alt="Antes"/>:<><span>ANTES</span><b>＋ Adicionar foto</b></>}</label><label className={`halfDrop ${project.afterImage?'hasMedia':''}`}><input type="file" accept="image/*" onChange={e=>uploadOne(e,'afterImage')}/>{project.afterImage?<img src={project.afterImage} alt="Depois"/>:<><span>DEPOIS</span><b>＋ Adicionar foto</b></>}</label></div></>}

    {step === 'proof' && <>{heading('13 / PROVA SOCIAL', 'Construa confiança antes do WhatsApp.', 'Adicione diferenciais e depoimentos. O site usa essas informações em pontos estratégicos.')}<div className="stageControl controlStack"><div><span className="controlLabel">DIFERENCIAIS</span><div className="benefitGrid">{project.benefits.map((b,i)=><div key={i}><input value={b} onChange={e=>{const n=[...project.benefits];n[i]=e.target.value;setField('benefits',n)}}/><button onClick={()=>setField('benefits',project.benefits.filter((_,x)=>x!==i))}>×</button></div>)}</div><button className="addInline" onClick={()=>setField('benefits',[...project.benefits,'Novo diferencial'])}>＋ diferencial</button></div><div><span className="controlLabel">DEPOIMENTOS</span><div className="repeatEditor">{project.testimonials.map((t,i)=><div className="testimonialEditor repeatCard" key={i}><div className="repeatNumber">★</div><div><input className="repeatTitle" value={t.name} onChange={e=>updateTestimonial(i,'name',e.target.value)}/><textarea rows={3} value={t.text} onChange={e=>updateTestimonial(i,'text',e.target.value)}/><select value={t.rating} onChange={e=>updateTestimonial(i,'rating',Number(e.target.value))}>{[5,4,3].map(n=><option key={n} value={n}>{n} estrelas</option>)}</select></div><button onClick={()=>setField('testimonials',project.testimonials.filter((_,x)=>x!==i))}>×</button></div>)}</div><button className="addRow" onClick={()=>setField('testimonials',[...project.testimonials,{name:'Cliente',text:'',rating:5}])}>＋ ADICIONAR DEPOIMENTO</button></div></div></>}

    {step === 'hours' && <>{heading('14 / LOCALIZAÇÃO', 'Deixe fácil chegar e saber quando está aberto.', 'Endereço, link do mapa e horários entram em uma seção limpa, sem poluir o site.')}<div className="stageControl controlStack"><label className="lineInput"><span>ENDEREÇO</span><input value={project.address} onChange={e=>setField('address',e.target.value)} placeholder="Rua, número, bairro, cidade"/></label><label className="lineInput"><span>LINK DO GOOGLE MAPS</span><input value={project.mapLink} onChange={e=>setField('mapLink',e.target.value)} placeholder="https://maps.google.com/..."/></label><div><span className="controlLabel">HORÁRIOS</span><div className="hoursEditor">{project.hours.map((h,i)=><div key={i}><input value={h.day} onChange={e=>updateHour(i,'day',e.target.value)}/><input value={h.time} onChange={e=>updateHour(i,'time',e.target.value)}/><button onClick={()=>setField('hours',project.hours.filter((_,x)=>x!==i))}>×</button></div>)}</div><button className="addInline" onClick={()=>setField('hours',[...project.hours,{day:'Novo dia',time:'09:00 — 18:00'}])}>＋ horário</button></div></div></>}

    {step === 'contact' && <>{heading('15 / CONTATO', 'O site precisa terminar em ação.', 'Configure WhatsApp, Instagram e texto do botão. No site final, o WhatsApp será o principal ponto de conversão.')}<div className="stageControl contactGrid"><label><span>WHATSAPP</span><input value={project.whatsapp} onChange={e=>setField('whatsapp',e.target.value.replace(/\D/g,''))} placeholder="5511999999999"/></label><label><span>INSTAGRAM</span><input value={project.instagram} onChange={e=>setField('instagram',e.target.value)} placeholder="@suaempresa"/></label><label className="wide"><span>CHAMADA DO BOTÃO</span><input value={project.ctaLabel} onChange={e=>setField('ctaLabel',e.target.value)}/></label><div className="whatsappPreview"><i>◉</i><div><span>BOTÃO PRINCIPAL</span><strong>{project.ctaLabel || 'Falar no WhatsApp'}</strong></div><b>↗</b></div></div></>}

    {step === 'faq' && <>{heading('16 / FAQ', 'Tire dúvidas sem transformar o site em manual.', 'Perguntas frequentes ajudam o cliente a chegar no WhatsApp mais decidido.')}<div className="stageControl repeatEditor">{project.faq.map((f,i)=><div className="repeatCard" key={i}><div className="repeatNumber">?</div><div><input className="repeatTitle" value={f.question} onChange={e=>updateFAQ(i,'question',e.target.value)}/><textarea rows={3} value={f.answer} onChange={e=>updateFAQ(i,'answer',e.target.value)}/></div><button onClick={()=>setField('faq',project.faq.filter((_,x)=>x!==i))}>×</button></div>)}<button className="addRow" onClick={()=>setField('faq',[...project.faq,{question:'Nova pergunta',answer:''}])}>＋ ADICIONAR PERGUNTA</button></div></>}

    {step === 'seo' && <>{heading('17 / SEO', 'Prepare o site para aparecer bem no Google.', 'Título e descrição são usados nos metadados da página e também quando o link é compartilhado.')}<div className="stageControl controlStack"><label className="lineInput"><span>TÍTULO DA PÁGINA</span><input maxLength={60} value={project.seoTitle} onChange={e=>setField('seoTitle',e.target.value)}/><small>{project.seoTitle.length}/60</small></label><label className="softTextarea"><span>DESCRIÇÃO</span><textarea maxLength={160} rows={4} value={project.seoDescription} onChange={e=>setField('seoDescription',e.target.value)}/><small>{project.seoDescription.length}/160</small></label><div className="googlePreview"><small>{project.name || 'Sua empresa'}</small><strong>{project.seoTitle || project.name}</strong><span>{project.seoDescription}</span></div></div></>}

    {step === 'sections' && <>{heading('18 / ESTRUTURA', 'Escolha o que aparece e em qual ordem.', 'Ative, desative e reorganize as seções. O VITRA mantém o espaçamento e a hierarquia visual automaticamente.')}<div className="stageControl sectionManager">{(['about','services','beforeAfter','gallery','video','packages','proof','hours','faq','contact'] as SectionKey[]).map(key=>{const active=project.sections.includes(key);const index=project.sections.indexOf(key);return <div className={active?'active':''} key={key}><button className="sectionToggle" onClick={()=>toggleSection(key)}><i>{active?'✓':''}</i><span>{sectionNames[key]}</span></button><div><button disabled={!active||index===0} onClick={()=>moveSection(index,-1)}>↑</button><button disabled={!active||index===project.sections.length-1} onClick={()=>moveSection(index,1)}>↓</button></div></div>})}</div></>}

    {step === 'review' && <>{heading('19 / REVISÃO', 'O site está com cara de entrega?', 'Confira os pontos essenciais antes de levar para publicação. Você pode voltar para qualquer etapa pela barra lateral.')}<div className="stageControl reviewCard"><div className="reviewSeal">V</div><div className="reviewSummary"><span>PROJETO</span><h3>{project.name}</h3><p>{project.niche==='automotive'?'Estética automotiva':'Manicure & Nails'} • {palette.name} • {fontNames[project.fontStyle]}</p></div><div className="reviewStats"><span><b>{project.services.length}</b> serviços</span><span><b>{project.gallery.length}</b> fotos</span><span><b>{project.sections.length}</b> seções</span><span><b>{project.testimonials.length}</b> avaliações</span></div><div className="qualityChecklist"><span className={project.name?'ok':''}>✓ Marca definida</span><span className={project.headline?'ok':''}>✓ Headline definida</span><span className={project.whatsapp?'ok':''}>✓ WhatsApp configurado</span><span className={project.address?'ok':''}>✓ Localização configurada</span><span className={project.logoUrl?'ok':''}>✓ Logotipo enviado</span><span className={project.heroImage?'ok':''}>✓ Capa personalizada</span></div><button className="readyBtn" onClick={()=>setField('status','ready')}>{project.status==='ready'?'✓ PROJETO MARCADO COMO PRONTO':'MARCAR COMO PRONTO PARA PUBLICAR ↗'}</button><small className="reviewNote">O motor que cria o projeto Vercel independente será conectado na etapa de publicação.</small></div></>}
  </>;
}
