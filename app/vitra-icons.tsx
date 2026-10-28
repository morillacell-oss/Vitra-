'use client';

import { SVGProps } from 'react';

export type IconName='home'|'plus'|'layers'|'car'|'sparkle'|'arrowUpRight'|'arrowLeft'|'arrowRight'|'check'|'monitor'|'phone'|'upload'|'image'|'video'|'building'|'briefcase'|'package'|'compare'|'star'|'clock'|'mapPin'|'message'|'help'|'search'|'layout'|'save'|'trash'|'grip'|'palette'|'type'|'eye'|'shield'|'wand'|'target'|'play'|'copy'|'checkCircle'|'chevronDown'|'camera'|'magic'|'globe';

const paths:Record<IconName,React.ReactNode>={
  home:<><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></>,
  plus:<><path d="M12 5v14"/><path d="M5 12h14"/></>,
  layers:<><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  car:<><path d="m5 11 1.7-4.1A3 3 0 0 1 9.5 5h5a3 3 0 0 1 2.8 1.9L19 11"/><path d="M4 11h16a2 2 0 0 1 2 2v4H2v-4a2 2 0 0 1 2-2Z"/><circle cx="6.5" cy="14" r="1"/><circle cx="17.5" cy="14" r="1"/></>,
  sparkle:<><path d="M12 2c.7 4.1 2.9 6.3 7 7-4.1.7-6.3 2.9-7 7-.7-4.1-2.9-6.3-7-7 4.1-.7 6.3-2.9 7-7Z"/><path d="M19 15c.3 2 1.4 3.1 3 3.5-1.6.4-2.7 1.5-3 3.5-.4-2-1.4-3.1-3-3.5 1.6-.4 2.6-1.5 3-3.5Z"/></>,
  arrowUpRight:<><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,arrowLeft:<><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,arrowRight:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,check:<path d="m5 12 4 4L19 6"/>,
  monitor:<><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></>,phone:<><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>,
  upload:<><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v5h16v-5"/></>,image:<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
  video:<><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-2v8l-4-2"/></>,building:<><path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-5h6v5"/><path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01"/></>,
  briefcase:<><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/></>,package:<><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,compare:<><rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/></>,
  star:<path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.4l6.2-.9L12 2.8Z"/>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,mapPin:<><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  message:<><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 10h8M8 14h5"/></>,help:<><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-1.2.8-1.5 1.3-1.5 2.4M12 17h.01"/></>,search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  layout:<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/></>,save:<><path d="M5 3h12l2 2v16H5Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></>,trash:<><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  grip:<><circle cx="9" cy="7" r="1"/><circle cx="15" cy="7" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/></>,palette:<><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 5-5c0-3-4-5-9-5Z"/><circle cx="7.5" cy="9" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="14" cy="6.5" r="1"/></>,
  type:<><path d="M4 6V4h16v2M9 20h6M12 4v16"/></>,eye:<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,shield:<><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  wand:<><path d="m4 20 9-9"/><path d="m12 4 .8 1.8L15 6.5l-2.2.7L12 9l-.8-1.8L9 6.5l2.2-.7L12 4Z"/><path d="m19 11 .6 1.4L21 13l-1.4.6L19 15l-.6-1.4L17 13l1.4-.6L19 11Z"/></>,target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
  play:<><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></>,copy:<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,checkCircle:<><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8"/></>,chevronDown:<path d="m6 9 6 6 6-6"/>,
  camera:<><path d="M4 7h3l2-3h6l2 3h3v13H4Z"/><circle cx="12" cy="13" r="4"/></>,magic:<><path d="m4 20 10-10"/><path d="m13 3 1 2.5L17 7l-3 1.5L13 11l-1-2.5L9 7l3-1.5L13 3Z"/><path d="m19 13 .6 1.5L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.5L19 13Z"/></>,globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 4 5.5 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.5-4-9s1.4-6.5 4-9Z"/></>
};

export function Icon({name,size=18,className,...props}:{name:IconName;size?:number;className?:string}&Omit<SVGProps<SVGSVGElement>,'name'>){return <svg className={`vxIcon ${className||''}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>}
export function Arrow({size=15}:{size?:number}){return <span className="vxArrow"><Icon name="arrowUpRight" size={size}/></span>}
export function Stars({count=5}:{count?:number}){return <span className="vxStars">{Array.from({length:Math.max(1,Math.min(5,count))}).map((_,i)=><Icon name="star" size={13} key={i}/>)}</span>}
