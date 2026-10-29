import type { Metadata, Viewport } from 'next';
import './globals.css';
import './premium.css';
import './refinement.css';
import './runtime.css';
import './cinema.css';
import './experience.css';
import './cinematic-polish.css';
import './automotive-cinema.css';
import './verticals.css';
import './app-shell.css';
import './light-shell.css';
import './free-style.css';
import './auth.css';
import './integrations-motion.css';
import './motion-polish.css';
import './mobile-dashboard-polish.css';
import './theme-dna.css';
import './app-navigation-v3.css';
import './quality-pass.css';
import './agency-grade-v2.css';
import './template-master-v3.css';
import './niche-art-direction-v4.css';
import './final-qa-v5.css';
import './automotive-five-v6.css';
import './art-direction-curation-v7.css';
import './max-quality-v8.css';
import './mobile-shell-v9.css';
import './project-manager-v10.css';
import ProjectCardManager from './project-card-manager';

export const metadata: Metadata = {
  title: 'VITRA — Cinematic Site Studio',
  description: 'Crie sites cinematográficos e premium para negócios locais em etapas simples.',
  applicationName:'VITRA',
  manifest:'/manifest.webmanifest',
  icons:{icon:'/vitra-mark.svg',apple:'/vitra-mark.svg'},
  appleWebApp:{capable:true,statusBarStyle:'default',title:'VITRA'},
  formatDetection:{telephone:false}
};
export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#F5F8F7',colorScheme:'light dark'};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {return <html lang="pt-BR"><body>{children}<ProjectCardManager/></body></html>}
