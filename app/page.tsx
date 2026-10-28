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

const automotiveServices = ['Lavagem detalhada', 'Polimento técnico', 'Vitrificação', 'Higienização interna'];
const manicureServices = ['Manicure', 'Pedicure', 'Alongamento em gel', 'Nail art'];

const fallbackImages: Record<Niche, string> = {
  automotive: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1600&q=85',
  manicure: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=85'
};

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
    name: automotive ? 'Apex Detail' : 'Maison Nails',
    slug: automotive ? 'apex-detail' : 'maison-nails',
    niche,
    template: 'signature',
    status: 'draft',
    theme: automotive ? 'dark' : 'light',
    accent: automotive ? '#ff5a36' : '#9a7659',
    font_style: 'editorial',
    whatsapp: '',
    instagram: '',
    address: '',
    headline: automotive ? 'Seu carro, em outro nível.' : 'Detalhes que transformam o seu momento.',
    subheadline: automotive
      ? 'Estética automotiva premium com acabamento impecável, proteção e cuidado em cada detalhe.'
      : 'Manicure, alongamento e nail art em uma experiência leve, elegante e feita para você.',
    cta_label: automotive ? 'Solicitar orçamento' : 'Agendar horário',
    hero_image: '',
    logo_url: '',
    services: automotive ? automotiveServices : manicureServices,
    gallery: [],
    settings: {}
  };
}

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="iconBox">{children}</span>;
}

