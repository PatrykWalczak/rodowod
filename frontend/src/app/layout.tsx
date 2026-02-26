import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RodoWod",
  description: "Platforma dla hodowców i właścicieli psów rasowych",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
