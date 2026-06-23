import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata = {
  title: 'AutoFlow Solutions — Business Automation Experts',
  description: 'Custom automation workflows that eliminate manual work and unlock growth for businesses worldwide. Zapier, Make.com, n8n, Stripe, API integrations and more.',
  keywords: 'business automation, workflow automation, Zapier, Make.com, n8n, web scraping, API integration, email automation',
  authors: [{ name: 'Ezabul Bari' }],
  openGraph: {
    title: 'AutoFlow Solutions — Business Automation Experts',
    description: 'Save time and scale faster with custom automation built by Ezabul Bari.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoFlow Solutions — Business Automation Experts',
    description: 'Save time and scale faster with custom automation.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
