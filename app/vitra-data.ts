export type Niche = 'automotive' | 'manicure';
export type Goal = 'whatsapp' | 'booking' | 'visit' | 'portfolio';
export type Status = 'draft' | 'ready';
export type HeroFocus = 'left' | 'center' | 'right';
export type Palette = { id:string; name:string; mode:'dark'|'light'; bg:string; surface:string; text:string; muted:string; accent:string; secondary:string };
export type Service = { title:string; description:string; price:string };
export type Package = { name:string; description:string; price:string; featured:boolean };
export type Testimonial = { name:string; text:string; rating:number };
export type FAQ = { question:string; answer:string };
export type Hour = { day:string; time:string };
export type SectionKey = 'about'|'services'|'beforeAfter'|'gallery'|'video'|'packages'|'proof'|'hours'|'faq'|'contact';
export type ServicesVariant = 'cards'|'numbered'|'editorial';
export type GalleryVariant = 'masonry'|'grid'|'filmstrip';
export type ProofVariant = 'cards'|'quotes'|'spotlight';
export type TemplateId = 'carbon-motion'|'obsidian-atelier'|'precision-white'|'velocity-red'|'mono-studio'|'maison-rose'|'nude-editorial'|'gloss-glass'|'noir-beauty'|'studio-minimal';
export type FontId = 'editorial'|'modern'|'minimal'|'bold'|'luxury'|'tech';
export type Project = {
  id:string; status:Status; niche:Niche; goal:Goal; templateId:TemplateId; paletteId:string; fontId:FontId;
  heroFocus:HeroFocus; name:string; eyebrow:string; headline:string; subheadline:string; ctaLabel:string;
  whatsapp:string; instagram:string; address:string; mapLink:string; logoUrl:string; heroImage:string; heroVideo:string; gallery:string[];
  aboutTitle:string; aboutText:string; aboutImage:string; services:Service[]; packages:Package[]; beforeImage:string; afterImage:string;
  benefits:string[]; testimonials:Testimonial[]; hours:Hour[]; faq:FAQ[]; seoTitle:string; seoDescription:string; sections:SectionKey[];
  servicesVariant:ServicesVariant; galleryVariant:GalleryVariant; proofVariant:ProofVariant; createdAt:string;
};

export type TemplatePreset = {
  id:TemplateId; niche:Niche; name:string; label:string; description:string; mood:string; paletteId:string; fontId:FontId;
  hero:'full'|'split'|'center'|'offset'|'poster'; services:ServicesVariant; gallery:GalleryVariant; proof:ProofVariant;
};

export const palettes:Palette[] = [
  {id:'carbon',name:'Carbon Fire',mode:'dark',bg:'#090B0E',surface:'#13171D',text:'#F6F3ED',muted:'#9097A1',accent:'#FF5A36',secondary:'#D4D7DC'},
  {id:'midnight',name:'Midnight Cobalt',mode:'dark',bg:'#070B14',surface:'#101827',text:'#F6F8FF',muted:'#8A96A9',accent:'#4E7BFF',secondary:'#9DB8FF'},
  {id:'obsidian',name:'Obsidian Gold',mode:'dark',bg:'#0C0B09',surface:'#181510',text:'#F6F0E5',muted:'#A2988A',accent:'#C89B5B',secondary:'#E4C89D'},
  {id:'forest',name:'Forest Sage',mode:'dark',bg:'#09100D',surface:'#12201A',text:'#EEF5F1',muted:'#90A198',accent:'#79B597',secondary:'#C2D8CC'},
  {id:'ivory',name:'Ivory Ink',mode:'light',bg:'#F5F2EA',surface:'#FFFFFF',text:'#151515',muted:'#6D6A65',accent:'#151515',secondary:'#D9D1C4'},
  {id:'sand',name:'Warm Sand',mode:'light',bg:'#F2EBE1',surface:'#FBF8F3',text:'#29221C',muted:'#7D7065',accent:'#9B6847',secondary:'#D6B79D'},
  {id:'ice',name:'Ice Studio',mode:'light',bg:'#F1F5F9',surface:'#FFFFFF',text:'#14202C',muted:'#71808E',accent:'#3976A8',secondary:'#C5DBEA'},
  {id:'blush',name:'Soft Blush',mode:'light',bg:'#FAF3F4',surface:'#FFFFFF',text:'#2D2022',muted:'#8A7277',accent:'#B66F7B',secondary:'#E9CDD2'}
];

