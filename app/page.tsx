'use client';

import { ChangeEvent, CSSProperties, Dispatch, SetStateAction, SVGProps, useEffect, useMemo, useState } from 'react';

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
type IconName = 'home' | 'plus' | 'layers' | 'car' | 'sparkle' | 'arrowUpRight' | 'arrowLeft' | 'arrowRight' | 'check' | 'monitor' | 'phone' | 'upload' | 'image' | 'video' | 'building' | 'briefcase' | 'package' | 'compare' | 'star' | 'clock' | 'mapPin' | 'message' | 'help' | 'search' | 'layout' | 'save' | 'copy' | 'trash' | 'grip' | 'palette' | 'type' | 'eye' | 'chevronDown' | 'settings' | 'shield' | 'wand';

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
  ['base', 'Começo', 'wand'], ['logo', 'Logo', 'image'], ['brand', 'Marca', 'building'], ['copy', 'Headline', 'type'], ['visual', 'Visual', 'palette'], ['hero', 'Capa', 'image'], ['gallery', 'Galeria', 'layers'], ['video', 'Vídeo', 'video'], ['about', 'Sobre', 'building'], ['services', 'Serviços', 'briefcase'], ['packages', 'Pacotes', 'package'], ['before', 'Antes/depois', 'compare'], ['proof', 'Prova social', 'star'], ['hours', 'Local & horários', 'clock'], ['contact', 'Contato', 'message'], ['faq', 'FAQ', 'help'], ['seo', 'SEO', 'search'], ['sections', 'Seções', 'layout'], ['review', 'Revisão', 'shield']
] as const;

type StepId = typeof steps[number][0];

const iconPaths: Record<IconName, JSX.Element | JSX.Element[]> = {
  home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  car: <><path d="m5 11 1.7-4.1A3 3 0 0 1 9.5 5h5a3 3 0 0 1 2.8 1.9L19 11"/><path d="M4 11h16a2 2 0 0 1 2 2v4H2v-4a2 2 0 0 1 2-2Z"/><path d="M5 17v2"/><path d="M19 17v2"/><circle cx="6.5" cy="14" r="1"/><circle cx="17.5" cy="14" r="1"/></>,
  sparkle: <><path d="M12 2c.7 4.1 2.9 6.3 7 7-4.1.7-6.3 2.9-7 7-.7-4.1-2.9-6.3-7-7 4.1-.7 6.3-2.9 7-7Z"/><path d="M19 15c.3 2 1.4 3.1 3 3.5-1.6.4-2.7 1.5-3 3.5-.4-2-1.4-3.1-3-3.5 1.6-.4 2.6-1.5 3-3.5Z"/></>,
  arrowUpRight: <><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
  arrowLeft: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
  arrowRight: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>,
  upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
  video: <><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-2v8l-4-2"/></>,
  building: <><path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-5h6v5"/><path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></>,
  package: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></>,
  compare: <><rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/><path d="M11 8h2M11 16h2"/></>,
  star: <path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.4l6.2-.9L12 2.8Z"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  mapPin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 10h8M8 14h5"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-1.2.8-1.5 1.3-1.5 2.4"/><path d="M12 17h.01"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/></>,
  save: <><path d="M5 3h12l2 2v16H5Z"/><path d="M8 3v6h8V3"/><path d="M8 21v-7h8v7"/></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
  trash: <><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m7 7 1 14h8l1-14"/><path d="M10 11v6M14 11v6"/></>,
  grip: <><circle cx="9" cy="7" r="1"/><circle cx="15" cy="7" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 5-5c0-3-4-5-9-5Z"/><circle cx="7.5" cy="9" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="14" cy="6.5" r="1"/></>,
  type: <><path d="M4 6V4h16v2"/><path d="M9 20h6"/><path d="M12 4v16"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  shield: <><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  wand: <><path d="m4 20 9-9"/><path d="m12 4 .8 1.8L15 6.5l-2.2.7L12 9l-.8-1.8L9 6.5l2.2-.7L12 4Z"/><path d="m19 11 .6 1.4L21 13l-1.4.6L19 15l-.6-1.4L17 13l1.4-.6L19 11Z"/></>
};

