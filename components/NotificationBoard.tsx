"use client";

import React, { useState, useEffect } from "react";
import { Bell, Globe, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export const NotificationBoard = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setIsActive(true);
    }
  }, []);

  const toggleNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      if (!isActive) {
        if ("Notification" in window) {
          Notification.requestPermission().then((p) => {
            if (p === "granted") {
              setIsActive(true);
              toast.success("Notifikasi aktif! Kami akan memberitahu Anda saat OTP masuk.");
            } else {
              toast.error("Izin notifikasi ditolak.");
            }
          });
        }
      } else {
        setIsActive(false);
        toast.success("Notifikasi dinonaktifkan.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="px-5 py-3">
      <div className="card p-5">
        {/* Title */}
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-[#3478f6]" strokeWidth={2.5} />
          <h3 className="text-[16px] font-extrabold text-[#1a2332] tracking-tight">Notifikasi</h3>
        </div>

        {/* Status Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-[#22c55e]" : "bg-[#cbd5e1]"}`} />
            <span className="text-[12px] font-medium text-[#8696a7]">{isActive ? "Aktif" : "Tidak Aktif"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8696a7]">
            <Globe size={14} strokeWidth={2} />
            <span className="text-[11px] font-medium">Browser</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-[#f8fafc] rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-[#8696a7] text-[12px] font-medium border border-[#eef2f6]">
            <RefreshIcon />
            Changes...
          </div>
          <button
            onClick={toggleNotifications}
            disabled={loading}
            className={`flex-1 font-bold text-[13px] py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isActive
                ? "bg-red-50 text-red-500 border border-red-100"
                : "bg-[#3478f6] text-white shadow-lg shadow-blue-200"
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : isActive ? "Nonaktifkan" : "Aktifkan"}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-[#f0f7ff] rounded-2xl p-5 border-l-4 border-[#3478f6]">
          <h4 className="text-[13px] font-extrabold text-[#1a2332] mb-1.5">Message Notifikasi Real-time</h4>
          <p className="text-[11px] leading-relaxed text-[#5a7a9a] font-medium">
            Disarankan menggunakan notifikasi real-time agar SMS message dapat diterima tepat waktu tanpa delay. Status ditutup saat mendaftar nomor.
          </p>
        </div>
      </div>
    </div>
  );
};

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
