"use client";

import React, { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, ChevronRight, ChevronLeft, QrCode, Check, Loader2, X, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { RumahOTP } from "@/lib/api";
import { toast } from "react-hot-toast";
import { auth, Profiles } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const PRESETS = [
  { amount: 2000, label: "Rp2.000", tag: "Hemat ✨" },
  { amount: 20000, label: "Rp20.000", tag: "Populer 🔥" },
  { amount: 50000, label: "Rp50.000", tag: "Rekomen 😎" },
  { amount: 70000, label: "Rp70.000", tag: "Juragan 🍌" },
  { amount: 100000, label: "Rp100.000", tag: "Bosman 🎩" },
  { amount: 200000, label: "Rp200.000", tag: "VVIP 🔥" },
];

type DepositData = {
  id: string;
  status: string;
  total: number;
  fee: number;
  diterima: number;
  qr_string: string;
  qr_image: string;
  created_at: string;
  expired_at: string;
} | null;

export default function DepositPage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [depositData, setDepositData] = useState<DepositData>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");

  const effectiveAmount = selectedPreset !== null ? PRESETS[selectedPreset].amount : parseInt(customAmount) || 0;

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    setCustomAmount("");
    setAmount(PRESETS[index].amount);
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    setSelectedPreset(null);
    setAmount(parseInt(val) || 0);
  };

  const handleConfirm = async () => {
    if (effectiveAmount < 2000) {
      toast.error("Minimal deposit Rp2.000");
      return;
    }
    if (effectiveAmount > 1000000) {
      toast.error("Maksimal deposit Rp1.000.000");
      return;
    }
    setLoading(true);
    try {
      const res = await RumahOTP.createDeposit(effectiveAmount, "qris");
      if (res.success) {
        setDepositData(res.data);
        setStep(4); // Go to QR / payment step
        toast.success("Tagihan berhasil dibuat!");
      } else {
        toast.error(res.message || "Gagal membuat tagihan.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!depositData || paymentStatus === "success") return;
    setCheckingStatus(true);
    try {
      const res = await RumahOTP.getDepositStatus(depositData.id);
      if (res.success) {
        setPaymentStatus(res.data.status);
        if (res.data.status === "success") {
          // 1. Get current user
          const { user } = await auth.getUser();
          if (user) {
            // 2. Get current profile balance
            const { data: profile } = await Profiles.get(user.id);
            if (profile) {
              const depositedAmount = depositData.diterima;
              const newBalance = (profile.balance || 0) + depositedAmount;
              
              // 3. Update balance in Supabase
              const updateRes = await Profiles.updateBalance(user.id, newBalance);
              if (!updateRes.error) {
                toast.success(`Pembayaran berhasil! Rp${depositedAmount.toLocaleString("id-ID")} ditambahkan ke saldo.`);
              } else {
                toast.error("Gagal mengupdate saldo. Hubungi admin.");
              }
            }
          }
        } else if (res.data.status === "cancel") {
          toast.error("Pembayaran dibatalkan.");
        }
      }
    } catch (e) {
      console.error("Check status error:", e);
      toast.error("Gagal cek status.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCancel = async () => {
    if (!depositData) return;
    setLoading(true);
    try {
      const res = await RumahOTP.cancelDeposit(depositData.id);
      if (res.success) {
        toast.success("Deposit dibatalkan.");
        setStep(1);
        setDepositData(null);
        setPaymentStatus("pending");
      }
    } catch {
      toast.error("Gagal membatalkan.");
    } finally {
      setLoading(false);
    }
  };

  const formatRp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
  const now = new Date();
  const dateStr = `${now.getDate()} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2,"0")}.${String(now.getMinutes()).padStart(2,"0")} WIB`;

  return (
    <main className="flex-1 overflow-y-auto pb-28">
      {/* Header */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="w-10 h-10 rounded-xl bg-white border border-[#eef2f6] flex items-center justify-center text-[#8696a7] active:scale-90 transition-transform">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-[16px] font-extrabold text-[#1a2332]">Payment Deposit</h1>
        <div className="w-10" />
      </div>

      {/* Stepper */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s ? "bg-[#3478f6] text-white shadow-lg shadow-blue-200" : "bg-[#eef2f6] text-[#b0bec5]"
                }`}>
                  {step > s ? <Check size={16} strokeWidth={3} /> : s}
                </div>
                <span className={`text-[11px] font-bold ${step >= s ? "text-[#3478f6]" : "text-[#b0bec5]"}`}>
                  {s === 1 ? "Jumlah" : s === 2 ? "Metode" : "Konfirmasi"}
                </span>
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-20px] rounded-full transition-colors ${step > s ? "bg-[#3478f6]" : "bg-[#eef2f6]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            {/* Preset Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {PRESETS.map((p, i) => (
                <button
                  key={p.amount}
                  onClick={() => handlePresetSelect(i)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all active:scale-95 ${
                    selectedPreset === i
                      ? "border-[#3478f6] bg-[#e8f0fe] shadow-md shadow-blue-100"
                      : "border-[#eef2f6] bg-white hover:border-[#3478f6]/30"
                  }`}
                >
                  <p className={`text-[14px] font-extrabold ${selectedPreset === i ? "text-[#3478f6]" : "text-[#1a2332]"}`}>
                    {p.label}
                  </p>
                  <p className="text-[10px] text-[#8696a7] font-medium mt-1">{p.tag}</p>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="card p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-bold text-[#1a2332]">Masukan nominal</p>
                <span className="text-[9px] font-bold text-[#3478f6] bg-[#e8f0fe] px-2.5 py-1 rounded-lg">MIN RP 2.000 | MAX RP 1.000.000</span>
              </div>
              <div className="flex items-center gap-3 bg-[#f8fafc] rounded-2xl border border-[#eef2f6] p-4">
                <span className="text-[15px] font-extrabold text-[#8696a7]">Rp</span>
                <input
                  type="number"
                  placeholder="Masukkan nominal"
                  value={customAmount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[15px] font-bold text-[#1a2332] placeholder:text-[#cbd5e1]"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="card p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-bold text-[#1a2332]">Pembayaran</span>
                <span className="text-[15px] font-extrabold text-[#1a2332]">{formatRp(effectiveAmount)}</span>
              </div>
              <div className="border-t border-[#eef2f6] pt-3 space-y-2">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#8696a7] font-medium">Nominal</span>
                  <span className="text-[#1a2332] font-bold">{formatRp(effectiveAmount)}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#8696a7] font-medium">Admin</span>
                  <span className="text-[#1a2332] font-bold">{formatRp(0)}</span>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => effectiveAmount >= 2000 ? setStep(2) : toast.error("Minimal Rp2.000")}
              className="w-full bg-[#3478f6] text-white font-bold text-[14px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-200"
            >
              Lanjutkan <ChevronRight size={16} strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <div className="text-center mb-6">
              <h2 className="text-[18px] font-extrabold text-[#1a2332] mb-1">Pilih Metode Pembayaran</h2>
              <p className="text-[12px] text-[#8696a7] font-medium">Silakan pilih metode untuk membayar transaksi</p>
            </div>

            {/* Payment Amount */}
            <div className="card p-4 mb-6 flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#1a2332]">Pembayaran</span>
              <span className="text-[15px] font-extrabold text-[#1a2332]">{formatRp(effectiveAmount)}</span>
            </div>

            {/* QRIS Option */}
            <div className="mb-4">
              <p className="text-[13px] font-extrabold text-[#1a2332] mb-3">Pembayaran Indonesia</p>
              <div className="card p-5 border-2 border-[#3478f6] bg-[#fafcff]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f8fafc] border border-[#eef2f6] flex items-center justify-center">
                    <QrCode size={24} className="text-[#1a2332]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-[#1a2332]">QRIS</p>
                      <span className="text-[9px] font-bold text-[#8696a7] bg-[#eef2f6] px-2 py-0.5 rounded-md">~ 2 menit</span>
                    </div>
                    <p className="text-[11px] text-[#8696a7] font-medium">Pembayaran Instan</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#3478f6] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3478f6]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white border border-[#eef2f6] text-[#1a2332] font-bold text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <ChevronLeft size={14} strokeWidth={3} /> Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-[2] bg-[#3478f6] text-white font-bold text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-200"
              >
                Lanjutkan <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <div className="card p-6 mb-6">
              {/* QR Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] border border-[#eef2f6] flex items-center justify-center">
                  <QrCode size={32} className="text-[#8696a7]" />
                </div>
              </div>

              <h3 className="text-[16px] font-extrabold text-[#1a2332] text-center mb-6">Detail Pembayaran</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#eef2f6]">
                  <span className="text-[12px] text-[#8696a7] font-medium">Metode</span>
                  <span className="text-[14px] font-extrabold text-[#1a2332]">QRIS</span>
                </div>
                <div className="flex justify-between items-start pb-3 border-b border-[#eef2f6]">
                  <span className="text-[12px] text-[#8696a7] font-medium">Tanggal Transaksi</span>
                  <span className="text-[13px] font-bold text-[#1a2332] text-right">{dateStr}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-[#eef2f6]">
                  <span className="text-[12px] text-[#8696a7] font-medium">Currency</span>
                  <span className="text-[14px] font-bold text-[#1a2332]">IDR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8696a7] font-medium">Nominal</span>
                  <span className="text-[13px] font-bold text-[#1a2332]">{formatRp(effectiveAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8696a7] font-medium">Biaya Admin</span>
                  <span className="text-[13px] font-bold text-[#1a2332]">-</span>
                </div>
                <div className="border-t border-[#eef2f6] pt-3 flex justify-between">
                  <span className="text-[13px] font-bold text-[#8696a7]">Total Pembayaran</span>
                  <span className="text-[15px] font-extrabold text-[#3478f6]">{formatRp(effectiveAmount)}</span>
                </div>
              </div>

              <p className="text-[10px] text-[#8696a7] text-center mt-6 font-medium">
                Payment Gateway oleh <span className="font-bold text-[#1a2332]">VANNESS STORE</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white border border-[#eef2f6] text-[#1a2332] font-bold text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <ChevronLeft size={14} strokeWidth={3} /> Kembali
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-[2] bg-[#3478f6] text-white font-bold text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-200"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Konfirmasi <ExternalLink size={14} strokeWidth={3} /></>}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && depositData && (
          <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5">
            <div className="card p-6 mb-4 text-center">
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold mb-6 ${
                paymentStatus === "success" ? "bg-green-50 text-green-600" :
                paymentStatus === "cancel" ? "bg-red-50 text-red-500" :
                "bg-yellow-50 text-yellow-600 animate-pulse"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  paymentStatus === "success" ? "bg-green-500" :
                  paymentStatus === "cancel" ? "bg-red-500" :
                  "bg-yellow-500"
                }`} />
                {paymentStatus === "success" ? "SUKSES" : paymentStatus === "cancel" ? "DIBATALKAN" : "MENUNGGU PEMBAYARAN"}
              </div>

              {/* QR Image */}
              {depositData.qr_image && paymentStatus === "pending" && (
                <div className="mb-6">
                  <img src={depositData.qr_image} alt="QRIS" className="w-56 h-56 mx-auto rounded-2xl border border-[#eef2f6] shadow-sm" />
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Check size={40} className="text-green-500" strokeWidth={3} />
                </div>
              )}

              {/* Details */}
              <div className="text-left space-y-3 mt-4">
                <div className="flex justify-between text-[12px] pb-2 border-b border-[#eef2f6]">
                  <span className="text-[#8696a7] font-medium">ID Deposit</span>
                  <span className="text-[#1a2332] font-bold text-[11px]">{depositData.id}</span>
                </div>
                <div className="flex justify-between text-[12px] pb-2 border-b border-[#eef2f6]">
                  <span className="text-[#8696a7] font-medium">Nominal</span>
                  <span className="text-[#1a2332] font-bold">{formatRp(depositData.diterima)}</span>
                </div>
                <div className="flex justify-between text-[12px] pb-2 border-b border-[#eef2f6]">
                  <span className="text-[#8696a7] font-medium">Biaya Admin</span>
                  <span className="text-[#1a2332] font-bold">{formatRp(depositData.fee)}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#8696a7] font-bold">Total</span>
                  <span className="text-[#3478f6] font-extrabold">{formatRp(depositData.total)}</span>
                </div>
              </div>

              {depositData.expired_at && paymentStatus === "pending" && (
                <p className="text-[10px] text-red-400 font-bold mt-4">Expire: {depositData.expired_at}</p>
              )}
            </div>

            {/* Action Buttons */}
            {paymentStatus === "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-white border border-red-100 text-red-500 font-bold text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <><X size={14} strokeWidth={3} /> Batalkan</>}
                </button>
                <button
                  onClick={handleCheckStatus}
                  disabled={checkingStatus}
                  className="flex-[2] bg-[#3478f6] text-white font-bold text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-200"
                >
                  {checkingStatus ? <Loader2 size={16} className="animate-spin" /> : <>Cek Status <ChevronRight size={14} strokeWidth={3} /></>}
                </button>
              </div>
            )}

            {paymentStatus !== "pending" && (
              <Link href="/" className="w-full bg-[#3478f6] text-white font-bold text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-200">
                Kembali ke Home <ChevronRight size={14} strokeWidth={3} />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}