export const templates:TemplatePreset[] = [
  {id:'carbon-motion',niche:'automotive',name:'Carbon Motion',label:'CINEMATIC / DARK',description:'Tela cheia, contraste alto e presença de filme automotivo.',mood:'Performance premium',paletteId:'carbon',fontId:'modern',hero:'full',services:'numbered',gallery:'filmstrip',proof:'spotlight'},
  {id:'obsidian-atelier',niche:'automotive',name:'Obsidian Atelier',label:'LUXURY / EDITORIAL',description:'Sofisticação escura, serifas e composição de estúdio.',mood:'Luxo silencioso',paletteId:'obsidian',fontId:'luxury',hero:'split',services:'editorial',gallery:'masonry',proof:'quotes'},
  {id:'precision-white',niche:'automotive',name:'Precision White',label:'SWISS / CLEAN',description:'Clareza técnica, fundo claro e hierarquia precisa.',mood:'Precisão moderna',paletteId:'ice',fontId:'minimal',hero:'offset',services:'cards',gallery:'grid',proof:'cards'},
  {id:'velocity-red',niche:'automotive',name:'Velocity Red',label:'MOTORSPORT / BOLD',description:'Tipografia agressiva, números grandes e ritmo de performance.',mood:'Alta energia',paletteId:'carbon',fontId:'bold',hero:'poster',services:'numbered',gallery:'filmstrip',proof:'cards'},
  {id:'mono-studio',niche:'automotive',name:'Mono Studio',label:'MONO / ART DIRECTION',description:'Preto e branco, muito espaço e fotografia como protagonista.',mood:'Editorial minimalista',paletteId:'ivory',fontId:'editorial',hero:'center',services:'editorial',gallery:'masonry',proof:'quotes'},
  {id:'maison-rose',niche:'manicure',name:'Maison Rose',label:'SOFT LUXURY',description:'Elegância delicada, fotografia ampla e acabamento de boutique.',mood:'Beleza sofisticada',paletteId:'blush',fontId:'luxury',hero:'split',services:'editorial',gallery:'masonry',proof:'quotes'},
  {id:'nude-editorial',niche:'manicure',name:'Nude Editorial',label:'MAGAZINE / NUDE',description:'Composição de revista, tons quentes e tipografia refinada.',mood:'Editorial quente',paletteId:'sand',fontId:'editorial',hero:'offset',services:'cards',gallery:'masonry',proof:'spotlight'},
  {id:'gloss-glass',niche:'manicure',name:'Gloss Glass',label:'GLOSS / LAYERED',description:'Superfícies translúcidas e brilho controlado sem perder elegância.',mood:'Contemporâneo glossy',paletteId:'ice',fontId:'modern',hero:'full',services:'cards',gallery:'grid',proof:'cards'},
  {id:'noir-beauty',niche:'manicure',name:'Noir Beauty',label:'DARK / ROMANTIC',description:'Fundo profundo, destaque fotográfico e atmosfera noturna.',mood:'Beleza cinematográfica',paletteId:'obsidian',fontId:'luxury',hero:'center',services:'editorial',gallery:'filmstrip',proof:'quotes'},
  {id:'studio-minimal',niche:'manicure',name:'Studio Minimal',label:'CLEAN / MODERN',description:'Minimalismo branco, organização forte e foco no trabalho.',mood:'Clean premium',paletteId:'ivory',fontId:'minimal',hero:'poster',services:'numbered',gallery:'grid',proof:'spotlight'}
];

export const fallback = {
  automotive:{
    hero:'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1800&q=88',
    about:'https://images.unsplash.com/photo-1605559424843-9e4c228bf18c?auto=format&fit=crop&w=1400&q=85',
    gallery:[
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=84'
    ]
  },
  manicure:{
    hero:'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1800&q=88',
    about:'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1400&q=85',
    gallery:[
      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1599948128020-9a44505b0d1b?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=84'
    ]
  }
} as const;

export const sectionNames:Record<SectionKey,string> = {about:'Sobre',services:'Serviços',beforeAfter:'Antes/depois',gallery:'Galeria',video:'Vídeo',packages:'Pacotes',proof:'Avaliações',hours:'Local & horários',faq:'Perguntas',contact:'Contato'};
export const fontNames:Record<FontId,string> = {editorial:'Editorial',modern:'Modern',minimal:'Minimal',bold:'Bold',luxury:'Luxury',tech:'Tech'};

