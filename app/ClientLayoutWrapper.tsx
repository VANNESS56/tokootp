"use client";

import { usePathname } from "next/navigation";
import { MaintenanceGuard } from "@/components/MaintenanceGuard";
import { Toaster } from "react-hot-toast";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMemberPage = pathname?.startsWith("/member");
  const isLoginPage = pathname?.startsWith("/login");
  const isRegisterPage = pathname?.startsWith("/register");
  
  // Dashboard, Login, Register keep the mobile container for PWA feel.
  const useMobileContainer = isMemberPage || isLoginPage || isRegisterPage;

  return (
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
    </MaintenanceGuard>
  );
}
