import type { Metadata } from 'next';
import './globals.css';
import './premium.css';
import './refinement.css';
import './runtime.css';
import './cinema.css';
import './experience.css';
import './cinematic-polish.css';

export const metadata: Metadata = {
  title: 'VITRA — Cinematic Site Studio',
  description: 'Crie sites cinematográficos e premium para negócios locais em etapas simples.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
