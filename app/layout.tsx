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

export const metadata: Metadata = {
  title: 'VITRA — Cinematic Site Studio',
  description: 'Crie sites cinematográficos e premium para negócios locais em etapas simples.',
  applicationName:'VITRA',
  manifest:'/manifest.webmanifest',
  icons:{icon:'/vitra-mark.svg',apple:'/vitra-mark.svg'},
  appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'VITRA'},
  formatDetection:{telephone:false}
};

export const viewport: Viewport = {
  width:'device-width',
  initialScale:1,
  viewportFit:'cover',
  themeColor:'#090A0D',
  colorScheme:'dark'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
