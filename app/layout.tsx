import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import Providers from "./providers";

import 'react-toastify/dist/ReactToastify.css';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chainsight.com';
  
  let logoUrl = `${baseUrl}/logo_nodo.png`;
  let logoText = 'Nodo';


  const title = `${logoText} - Nuestro proyecto`;
  const description = "Nuestro proyecto";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: logoText,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: `Logo de ${logoText}`,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [logoUrl],
    },
    metadataBase: new URL(baseUrl),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  return (
    <html lang="es">
      <head>
        {/* Preconnect a dominios externos para reducir latencia */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href={apiUrl.replace(/^https?:\/\//, '')} />
      </head>
      <body className={`${inter.className} bg-palette-background-primary text-palette-text-primary min-h-screen antialiased`}>
       <Providers>

         {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
       </Providers>
      </body>
    </html>
  );
}