export function copyOptions(niche:Niche, goal:Goal){
  const auto = niche === 'automotive';
  if(auto){
    if(goal==='whatsapp') return [
      {name:'Impactante',headline:'Seu carro de volta ao estado que merece.',subheadline:'Detalhamento premium, proteção avançada e acabamento que muda a presença do seu carro.',cta:'Pedir orçamento'},
      {name:'Premium',headline:'Brilho é detalhe. Presença é o resultado.',subheadline:'Cuidado técnico do primeiro toque ao acabamento final, com atendimento direto pelo WhatsApp.',cta:'Falar com especialista'},
      {name:'Direta',headline:'Estética automotiva sem serviço genérico.',subheadline:'Escolha o cuidado ideal para o seu carro e receba um orçamento rápido e claro.',cta:'Solicitar orçamento'}
    ];
    if(goal==='visit') return [
      {name:'Local',headline:'O próximo nível do seu carro está aqui.',subheadline:'Conheça um estúdio preparado para cuidar de cada superfície com método, técnica e acabamento.',cta:'Ver localização'},
      {name:'Confiança',headline:'Entre com um carro. Saia com outra presença.',subheadline:'Detalhamento automotivo feito com processo, produtos profissionais e atenção real.',cta:'Agendar visita'},
      {name:'Premium',headline:'Um estúdio feito para quem repara nos detalhes.',subheadline:'Ambiente, técnica e acabamento pensados para elevar a experiência de cuidado automotivo.',cta:'Conhecer o estúdio'}
    ];
    return [
      {name:'Portfólio',headline:'Resultado que não precisa de legenda.',subheadline:'Veja detalhes, transformações e acabamentos de trabalhos feitos com padrão profissional.',cta:'Ver trabalhos'},
      {name:'Editorial',headline:'Cada reflexo conta uma história.',subheadline:'Uma seleção de projetos de estética automotiva onde técnica e acabamento aparecem em cada ângulo.',cta:'Explorar portfólio'},
      {name:'Técnica',headline:'Processo preciso. Resultado visível.',subheadline:'Conheça nosso padrão de execução em lavagem técnica, polimento, proteção e acabamento.',cta:'Ver resultados'}
    ];
  }
  if(goal==='booking') return [
    {name:'Desejo',headline:'Seu próximo horário pode mudar todo o seu visual.',subheadline:'Manicure e nail design com técnica, cuidado e acabamento pensado para durar.',cta:'Agendar horário'},
    {name:'Luxury',headline:'Detalhes pequenos. Efeito impossível de ignorar.',subheadline:'Uma experiência de beleza feita com precisão, calma e um acabamento que combina com você.',cta:'Reservar meu horário'},
    {name:'Direta',headline:'Unhas impecáveis, sem complicação.',subheadline:'Escolha seu serviço, fale direto pelo WhatsApp e garanta seu próximo horário.',cta:'Quero agendar'}
  ];
  if(goal==='portfolio') return [
    {name:'Editorial',headline:'Seu estilo começa nas pontas dos dedos.',subheadline:'Uma seleção de trabalhos criados para valorizar formatos, cores e detalhes únicos.',cta:'Ver trabalhos'},
    {name:'Artístico',headline:'Referência vira detalhe. Detalhe vira assinatura.',subheadline:'Nail art, alongamentos e acabamentos desenvolvidos com técnica e identidade.',cta:'Explorar portfólio'},
    {name:'Clean',headline:'Trabalhos que falam antes da legenda.',subheadline:'Veja resultados reais e encontre a próxima referência para o seu atendimento.',cta:'Ver galeria'}
  ];
  return [
    {name:'Boutique',headline:'Cuidado que aparece nos detalhes.',subheadline:'Um espaço pensado para você desacelerar, escolher seu estilo e sair com acabamento impecável.',cta:'Conhecer o studio'},
    {name:'Premium',headline:'Beleza com hora marcada e atenção de verdade.',subheadline:'Atendimento cuidadoso, técnica precisa e uma experiência feita para você.',cta:'Agendar visita'},
    {name:'Moderna',headline:'Seu momento. Seu estilo. Seu acabamento.',subheadline:'Manicure e nail design em um ambiente atual, confortável e feito para receber você.',cta:'Ver localização'}
  ];
}

export function defaultGoal(niche:Niche):Goal { return niche==='automotive' ? 'whatsapp' : 'booking'; }

