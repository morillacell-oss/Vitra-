import fs from 'node:fs';

function patch(path, marker, from, to) {
  const source = fs.readFileSync(path, 'utf8');
  if (source.includes(marker)) return;
  if (!source.includes(from)) throw new Error(`VITRA patch anchor not found: ${path}`);
  fs.writeFileSync(path, source.replace(from, to));
}

patch(
  'app/vitra-data.ts',
  'export type AnimationLevel',
  "export type HeroFocus = 'left'|'center'|'right';",
  "export type HeroFocus = 'left'|'center'|'right';\nexport type AnimationLevel = 'low'|'medium'|'high';"
);
patch(
  'app/vitra-data.ts',
  'animationLevel:AnimationLevel;',
  'heroFocus:HeroFocus; name:string; eyebrow:string; headline:string; subheadline:string; ctaLabel:string;',
  'heroFocus:HeroFocus; animationLevel:AnimationLevel; name:string; eyebrow:string; headline:string; subheadline:string; ctaLabel:string;'
);
patch(
  'app/vitra-data.ts',
  "heroFocus:'center',animationLevel:'medium'",
  "heroFocus:'center',name:profile.sampleName",
  "heroFocus:'center',animationLevel:'medium',name:profile.sampleName"
);
patch(
  'app/vitra-data.ts',
  'animationLevel:raw.animationLevel||base.animationLevel',
  '...raw,niche,templateId,goal:raw.goal||base.goal,',
  '...raw,niche,templateId,animationLevel:raw.animationLevel||base.animationLevel,goal:raw.goal||base.goal,'
);

const fontBlock = `<span className="vxControlLabel">TIPOGRAFIA</span><div className="vxFontGrid">{Object.entries(fontNames).map(([k,v])=><button className={\`${'${project.fontId===k?\'active\':\'\'}'} sample-${'${k}'}\`} key={k} onClick={()=>setField('fontId',k as Project['fontId'])}><span>Aa</span><b>{v}</b></button>)}</div></div></>}{id==='hero'&&`;
const motionBlock = `<span className="vxControlLabel">TIPOGRAFIA</span><div className="vxFontGrid">{Object.entries(fontNames).map(([k,v])=><button className={\`${'${project.fontId===k?\'active\':\'\'}'} sample-${'${k}'}\`} key={k} onClick={()=>setField('fontId',k as Project['fontId'])}><span>Aa</span><b>{v}</b></button>)}</div><span className="vxControlLabel">ANIMAÇÕES</span><div className="vxMotionGrid">{([{id:'low',label:'Pouca',name:'Sutil',text:'Entradas leves e rápidas. Ideal para sites clean e clínicos.'},{id:'medium',label:'Média',name:'Equilibrada',text:'Movimento refinado, stagger e profundidade sem distrair.'},{id:'high',label:'Muita',name:'Cinematográfica',text:'Revelações mais marcantes, escala e ritmo de campanha.'}] as const).map(m=><button key={m.id} className={project.animationLevel===m.id?'active':''} onClick={()=>setField('animationLevel',m.id)}><span><Icon name={m.id==='high'?'play':m.id==='medium'?'magic':'sparkle'} size={17}/></span><div><small>{m.label.toUpperCase()}</small><b>{m.name}</b><p>{m.text}</p></div>{project.animationLevel===m.id&&<i><Icon name="check" size={12}/></i>}</button>)}</div><small className="vxMotionNote">A prévia aplica o nível em tempo real. Em aparelhos com “reduzir movimento”, o VITRA respeita a preferência automaticamente.</small></div></>}{id==='hero'&&`;
patch('app/studio-v4.tsx', 'vxMotionGrid', fontBlock, motionBlock);

patch(
  'app/site-preview-v2.tsx',
  'useRef } from',
  "import { CSSProperties, useMemo, useState } from 'react';",
  "import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';"
);
patch(
  'app/site-preview-v2.tsx',
  'const motionRoot=useRef',
  "  const automotive=!freeMode&&project.niche==='automotive';",
  "  const automotive=!freeMode&&project.niche==='automotive';\n  const motionRoot=useRef<HTMLElement|null>(null);"
);
patch(
  'app/site-preview-v2.tsx',
  'VITRA_MOTION_OBSERVER',
  "  const autoTags=(serviceNames.length?serviceNames:['PPF','Películas','Detailing','Personalização']).slice(0,4);",
  `  const autoTags=(serviceNames.length?serviceNames:['PPF','Películas','Detailing','Personalização']).slice(0,4);\n\n  // VITRA_MOTION_OBSERVER\n  useEffect(()=>{\n    const root=motionRoot.current;if(!root)return;\n    const items=Array.from(root.querySelectorAll<HTMLElement>('section,.csTrust,.csAutoRibbon,.csFooter'));\n    items.forEach((el,i)=>{el.classList.add('csMotionItem');el.style.setProperty('--motion-index',String(i%6));});\n    if(typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(el=>el.classList.add('is-visible'));return;}\n    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){(entry.target as HTMLElement).classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:0.12,rootMargin:'0px 0px -8% 0px'});\n    items.forEach(el=>observer.observe(el));\n    return()=>observer.disconnect();\n  },[project.animationLevel,project.templateId,project.sections.length,gallery.length]);`
);
patch(
  'app/site-preview-v2.tsx',
  'ref={motionRoot}',
  'return <article className={`clientSite ${freeMode?',
  'return <article ref={motionRoot} className={`clientSite motion-${project.animationLevel||\'medium\'} ${freeMode?'
);

