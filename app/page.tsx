'use client';

import { ChangeEvent, CSSProperties, FormEvent, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';

type Niche = 'automotive' | 'manicure';
type Theme = 'dark' | 'light';
type Status = 'draft' | 'ready' | 'published';

type Project = {
  id?: string;
  user_id?: string;
  name: string;
  slug: string;
  niche: Niche;
  template: string;
  status: Status;
  theme: Theme;
  accent: string;
  font_style: string;
  whatsapp: string;
  instagram: string;
  address: string;
  headline: string;
  subheadline: string;
  cta_label: string;
  hero_image: string;
  logo_url: string;
  services: string[];
  gallery: string[];
  settings: Record<string, unknown>;
  custom_domain?: string | null;
  vercel_url?: string | null;
  updated_at?: string;
};

type MediaKind = 'hero' | 'logo' | 'gallery' | 'video';

type WizardStep = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  optional?: boolean;
};

const automotiveServices = ['Lavagem detalhada', 'Polimento técnico', 'Vitrificação', 'Higienização interna'];
const manicureServices = ['Manicure', 'Pedicure', 'Alongamento em gel', 'Nail art'];

const fallbackImages: Record<Niche, string> = {
  automotive: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1800&q=88',
  manicure: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1800&q=88'
};

const wizardSteps: WizardStep[] = [
  { id: 'logo', eyebrow: '01 / IDENTIDADE', title: 'Comece pelo logotipo.', description: 'Envie a marca do cliente. PNG ou WebP com fundo transparente funciona melhor.', optional: true },
  { id: 'name', eyebrow: '02 / MARCA', title: 'Qual é o nome do negócio?', description: 'Esse nome aparece no cabeçalho, rodapé e título visual do site.' },
  { id: 'headline', eyebrow: '03 / PRIMEIRA IMPRESSÃO', title: 'Escreva a frase principal.', description: 'Uma frase curta, forte e clara para explicar por que esse negócio merece atenção.' },
  { id: 'subheadline', eyebrow: '04 / POSICIONAMENTO', title: 'Agora o subtítulo.', description: 'Explique em uma ou duas frases o que a empresa entrega e para quem.' },
  { id: 'style', eyebrow: '05 / DIREÇÃO VISUAL', title: 'Escolha a personalidade.', description: 'O VITRA aplica cores, contraste e estilo visual sem você mexer em código.' },
  { id: 'hero', eyebrow: '06 / CAPA', title: 'Escolha a imagem principal.', description: 'A imagem é recortada automaticamente para desktop e celular sem deformar.' },
  { id: 'gallery', eyebrow: '07 / PORTFÓLIO', title: 'Mostre o trabalho.', description: 'Adicione fotos de resultado, ambiente, antes e depois ou detalhes.', optional: true },
  { id: 'video', eyebrow: '08 / MOVIMENTO', title: 'Tem um vídeo?', description: 'Adicione um vídeo curto de apresentação. O site dimensiona e encaixa automaticamente.', optional: true },
  { id: 'services', eyebrow: '09 / OFERTA', title: 'O que esse negócio vende?', description: 'Liste os principais serviços. A ordem daqui será a ordem no site.' },
  { id: 'contact', eyebrow: '10 / CONVERSÃO', title: 'Como o cliente entra em contato?', description: 'WhatsApp, Instagram, endereço e o texto do botão principal.' },
  { id: 'review', eyebrow: '11 / REVISÃO', title: 'Está com cara de site caro.', description: 'Revise tudo no preview e salve o projeto antes da publicação.' }
];

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'novo-site';
}

function freshProject(niche: Niche): Project {
  const automotive = niche === 'automotive';
  return {
    name: '',
    slug: '',
    niche,
    template: 'signature',
    status: 'draft',
    theme: automotive ? 'dark' : 'light',
    accent: automotive ? '#ff6542' : '#b27979',
    font_style: 'editorial',
    whatsapp: '',
    instagram: '',
    address: '',
    headline: '',
    subheadline: '',
    cta_label: automotive ? 'Solicitar orçamento' : 'Agendar horário',
    hero_image: '',
    logo_url: '',
    services: automotive ? automotiveServices : manicureServices,
    gallery: [],
    settings: {}
  };
}

