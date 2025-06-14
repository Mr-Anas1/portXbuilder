// src/app/layout.js

"use client";

import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// export const metadata = {
//   title: "Your App",
//   description: "Awesome stuff",
// };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProvider>
          <AuthProvider>
            <PortfolioProvider>
              <Toaster position="top-right" />
              {children}
            </PortfolioProvider>
          </AuthProvider>
        </ClerkProvider>
        {/* PayPal Script */}
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&vault=true&intent=subscription`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
