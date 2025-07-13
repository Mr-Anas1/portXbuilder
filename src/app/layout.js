// src/app/layout.js

"use client";

import { Inter, Montserrat, Lato } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
});

// export const metadata = {
//   title: "Your App",
//   description: "Awesome stuff",
// };
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>
            PortXBuilder – Portfolio Creator & Generator | Build Your Portfolio
            Website
          </title>
          <meta name="google-adsense-account" content="ca-pub-5542805617135767" />
          <meta
            name="description"
            content="Create your professional portfolio website in minutes with PortXBuilder. The easiest portfolio creator and generator for developers, designers, and creators. No code needed!"
          />
          <meta
            name="keywords"
            content="portfolio creator, portfolio generator, build portfolio website, online portfolio, portfolio builder, personal website, developer portfolio, designer portfolio"
          />
          <meta
            property="og:title"
            content="PortXBuilder – Portfolio Creator & Generator"
          />
          <meta
            property="og:description"
            content="Create your professional portfolio website in minutes. No code needed!"
          />
          <meta property="og:image" content="/logo.png" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.portxbuilder.com/" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="PortXBuilder – Portfolio Creator & Generator"
          />
          <meta
            name="twitter:description"
            content="Create your professional portfolio website in minutes. No code needed!"
          />
          <meta name="twitter:image" content="/logo.png" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/android-chrome-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="/android-chrome-512x512.png"
          />
          {/* Add manifest if present */}
          <link rel="manifest" href="/site.webmanifest" />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-TFXG1EFHHP"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TFXG1EFHHP');
            `}
          </Script>
        </head>
        <body
          className={`${lato.variable} ${montserrat.variable} font-sans antialiased`}
        >
          <AuthProvider>
            <PortfolioProvider>
              <Toaster position="top-right" />
              {children}
            </PortfolioProvider>
          </AuthProvider>

          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