function getVideoUrl(project: Project) {
  return typeof project.settings?.video_url === 'string' ? project.settings.video_url : '';
}

function displayName(project: Project) {
  return project.name.trim() || (project.niche === 'automotive' ? 'Sua Estética' : 'Seu Studio');
}

function displayHeadline(project: Project) {
  if (project.headline.trim()) return project.headline;
  return project.niche === 'automotive' ? 'Seu carro, em outro nível.' : 'Detalhes que transformam o seu momento.';
}

function displaySubheadline(project: Project) {
  if (project.subheadline.trim()) return project.subheadline;
  return project.niche === 'automotive'
    ? 'Estética automotiva premium com acabamento impecável, proteção e cuidado em cada detalhe.'
    : 'Manicure, alongamento e nail art em uma experiência leve, elegante e feita para você.';
}

function SitePreview({ project, compact = false }: { project: Project; compact?: boolean }) {
  const hero = project.hero_image || fallbackImages[project.niche];
  const videoUrl = getVideoUrl(project);
  const style = { '--accent': project.accent } as CSSProperties;
  const isAuto = project.niche === 'automotive';

  return (
    <div className={`siteCanvas ${project.theme} ${project.niche} template-${project.template} ${compact ? 'compact' : ''}`} style={style}>
      <header className="siteHeader">
        <div className="siteBrand">
          {project.logo_url ? <img src={project.logo_url} alt="Logo" /> : <span className="brandMark">{displayName(project).slice(0, 1)}</span>}
          <strong>{displayName(project)}</strong>
        </div>
        <nav className="siteNav"><span>Serviços</span><span>Sobre</span><span>Contato</span></nav>
        <button className="siteWhatsapp">WhatsApp ↗</button>
      </header>

      <section className="previewHero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="heroShade" />
        <div className="previewHeroContent">
          <span className="eyebrow">{isAuto ? 'DETAILING • CUIDADO AUTOMOTIVO' : 'BEAUTY STUDIO • NAIL DESIGN'}</span>
          <h1>{displayHeadline(project)}</h1>
          <p>{displaySubheadline(project)}</p>
          <div className="previewActions">
            <button className="primarySiteBtn">{project.cta_label || 'Falar no WhatsApp'} <b>↗</b></button>
            <span className="microcopy">Atendimento com hora marcada</span>
          </div>
        </div>
        <div className="heroCounter"><span>01</span><i /></div>
      </section>

      <section className="previewManifesto">
        <span>EXPERIÊNCIA</span>
        <h2>{isAuto ? 'Não é só limpeza. É presença.' : 'Não é só unha. É como você se sente.'}</h2>
        <p>{isAuto ? 'Processos precisos, produtos de alto padrão e acabamento pensado para quem percebe os detalhes.' : 'Técnica, delicadeza e um atendimento feito para transformar cuidado em ritual.'}</p>
      </section>

      {project.gallery.length > 0 && (
        <section className="previewGallery">
          {project.gallery.slice(0, 4).map((url, index) => <img src={url} alt={`Trabalho ${index + 1}`} key={`${url}-${index}`} />)}
        </section>
      )}

      {videoUrl && (
        <section className="previewVideo">
          <video src={videoUrl} autoPlay muted loop playsInline controls={false} />
          <div><span>EM MOVIMENTO</span><h2>Uma experiência que dá para sentir.</h2></div>
        </section>
      )}

      <section className="previewServices">
        <div className="sectionTop"><span>02 / SERVIÇOS</span><small>O que fazemos</small></div>
        <div className="serviceRows">
          {project.services.filter(Boolean).slice(0, 5).map((service, index) => (
            <div className="serviceRow" key={`${service}-${index}`}>
              <span>0{index + 1}</span><h3>{service}</h3><b>↗</b>
            </div>
          ))}
        </div>
      </section>

      <section className="previewClosing">
        <span>{isAuto ? 'SEU CARRO MERECE MAIS.' : 'SEU MOMENTO COMEÇA AQUI.'}</span>
        <h2>{displayName(project)}</h2>
        <button className="primarySiteBtn">{project.cta_label || 'Falar agora'} <b>↗</b></button>
      </section>
    </div>
  );
}