patch(
  'app/auth-gate.tsx',
  "import GitHubConnection from './github-connection';",
  "import { Icon } from './vitra-icons';",
  "import { Icon } from './vitra-icons';\nimport GitHubConnection from './github-connection';"
);
patch(
  'app/auth-gate.tsx',
  'animation_level:String(p.animationLevel',
  "    niche:String(p.niche||'free'),template:String(p.templateId||'custom'),status:String(p.status||'draft'),",
  "    niche:String(p.niche||'free'),template:String(p.templateId||'custom'),status:String(p.status||'draft'),animation_level:String(p.animationLevel||'medium'),"
);
patch(
  'app/auth-gate.tsx',
  '<GitHubConnection/>',
  '      <div className="vxAccountStatus"><i/> Conta conectada • projetos na nuvem</div>',
  '      <div className="vxAccountStatus"><i/> Conta conectada • projetos na nuvem</div>\n      <GitHubConnection/>'
);

/* VITRA_THEME_PALETTE_MAP — common archetypes keep their structure, but each niche gets a more fitting color language. */
patch(
  'app/vitra-data.ts',
  'VITRA_THEME_PALETTE_MAP',
  `function directionSet(niche:Niche):Direction[]{\n if(specialDirections[niche]) return specialDirections[niche]!;\n const profile=nicheCatalog[niche];\n return commonDirections.map((d,i)=>({...d,slug:\`${'${niche}'}-${'${d.slug}'}\`,name:[\`${'${profile.label.split(\' / \')[0]}'} Noir\`,\`${'${profile.label.split(\' / \')[0]}'} Atelier\`,\`${'${profile.label.split(\' / \')[0]}'} Clean\`,\`${'${profile.label.split(\' / \')[0]}'} Impact\`,\`${'${profile.label.split(\' / \')[0]}'} Gallery\`][i]}));\n}`,
  `// VITRA_THEME_PALETTE_MAP\nfunction directionSet(niche:Niche):Direction[]{\n if(specialDirections[niche]) return specialDirections[niche]!;\n const profile=nicheCatalog[niche];\n const paletteMap:Partial<Record<Niche,string[]>>={\n  dentist:['midnight','forest','ice','emerald','ivory'],petshop:['forest','sand','ivory','emerald','blush'],hair:['wine','obsidian','blush','midnight','ivory'],barber:['carbon','obsidian','ivory','carbon','ivory'],aesthetics:['forest','sand','ivory','wine','blush'],restaurant:['wine','obsidian','sand','carbon','ivory'],fitness:['carbon','midnight','ice','carbon','ivory'],tattoo:['carbon','obsidian','ivory','wine','ivory'],realtor:['midnight','sand','ice','forest','ivory'],mechanic:['carbon','obsidian','ice','midnight','ivory'],photographer:['carbon','obsidian','ivory','midnight','ivory'],lawyer:['midnight','obsidian','ivory','forest','ivory']\n };\n const nichePalettes=paletteMap[niche];\n return commonDirections.map((d,i)=>({...d,paletteId:nichePalettes?.[i]||d.paletteId,slug:\`${'${niche}'}-${'${d.slug}'}\`,name:[\`${'${profile.label.split(\' / \')[0]}'} Noir\`,\`${'${profile.label.split(\' / \')[0]}'} Atelier\`,\`${'${profile.label.split(\' / \')[0]}'} Clean\`,\`${'${profile.label.split(\' / \')[0]}'} Impact\`,\`${'${profile.label.split(\' / \')[0]}'} Gallery\`][i]}));\n}`
);

patch(
  'app/vitra-data.ts',
  'VITRA_THEME_FLOW',
  "export function applyTemplate(project:Project,id:TemplateId):Project{const preset=templates.find(t=>t.id===id)||templates.find(t=>t.niche===project.niche)!;return {...project,templateId:preset.id,paletteId:preset.paletteId,fontId:preset.fontId,servicesVariant:preset.services,galleryVariant:preset.gallery,proofVariant:preset.proof};}",
  `// VITRA_THEME_FLOW — a theme changes composition, never the client's content.\nexport function applyTemplate(project:Project,id:TemplateId):Project{\n const preset=templates.find(t=>t.id===id)||templates.find(t=>t.niche===project.niche)!;\n const flow:Record<TemplatePreset['hero'],SectionKey[]>={\n  full:['services','about','gallery','beforeAfter','proof','packages','hours','faq','contact','video'],\n  split:['about','services','gallery','proof','packages','faq','hours','contact','beforeAfter','video'],\n  offset:['services','proof','about','gallery','packages','hours','faq','contact','beforeAfter','video'],\n  poster:['gallery','services','beforeAfter','about','proof','packages','contact','faq','hours','video'],\n  center:['gallery','about','proof','services','packages','faq','contact','hours','beforeAfter','video']\n };\n const enabled=new Set(project.sections);\n const sections=flow[preset.hero].filter(key=>enabled.has(key));\n return {...project,templateId:preset.id,paletteId:preset.paletteId,fontId:preset.fontId,servicesVariant:preset.services,galleryVariant:preset.gallery,proofVariant:preset.proof,sections};\n}`
);

