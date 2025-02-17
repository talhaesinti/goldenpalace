// app/layout.js

import Layout from '../layouts/Layout';
import '../styles/globals.css';
import { Roboto, Montserrat } from 'next/font/google';

// Roboto font tanımlaması
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-roboto',
});

// Montserrat font tanımlaması
const montserrat = Montserrat({
  weight: ['500', '600', '700'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://goldencastletravel.com'),
  title: {
    template: '%s | Golden Castle Travel',
    default: 'Golden Castle Travel | Yurt İçi ve Yurt Dışı Turlar'
  },
  description: 'Golden Castle Travel olarak, 31 ülkelik deneyimimizle Balkanlar\'dan Afrika\'ya, Ortadoğu\'dan Avrupa\'ya uzanan kültürel ve manevi turlar düzenliyoruz. Hac, Umre ve Kudüs turları ile manevi yolculuğunuza eşlik ediyoruz.',
  keywords: ['tur', 'seyahat', 'yurt içi turlar', 'yurt dışı turlar', 'Balkan turları', 'Afrika turları', 'Ortadoğu turları', 'Hac', 'Umre', 'Kudüs turları', 'kültürel turlar', 'manevi turlar', 'Golden Castle Travel'],
  authors: [{ name: 'Golden Castle Travel' }],
  creator: 'Golden Castle Travel',
  publisher: 'Golden Castle Travel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://goldencastletravel.com',
    siteName: 'Golden Castle Travel',
    title: {
      template: '%s | Golden Castle Travel',
      default: 'Golden Castle Travel | Yurt İçi ve Yurt Dışı Turlar'
    },
    description: 'Golden Castle Travel olarak, 31 ülkelik deneyimimizle Balkanlar\'dan Afrika\'ya, Ortadoğu\'dan Avrupa\'ya uzanan kültürel ve manevi turlar düzenliyoruz.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Golden Castle Travel - Yurt İçi ve Yurt Dışı Turlar',
        type: 'image/jpeg',
      },
      {
        url: '/images/og-image-square.jpg',
        width: 600,
        height: 600,
        alt: 'Golden Castle Travel - Yurt İçi ve Yurt Dışı Turlar',
        type: 'image/jpeg',
        description: 'Dünya deneyimli ekibimiz ile benzersiz rotalarda unutulmaz seyahatler',
      }
    ],
  },
  other: {
    'whatsapp-catalog-id': 'golden-castle-travel',
    'og:image:secure_url': 'https://goldencastletravel.com/images/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s | Golden Castle Travel',
      default: 'Golden Castle Travel | Kültürel ve Manevi Turlar'
    },
    description: 'Balkanlar\'dan Afrika\'ya, Ortadoğu\'dan Avrupa\'ya uzanan kültürel ve manevi turlar. Hac, Umre ve Kudüs turları ile manevi yolculuğunuza eşlik ediyoruz.',
    images: ['/images/og-image-square.jpg'],
    creator: '@goldencastletravel',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* Production API için preconnect */}
        <link rel="preconnect" href="https://api.goldencastletravel.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.goldencastletravel.com" />
        
        {/* Ana site için preconnect */}
        <link rel="preconnect" href="https://goldencastletravel.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://goldencastletravel.com" />
      </head>
      <body className={`${roboto.variable} ${montserrat.variable} bg-[#f7f9fc] text-[#2c3e50]`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
