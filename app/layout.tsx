import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_KR } from 'next/font/google';
import "./globals.css";
import { Header } from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { DarkModeProvider } from "@/components/providers/DarkModeProvider";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: "Exhibition VR - Digital Twin Virtual Tours",
  description: "Experience art exhibitions in immersive virtual reality through our digital twin technology",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable} ${notoSansKR.variable}`}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans antialiased pb-16">
        <DarkModeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <BottomNav />
        </DarkModeProvider>
      </body>
    </html>
  );
}
