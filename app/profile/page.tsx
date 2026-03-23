"use client";

import React, { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { User, LogOut, ChevronRight, Settings, Shield, Bell, LayoutDashboard, HelpCircle, Star, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { auth, Profiles } from "@/lib/supabase";
import { RumahOTP } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | string>("...");
  const [stats, setStats] = useState({ total: 0, successRate: "100%" });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initProfile = async () => {
      setLoading(true);
      try {
        // 1. Get User
        const { user: sbUser } = await auth.getUser();
        if (sbUser) {
          setUser(sbUser);
          
          // Ensure profile and get balance
          await Profiles.ensureProfile(sbUser.id);
          const { data: profile } = await Profiles.get(sbUser.id);
          if (profile) setBalance(profile.balance || 0);

          const isUserAdmin = 
            sbUser.email === "admin@vanness.store" || 
            sbUser.email === "vanness.id@gmail.com" || 
            sbUser.email === "vannessvanness56@gmail.com" || 
            profile?.role === "admin";
          setIsAdmin(isUserAdmin);
        }

        // 3. Get Stats from localStorage
        const saved = localStorage.getItem("toko_otp_orders");
        if (saved) {
          try {
            const orders = JSON.parse(saved);
            const successCount = orders.filter((o: any) => o.status === "received" || o.status === "success").length;
            const rate = orders.length > 0 ? Math.round((successCount / orders.length) * 100) : 100;
            setStats({ total: orders.length, successRate: `${rate}%` });
          } catch (e) {
            console.error("Stats parse error:", e);
          }
        }
      } catch (e) {
        console.error("Profile init error:", e);
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Berhasil keluar.");
      router.push("/login");
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "...";

  const menuGroups = [
    {
      title: "Akun",
      items: [
        { name: "Informasi Profil", desc: "Nama, email, telepon", icon: User, color: "text-[#3478f6]", bg: "bg-blue-50" },
        { name: "Pengaturan Keamanan", desc: "Password, 2FA", icon: Shield, color: "text-[#22c55e]", bg: "bg-green-50" },
        { name: "Preferensi Notifikasi", desc: "Browser, email", icon: Bell, color: "text-[#f97316]", bg: "bg-orange-50" },
      ],
    },
    {
      title: "Lainnya",
      items: [
        { name: "Pusat Bantuan", desc: "FAQ & support", icon: HelpCircle, color: "text-[#8b5cf6]", bg: "bg-purple-50" },
        { name: "Beri Rating", desc: "Ulasan & masukan", icon: Star, color: "text-[#eab308]", bg: "bg-yellow-50" },
      ],
    },
  ];

  if (loading && !user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3478f6]" />
        <p className="mt-4 text-[12px] font-bold text-[#8696a7]">Memuat profil...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pb-28">
      {/* Profile Card */}
      <div className="px-5 pt-8 pb-2">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#3a4a5c] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-slate-200 uppercase">
                {displayName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#22c55e] border-3 border-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-extrabold text-[#1a2332] leading-tight capitalize">{displayName}</h2>
              <p className="text-[11px] text-[#8696a7] font-medium mb-2">{displayEmail}</p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-[#3478f6] bg-[#e8f0fe] px-2.5 py-1 rounded-lg uppercase tracking-wider">Member</span>
                <span className="text-[9px] font-bold text-[#22c55e] bg-green-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">Aktif</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#eef2f6] flex items-center justify-center text-[#8696a7] active:scale-90 transition-transform">
              <Settings size={16} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#f8fafc] rounded-2xl p-4 text-center border border-[#eef2f6]">
              <p className="text-[16px] font-extrabold text-[#1a2332]">
                {typeof balance === "number" ? `Rp${balance.toLocaleString("id-ID")}` : balance}
              </p>
              <p className="text-[9px] text-[#8696a7] font-bold uppercase tracking-wider mt-0.5">Saldo (IDR)</p>
            </div>
            <div className="bg-[#f8fafc] rounded-2xl p-4 text-center border border-[#eef2f6]">
              <p className="text-[16px] font-extrabold text-[#1a2332]">{stats.total}</p>
              <p className="text-[9px] text-[#8696a7] font-bold uppercase tracking-wider mt-0.5">Transaksi</p>
            </div>
            <div className="bg-[#f8fafc] rounded-2xl p-4 text-center border border-[#eef2f6]">
              <p className="text-[16px] font-extrabold text-[#22c55e]">{stats.successRate}</p>
              <p className="text-[9px] text-[#8696a7] font-bold uppercase tracking-wider mt-0.5">Sukses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="px-5 py-2">
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#3478f6]">
              <Copy size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] text-[#8696a7] font-medium">Kode Referral</p>
              <p className="text-[14px] font-extrabold text-[#1a2332] tracking-wider uppercase">{user?.id?.slice(0, 8) || "VANNESS-001"}</p>
            </div>
          </div>
          <button
            onClick={() => { 
                const code = user?.id?.slice(0, 8) || "VANNESS-001";
                navigator.clipboard.writeText(code); 
                toast.success("Kode disalin!"); 
            }}
            className="text-[11px] font-bold text-[#3478f6] bg-[#e8f0fe] px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            Salin
          </button>
        </div>
      </div>

      {/* Admin Access */}
      {isAdmin && (
        <div className="px-5 py-2">
          <Link href="/admin" className="card p-4 flex items-center justify-between group active:scale-[0.98] transition-transform block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a2332] flex items-center justify-center text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={18} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#1a2332]">Dashboard Admin</p>
                <p className="text-[10px] text-[#8696a7] font-medium">Kontrol database & integrasi</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#cbd5e1] group-hover:text-[#1a2332] transition-colors" />
          </Link>
        </div>
      )}

      {/* Menu Groups */}
      {menuGroups.map((group) => (
        <div key={group.title} className="px-5 py-2">
          <p className="text-[10px] font-bold text-[#8696a7] uppercase tracking-[0.15em] mb-2 px-1">{group.title}</p>
          <div className="card overflow-hidden divide-y divide-[#eef2f6]">
            {group.items.map((item) => (
              <button key={item.name} className="w-full flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors active:scale-[0.98] group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon size={18} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-[#1a2332] leading-tight">{item.name}</p>
                    <p className="text-[10px] text-[#8696a7] font-medium">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#cbd5e1] group-hover:text-[#8696a7] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="px-5 py-4">
        <button 
          onClick={handleLogout}
          className="w-full card p-4 flex items-center justify-center gap-2 text-red-500 font-bold text-[13px] hover:bg-red-50 transition-colors active:scale-95"
        >
          <LogOut size={16} strokeWidth={2.5} />
          Keluar dari Akun
        </button>
      </div>

      <BottomNav />
    </main>
  );
}

