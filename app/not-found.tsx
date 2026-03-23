"use client";

import Link from "next/link";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-4 font-sans relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4e73df]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#22c55e]/5 rounded-full blur-[120px]" />

      <div className="text-center relative z-10 max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-center mx-auto mb-6 border border-slate-100">
             <AlertCircle size={48} className="text-[#e74a3b]" />
          </div>
          
          <h1 className="text-[120px] font-black text-[#4e73df] leading-none tracking-tighter mb-2 opacity-10">
            404
          </h1>
          
          <h2 className="text-2xl font-black text-[#1a2332] mb-3 uppercase tracking-tight">
            Waduh! Halaman Hilang
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            Maaf Kak, sepertinya halaman yang Kamu cari sudah dihapus, diubah namanya, atau mungkin sedang bersembunyi di dimensi lain.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-10"
        >
          <Link 
            href="/"
            className="flex items-center gap-2 bg-[#4e73df] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#2e59d9] transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            <Home size={18} />
            Kembali Ke Beranda
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Halaman Sebelumnya
          </button>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-slate-100 opacity-40">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              TOKO OTP &bull; Sistem Digital Terpercaya
           </p>
        </div>
      </div>
    </main>
  );
}