function SitePreview({ project }: { project: Project }) {
  const hero = project.hero_image || fallbackImages[project.niche];
  const style = { '--accent': project.accent } as CSSProperties;
  const isAuto = project.niche === 'automotive';

  return (
    <div className={`siteCanvas ${project.theme} ${project.niche} template-${project.template}`} style={style}>
      <div className="siteNoise" />
      <header className="siteHeader">
        <div className="siteBrand">
          {project.logo_url ? <img src={project.logo_url} alt="Logo" /> : <span className="brandMark">V</span>}
          <strong>{project.name}</strong>
        </div>
        <div className="siteNav">
          <span>Serviços</span><span>Sobre</span><span>Contato</span>
        </div>
        <button>WhatsApp ↗</button>
      </header>

      <section className="previewHero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="heroShade" />
        <div className="heroGrid" />
        <div className="previewHeroContent">
          <span className="eyebrow">{isAuto ? 'DETAILING • CUIDADO AUTOMOTIVO' : 'BEAUTY STUDIO • NAIL DESIGN'}</span>
          <h1>{project.headline}</h1>
          <p>{project.subheadline}</p>
          <div className="previewActions">
            <button className="primarySiteBtn">{project.cta_label} <b>↗</b></button>
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
        <h2>{project.name}</h2>
        <button className="primarySiteBtn">{project.cta_label} <b>↗</b></button>
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
      <div className="authGlow" />
      <section className="authStory">
        <div className="vitraLogo"><span>V</span> VITRA</div>
        <div>
          <span className="kicker">SITE STUDIO / 01</span>
          <h1>Sites que parecem caros.<br />Criados em minutos.</h1>
          <p>Uma fábrica visual para transformar negócios locais em marcas digitais que vendem.</p>
        </div>
        <div className="authFoot"><span>ESTÉTICA AUTOMOTIVA</span><span>MANICURE</span><span>+ NOVOS NICHOS</span></div>
      </section>
      <section className="authPanel">
        <div className="authCard">
          <span className="tinyLabel">ACESSO AO ESTÚDIO</span>
          <h2>{mode === 'login' ? 'Bem-vindo de volta.' : 'Crie seu acesso.'}</h2>
          <p>{mode === 'login' ? 'Entre para continuar criando.' : 'Seu painel Vitra começa aqui.'}</p>
          <form onSubmit={submit}>
            <label>E-MAIL<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" required /></label>
            <label>SENHA<input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></label>
            {message && <div className="formMessage">{message}</div>}
            <button className="solidBtn" disabled={busy}>{busy ? 'CARREGANDO...' : mode === 'login' ? 'ENTRAR NO VITRA ↗' : 'CRIAR CONTA ↗'}</button>
          </form>
          <button className="textBtn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Ainda não tenho conta' : 'Já tenho uma conta'}
          </button>
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
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [activePanel, setActivePanel] = useState<'brand' | 'content' | 'services' | 'media' | 'publish'>('brand');

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
  }, [session?.user.id]);

  async function loadProjects() {
    if (!supabase) return;
    const { data, error } = await supabase.from('projects').select('*').order('updated_at', { ascending: false });
    if (!error && data) setProjects(data as Project[]);
  }

  function startProject(niche: Niche) {
    setProject(freshProject(niche));
    setActivePanel('brand');
    setNotice('');
    setView('builder');
  }

  function editProject(item: Project) {
    setProject({ ...item, services: item.services || [], gallery: item.gallery || [] });
    setActivePanel('brand');
    setNotice('');
    setView('builder');
  }

  function setField<K extends keyof Project>(key: K, value: Project[K]) {
    setProject(prev => ({ ...prev, [key]: value }));
  }

  async function saveProject() {
    if (!supabase || !session?.user) return;
    setSaving(true);
    setNotice('');
    const payload = {
      user_id: session.user.id,
      name: project.name,
      slug: project.slug || slugify(project.name),
      niche: project.niche,
      template: project.template,
      status: project.status,
      theme: project.theme,
      accent: project.accent,
      font_style: project.font_style,
      whatsapp: project.whatsapp,
      instagram: project.instagram,
      address: project.address,
      headline: project.headline,
      subheadline: project.subheadline,
      cta_label: project.cta_label,
      hero_image: project.hero_image,
      logo_url: project.logo_url,
      services: project.services,
      gallery: project.gallery,
      settings: project.settings,
      custom_domain: project.custom_domain || null,
      vercel_url: project.vercel_url || null
    };

    const query = project.id
      ? supabase.from('projects').update(payload).eq('id', project.id).select().single()
      : supabase.from('projects').insert(payload).select().single();
    const { data, error } = await query;

    if (error) setNotice(error.message);
    else {
      setProject(data as Project);
      setNotice('Projeto salvo no Vitra.');
      await loadProjects();
    }
    setSaving(false);
  }

  async function uploadAsset(event: ChangeEvent<HTMLInputElement>, kind: 'hero' | 'logo' | 'gallery') {
    if (!supabase || !session?.user || !event.target.files?.[0]) return;
    const file = event.target.files[0];
    setNotice('Enviando mídia...');
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `${session.user.id}/${crypto.randomUUID()}-${safe}`;
    const { error } = await supabase.storage.from('vitra-assets').upload(path, file, { upsert: false });
    if (error) { setNotice(error.message); return; }
    const { data } = supabase.storage.from('vitra-assets').getPublicUrl(path);
    if (kind === 'hero') setField('hero_image', data.publicUrl);
    if (kind === 'logo') setField('logo_url', data.publicUrl);
    if (kind === 'gallery') setField('gallery', [...project.gallery, data.publicUrl]);
    setNotice('Mídia adicionada. Salve o projeto para confirmar.');
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

  return (
    <main className="studioShell">
      <aside className="rail">
        <button className="railLogo" onClick={() => setView('dashboard')}>V</button>
        <div className="railNav">
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><Icon>⌂</Icon><span>Início</span></button>
          <button className={view === 'builder' ? 'active' : ''} onClick={() => startProject('automotive')}><Icon>＋</Icon><span>Criar</span></button>
          <button><Icon>◇</Icon><span>Modelos</span></button>
        </div>
        <button className="railUser" onClick={logout} title="Sair">{session.user.email?.slice(0, 1).toUpperCase()}</button>
      </aside>

      {view === 'dashboard' ? (
        <section className="dashboard">
          <header className="topbar">
            <div><span className="tinyLabel">VITRA / SITE STUDIO</span><h1>Seu estúdio digital.</h1></div>
            <button className="newProjectBtn" onClick={() => startProject('automotive')}>＋ NOVO SITE</button>
          </header>

          <section className="dashboardHero">
            <div className="heroOrb orbOne" /><div className="heroOrb orbTwo" />
            <div className="dashHeroCopy">
              <span className="kicker">CRIAR • PERSONALIZAR • PUBLICAR</span>
              <h2>Um site com cara de<br /><em>agência.</em> Sem agência.</h2>
              <p>Escolha o nicho, coloque a identidade do cliente e transforme um modelo premium em uma entrega pronta para vender.</p>
              <div className="dashActions"><button onClick={() => startProject('automotive')}>CRIAR AGORA ↗</button><span>01 — dois nichos prontos</span></div>
            </div>
            <div className="floatingPreview">
              <div className="floatTop"><i /><i /><i /><span>vitra preview</span></div>
              <div className="floatSite">
                <small>APEX / DETAIL</small><h3>Seu carro,<br />em outro nível.</h3><div className="floatLine" /><b>ORÇAMENTO ↗</b>
              </div>
            </div>
          </section>

          <section className="metricStrip">
            <div><span>PROJETOS</span><strong>{String(projects.length).padStart(2, '0')}</strong></div>
            <div><span>PUBLICADOS</span><strong>{String(published).padStart(2, '0')}</strong></div>
            <div><span>EM CRIAÇÃO</span><strong>{String(drafts).padStart(2, '0')}</strong></div>
            <div><span>NICHOS ATIVOS</span><strong>02</strong></div>
          </section>

          <section className="sectionBlock">
            <div className="blockTitle"><div><span className="tinyLabel">COMECE POR AQUI</span><h3>Escolha um universo.</h3></div><span className="indexTag">01 / NICHOS</span></div>
            <div className="nicheGrid">
              <button className="nicheCard autoCard" onClick={() => startProject('automotive')}>
                <div className="cardImage"><span>ESTÉTICA<br />AUTOMOTIVA</span></div>
                <div className="nicheMeta"><span>PREMIUM / HIGH CONTRAST</span><b>CRIAR SITE ↗</b></div>
              </button>
              <button className="nicheCard nailsCard" onClick={() => startProject('manicure')}>
                <div className="cardImage"><span>MANICURE<br />& NAILS</span></div>
                <div className="nicheMeta"><span>EDITORIAL / SOFT LUXURY</span><b>CRIAR SITE ↗</b></div>
              </button>
            </div>
          </section>

          <section className="sectionBlock projectsBlock">
            <div className="blockTitle"><div><span className="tinyLabel">SEUS TRABALHOS</span><h3>Projetos recentes.</h3></div><span className="indexTag">02 / SITES</span></div>
            {projects.length === 0 ? (
              <div className="emptyProjects"><span>V</span><h4>Nenhum site ainda.</h4><p>Seu primeiro projeto começa com um clique.</p><button onClick={() => startProject('automotive')}>CRIAR PRIMEIRO SITE ↗</button></div>
            ) : (
              <div className="projectGrid">
                {projects.map(item => (
                  <button className="projectCard" key={item.id} onClick={() => editProject(item)}>
                    <div className={`projectThumb ${item.niche}`} style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.72)), url(${item.hero_image || fallbackImages[item.niche]})` }}>
                      <span className={`statusDot ${item.status}`} />
                      <strong>{item.name}</strong>
                    </div>
                    <div className="projectInfo"><div><span>{item.niche === 'automotive' ? 'ESTÉTICA' : 'MANICURE'}</span><b>{item.status === 'published' ? 'PUBLICADO' : 'RASCUNHO'}</b></div><i>↗</i></div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </section>
      ) : (
        <section className="builder">
          <header className="builderTopbar">
            <div className="builderCrumbs"><button onClick={() => setView('dashboard')}>VITRA</button><span>/</span><strong>{project.name || 'Novo site'}</strong><span className={`saveDot ${saving ? 'saving' : ''}`} /></div>
            <div className="builderActions"><span>{notice}</span><button className="ghostBtn" onClick={() => setView('dashboard')}>SAIR</button><button className="saveBtn" onClick={saveProject} disabled={saving}>{saving ? 'SALVANDO...' : 'SALVAR PROJETO'}</button></div>
          </header>

          <div className="builderBody">
            <aside className="builderTools">
              {[
                ['brand', 'Aa', 'Marca'], ['content', '✎', 'Conteúdo'], ['services', '≡', 'Serviços'], ['media', '▧', 'Mídia'], ['publish', '↗', 'Publicar']
              ].map(([id, icon, label]) => (
                <button key={id} className={activePanel === id ? 'active' : ''} onClick={() => setActivePanel(id as typeof activePanel)}><span>{icon}</span><small>{label}</small></button>
              ))}
            </aside>

            <aside className="editorPanel">
              <div className="panelHeading"><span className="tinyLabel">EDITOR VISUAL</span><h2>{activePanel === 'brand' ? 'Identidade' : activePanel === 'content' ? 'Conteúdo' : activePanel === 'services' ? 'Serviços' : activePanel === 'media' ? 'Mídia' : 'Publicação'}</h2></div>

              {activePanel === 'brand' && <>
                <label className="fieldLabel">NOME DA MARCA<input value={project.name} onChange={e => setProject(prev => ({ ...prev, name: e.target.value, slug: prev.id ? prev.slug : slugify(e.target.value) }))} /></label>
                <label className="fieldLabel">NICHO<select value={project.niche} onChange={e => setProject(freshProject(e.target.value as Niche))}><option value="automotive">Estética Automotiva</option><option value="manicure">Manicure & Nails</option></select></label>
                <div className="fieldLabel">TEMA<div className="segmented"><button className={project.theme === 'dark' ? 'active' : ''} onClick={() => setField('theme', 'dark')}>ESCURO</button><button className={project.theme === 'light' ? 'active' : ''} onClick={() => setField('theme', 'light')}>CLARO</button></div></div>
                <div className="fieldLabel">COR DE DESTAQUE<div className="colorField"><input type="color" value={project.accent} onChange={e => setField('accent', e.target.value)} /><input value={project.accent} onChange={e => setField('accent', e.target.value)} /></div></div>
                <div className="fieldLabel">ESTILO<div className="templateList">{['signature','editorial','minimal'].map(t => <button key={t} className={project.template === t ? 'active' : ''} onClick={() => setField('template', t)}><span className={`templateMini ${t}`} /><b>{t}</b></button>)}</div></div>
              </>}

              {activePanel === 'content' && <>
                <label className="fieldLabel">TÍTULO PRINCIPAL<textarea rows={3} value={project.headline} onChange={e => setField('headline', e.target.value)} /></label>
                <label className="fieldLabel">SUBTÍTULO<textarea rows={4} value={project.subheadline} onChange={e => setField('subheadline', e.target.value)} /></label>
                <label className="fieldLabel">TEXTO DO BOTÃO<input value={project.cta_label} onChange={e => setField('cta_label', e.target.value)} /></label>
                <label className="fieldLabel">WHATSAPP<input value={project.whatsapp} onChange={e => setField('whatsapp', e.target.value)} placeholder="5511999999999" /></label>
                <label className="fieldLabel">INSTAGRAM<input value={project.instagram} onChange={e => setField('instagram', e.target.value)} placeholder="@seuperfil" /></label>
                <label className="fieldLabel">ENDEREÇO<input value={project.address} onChange={e => setField('address', e.target.value)} placeholder="Cidade, bairro..." /></label>
              </>}

              {activePanel === 'services' && <>
                <p className="panelHint">Edite os serviços. Eles entram automaticamente no site na ordem abaixo.</p>
                <div className="servicesEditor">
                  {project.services.map((service, index) => <div className="serviceInput" key={index}><span>0{index + 1}</span><input value={service} onChange={e => { const next = [...project.services]; next[index] = e.target.value; setField('services', next); }} /><button onClick={() => setField('services', project.services.filter((_, i) => i !== index))}>×</button></div>)}
                </div>
                <button className="addRowBtn" onClick={() => setField('services', [...project.services, 'Novo serviço'])}>＋ ADICIONAR SERVIÇO</button>
              </>}

              {activePanel === 'media' && <>
                <div className="uploadBlock"><div><span>CAPA PRINCIPAL</span><p>Imagem grande do topo do site.</p></div><label className="uploadBtn">ENVIAR<input type="file" accept="image/*" onChange={e => uploadAsset(e, 'hero')} /></label>{project.hero_image && <img src={project.hero_image} alt="Capa" />}</div>
                <div className="uploadBlock"><div><span>LOGOTIPO</span><p>PNG ou WebP com fundo transparente.</p></div><label className="uploadBtn">ENVIAR<input type="file" accept="image/*" onChange={e => uploadAsset(e, 'logo')} /></label>{project.logo_url && <img className="logoPreview" src={project.logo_url} alt="Logo" />}</div>
                <div className="uploadBlock"><div><span>GALERIA</span><p>Fotos de trabalhos, antes/depois e ambiente.</p></div><label className="uploadBtn">ADICIONAR<input type="file" accept="image/*" onChange={e => uploadAsset(e, 'gallery')} /></label><div className="galleryMini">{project.gallery.map((url, i) => <img src={url} alt="Galeria" key={i} />)}</div></div>
              </>}

              {activePanel === 'publish' && <>
                <div className="publishCard"><span className="publishIcon">↗</span><h3>Pronto para vender.</h3><p>Salve o projeto agora. A etapa de publicação vai transformar esta configuração em um site estático separado na Vercel.</p></div>
                <label className="fieldLabel">SLUG DO PROJETO<input value={project.slug} onChange={e => setField('slug', slugify(e.target.value))} /></label>
                <label className="fieldLabel">DOMÍNIO DO CLIENTE<input value={project.custom_domain || ''} onChange={e => setField('custom_domain', e.target.value)} placeholder="cliente.com.br" /></label>
                <div className="publishStatus"><div><span>STATUS</span><strong>{project.status === 'published' ? 'PUBLICADO' : 'RASCUNHO'}</strong></div><div><span>URL</span><strong>{project.vercel_url || 'Será criada na publicação'}</strong></div></div>
                <button className="publishBtn" onClick={async () => { setField('status','ready'); setNotice('Projeto marcado como pronto. Salve para confirmar.'); }}>MARCAR COMO PRONTO ↗</button>
                <small className="publishNote">A automação de deploy será conectada na próxima etapa sem colocar banco de dados nos sites finais.</small>
              </>}
            </aside>

            <section className="previewStage">
              <div className="previewToolbar"><div><span className="liveDot" /> PREVIEW AO VIVO</div><div className="deviceToggle"><button className="active">DESKTOP</button><button>MOBILE</button></div><span>{project.slug}.vercel.app</span></div>
              <div className="browserFrame">
                <div className="browserBar"><div><i/><i/><i/></div><span>https://{project.slug || 'seu-site'}.vercel.app</span><b>↗</b></div>
                <div className="browserViewport"><SitePreview project={project} /></div>
              </div>
            </section>
          </div>
        </section>
      )}
    </main>
  );
}
