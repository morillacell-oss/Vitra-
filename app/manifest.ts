import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:'VITRA — Cinematic Site Studio',
    short_name:'VITRA',
    description:'Crie sites cinematográficos para negócios locais em um fluxo simples e guiado.',
    start_url:'/',
    display:'standalone',
    background_color:'#090A0D',
    theme_color:'#090A0D',
    orientation:'portrait-primary',
    categories:['business','productivity','design'],
    icons:[
      {src:'/vitra-mark.svg',sizes:'any',type:'image/svg+xml',purpose:'any'},
      {src:'/vitra-maskable.svg',sizes:'any',type:'image/svg+xml',purpose:'maskable'}
    ]
  };
}