export function createProject(niche:Niche='automotive'):Project {
  const auto=niche==='automotive';
  const goal=defaultGoal(niche);
  const copy=copyOptions(niche,goal)[0];
  const preset=templates.find(t=>t.niche===niche)!;
  return {
    id:typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,
    status:'draft',niche,goal,templateId:preset.id,paletteId:preset.paletteId,fontId:preset.fontId,heroFocus:'center',
    name:auto?'Apex Detail':'Maison Nails',eyebrow:auto?'DETAILING • PROTEÇÃO • PRESENÇA':'NAIL DESIGN • CUIDADO • ESTILO',headline:copy.headline,subheadline:copy.subheadline,ctaLabel:copy.cta,
    whatsapp:'',instagram:'',address:'',mapLink:'',logoUrl:'',heroImage:'',heroVideo:'',gallery:[],
    aboutTitle:auto?'Não é só limpeza. É presença.':'Cuidado que aparece nos detalhes.',
    aboutText:auto?'Cada etapa é pensada para recuperar brilho, proteger superfícies e entregar uma experiência de alto padrão do primeiro contato à entrega.':'Atendimento cuidadoso, técnica precisa e um ambiente pensado para você. Cada detalhe é feito para durar e combinar com o seu estilo.',
    aboutImage:'',
    services:auto?[
      {title:'Lavagem técnica',description:'Limpeza detalhada com processo seguro para pintura, rodas e acabamento.',price:''},
      {title:'Polimento técnico',description:'Correção de marcas e recuperação do brilho com acabamento refinado.',price:''},
      {title:'Vitrificação',description:'Proteção avançada com brilho profundo e maior resistência no dia a dia.',price:''},
      {title:'Higienização interna',description:'Limpeza profunda de bancos, carpetes, forros e acabamentos internos.',price:''}
    ]:[
      {title:'Manicure premium',description:'Cuidado completo, preparação e acabamento preciso.',price:''},
      {title:'Alongamento em gel',description:'Estrutura leve, resistente e com acabamento natural.',price:''},
      {title:'Blindagem',description:'Mais resistência e brilho para unhas naturais.',price:''},
      {title:'Nail art',description:'Design personalizado para transformar referências em detalhes únicos.',price:''}
    ],
    packages:auto?[
      {name:'Essencial',description:'Lavagem técnica + acabamento interno',price:'Sob consulta',featured:false},
      {name:'Signature',description:'Detalhamento completo + proteção',price:'Sob consulta',featured:true},
      {name:'Protection',description:'Correção + vitrificação premium',price:'Sob consulta',featured:false}
    ]:[
      {name:'Classic',description:'Manicure completa',price:'Sob consulta',featured:false},
      {name:'Signature',description:'Alongamento + acabamento premium',price:'Sob consulta',featured:true},
      {name:'Art',description:'Alongamento + nail art personalizada',price:'Sob consulta',featured:false}
    ],
    beforeImage:'',afterImage:'',benefits:auto?['Produtos profissionais','Processo detalhado','Atendimento com hora marcada','Acabamento premium']:['Materiais selecionados','Técnica profissional','Atendimento com hora marcada','Acabamento impecável'],
    testimonials:[
      {name:'Cliente verificado',text:auto?'O carro ficou com aparência de novo. Atendimento cuidadoso do começo ao fim.':'Atendimento impecável e resultado muito delicado. Já saí com o próximo horário marcado.',rating:5},
      {name:'Cliente verificado',text:auto?'Serviço muito acima do esperado. Explicaram cada etapa e o acabamento ficou excelente.':'Ambiente lindo, atendimento pontual e acabamento perfeito. Recomendo muito.',rating:5}
    ],
    hours:[{day:'Segunda a sexta',time:'09:00 — 18:00'},{day:'Sábado',time:'09:00 — 15:00'},{day:'Domingo',time:'Fechado'}],
    faq:[
      {question:auto?'Precisa agendar?':'Precisa marcar horário?',answer:'Sim. Trabalhamos com horário marcado para manter a qualidade e evitar espera.'},
      {question:'Como faço um orçamento?',answer:'Use o botão de contato e continue o atendimento diretamente pelo WhatsApp.'},
      {question:auto?'Quanto tempo leva o serviço?':'Quanto tempo dura o atendimento?',answer:'O tempo varia conforme o serviço escolhido. Confirmamos a estimativa antes do atendimento.'}
    ],
    seoTitle:auto?'Apex Detail | Estética Automotiva Premium':'Maison Nails | Manicure & Nail Design',
    seoDescription:auto?'Estética automotiva premium com lavagem técnica, polimento, vitrificação e higienização.':'Manicure, alongamento, blindagem e nail art com atendimento premium.',
    sections:['about','services','beforeAfter','gallery','video','packages','proof','hours','faq','contact'],
    servicesVariant:preset.services,galleryVariant:preset.gallery,proofVariant:preset.proof,createdAt:new Date().toISOString()
  };
}

