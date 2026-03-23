"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { MaintenanceGuard } from "@/components/MaintenanceGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isMemberPage = pathname?.startsWith("/member");
  const isLoginPage = pathname?.startsWith("/login");
  const isRegisterPage = pathname?.startsWith("/register");
  
  // Dashboard, Login, Register keep the mobile container for PWA feel.
  const useMobileContainer = isMemberPage || isLoginPage || isRegisterPage;

  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        <MaintenanceGuard>
          {useMobileContainer ? (
            <div className="main-container flex flex-col relative pb-28">
              {children}
            </div>
          ) : (
            <div className="min-h-screen">
              {children}
            </div>
          )}
        </MaintenanceGuard>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: { 
                borderRadius: '14px', 
                background: '#1a2332', 
                color: '#fff', 
                fontSize: '13px', 
                fontWeight: '600', 
                padding: '14px 20px' 
              }
            }} 
          />
        </body>
      </html>
    );
}
