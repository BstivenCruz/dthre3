import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Providers } from "@/components/functional/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hansonBold = localFont({
  src: "../../public/fonts/hanson-bold/Hanson-Bold.ttf",
  variable: "--font-hanson-bold",
  display: "swap",
});

export const metadata: Metadata = {
  title: "D-thre3 | Academia de Baile",
  description: "Sistema de gestión para academia de baile urbano D-thre3",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "D-thre3 | Academia de Baile",
    description: "Sistema de gestión para academia de baile urbano",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hansonBold.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
