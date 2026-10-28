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

console.log('VITRA preparation complete.');