patch(
  'app/studio-v4.tsx',
  "next.status==='ready'?'delivery':'builder'",
  "function edit(item:Project){setProject(upgradeProject(item));setStep(0);setView('builder');window.scrollTo(0,0)}",
  "function edit(item:Project){const next=upgradeProject(item);setProject(next);setStep(0);setView(next.status==='ready'?'delivery':'builder');window.scrollTo(0,0)}"
);

patch(
  'app/studio-v4.tsx',
  'onTheme={(id)=>',
  "if(view==='delivery')return <Delivery project={project} audit={audit} freeMode={freeMode} onDashboard={()=>setView('dashboard')} onEdit={()=>{setStep(0);setView('builder')}} onPreview={()=>setPreviewOpen(true)}/>;",
  "if(view==='delivery')return <Delivery project={project} audit={audit} freeMode={freeMode} onDashboard={()=>setView('dashboard')} onEdit={()=>{setStep(0);setView('builder')}} onPreview={()=>setPreviewOpen(true)} onTheme={(id)=>{const next=applyTemplate(project,id);setProject(next);save(next,'Tema atualizado sem alterar seu conteúdo.')}}/>;"
);

patch(
  'app/studio-v4.tsx',
  'vxThemeLab',
  "function Delivery({project,audit,freeMode,onDashboard,onEdit,onPreview}:{project:Project;audit:ReturnType<typeof auditProject>;freeMode:boolean;onDashboard:()=>void;onEdit:()=>void;onPreview:()=>void}){return <main className=\"vxDelivery\"><header><button onClick={onDashboard}><Icon name=\"home\" size={15}/> Menu</button><span>VITRA / ENTREGA</span></header><section><div className=\"vxDeliveryCopy\"><span>{freeMode?'ESTILO LIVRE':nicheNames[project.niche]} • PROJETO PRONTO</span><h1>{project.name||'Projeto sem nome'}</h1><p>Direção concluída com Quality Score <b>{audit.score}/100</b>.</p><div className=\"vxDeliveryActions\"><button className=\"vxPrimary\" onClick={onPreview}><Icon name=\"eye\" size={15}/> Visualizar site</button><button className=\"vxGhost\" onClick={onEdit}>Continuar editando</button></div></div><div className=\"vxDeliveryDevice\"><SitePreview project={project} freeMode={freeMode}/></div></section></main>}",
  "function Delivery({project,audit,freeMode,onDashboard,onEdit,onPreview,onTheme}:{project:Project;audit:ReturnType<typeof auditProject>;freeMode:boolean;onDashboard:()=>void;onEdit:()=>void;onPreview:()=>void;onTheme:(id:TemplateId)=>void}){const themeOptions=freeMode?[]:templates.filter(t=>t.niche===project.niche);return <main className=\"vxDelivery\"><header><button onClick={onDashboard}><Icon name=\"home\" size={15}/> Menu</button><span>VITRA / ENTREGA</span></header><section><div className=\"vxDeliveryCopy\"><span>{freeMode?'ESTILO LIVRE':nicheNames[project.niche]} • PROJETO PRONTO</span><h1>{project.name||'Projeto sem nome'}</h1><p>Direção concluída com Quality Score <b>{audit.score}/100</b>.</p><div className=\"vxDeliveryActions\"><button className=\"vxPrimary\" onClick={onPreview}><Icon name=\"eye\" size={15}/> Visualizar site</button><button className=\"vxGhost\" onClick={onEdit}>Continuar editando</button></div>{themeOptions.length>0&&<div className=\"vxThemeLab\"><header><div><span>TEMA DO SITE</span><h3>Troque o visual sem perder nada.</h3></div><small>Fotos, vídeos, textos, serviços e contatos permanecem. Só a direção visual e a composição mudam.</small></header><div className=\"vxThemeLabGrid\">{themeOptions.map(t=><button key={t.id} className={project.templateId===t.id?'active':''} onClick={()=>onTheme(t.id)}><span>{t.label}</span><b>{t.name}</b><small>{t.mood}</small>{project.templateId===t.id&&<i><Icon name=\"check\" size={11}/></i>}</button>)}</div></div>}</div><div className=\"vxDeliveryDevice\"><SitePreview project={project} freeMode={freeMode}/></div></section></main>}"
);

console.log('VITRA preparation complete.');