import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockCert | Blockchain-Based Academic Credential Verification Platform",
  description: "Secure, tamper-evident academic credential verification platform using Ed25519 digital signatures, SHA-256 hash chains, and permanent QR codes.",
  keywords: ["academic credentials", "blockchain verification", "digital diploma", "Ed25519", "tamper-proof", "BlockCert"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
