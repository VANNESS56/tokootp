"use client";

import React, { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Activity, CheckCircle2, XCircle, Clock, Filter, Search, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Transaction = {
  id: string;
  type: "deposit" | "purchase";
  app?: string;
  country?: string;
  phone?: string;
  amount: number;
  status: "success" | "canceled" | "waiting" | "received";
  time: string;
  otp?: string;
};

const MOCK_DATA: Transaction[] = [
  { id: "RO137229787", type: "purchase", app: "WhatsApp", country: "Indonesia", phone: "+62 856 4441 4442", amount: 2150, status: "received", time: "Baru saja", otp: "482910" },
  { id: "RO137228123", type: "deposit", amount: 50000, status: "success", time: "5 menit lalu" },
  { id: "RO137227456", type: "purchase", app: "Telegram", country: "Russia", phone: "+7 915 123 4567", amount: 1500, status: "waiting", time: "10 menit lalu" },
  { id: "RO137226789", type: "purchase", app: "Instagram", country: "USA", phone: "+1 555 012 3456", amount: 3200, status: "canceled", time: "1 jam lalu" },
  { id: "RO137225000", type: "deposit", amount: 20000, status: "success", time: "2 jam lalu" },
];

const STATUS_CONFIG = {
  success: { label: "Berhasil", color: "text-[#22c55e]", bg: "bg-green-50", icon: CheckCircle2 },
  received: { label: "OTP Diterima", color: "text-[#3478f6]", bg: "bg-blue-50", icon: CheckCircle2 },
  waiting: { label: "Menunggu", color: "text-[#f59e0b]", bg: "bg-yellow-50", icon: Clock },
  canceled: { label: "Dibatalkan", color: "text-[#ef4444]", bg: "bg-red-50", icon: XCircle },
};

export default function ActivityPage() {
  const [filter, setFilter] = useState<"all" | "deposit" | "purchase">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load local orders
    const savedOrders = localStorage.getItem("toko_otp_orders");
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        const mappedOrders = parsed.map((o: any) => ({
          id: String(o.order_id),
          type: "purchase",
          app: o.service,
          phone: o.phone_number,
          amount: o.amount || 0,
          status: o.status === "waiting" ? "waiting" : (o.status === "received" ? "received" : "canceled"),
          time: o.time || "Baru saja",
          otp: o.otp || null
        }));
        setTransactions(mappedOrders);
      } catch (e) {
        console.error("Activity load error:", e);
      }
    }
  }, []);

  const filtered = transactions.filter(t => filter === "all" || t.type === filter);

  return (
    <main className="flex-1 overflow-y-auto pb-28">
      {/* Header */}
      <div className="px-5 pt-8 pb-2 flex items-center justify-between">
        <Link href="/" className="w-10 h-10 rounded-xl bg-white border border-[#eef2f6] flex items-center justify-center text-[#8696a7] active:scale-90 transition-transform">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-[16px] font-extrabold text-[#1a2332]">Riwayat Aktivitas</h1>
        <button className="w-10 h-10 rounded-xl bg-white border border-[#eef2f6] flex items-center justify-center text-[#8696a7] active:scale-90 transition-transform">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-4 flex gap-2">
        {(["all", "purchase", "deposit"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`py-2.5 px-5 rounded-xl text-[12px] font-bold transition-all active:scale-95 ${
              filter === f
                ? "bg-[#3478f6] text-white shadow-md shadow-blue-200"
                : "bg-white border border-[#eef2f6] text-[#8696a7]"
            }`}
          >
            {f === "all" ? "Semua" : f === "deposit" ? "Deposit" : "OTP Order"}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="px-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] flex items-center justify-center text-[#cbd5e1] mb-4">
              <Activity size={28} />
            </div>
            <p className="text-[13px] font-bold text-[#8696a7]">Belum ada aktivitas.</p>
          </div>
        ) : (
          filtered.map((tx, idx) => {
            const cfg = STATUS_CONFIG[tx.status];
            const isExpanded = expandedId === tx.id;
            const StatusIcon = cfg.icon;

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                  className="w-full card p-5 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center ${cfg.color}`}>
                        {tx.type === "deposit" ? (
                          <span className="text-[14px] font-black">+</span>
                        ) : (
                          <Activity size={18} strokeWidth={2.5} />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#1a2332] leading-tight mb-0.5">
                          {tx.type === "deposit" ? "Top Up Saldo" : tx.app}
                        </p>
                        <p className="text-[10px] text-[#8696a7] font-medium">
                          {tx.type === "deposit" ? "Deposit QRIS" : tx.country}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[13px] font-extrabold ${tx.type === "deposit" ? "text-[#22c55e]" : "text-[#1a2332]"}`}>
                        {tx.type === "deposit" ? "+" : "-"}Rp{tx.amount.toLocaleString("id-ID")}
                      </p>
                      <p className="text-[9px] text-[#b0bec5] font-medium">{tx.time}</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-[#eef2f6] space-y-2.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#8696a7] font-medium">ID Transaksi</span>
                            <span className="text-[#1a2332] font-bold text-[10px]">{tx.id}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#8696a7] font-medium">Status</span>
                            <span className={`font-bold text-[11px] flex items-center gap-1 ${cfg.color}`}>
                              <StatusIcon size={12} strokeWidth={3} /> {cfg.label}
                            </span>
                          </div>
                          {tx.phone && (
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#8696a7] font-medium">Nomor</span>
                              <span className="text-[#1a2332] font-bold">{tx.phone}</span>
                            </div>
                          )}
                          {tx.otp && (
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#8696a7] font-medium">Kode OTP</span>
                              <span className="text-[#3478f6] font-extrabold tracking-widest text-[14px]">{tx.otp}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </main>
  );
}