function AuthScreen({ onSession }: { onSession: (session: Session | null) => void }) {
  const supabase = getSupabase();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage('');

    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (result.error) setMessage(result.error.message);
    else if (result.data.session) onSession(result.data.session);
    else setMessage('Conta criada. Verifique seu e-mail para confirmar o acesso.');
    setBusy(false);
  }

  return (
    <main className="authShell">
      <section className="authVisual">
        <div className="authAurora authAuroraOne" /><div className="authAurora authAuroraTwo" />
        <header className="authBrand"><span className="vitraMonogram">V</span><div><strong>VITRA</strong><small>SITE STUDIO</small></div></header>
        <div className="authHeroCopy">
          <span className="authPill">SEU ESTÚDIO DIGITAL</span>
          <h1>Crie sites que<br /><em>parecem caros.</em></h1>
          <p>Uma experiência guiada para transformar negócios locais em marcas digitais prontas para vender.</p>
          <div className="authBenefits"><span>01&nbsp; Sem código</span><span>02&nbsp; Preview ao vivo</span><span>03&nbsp; Publicação rápida</span></div>
        </div>
        <div className="authMockup">
          <div className="mockupTop"><i /><i /><i /><span>preview.vitra</span></div>
          <div className="mockupHero"><small>APEX DETAIL</small><h3>Presença<br />em cada detalhe.</h3><button>ORÇAMENTO ↗</button></div>
        </div>
        <footer className="authFooter"><span>ESTÉTICA AUTOMOTIVA</span><span>MANICURE & NAILS</span><span>+ NOVOS NICHOS</span></footer>
      </section>

      <section className="authPanel">
        <div className="authCard">
          <div className="authMobileBrand"><span className="vitraMonogram">V</span><strong>VITRA</strong></div>
          <span className="tinyLabel">ACESSO AO ESTÚDIO</span>
          <h2>{mode === 'login' ? 'Bem-vindo.' : 'Crie sua conta.'}</h2>
          <p>{mode === 'login' ? 'Entre para continuar seus projetos.' : 'Comece a criar sites premium em minutos.'}</p>
          <form onSubmit={submit}>
            <label><span>E-MAIL</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" required /></label>
            <label><span>SENHA</span><input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></label>
            {message && <div className="formMessage">{message}</div>}
            <button className="solidBtn" disabled={busy}>{busy ? 'CARREGANDO...' : mode === 'login' ? 'ENTRAR NO VITRA' : 'CRIAR CONTA'} <b>↗</b></button>
          </form>
          <div className="authSwitch"><span>{mode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}</span><button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Criar agora' : 'Entrar'}</button></div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  const supabase = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<'dashboard' | 'builder'>('dashboard');
  const [project, setProject] = useState<Project>(freshProject('automotive'));
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!session?.user || !supabase) return;
    void loadProjects();
  }, [session?.user.id, supabase]);

  async function loadProjects() {
    if (!supabase) return;
    const { data, error } = await supabase.from('projects').select('*').order('updated_at', { ascending: false });
    if (!error && data) setProjects(data as Project[]);
  }

  function startProject(niche: Niche) {
    setProject(freshProject(niche));
    setStep(0);
    setNotice('');
    setView('builder');
  }

  function editProject(item: Project) {
    setProject({ ...item, services: item.services || [], gallery: item.gallery || [], settings: item.settings || {} });
    setStep(0);
    setNotice('');
    setView('builder');
  }

  function setField<K extends keyof Project>(key: K, value: Project[K]) {
    setProject(prev => ({ ...prev, [key]: value }));
  }

  function setSetting(key: string, value: unknown) {
    setProject(prev => ({ ...prev, settings: { ...(prev.settings || {}), [key]: value } }));
  }

  async function saveProject(overrides: Partial<Project> = {}) {
    if (!supabase || !session?.user) return false;
    setSaving(true);
    setNotice('');
    const current = { ...project, ...overrides };
    const payload = {
      user_id: session.user.id,
      name: current.name.trim() || displayName(current),
      slug: current.slug || slugify(current.name || displayName(current)),
      niche: current.niche,
      template: current.template,
      status: current.status,
      theme: current.theme,
      accent: current.accent,
      font_style: current.font_style,
      whatsapp: current.whatsapp,
      instagram: current.instagram,
      address: current.address,
      headline: current.headline,
      subheadline: current.subheadline,
      cta_label: current.cta_label,
      hero_image: current.hero_image,
      logo_url: current.logo_url,
      services: current.services,
      gallery: current.gallery,
      settings: current.settings,
      custom_domain: current.custom_domain || null,
      vercel_url: current.vercel_url || null
    };

    const query = current.id
      ? supabase.from('projects').update(payload).eq('id', current.id).select().single()
      : supabase.from('projects').insert(payload).select().single();
    const { data, error } = await query;

    if (error) {
      setNotice(error.message);
      setSaving(false);
      return false;
    }

    setProject(data as Project);
    setNotice('Projeto salvo.');
    await loadProjects();
    setSaving(false);
    return true;
  }

  async function uploadAsset(event: ChangeEvent<HTMLInputElement>, kind: MediaKind) {
    if (!supabase || !session?.user || !event.target.files?.[0]) return;
    const file = event.target.files[0];
    setUploading(true);
    setNotice('Enviando mídia...');
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `${session.user.id}/${crypto.randomUUID()}-${safe}`;
    const { error } = await supabase.storage.from('vitra-assets').upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      setNotice(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('vitra-assets').getPublicUrl(path);
    if (kind === 'hero') setField('hero_image', data.publicUrl);
    if (kind === 'logo') setField('logo_url', data.publicUrl);
    if (kind === 'gallery') setField('gallery', [...project.gallery, data.publicUrl]);
    if (kind === 'video') setSetting('video_url', data.publicUrl);
    setNotice('Mídia adicionada.');
    setUploading(false);
    event.target.value = '';
  }

  function removeGallery(index: number) {
    setField('gallery', project.gallery.filter((_, i) => i !== index));
  }

  function nextStep() {
    setStep(value => Math.min(value + 1, wizardSteps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function previousStep() {
    setStep(value => Math.max(value - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setProjects([]);
    setView('dashboard');
  }

  if (loading) return <div className="loadingScreen"><div className="loadingLogo">V</div><span>ABRINDO O ESTÚDIO</span></div>;
  if (!supabase) return <div className="configError"><h1>VITRA</h1><p>Configure as variáveis do Supabase para abrir o estúdio.</p></div>;
  if (!session) return <AuthScreen onSession={setSession} />;

  const published = projects.filter(p => p.status === 'published').length;
  const drafts = projects.filter(p => p.status !== 'published').length;
  const activeStep = wizardSteps[step];
  const progress = ((step + 1) / wizardSteps.length) * 100;

  return (
    <main className="studioShell">
      {view === 'dashboard' ? (
        <>
          <aside className="rail">
            <button className="railLogo" onClick={() => setView('dashboard')}>V</button>
            <nav className="railNav"><button className="active"><span>⌂</span><small>Início</small></button><button onClick={() => startProject('automotive')}><span>＋</span><small>Criar</small></button></nav>
            <button className="railUser" onClick={logout} title="Sair">{session.user.email?.slice(0, 1).toUpperCase()}</button>
          </aside>

          <section className="dashboard">
            <header className="topbar">
              <div className="topbarBrand"><span className="tinyLabel">VITRA / SITE STUDIO</span><h1>Seu estúdio digital.</h1></div>
              <button className="newProjectBtn" onClick={() => startProject('automotive')}>＋ NOVO SITE</button>
            </header>

            <section className="dashboardHero">
              <div className="dashHeroCopy">
                <span className="kicker">CRIAR • PERSONALIZAR • PUBLICAR</span>
                <h2>Um site com cara de<br /><em>agência.</em> Sem agência.</h2>
                <p>O VITRA conduz você etapa por etapa. Você coloca a identidade do cliente e o sistema cuida da composição, proporções e experiência.</p>
                <button className="heroCreateBtn" onClick={() => startProject('automotive')}>COMEÇAR UM PROJETO <b>↗</b></button>
              </div>
              <div className="floatingPreview"><div className="floatBrowser"><i /><i /><i /><span>vitra.preview</span></div><div className="floatImage"><small>APEX DETAIL</small><h3>Seu carro,<br />em outro nível.</h3><button>ORÇAMENTO ↗</button></div></div>
            </section>

            <section className="metricStrip">
              <div><span>PROJETOS</span><strong>{String(projects.length).padStart(2, '0')}</strong></div>
              <div><span>PUBLICADOS</span><strong>{String(published).padStart(2, '0')}</strong></div>
              <div><span>EM CRIAÇÃO</span><strong>{String(drafts).padStart(2, '0')}</strong></div>
              <div><span>NICHOS</span><strong>02</strong></div>
            </section>

            <section className="sectionBlock">
              <div className="blockTitle"><div><span className="tinyLabel">COMECE POR AQUI</span><h3>Escolha o tipo de negócio.</h3></div><span className="indexTag">01 / NICHO</span></div>
              <div className="nicheGrid">
                <button className="nicheCard autoCard" onClick={() => startProject('automotive')}><div className="cardImage"><span>ESTÉTICA<br />AUTOMOTIVA</span></div><div className="nicheMeta"><span>PREMIUM / HIGH CONTRAST</span><b>CRIAR SITE ↗</b></div></button>
                <button className="nicheCard nailsCard" onClick={() => startProject('manicure')}><div className="cardImage"><span>MANICURE<br />& NAILS</span></div><div className="nicheMeta"><span>EDITORIAL / SOFT LUXURY</span><b>CRIAR SITE ↗</b></div></button>
              </div>
            </section>

            <section className="sectionBlock projectsBlock">
              <div className="blockTitle"><div><span className="tinyLabel">SEUS TRABALHOS</span><h3>Projetos recentes.</h3></div><span className="indexTag">02 / SITES</span></div>
              {projects.length === 0 ? (
                <div className="emptyProjects"><span>V</span><h4>Nenhum projeto ainda.</h4><p>Crie o primeiro site seguindo as etapas do VITRA.</p><button onClick={() => startProject('automotive')}>CRIAR PRIMEIRO SITE ↗</button></div>
              ) : (
                <div className="projectGrid">
                  {projects.map(item => (
                    <button className="projectCard" key={item.id} onClick={() => editProject(item)}>
                      <div className="projectThumb" style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.76)), url(${item.hero_image || fallbackImages[item.niche]})` }}><span className={`statusDot ${item.status}`} /><strong>{item.name}</strong></div>
                      <div className="projectInfo"><div><span>{item.niche === 'automotive' ? 'ESTÉTICA' : 'MANICURE'}</span><b>{item.status === 'published' ? 'PUBLICADO' : 'RASCUNHO'}</b></div><i>↗</i></div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </section>
        </>
      ) : (
        <section className="wizardShell">
          <header className="wizardTopbar">
            <button className="wizardBrand" onClick={() => setView('dashboard')}><span>V</span><b>VITRA</b></button>
            <div className="wizardProjectName"><small>PROJETO</small><strong>{displayName(project)}</strong></div>
            <div className="wizardTopActions"><span className="saveNotice">{notice}</span><button className="ghostBtn" onClick={() => setView('dashboard')}>SAIR</button><button className="saveBtn" disabled={saving} onClick={() => void saveProject()}>{saving ? 'SALVANDO...' : 'SALVAR'}</button></div>
          </header>

          <div className="wizardProgress"><i style={{ width: `${progress}%` }} /></div>

          <div className="wizardLayout">
            <aside className="stepRail">
              <span className="stepRailLabel">ETAPAS</span>
              <div className="stepDots">
                {wizardSteps.map((item, index) => (
                  <button key={item.id} className={`${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`} onClick={() => setStep(index)} title={item.title}><span>{index < step ? '✓' : String(index + 1).padStart(2, '0')}</span><small>{item.id === 'subheadline' ? 'Subtítulo' : item.id === 'headline' ? 'Título' : item.id === 'hero' ? 'Capa' : item.id === 'gallery' ? 'Galeria' : item.id === 'contact' ? 'Contato' : item.id === 'services' ? 'Serviços' : item.id === 'review' ? 'Revisão' : item.id.charAt(0).toUpperCase() + item.id.slice(1)}</small></button>
                ))}
              </div>
            </aside>

            <main className="wizardStage">
              <div className="stageContent">
                <div className="stageHeading"><span>{activeStep.eyebrow}</span><h1>{activeStep.title}</h1><p>{activeStep.description}</p>{activeStep.optional && <small>OPCIONAL — você pode pular esta etapa.</small>}</div>

                <div className="stageControl">
                  {activeStep.id === 'logo' && (
                    <div className="uploadHeroControl">
                      <label className={`dropZone logoDrop ${project.logo_url ? 'hasMedia' : ''}`}>
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={e => void uploadAsset(e, 'logo')} />
                        {project.logo_url ? <img src={project.logo_url} alt="Logo enviado" /> : <><span className="uploadIcon">＋</span><strong>Enviar logotipo</strong><small>PNG, JPG, WebP ou AVIF</small></>}
                      </label>
                      {project.logo_url && <button className="removeMedia" onClick={() => setField('logo_url', '')}>REMOVER LOGO</button>}
                    </div>
                  )}

                  {activeStep.id === 'name' && (
                    <label className="bigInput"><span>NOME DA MARCA</span><input autoFocus value={project.name} onChange={e => setProject(prev => ({ ...prev, name: e.target.value, slug: prev.id ? prev.slug : slugify(e.target.value) }))} placeholder={project.niche === 'automotive' ? 'Ex.: Apex Detail' : 'Ex.: Maison Nails'} /></label>
                  )}

                  {activeStep.id === 'headline' && (
                    <label className="bigTextarea"><span>TÍTULO PRINCIPAL</span><textarea autoFocus rows={3} value={project.headline} onChange={e => setField('headline', e.target.value)} placeholder={displayHeadline(project)} maxLength={90} /><small>{project.headline.length}/90</small></label>
                  )}

                  {activeStep.id === 'subheadline' && (
                    <label className="bigTextarea"><span>SUBTÍTULO</span><textarea autoFocus rows={4} value={project.subheadline} onChange={e => setField('subheadline', e.target.value)} placeholder={displaySubheadline(project)} maxLength={220} /><small>{project.subheadline.length}/220</small></label>
                  )}

                  {activeStep.id === 'style' && (
                    <div className="styleControls">
                      <div><span className="controlLabel">ESTILO DO SITE</span><div className="styleCards">{['signature','editorial','minimal'].map(item => <button key={item} className={project.template === item ? 'active' : ''} onClick={() => setField('template', item)}><span className={`styleSample ${item}`}><i /><i /><i /></span><strong>{item === 'signature' ? 'Signature' : item === 'editorial' ? 'Editorial' : 'Minimal'}</strong></button>)}</div></div>
                      <div className="splitControls"><div><span className="controlLabel">TEMA</span><div className="segmented"><button className={project.theme === 'dark' ? 'active' : ''} onClick={() => setField('theme', 'dark')}>ESCURO</button><button className={project.theme === 'light' ? 'active' : ''} onClick={() => setField('theme', 'light')}>CLARO</button></div></div><div><span className="controlLabel">COR DE DESTAQUE</span><div className="colorPicker"><input type="color" value={project.accent} onChange={e => setField('accent', e.target.value)} /><b>{project.accent.toUpperCase()}</b></div></div></div>
                    </div>
                  )}

                  {activeStep.id === 'hero' && (
                    <div className="uploadHeroControl"><label className={`dropZone heroDrop ${project.hero_image ? 'hasMedia' : ''}`}><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={e => void uploadAsset(e, 'hero')} />{project.hero_image ? <img src={project.hero_image} alt="Capa" /> : <><span className="uploadIcon">▧</span><strong>Enviar imagem de capa</strong><small>O VITRA recorta automaticamente em 16:9 e mobile</small></>}</label>{project.hero_image && <button className="removeMedia" onClick={() => setField('hero_image', '')}>TROCAR / REMOVER CAPA</button>}</div>
                  )}

                  {activeStep.id === 'gallery' && (
                    <div className="galleryEditor"><label className="addMediaCard"><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={e => void uploadAsset(e, 'gallery')} /><span>＋</span><strong>Adicionar foto</strong><small>até 4 aparecem no preview</small></label>{project.gallery.map((url, index) => <div className="galleryItem" key={`${url}-${index}`}><img src={url} alt={`Galeria ${index + 1}`} /><button onClick={() => removeGallery(index)}>×</button></div>)}</div>
                  )}

                  {activeStep.id === 'video' && (
                    <div className="uploadHeroControl"><label className={`dropZone videoDrop ${getVideoUrl(project) ? 'hasMedia' : ''}`}><input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e => void uploadAsset(e, 'video')} />{getVideoUrl(project) ? <video src={getVideoUrl(project)} muted loop autoPlay playsInline /> : <><span className="uploadIcon">▶</span><strong>Enviar vídeo</strong><small>MP4, WebM ou MOV • até 50 MB</small></>}</label>{getVideoUrl(project) && <button className="removeMedia" onClick={() => setSetting('video_url', '')}>REMOVER VÍDEO</button>}</div>
                  )}

                  {activeStep.id === 'services' && (
                    <div className="servicesEditor"><div className="servicesList">{project.services.map((service, index) => <div className="serviceInput" key={index}><span>{String(index + 1).padStart(2, '0')}</span><input value={service} onChange={e => { const next = [...project.services]; next[index] = e.target.value; setField('services', next); }} /><button onClick={() => setField('services', project.services.filter((_, i) => i !== index))}>×</button></div>)}</div><button className="addServiceBtn" onClick={() => setField('services', [...project.services, 'Novo serviço'])}>＋ ADICIONAR SERVIÇO</button></div>
                  )}

                  {activeStep.id === 'contact' && (
                    <div className="contactGrid"><label><span>WHATSAPP</span><input value={project.whatsapp} onChange={e => setField('whatsapp', e.target.value)} placeholder="5511999999999" /></label><label><span>INSTAGRAM</span><input value={project.instagram} onChange={e => setField('instagram', e.target.value)} placeholder="@seuperfil" /></label><label className="wide"><span>ENDEREÇO</span><input value={project.address} onChange={e => setField('address', e.target.value)} placeholder="Rua, bairro, cidade" /></label><label className="wide"><span>TEXTO DO BOTÃO</span><input value={project.cta_label} onChange={e => setField('cta_label', e.target.value)} placeholder="Solicitar orçamento" /></label></div>
                  )}

                  {activeStep.id === 'review' && (
                    <div className="reviewCard"><div className="reviewSeal">V</div><div><span>PROJETO COMPLETO</span><h3>{displayName(project)}</h3><p>Logo, textos, mídia, serviços e contatos estão prontos para virar um site independente.</p></div><div className="reviewStats"><span><b>{project.gallery.length}</b> fotos</span><span><b>{project.services.filter(Boolean).length}</b> serviços</span><span><b>{getVideoUrl(project) ? '1' : '0'}</b> vídeo</span></div><button className="readyBtn" onClick={() => void saveProject({ status: 'ready' })}>SALVAR E MARCAR COMO PRONTO ↗</button></div>
                  )}
                </div>

                <div className="stageFooter">
                  <button className="backStep" onClick={previousStep} disabled={step === 0}>← VOLTAR</button>
                  <div><span>{uploading ? 'ENVIANDO MÍDIA...' : `${step + 1} DE ${wizardSteps.length}`}</span>{step < wizardSteps.length - 1 && <button className="nextStep" onClick={nextStep} disabled={uploading}>CONTINUAR <b>→</b></button>}</div>
                </div>
              </div>
            </main>

            <aside className="livePreviewPanel">
              <div className="previewPanelTop"><div><i /><i /><i /></div><span>PREVIEW AO VIVO</span><b>{project.niche === 'automotive' ? 'DESKTOP' : 'RESPONSIVO'}</b></div>
              <div className="previewViewport"><SitePreview project={project} /></div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