function Icon({ name, size = 18, className, ...props }: { name: IconName; size?: number; className?: string } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return <svg className={`vitraIcon ${className || ''}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{iconPaths[name]}</svg>;
}

function ActionArrow() { return <span className="actionArrow"><Icon name="arrowUpRight" size={15} /></span>; }
function Stars({ count = 5 }: { count?: number }) { return <span className="stars" aria-label={`${count} estrelas`}>{Array.from({ length: count }).map((_, i) => <Icon name="star" size={13} key={i} />)}</span>; }

function createProject(niche: Niche): Project {
  const auto = niche === 'automotive';
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    status: 'draft', niche, template: 'atelier', paletteId: auto ? 'carbon' : 'blush', fontStyle: 'editorial',
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
      { question: 'Como faço um orçamento?', answer: 'Use o botão de contato e continue o atendimento diretamente pelo WhatsApp.' },
      { question: auto ? 'Quanto tempo leva o serviço?' : 'Quanto tempo dura o atendimento?', answer: 'O tempo varia conforme o serviço escolhido. Confirmamos a estimativa antes do atendimento.' }
    ],
    seoTitle: auto ? 'Apex Detail | Estética Automotiva Premium' : 'Maison Nails | Manicure & Nail Design',
    seoDescription: auto ? 'Estética automotiva premium com lavagem técnica, polimento, vitrificação e higienização.' : 'Manicure, alongamento, blindagem e nail art com atendimento premium.',
    sections: ['about', 'services', 'beforeAfter', 'gallery', 'video', 'packages', 'proof', 'hours', 'faq', 'contact'],
    createdAt: new Date().toISOString()
  };
}

const fontNames: Record<Project['fontStyle'], string> = { editorial: 'Editorial', modern: 'Modern', minimal: 'Minimal', bold: 'Bold', luxury: 'Luxury', tech: 'Tech' };
const sectionNames: Record<SectionKey, string> = { about: 'Sobre', services: 'Serviços', beforeAfter: 'Antes/depois', gallery: 'Galeria', video: 'Vídeo', packages: 'Pacotes', proof: 'Avaliações', hours: 'Local & horários', faq: 'Perguntas', contact: 'Contato' };
const sectionIcons: Record<SectionKey, IconName> = { about: 'building', services: 'briefcase', beforeAfter: 'compare', gallery: 'image', video: 'video', packages: 'package', proof: 'star', hours: 'clock', faq: 'help', contact: 'message' };

function readFile(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }); }
function safeProject(p: Project) { const trim = (v: string) => v.startsWith('data:') && v.length > 180000 ? '' : v.startsWith('blob:') ? '' : v; return { ...p, logoUrl: trim(p.logoUrl), heroImage: trim(p.heroImage), heroVideo: '', aboutImage: trim(p.aboutImage), beforeImage: trim(p.beforeImage), afterImage: trim(p.afterImage), gallery: p.gallery.map(trim).filter(Boolean) }; }

function SitePreview({ project, compact = false }: { project: Project; compact?: boolean }) {
  const palette = palettes.find(p => p.id === project.paletteId) || palettes[0];
  const fb = fallback[project.niche];
  const style = { '--site-bg': palette.bg, '--site-surface': palette.surface, '--site-text': palette.text, '--site-muted': palette.muted, '--site-accent': palette.accent, '--site-secondary': palette.secondary } as CSSProperties;
  const gallery = project.gallery.length ? project.gallery : [fb.g1, fb.g2, fb.g3];
  const hero = project.heroImage || fb.hero;
  const aboutImg = project.aboutImage || fb.about;
  const sectionSet = new Set(project.sections);

  const renderSection = (key: SectionKey) => {
    if (key === 'about') return <section className="siteAbout" id="about" key={key}><div className="sectionIndex">01 / SOBRE</div><div className="aboutCopy"><span>NOSSO PADRÃO</span><h2>{project.aboutTitle}</h2><p>{project.aboutText}</p><button>Conhecer o atendimento <ActionArrow /></button></div><div className="aboutImage"><img src={aboutImg} alt="Ambiente e trabalho"/><span>QUALIDADE EM CADA DETALHE</span></div></section>;
    if (key === 'services') return <section className="siteServices" id="services" key={key}><SectionHead index="02" title="O que fazemos." text="Serviços apresentados com clareza, hierarquia e percepção de valor."/><div className="serviceGrid">{project.services.filter(s => s.title).map((s, i) => <article className="siteService" key={i}><span>{String(i + 1).padStart(2, '0')}</span><h3>{s.title}</h3><p>{s.description}</p><div><b>{s.price || 'Consultar'}</b><ActionArrow /></div></article>)}</div></section>;
    if (key === 'beforeAfter') return (project.beforeImage || project.afterImage) ? <section className="siteBefore" key={key}><div className="galleryTitle"><span>03 / TRANSFORMAÇÃO</span><h2>Resultado sem precisar explicar.</h2></div><div className="beforeGrid"><figure>{project.beforeImage ? <img src={project.beforeImage} alt="Antes"/> : <div className="mediaPlaceholder"/>}<figcaption>ANTES</figcaption></figure><figure>{project.afterImage ? <img src={project.afterImage} alt="Depois"/> : <div className="mediaPlaceholder"/>}<figcaption>DEPOIS</figcaption></figure></div></section> : null;
    if (key === 'gallery') return <section className="siteGallery" key={key}><div className="galleryTitle"><span>04 / TRABALHOS</span><h2>Detalhes que falam por si.</h2></div><div className="galleryGrid">{gallery.slice(0, 6).map((url, i) => <img src={url} alt={`Trabalho ${i + 1}`} key={i}/>)}</div></section>;
    if (key === 'video') return project.heroVideo ? <section className="siteVideo" key={key}><video src={project.heroVideo} controls playsInline/><div><span>05 / EM MOVIMENTO</span><h2>Uma marca também se sente.</h2></div></section> : null;
    if (key === 'packages') return <section className="sitePackages" key={key}><SectionHead index="05" title="Escolha sua experiência." text="Opções bem organizadas aumentam clareza sem transformar o site numa tabela fria."/><div className="packageGrid">{project.packages.filter(p => p.name).map((p, i) => <article className={`packageCard ${p.featured ? 'featured' : ''}`} key={i}>{p.featured && <span className="packageBadge">MAIS ESCOLHIDO</span>}<small>{String(i + 1).padStart(2, '0')}</small><h3>{p.name}</h3><p>{p.description}</p><strong>{p.price || 'Sob consulta'}</strong><button>{project.ctaLabel}<ActionArrow /></button></article>)}</div></section>;
    if (key === 'proof') return <section className="siteProof" key={key}><div><span>06 / QUEM JÁ VEIO</span><h2>Confiança se constrói no resultado.</h2></div><div className="testimonialGrid">{project.testimonials.map((t, i) => <blockquote key={i}><Stars count={Math.max(1, Math.min(5, t.rating))}/><p>“{t.text}”</p><footer>{t.name}</footer></blockquote>)}</div></section>;
    if (key === 'hours') return <section className="siteLocation" key={key}><div className="locationCopy"><span>07 / VISITE</span><h2>Seu próximo atendimento começa aqui.</h2><p>{project.address || 'Adicione o endereço para apresentar a localização do negócio.'}</p>{project.mapLink && <a href={project.mapLink} target="_blank" rel="noreferrer">Abrir mapa <ActionArrow /></a>}</div><div className="hoursList">{project.hours.map((h, i) => <div key={i}><span>{h.day}</span><b>{h.time}</b></div>)}</div></section>;
    if (key === 'faq') return <section className="siteFaq" key={key}><div className="faqIntro"><span>08 / DÚVIDAS</span><h2>Antes de chamar, talvez esteja aqui.</h2></div><div className="faqList">{project.faq.map((f, i) => <details key={i} open={i === 0}><summary>{f.question}<Icon name="chevronDown" size={15}/></summary><p>{f.answer}</p></details>)}</div></section>;
    if (key === 'contact') return <section className="siteClosing" id="contact" key={key}><span>PRONTO PARA COMEÇAR?</span><h2>{project.name}</h2><p>Atendimento direto, simples e rápido.</p><button>{project.ctaLabel}<ActionArrow /></button><div className="closingMeta">{project.instagram && <small>{project.instagram}</small>}{project.address && <small>{project.address}</small>}</div></section>;
    return null;
  };

  return <article className={`siteCanvas ${palette.mode} template-${project.template} font-${project.fontStyle} ${compact ? 'compact' : ''}`} style={style}>
    <header className="siteHeader"><div className="siteBrand">{project.logoUrl ? <img src={project.logoUrl} alt="Logo"/> : <span className="siteMonogram">{project.name.slice(0, 1) || 'V'}</span>}<b>{project.name || 'Sua marca'}</b></div><nav><a href="#services">Serviços</a><a href="#about">Sobre</a><a href="#contact">Contato</a></nav><button>WhatsApp <ActionArrow /></button></header>
    <section className="siteHero" style={{ backgroundImage: `url(${hero})` }}>{project.heroVideo && <video src={project.heroVideo} autoPlay muted loop playsInline/>}<div className="siteHeroShade"/><div className="siteHeroCopy"><span>{project.eyebrow}</span><h1>{project.headline || 'Sua headline principal'}</h1><p>{project.subheadline}</p><div><button className="sitePrimary">{project.ctaLabel || 'Falar agora'}<ActionArrow /></button><small>Atendimento personalizado</small></div></div><div className="siteHeroStamp"><i>01</i><span>EXPERIÊNCIA<br/>PREMIUM</span></div></section>
    <div className="trustStrip">{project.benefits.filter(Boolean).slice(0, 4).map((benefit, i) => <span key={i}><Icon name="check" size={13}/>{benefit}</span>)}</div>
    {project.sections.filter(key => sectionSet.has(key)).map(renderSection)}
  </article>;
}

function SectionHead({ index, title, text }: { index: string; title: string; text: string }) { return <div className="sectionHead"><div><span>{index} / SERVIÇO</span><h2>{title}</h2></div><p>{text}</p></div>; }

function UploadBox({ value, label, hint, accept = 'image/*', onChange, onRemove, icon = 'upload' }: { value?: string; label: string; hint: string; accept?: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; onRemove?: () => void; icon?: IconName }) {
  return <div><label className={`dropZone ${value ? 'hasMedia' : ''}`}><input type="file" accept={accept} onChange={onChange}/>{value ? (accept.startsWith('video') ? <video src={value} muted playsInline/> : <img src={value} alt={label}/>) : <><span className="uploadIcon"><Icon name={icon} size={21}/></span><strong>{label}</strong><small>{hint}</small></>}</label>{value && onRemove && <button className="removeMedia" onClick={onRemove}><Icon name="trash" size={14}/> Remover mídia</button>}</div>;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project>(() => createProject('automotive'));
  const [view, setView] = useState<'dashboard' | 'builder'>('dashboard');
  const [step, setStep] = useState(0);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [notice, setNotice] = useState('');

  useEffect(() => { try { const raw = localStorage.getItem('vitra-test-projects-v2'); if (raw) setProjects(JSON.parse(raw)); } catch {} }, []);
  const palette = useMemo(() => palettes.find(p => p.id === project.paletteId) || palettes[0], [project.paletteId]);
  const current = steps[step];
  const currentId = current[0] as StepId;
  const progress = ((step + 1) / steps.length) * 100;

  function setField<K extends keyof Project>(key: K, value: Project[K]) { setProject(prev => ({ ...prev, [key]: value })); }
  function persist(list: Project[]) { setProjects(list); try { localStorage.setItem('vitra-test-projects-v2', JSON.stringify(list.map(safeProject))); } catch {} }
  function save(nextProject = project) { const exists = projects.some(p => p.id === nextProject.id); const next = exists ? projects.map(p => p.id === nextProject.id ? nextProject : p) : [nextProject, ...projects]; persist(next); setNotice('Versão salva neste navegador.'); window.setTimeout(() => setNotice(''), 1800); }
  function start(niche: Niche) { setProject(createProject(niche)); setStep(0); setView('builder'); setNotice(''); window.scrollTo(0, 0); }
  function edit(item: Project) { setProject(item); setStep(0); setView('builder'); setNotice(''); }
  function duplicate() { const clone = { ...project, id: crypto.randomUUID(), name: `${project.name} — cópia`, status: 'draft' as Status, createdAt: new Date().toISOString() }; setProject(clone); persist([clone, ...projects]); setNotice('Projeto duplicado.'); }
  function next() { if (step < steps.length - 1) setStep(step + 1); }
  function back() { if (step > 0) setStep(step - 1); }
  function finish() { const ready = { ...project, status: 'ready' as Status }; setProject(ready); save(ready); setNotice('Projeto pronto para publicação.'); }
  async function uploadOne(e: ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'heroImage' | 'aboutImage' | 'beforeImage' | 'afterImage') { const file = e.target.files?.[0]; if (!file) return; setField(key, await readFile(file)); e.target.value = ''; }
  async function uploadGallery(e: ChangeEvent<HTMLInputElement>) { const files = Array.from(e.target.files || []).slice(0, 8 - project.gallery.length); if (!files.length) return; const items = await Promise.all(files.map(readFile)); setField('gallery', [...project.gallery, ...items].slice(0, 8)); e.target.value = ''; }
  function uploadVideo(e: ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (!file) return; if (project.heroVideo.startsWith('blob:')) URL.revokeObjectURL(project.heroVideo); setField('heroVideo', URL.createObjectURL(file)); e.target.value = ''; }
  function toggleSection(key: SectionKey) { setField('sections', project.sections.includes(key) ? project.sections.filter(s => s !== key) : [...project.sections, key]); }
  function moveSection(index: number, dir: -1 | 1) { const nextSections = [...project.sections]; const target = index + dir; if (target < 0 || target >= nextSections.length) return; [nextSections[index], nextSections[target]] = [nextSections[target], nextSections[index]]; setField('sections', nextSections); }

  if (view === 'dashboard') return <main className="studioShell">
    <aside className="rail"><button className="railLogo" aria-label="Vitra">V</button><div className="railNav"><button className="active"><Icon name="home"/><small>Início</small></button><button onClick={() => start('automotive')}><Icon name="plus"/><small>Criar</small></button><button><Icon name="layers"/><small>Modelos</small></button></div><div className="testMode">TEST</div></aside>
    <section className="dashboard">
      <header className="topbar"><div className="topbarBrand"><span className="tinyLabel">VITRA / SITE STUDIO</span><h1>Fábrica de sites premium.</h1></div><button className="newProjectBtn" onClick={() => start('automotive')}><Icon name="plus" size={15}/> Novo site</button></header>
      <section className="dashboardHero"><div className="dashGlow"/><div className="dashHeroCopy"><span className="kicker">MODO ESTÚDIO • ACESSO LIVRE</span><h2>Sites que parecem feitos por uma <em>agência.</em></h2><p>Identidade, tipografia, mídia, prova social e conversão organizadas por um sistema visual consistente do primeiro ao último pixel.</p><button className="heroCreateBtn" onClick={() => start('automotive')}>Começar um site <ActionArrow /></button><div className="dashBadges"><span>19 etapas guiadas</span><span>8 paletas</span><span>6 tipografias</span><span>Sistema vetorial próprio</span></div></div><div className="heroDevice"><div className="heroBrowser"><i/><i/><i/><span>preview.vitra</span></div><SitePreview project={createProject('automotive')} compact/></div></section>
      <section className="metricStrip"><div><span>PROJETOS</span><strong>{String(projects.length).padStart(2, '0')}</strong></div><div><span>NICHOS</span><strong>02</strong></div><div><span>PALETAS</span><strong>08</strong></div><div><span>ETAPAS</span><strong>19</strong></div></section>
      <section className="sectionBlock"><div className="blockTitle"><div><span className="tinyLabel">COMEÇAR</span><h3>Escolha o nicho.</h3></div><span className="indexTag">01 / BASE</span></div><div className="nicheGrid"><button className="nicheCard autoCard" onClick={() => start('automotive')}><div className="cardImage"><span>ESTÉTICA<br/>AUTOMOTIVA</span></div><div className="nicheMeta"><span>PREMIUM / PERFORMANCE</span><b>Criar site <ActionArrow /></b></div></button><button className="nicheCard nailsCard" onClick={() => start('manicure')}><div className="cardImage"><span>MANICURE<br/>& NAILS</span></div><div className="nicheMeta"><span>EDITORIAL / SOFT LUXURY</span><b>Criar site <ActionArrow /></b></div></button></div></section>
      <section className="sectionBlock projectsBlock"><div className="blockTitle"><div><span className="tinyLabel">SEUS TESTES</span><h3>Projetos recentes.</h3></div><span className="indexTag">02 / PROJETOS</span></div>{projects.length === 0 ? <div className="emptyProjects"><span className="emptyMark"><Icon name="wand" size={24}/></span><h4>Pronto para o primeiro.</h4><p>Crie um site completo e salve a versão de teste neste navegador.</p><button onClick={() => start('automotive')}>Criar primeiro site <ActionArrow /></button></div> : <div className="projectGrid">{projects.map(item => <button className="projectCard" key={item.id} onClick={() => edit(item)}><div className="projectThumb" style={{ backgroundImage: `linear-gradient(180deg,transparent,rgba(0,0,0,.82)),url(${item.heroImage || fallback[item.niche].hero})` }}><span className={`statusDot ${item.status}`}/><strong>{item.name}</strong></div><div className="projectInfo"><div><span>{item.niche === 'automotive' ? 'ESTÉTICA' : 'MANICURE'}</span><b>{item.status === 'ready' ? 'PRONTO' : 'RASCUNHO'}</b></div><ActionArrow /></div></button>)}</div>}</section>
    </section>
  </main>;

  const optional = !['base', 'brand', 'copy', 'visual', 'review'].includes(currentId);
  return <main className="wizardShell">
    <header className="wizardTopbar"><button className="wizardBrand" onClick={() => setView('dashboard')}><span>V</span><b>VITRA</b></button><div className="wizardProjectName"><small>PROJETO EM CRIAÇÃO</small><strong>{project.name || 'Novo site'}</strong></div><div className="wizardTopActions"><span className="saveNotice">{notice}</span><button className="ghostBtn" onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}><Icon name={previewMode === 'desktop' ? 'phone' : 'monitor'} size={15}/><span>{previewMode === 'desktop' ? 'Mobile' : 'Desktop'}</span></button><button className="saveBtn" onClick={() => save()}><Icon name="save" size={14}/> Salvar teste</button></div></header>
    <div className="wizardProgress"><i style={{ width: `${progress}%` }}/></div>
    <div className="wizardLayout">
      <aside className="stepRail"><span className="stepRailLabel">ETAPAS</span><div className="stepDots">{steps.map((s, i) => <button key={s[0]} className={`${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} onClick={() => setStep(i)}><span>{i < step ? <Icon name="check" size={13}/> : <Icon name={s[2] as IconName} size={14}/>}</span><small>{s[1]}</small></button>)}</div></aside>
      <section className="wizardStage"><div className="stageContent"><Stage step={currentId} project={project} palette={palette} setField={setField} uploadOne={uploadOne} uploadGallery={uploadGallery} uploadVideo={uploadVideo} toggleSection={toggleSection} moveSection={moveSection} setProject={setProject}/><footer className="stageFooter"><button className="backStep" onClick={back} disabled={step === 0}><Icon name="arrowLeft" size={14}/> Voltar</button><div>{optional && step < steps.length - 1 && <button className="skipStep" onClick={next}>Pular</button>}<span>{String(step + 1).padStart(2, '0')} / {steps.length}</span>{step < steps.length - 1 ? <button className="nextStep" onClick={next}>Continuar <Icon name="arrowRight" size={15}/></button> : <button className="nextStep finish" onClick={finish}>Finalizar <Icon name="check" size={15}/></button>}</div></footer></div></section>
      <aside className={`livePreviewPanel ${previewMode}`}><div className="previewPanelTop"><div><i/><i/><i/></div><span>PREVIEW AO VIVO</span><b><Icon name={previewMode === 'desktop' ? 'monitor' : 'phone'} size={13}/>{previewMode.toUpperCase()}</b></div><div className="previewViewport"><div className="previewFrame"><SitePreview project={project}/></div></div></aside>
    </div>
  </main>;
}