export function applyTemplate(project:Project,id:TemplateId):Project {
  const preset=templates.find(t=>t.id===id)!;
  return {...project,templateId:id,paletteId:preset.paletteId,fontId:preset.fontId,servicesVariant:preset.services,galleryVariant:preset.gallery,proofVariant:preset.proof};
}

export function upgradeProject(raw:Partial<Project>):Project {
  const niche:Niche=raw.niche==='manicure'?'manicure':'automotive';
  const base=createProject(niche);
  const templateId=(raw.templateId&&templates.some(t=>t.id===raw.templateId))?raw.templateId:base.templateId;
  return {...base,...raw,templateId,goal:raw.goal||base.goal,servicesVariant:raw.servicesVariant||base.servicesVariant,galleryVariant:raw.galleryVariant||base.galleryVariant,proofVariant:raw.proofVariant||base.proofVariant};
}

export type AuditItem={key:string;label:string;ok:boolean;weight:number;step:number;hint:string};
export function auditProject(p:Project){
  const items:AuditItem[]=[
    {key:'identity',label:'Identidade da marca',ok:Boolean(p.name.trim()&&p.logoUrl),weight:10,step:3,hint:'Adicione nome e logotipo.'},
    {key:'hero',label:'Imagem principal própria',ok:Boolean(p.heroImage||p.heroVideo),weight:10,step:6,hint:'Use uma foto ou vídeo real do cliente.'},
    {key:'copy',label:'Mensagem principal objetiva',ok:p.headline.trim().length>=12&&p.subheadline.trim().length>=40,weight:10,step:4,hint:'Fortaleça título e subtítulo.'},
    {key:'whatsapp',label:'Canal de conversão',ok:/\d{10,15}/.test(p.whatsapp.replace(/\D/g,'')),weight:12,step:15,hint:'Informe um WhatsApp válido.'},
    {key:'services',label:'Serviços bem preenchidos',ok:p.services.filter(s=>s.title&&s.description).length>=3,weight:8,step:10,hint:'Mantenha pelo menos 3 serviços completos.'},
    {key:'gallery',label:'Portfólio visual',ok:p.gallery.length>=3,weight:8,step:7,hint:'Envie ao menos 3 fotos reais.'},
    {key:'about',label:'Posicionamento da empresa',ok:p.aboutTitle.trim().length>6&&p.aboutText.trim().length>70,weight:6,step:9,hint:'Complete a seção Sobre.'},
    {key:'proof',label:'Prova social',ok:p.testimonials.filter(t=>t.text.trim().length>30).length>=2,weight:7,step:13,hint:'Use ao menos 2 depoimentos específicos.'},
    {key:'location',label:'Localização e horário',ok:Boolean(p.address.trim()&&p.hours.length>=2),weight:6,step:14,hint:'Preencha endereço e horários.'},
    {key:'faq',label:'Objeções respondidas',ok:p.faq.filter(f=>f.question&&f.answer).length>=2,weight:4,step:16,hint:'Mantenha pelo menos 2 perguntas úteis.'},
    {key:'seo',label:'SEO básico',ok:p.seoTitle.length>=20&&p.seoTitle.length<=65&&p.seoDescription.length>=70&&p.seoDescription.length<=165,weight:10,step:17,hint:'Ajuste título e descrição SEO.'},
    {key:'structure',label:'Estrutura enxuta',ok:p.sections.length>=5&&p.sections.length<=10,weight:4,step:18,hint:'Mantenha entre 5 e 10 seções.'},
    {key:'media',label:'Mídia suficiente para venda',ok:Boolean((p.heroImage||p.heroVideo)&&p.gallery.length>=3),weight:5,step:7,hint:'Combine capa e galeria real.'}
  ];
  const score=items.reduce((sum,item)=>sum+(item.ok?item.weight:0),0);
  return {score,items,grade:score>=90?'Excelente':score>=75?'Muito bom':score>=60?'Bom':'Precisa de ajustes'};
}

export function safeProject(p:Project){
  const trim=(v:string)=>v.startsWith('data:')&&v.length>180000?'':v.startsWith('blob:')?'':v;
  return {...p,logoUrl:trim(p.logoUrl),heroImage:trim(p.heroImage),heroVideo:'',aboutImage:trim(p.aboutImage),beforeImage:trim(p.beforeImage),afterImage:trim(p.afterImage),gallery:p.gallery.map(trim).filter(Boolean)};
}
