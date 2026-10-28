import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:'VITRA — Cinematic Site Studio',
    short_name:'VITRA',
    description:'Crie sites cinematográficos para negócios locais em um fluxo simples e guiado.',
    start_url:'/',
    display:'standalone',
    background_color:'#F5F8F7',
    theme_color:'#F5F8F7',
    orientation:'portrait-primary',
    categories:['business','productivity','design'],
    icons:[
      {src:'/vitra-mark.svg',sizes:'any',type:'image/svg+xml',purpose:'any'},
      {src:'/vitra-maskable.svg',sizes:'any',type:'image/svg+xml',purpose:'maskable'}
    ]
  };
}