type StageProps = {
  step: StepId; project: Project; palette: Palette;
  setField: <K extends keyof Project>(key: K, value: Project[K]) => void;
  uploadOne: (e: ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'heroImage' | 'aboutImage' | 'beforeImage' | 'afterImage') => void;
  uploadGallery: (e: ChangeEvent<HTMLInputElement>) => void;
  uploadVideo: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleSection: (key: SectionKey) => void;
  moveSection: (index: number, dir: -1 | 1) => void;
  setProject: Dispatch<SetStateAction<Project>>;
};

function Stage({ step, project, palette, setField, uploadOne, uploadGallery, uploadVideo, toggleSection, moveSection, setProject }: StageProps) {
  const heading = (index: string, title: string, text: string, note?: string) => <div className="stageHeading"><span>{index}</span><h1>{title}</h1><p>{text}</p>{note && <small>{note}</small>}</div>;
  const updateService = (i: number, key: keyof Service, value: string) => { const next = [...project.services]; next[i] = { ...next[i], [key]: value }; setField('services', next); };
  const updatePackage = (i: number, key: keyof Package, value: string | boolean) => { const next = [...project.packages]; next[i] = { ...next[i], [key]: value }; setField('packages', next); };
  const updateTestimonial = (i: number, key: keyof Testimonial, value: string | number) => { const next = [...project.testimonials]; next[i] = { ...next[i], [key]: value }; setField('testimonials', next); };
  const updateFAQ = (i: number, key: keyof FAQ, value: string) => { const next = [...project.faq]; next[i] = { ...next[i], [key]: value }; setField('faq', next); };
  const updateHour = (i: number, key: keyof Hour, value: string) => { const next = [...project.hours]; next[i] = { ...next[i], [key]: value }; setField('hours', next); };

  return <>
    {step === 'base' && <>{heading('01 / BASE', 'Que tipo de negócio vamos transformar?', 'O nicho define a estrutura inicial, textos sugeridos, serviços e composição visual. Tudo continua editável depois.')}<div className="stageControl nicheChoice"><button className={project.niche === 'automotive' ? 'active' : ''} onClick={() => setProject(createProject('automotive'))}><span className="nicheVector"><Icon name="car" size={25}/></span><div><strong>Estética automotiva</strong><small>Detalhamento, polimento, vitrificação e proteção</small></div><ActionArrow /></button><button className={project.niche === 'manicure' ? 'active' : ''} onClick={() => setProject(createProject('manicure'))}><span className="nicheVector"><Icon name="sparkle" size={25}/></span><div><strong>Manicure & Nails</strong><small>Manicure, alongamento, gel e nail art</small></div><ActionArrow /></button></div></>}
    {step === 'logo' && <>{heading('02 / IDENTIDADE', 'Comece pelo logotipo.', 'Envie a marca do cliente. O VITRA preserva a proporção e nunca estica ou deforma o arquivo.', 'PNG ou WebP transparente é o ideal.')}<div className="stageControl"><UploadBox value={project.logoUrl} label="Enviar logotipo" hint="PNG, WEBP OU JPG" onChange={e => uploadOne(e, 'logoUrl')} onRemove={() => setField('logoUrl', '')} icon="image"/></div></>}
    {step === 'brand' && <>{heading('03 / MARCA', 'Dê nome e personalidade.', 'Nome, assinatura curta e texto do botão formam a base verbal que aparece em todo o site.')}<div className="stageControl controlStack"><BigInput label="NOME DA MARCA" value={project.name} onChange={v => setField('name', v)} placeholder="Ex. Apex Detail"/><BigInput label="ASSINATURA CURTA" value={project.eyebrow} onChange={v => setField('eyebrow', v)} placeholder="DETALHAMENTO • PROTEÇÃO • PRESENÇA"/><BigInput label="BOTÃO PRINCIPAL" value={project.ctaLabel} onChange={v => setField('ctaLabel', v)} placeholder="Solicitar orçamento"/></div></>}
    {step === 'copy' && <>{heading('04 / MENSAGEM', 'A primeira tela precisa vender sem parecer propaganda.', 'Use uma headline curta, específica e forte. O subtítulo explica valor sem poluir o design.')}<div className="stageControl controlStack"><BigArea label="TÍTULO PRINCIPAL" value={project.headline} onChange={v => setField('headline', v)} max={74}/><BigArea label="SUBTÍTULO" value={project.subheadline} onChange={v => setField('subheadline', v)} max={180}/></div></>}
    {step === 'visual' && <>{heading('05 / DIREÇÃO VISUAL', 'Escolha uma linguagem visual completa.', 'Paleta, tipografia e composição trabalham juntas. Todas as opções foram montadas para manter contraste e hierarquia profissionais.')}<div className="stageControl visualStudio"><span className="controlLabel">PALETAS CURADAS</span><div className="paletteGrid">{palettes.map(p => <button key={p.id} className={project.paletteId === p.id ? 'active' : ''} onClick={() => setField('paletteId', p.id)}><div className="paletteSwatches"><i style={{ background: p.bg }}/><i style={{ background: p.surface }}/><i style={{ background: p.accent }}/><i style={{ background: p.secondary }}/></div><strong>{p.name}</strong><small>{p.mode === 'dark' ? 'DARK' : 'LIGHT'}</small>{project.paletteId === p.id && <span><Icon name="check" size={13}/></span>}</button>)}</div><span className="controlLabel">TIPOGRAFIA</span><div className="fontGrid">{Object.entries(fontNames).map(([key, label]) => <button key={key} className={`${project.fontStyle === key ? 'active' : ''} font-${key}`} onClick={() => setField('fontStyle', key as Project['fontStyle'])}><span>Aa</span><strong>{label}</strong></button>)}</div><span className="controlLabel">COMPOSIÇÃO</span><div className="templateGrid">{(['atelier','cinema','grid','minimal'] as const).map(t => <button key={t} className={project.template === t ? 'active' : ''} onClick={() => setField('template', t)}><span className={`templateSketch ${t}`}><i/><i/><i/></span><b>{t}</b></button>)}</div><div className="paletteInfo"><span style={{ background: palette.accent }}/><div><strong>{palette.name}</strong><small>Contraste e combinação já calibrados</small></div></div></div></>}
    {step === 'hero' && <>{heading('06 / CAPA', 'Escolha a imagem que segura a primeira impressão.', 'O enquadramento usa cover responsivo, preservando proporção no desktop e no celular.')}<div className="stageControl"><UploadBox value={project.heroImage} label="Enviar foto de capa" hint="RECOMENDADO: 1600 × 1000 OU MAIOR" onChange={e => uploadOne(e, 'heroImage')} onRemove={() => setField('heroImage', '')} icon="image"/></div></>}
    {step === 'gallery' && <>{heading('07 / GALERIA', 'Mostre trabalho real sem bagunçar o layout.', 'Você envia as fotos e o VITRA distribui automaticamente em uma composição editorial responsiva.')}<div className="stageControl"><div className="galleryEditor"><label className="addMediaCard"><input type="file" multiple accept="image/*" onChange={uploadGallery}/><Icon name="plus" size={22}/><strong>Adicionar fotos</strong><small>ATÉ 8 IMAGENS</small></label>{project.gallery.map((url, i) => <figure className="galleryItem" key={i}><img src={url} alt={`Galeria ${i + 1}`}/><button onClick={() => setField('gallery', project.gallery.filter((_, x) => x !== i))} aria-label="Remover imagem"><Icon name="trash" size={14}/></button></figure>)}</div></div></>}
    {step === 'video' && <>{heading('08 / VÍDEO', 'Movimento quando ele realmente agrega.', 'Vídeo é opcional. Quando usado, entra numa seção própria e nunca invade ou deforma outras áreas.')}<div className="stageControl"><UploadBox value={project.heroVideo} label="Adicionar vídeo" hint="MP4, WEBM OU MOV" accept="video/*" onChange={uploadVideo} onRemove={() => setField('heroVideo', '')} icon="video"/></div></>}
    {step === 'about' && <>{heading('09 / SOBRE', 'Construa percepção de valor.', 'Esta seção combina texto e imagem para explicar processo, atendimento e posicionamento da empresa.')}<div className="stageControl controlStack"><BigInput label="TÍTULO" value={project.aboutTitle} onChange={v => setField('aboutTitle', v)}/><BigArea label="TEXTO" value={project.aboutText} onChange={v => setField('aboutText', v)} max={320}/><UploadBox value={project.aboutImage} label="Imagem da seção" hint="AMBIENTE, EQUIPE OU DETALHE" onChange={e => uploadOne(e, 'aboutImage')} onRemove={() => setField('aboutImage', '')}/></div></>}
    {step === 'services' && <>{heading('10 / SERVIÇOS', 'Venda valor antes de preço.', 'Cada serviço recebe nome, descrição e preço opcional. O layout mantém todos com a mesma hierarquia.')}<div className="stageControl repeater">{project.services.map((s, i) => <article className="repeaterCard" key={i}><div className="repeaterTop"><span>{String(i + 1).padStart(2,'0')}</span><button onClick={() => setField('services', project.services.filter((_,x) => x !== i))}><Icon name="trash" size={14}/></button></div><input value={s.title} onChange={e => updateService(i,'title',e.target.value)} placeholder="Nome do serviço"/><textarea value={s.description} onChange={e => updateService(i,'description',e.target.value)} placeholder="Descrição curta" rows={2}/><input value={s.price} onChange={e => updateService(i,'price',e.target.value)} placeholder="Preço opcional"/></article>)}<button className="addRowBtn" onClick={() => setField('services',[...project.services,{title:'Novo serviço',description:'',price:''}])}><Icon name="plus" size={15}/> Adicionar serviço</button></div></>}
    {step === 'packages' && <>{heading('11 / PACOTES', 'Crie uma oferta fácil de comparar.', 'Pacotes são opcionais. Destaque apenas uma opção para conduzir a escolha sem pressionar o visitante.')}<div className="stageControl repeater">{project.packages.map((p, i) => <article className={`repeaterCard ${p.featured ? 'selectedCard' : ''}`} key={i}><div className="repeaterTop"><span>PACOTE {String(i + 1).padStart(2,'0')}</span><label className="featureToggle"><input type="checkbox" checked={p.featured} onChange={e => updatePackage(i,'featured',e.target.checked)}/><i/><b>Destacar</b></label></div><input value={p.name} onChange={e => updatePackage(i,'name',e.target.value)} placeholder="Nome"/><textarea value={p.description} onChange={e => updatePackage(i,'description',e.target.value)} rows={2}/><input value={p.price} onChange={e => updatePackage(i,'price',e.target.value)} placeholder="Preço ou Sob consulta"/></article>)}<button className="addRowBtn" onClick={() => setField('packages',[...project.packages,{name:'Novo pacote',description:'',price:'Sob consulta',featured:false}])}><Icon name="plus" size={15}/> Adicionar pacote</button></div></>}
    {step === 'before' && <>{heading('12 / ANTES E DEPOIS', 'Transformação visual com proporção correta.', 'As duas imagens ocupam áreas equivalentes para tornar a comparação limpa e convincente.')}<div className="stageControl beforeEditor"><UploadBox value={project.beforeImage} label="Antes" hint="FOTO ORIGINAL" onChange={e => uploadOne(e,'beforeImage')} onRemove={() => setField('beforeImage','')}/><UploadBox value={project.afterImage} label="Depois" hint="RESULTADO FINAL" onChange={e => uploadOne(e,'afterImage')} onRemove={() => setField('afterImage','')}/></div></>}
    {step === 'proof' && <>{heading('13 / PROVA SOCIAL', 'Deixe outras pessoas venderem por você.', 'Depoimentos curtos e específicos passam mais credibilidade do que textos genéricos.')}<div className="stageControl repeater">{project.testimonials.map((t,i) => <article className="repeaterCard" key={i}><div className="ratingRow"><Stars count={t.rating}/><select value={t.rating} onChange={e => updateTestimonial(i,'rating',Number(e.target.value))}>{[5,4,3].map(n => <option key={n} value={n}>{n} estrelas</option>)}</select></div><input value={t.name} onChange={e => updateTestimonial(i,'name',e.target.value)} placeholder="Nome"/><textarea value={t.text} onChange={e => updateTestimonial(i,'text',e.target.value)} rows={3}/></article>)}<button className="addRowBtn" onClick={() => setField('testimonials',[...project.testimonials,{name:'Cliente',text:'',rating:5}])}><Icon name="plus" size={15}/> Adicionar avaliação</button></div></>}
    {step === 'hours' && <>{heading('14 / LOCAL E HORÁRIOS', 'Transforme visita em decisão.', 'Endereço, mapa e funcionamento aparecem juntos para eliminar dúvidas antes do contato.')}<div className="stageControl controlStack"><BigInput label="ENDEREÇO" value={project.address} onChange={v => setField('address',v)} placeholder="Rua, número, bairro, cidade"/><BigInput label="LINK DO GOOGLE MAPS" value={project.mapLink} onChange={v => setField('mapLink',v)} placeholder="https://maps.google.com/..."/><div className="hoursEditor">{project.hours.map((h,i) => <div key={i}><input value={h.day} onChange={e => updateHour(i,'day',e.target.value)}/><input value={h.time} onChange={e => updateHour(i,'time',e.target.value)}/></div>)}</div></div></>}
    {step === 'contact' && <>{heading('15 / CONTATO', 'Deixe o caminho para o contato óbvio.', 'Sem formulários desnecessários: WhatsApp e Instagram entram como ações diretas e coerentes com o site.')}<div className="stageControl controlStack"><BigInput label="WHATSAPP" value={project.whatsapp} onChange={v => setField('whatsapp',v)} placeholder="5511999999999"/><BigInput label="INSTAGRAM" value={project.instagram} onChange={v => setField('instagram',v)} placeholder="@empresa"/></div></>}
    {step === 'faq' && <>{heading('16 / FAQ', 'Remova objeções antes da conversa.', 'As perguntas ficam em acordeão para manter a página limpa e dar contexto apenas quando o visitante pedir.')}<div className="stageControl repeater">{project.faq.map((f,i) => <article className="repeaterCard" key={i}><input value={f.question} onChange={e => updateFAQ(i,'question',e.target.value)} placeholder="Pergunta"/><textarea value={f.answer} onChange={e => updateFAQ(i,'answer',e.target.value)} rows={3} placeholder="Resposta"/></article>)}<button className="addRowBtn" onClick={() => setField('faq',[...project.faq,{question:'Nova pergunta',answer:''}])}><Icon name="plus" size={15}/> Adicionar pergunta</button></div></>}
    {step === 'seo' && <>{heading('17 / SEO', 'Prepare o site para ser encontrado.', 'Título e descrição são usados na apresentação do site em buscadores e compartilhamentos.')}<div className="stageControl controlStack"><BigInput label="TÍTULO SEO" value={project.seoTitle} onChange={v => setField('seoTitle',v)}/><BigArea label="DESCRIÇÃO SEO" value={project.seoDescription} onChange={v => setField('seoDescription',v)} max={160}/></div></>}
    {step === 'sections' && <>{heading('18 / ESTRUTURA', 'Decida o que entra e em que ordem.', 'Ative somente o que ajuda o cliente. Você também pode mover as seções para construir uma narrativa diferente.')}<div className="stageControl sectionManager">{(Object.keys(sectionNames) as SectionKey[]).map(key => { const active = project.sections.includes(key); const index = project.sections.indexOf(key); return <div className={active ? 'active' : ''} key={key}><span className="sectionGlyph"><Icon name={sectionIcons[key]} size={16}/></span><b>{sectionNames[key]}</b><button className="visibilityBtn" onClick={() => toggleSection(key)}><Icon name={active ? 'eye' : 'plus'} size={15}/><span>{active ? 'Ativa' : 'Adicionar'}</span></button>{active && <span className="orderActions"><button onClick={() => moveSection(index,-1)} disabled={index === 0}><Icon name="arrowLeft" size={13}/></button><button onClick={() => moveSection(index,1)} disabled={index === project.sections.length - 1}><Icon name="arrowRight" size={13}/></button></span>}<Icon name="grip" size={15} className="gripIcon"/></div>})}</div></>}
    {step === 'review' && <>{heading('19 / REVISÃO', 'O site está pronto para uma última inspeção.', 'Confira identidade, mídia, textos e estrutura. Finalizar marca o projeto como pronto para o motor de publicação.')}<div className="stageControl reviewCard"><div className="reviewSeal"><Icon name="shield" size={23}/></div><span>CHECKLIST VITRA</span><h3>{project.name}</h3><p>{project.headline}</p><div className="reviewStats"><div><small>SEÇÕES</small><b>{project.sections.length}</b></div><div><small>SERVIÇOS</small><b>{project.services.length}</b></div><div><small>MÍDIAS</small><b>{project.gallery.length + [project.logoUrl,project.heroImage,project.aboutImage,project.heroVideo].filter(Boolean).length}</b></div></div><ul><li><Icon name="check" size={14}/> Layout responsivo</li><li><Icon name="check" size={14}/> Imagens sem deformação</li><li><Icon name="check" size={14}/> Contraste de paleta calibrado</li><li><Icon name="check" size={14}/> Hierarquia tipográfica consistente</li></ul></div></>}
  </>;
}

function BigInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="bigInput"><span>{label}</span><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/></label>; }
function BigArea({ label, value, onChange, max }: { label: string; value: string; onChange: (value: string) => void; max: number }) { return <label className="bigTextarea"><span>{label}</span><textarea value={value} onChange={e => onChange(e.target.value.slice(0,max))} rows={4}/><small>{value.length}/{max}</small></label>; }
