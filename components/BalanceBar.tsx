import React, { useState, useEffect } from "react";
import { Wallet, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { auth, Profiles } from "@/lib/supabase";

export const BalanceBar = () => {
  const [balance, setBalance] = useState<number | string>("...");
  const [loading, setLoading] = useState(false);

  const [responseTime, setResponseTime] = useState<number | null>(null);

  const fetchBalanceData = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const { user } = await auth.getUser();
      if (user) {
        const { data: profile } = await Profiles.get(user.id);
        if (profile) {
          setBalance(Number(profile.balance) || 0);
        } else {
          const { data: newProfile } = await Profiles.ensureProfile(user.id);
          setBalance(Number(newProfile?.balance) || 0);
        }
      }
    } catch (e) {
      console.error("Failed to fetch user balance", e);
      setBalance(0);
    } finally {
      const end = performance.now();
      setResponseTime(Math.round(end - start));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceData();

    // Listen for global refresh balance events
    const handleRefresh = () => fetchBalanceData();
    window.addEventListener("refreshBalance", handleRefresh);
    return () => window.removeEventListener("refreshBalance", handleRefresh);
  }, []);

  return (
    <div className="px-5 py-2">
      <div className="card p-5 relative overflow-hidden">
        {/* Background glow shadow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3478f6]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        {/* Top Row: Icon + Balance + Top Up */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] flex items-center justify-center">
              <div className="w-9 h-9 rounded-xl bg-[#3478f6] flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Wallet size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-[11px] text-[#8696a7] font-bold uppercase tracking-wider mb-1">Saldo Kamu</p>
              <h2 className="text-solid-theme fw-semibold fs-6 flex items-center gap-2 tracking-tight">
                {loading ? <Loader2 size={16} className="animate-spin text-[#3478f6]" /> : (
                  typeof balance === "number" ? `Rp${balance.toLocaleString("id-ID")}` : balance
                )}
              </h2>
            </div>
          </div>
          <Link
            href="/deposit"
            className="flex items-center gap-2 text-[#22c55e] font-bold text-[13px] py-3 px-5 rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] hover:bg-[#dcfce7] transition-all active:scale-95 shadow-md shadow-green-100"
          >
            <ExternalLink size={14} strokeWidth={2.5} />
            Top Up
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-[#eef2f6] mb-4" />

        {/* Bottom Row: Status + Response Time */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 text-[#22c55e] text-[10px] font-bold bg-[#f0fdf4] border border-[#dcfce7] rounded-lg px-3 py-1.5 uppercase tracking-wide">
            <RefreshCw size={10} strokeWidth={3} className="animate-spin" />
            Server Online
          </div>
          <div className="h-4 w-px bg-[#eef2f6]" />
          <p className="text-[10px] text-[#8696a7] font-bold uppercase tracking-tight">
            <span className="text-[#22c55e]">{responseTime ? `${responseTime}ms` : "..."}</span> response time
          </p>
        </div>
      </div>
    </div>
  );
};
