import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VITRA — Site Studio',
  description: 'Crie sites premium para negócios locais em minutos.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
