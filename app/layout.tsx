import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tokootp.app"),
  title: {
    default: "Toko OTP - Penyedia Nomor Virtual & Verifikasi OTP Instan 24 Jam",
    template: "%s | Toko OTP"
  },
  description: "Dapatkan nomor virtual berkualitas untuk verifikasi OTP 1.700+ aplikasi dari 70+ negara secara instan, otomatis, dan terpercaya 24 jam nonstop.",
  keywords: ["OTP", "Virtual Number", "Nomor Virtual", "Verifikasi SMS", "Toko OTP", "SMS Verification", "Jasa Nomor Virtual"],
  authors: [{ name: "Toko OTP" }],
  creator: "Toko OTP",
  publisher: "Toko OTP",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Toko OTP - Penyedia Nomor Virtual & Verifikasi OTP Instan 24 Jam",
    description: "Layanan verifikasi OTP tercepat dan termurah di Indonesia. Ribuan nomor dari berbagai negara siap digunakan.",
    type: "website",
    locale: "id_ID",
    url: "https://tokootp.app",
    siteName: "Toko OTP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toko OTP - Verifikasi OTP Instan",
    description: "Nomor virtual instan untuk semua aplikasi dari berbagai negara.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json"
};

export const viewport = {
  themeColor: "#3478f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
