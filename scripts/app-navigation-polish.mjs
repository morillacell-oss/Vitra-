import fs from 'node:fs';

const path='app/studio-v4.tsx';
let source=fs.readFileSync(path,'utf8');

source=source.replace("type View='dashboard'|'catalog'|'builder'|'delivery';","type View='dashboard'|'projects'|'catalog'|'builder'|'delivery';");

if(!source.includes('VITRA_APP_NAV_EVENTS')){
  const anchor=" useEffect(()=>{try{const raw=localStorage.getItem('vitra-projects-cinema-v1');if(raw)setProjects((JSON.parse(raw) as Project[]).map(upgradeProject));const free=localStorage.getItem('vitra-free-project-ids');if(free)setFreeIds(JSON.parse(free) as string[])}catch{}},[]);";
  if(!source.includes(anchor))throw new Error('VITRA app navigation effect anchor not found');
  const effect=`${anchor}\n // VITRA_APP_NAV_EVENTS — one navigation model for mobile and desktop shells.\n useEffect(()=>{\n  const navigate=(event:Event)=>{\n   const target=(event as CustomEvent<string>).detail;\n   if(target==='home'){setView('dashboard');window.scrollTo(0,0);return;}\n   if(target==='projects'){setView('projects');window.scrollTo(0,0);return;}\n   if(target==='create'){start();window.scrollTo(0,0);return;}\n   if(target==='models'){setView('catalog');window.scrollTo(0,0);}\n  };\n  window.addEventListener('vitra:navigate',navigate as EventListener);\n  return()=>window.removeEventListener('vitra:navigate',navigate as EventListener);\n },[]);`;
  source=source.replace(anchor,effect);
}

const oldRail='<nav><button className="active"><Icon name="home"/><span>Início</span></button><button onClick={()=>start()}><Icon name="plus"/><span>Criar</span></button><button onClick={()=>setView(\'catalog\')}><Icon name="layers"/><span>Modelos</span></button></nav>';
const newRail='<nav><button className="active"><Icon name="home"/><span>Início</span></button><button onClick={()=>setView(\'projects\')}><Icon name="briefcase"/><span>Projetos</span></button><button onClick={()=>start()}><Icon name="plus"/><span>Criar</span></button><button onClick={()=>setView(\'catalog\')}><Icon name="layers"/><span>Modelos</span></button></nav>';
source=source.replace(oldRail,newRail);

if(!source.includes("if(view==='projects')return")){
  const anchor=" if(view==='catalog')return <Catalog onBack={()=>setView('dashboard')} onChoose={(n,id)=>{setProject(applyTemplate(createProject(n),id));setStep(3);setView('builder')}}/>;";
  if(!source.includes(anchor))throw new Error('VITRA projects view anchor not found');
  const projectsView=` if(view==='projects')return <ProjectsView projects={projects} freeIds={freeIds} onHome={()=>setView('dashboard')} onCreate={()=>start()} onEdit={(item)=>{setProject(upgradeProject(item));setStep(0);setView('builder');window.scrollTo(0,0)}} onPreview={(item,isFree)=>openBrowserPreview(item,isFree)}/>;\n${anchor}`;
  source=source.replace(anchor,projectsView);
}

if(!source.includes('function ProjectsView(')){
  const anchor='\nfunction Catalog(';
  if(!source.includes(anchor))throw new Error('VITRA ProjectsView component anchor not found');
  const component=`\nfunction ProjectsView({projects,freeIds,onHome,onCreate,onEdit,onPreview}:{projects:Project[];freeIds:string[];onHome:()=>void;onCreate:()=>void;onEdit:(item:Project)=>void;onPreview:(item:Project,isFree:boolean)=>void}){\n const ready=projects.filter(p=>p.status==='ready').length;\n return <main className="vxProjectsPage">\n  <header className="vxProjectsPageTop"><div><span>VITRA / PROJETOS</span><h1>Seus sites.</h1><p>Edite, visualize e mantenha todos os sites dos seus clientes em um só lugar.</p></div><button className="vxPrimary" onClick={onCreate}><Icon name="plus" size={16}/> Novo site</button></header>\n  <section className="vxProjectStats"><article><small>TOTAL</small><b>{String(projects.length).padStart(2,'0')}</b><span>sites salvos</span></article><article><small>PRONTOS</small><b>{String(ready).padStart(2,'0')}</b><span>para entrega</span></article><article><small>RASCUNHOS</small><b>{String(projects.length-ready).padStart(2,'0')}</b><span>em edição</span></article></section>\n  {projects.length===0?<section className="vxProjectsEmpty"><span><Icon name="briefcase" size={25}/></span><h2>Nenhum site salvo ainda.</h2><p>Crie o primeiro projeto e ele aparecerá aqui para editar, visualizar e manter depois.</p><button className="vxPrimary" onClick={onCreate}>Criar primeiro site <Icon name="arrowRight" size={15}/></button></section>:<section className="vxProjectsPageGrid">{projects.map(item=>{const isFree=freeIds.includes(item.id);const template=templates.find(t=>t.id===item.templateId);const score=auditProject(item).score;return <article className="vxProjectProCard" key={item.id}><div className="vxProjectProMedia" style={{backgroundImage:\`linear-gradient(180deg,rgba(5,10,9,.04),rgba(5,10,9,.74)),url(${'${item.heroImage||fallback[item.niche].hero}'})\`}}><span className={item.status}>{item.status==='ready'?'PRONTO':'RASCUNHO'}</span><b>{score}/100</b></div><div className="vxProjectProBody"><small>{isFree?'ESTILO LIVRE':nicheNames[item.niche]}</small><h2>{item.name||'Projeto sem nome'}</h2><p>{isFree?'Criação manual':template?.name||'Direção personalizada'}</p><div><button className="vxProjectEdit" onClick={()=>onEdit(item)}><Icon name="palette" size={15}/> Editar</button><button className="vxProjectPreview" onClick={()=>onPreview(item,isFree)}><Icon name="eye" size={15}/> Visualizar</button></div></div></article>})}</section>}\n </main>;\n}\n`;
  source=source.replace(anchor,component+anchor);
}

fs.writeFileSync(path,source);
console.log('VITRA app navigation polish complete.');
