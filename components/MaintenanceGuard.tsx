"use client";

import React, { useEffect, useState } from "react";
import { Settings, auth, Profiles } from "@/lib/supabase";
import { Loader2, Construction, ShieldAlert } from "lucide-react";

export const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // 1. Check Settings
        const { data: sys } = await Settings.get();
        const maintenanceActive = Boolean(sys?.maintenance_mode);
        setIsMaintenance(maintenanceActive);

        // 2. Check User (Admins bypass maintenance)
        const { user } = await auth.getUser();
        if (user) {
          const { data: profile } = await Profiles.get(user.id);
          const adminEmails = ['admin@vanness.store', 'vanness.id@gmail.com', 'vannessvanness56@gmail.com'];
          if (adminEmails.includes(user.email || "") || profile?.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (e) {
        console.error("Maintenance check failed", e);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4e73df]" size={32} />
      </div>
    );
  }

  const path = typeof window !== 'undefined' ? window.location.pathname : "";
  const isExcludedPath = path.startsWith('/admin') || path.startsWith('/login') || path.startsWith('/register');

  // If Maintenance is Active and User is NOT Admin and not on excluded path
  if (isMaintenance && !isAdmin && path !== "" && !isExcludedPath) {
    return (
      <div className="fixed inset-0 bg-[#f8f9fc] z-[9999] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full">
           <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction size={40} />
           </div>
           <h1 className="text-xl font-extrabold text-[#1a2332] mb-2 tracking-tight">MAINTENANCE MODE</h1>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Halo Kak! Saat ini sistem kami sedang dalam perbaikan rutin untuk meningkatkan kualitas layanan.
           </p>
           
           <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-[9px] text-slate-300 font-semibold uppercase tracking-[0.2em]">TOKO OTP &bull; 2026</p>
           </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
