import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kalkulator Godzin',
  description: 'Oblicz ilość czasu między dwoma określonymi godzinami.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
