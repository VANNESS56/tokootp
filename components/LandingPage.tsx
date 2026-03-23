"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  Smartphone, 
  Menu, 
  X,
  MessageCircle,
  Hash,
  Globe
} from "lucide-react";

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="text-[#3478f6]" size={24} />,
      title: "Instan & Otomatis",
      desc: "Order diproses dalam hitungan detik oleh sistem otomatis 24/7."
    },
    {
      icon: <RotateCcw className="text-[#22c55e]" size={24} />,
      title: "Jaminan Refund",
      desc: "Jika nomor tidak mendapatkan OTP, saldo otomatis kembali 100%."
    },
    {
      icon: <ShieldCheck className="text-orange-500" size={24} />,
      title: "Aman & Terpercaya",
      desc: "Keamanan data user adalah prioritas utama kami dengan enkripsi penuh."
    }
  ];

  const steps = [
    { number: "01", title: "Daftar Akun", desc: "Buat akun gratis dalam hitungan menit." },
    { number: "02", title: "Isi Saldo", desc: "Top up instan via QRIS, E-Wallet, atau VA." },
    { number: "03", title: "Pilih Layanan", desc: "Pilih aplikasi dan negara yang dibutuhkan." },
    { number: "04", title: "Terima OTP", desc: "Gunakan nomor dan tunggu kode masuk." }
  ];

  const apps = [
    { name: "WhatsApp", color: "bg-[#25D366]" },
    { name: "Telegram", color: "bg-[#0088cc]" },
    { name: "Google", color: "bg-[#4285F4]" },
    { name: "Facebook", color: "bg-[#1877F2]" },
    { name: "Instagram", color: "bg-[#E1306C]" },
    { name: "Twitter", color: "bg-[#1DA1F2]" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-[#eef2f6] py-3 shadow-sm" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#3478f6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <Hash size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[20px] font-black text-[#1a2332] tracking-tighter">TOKO OTP</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[14px] font-bold text-[#8696a7] hover:text-[#3478f6] transition-colors">Fitur</a>
            <a href="#steps" className="text-[14px] font-bold text-[#8696a7] hover:text-[#3478f6] transition-colors">Cara Kerja</a>
            <a href="#faq" className="text-[14px] font-bold text-[#8696a7] hover:text-[#3478f6] transition-colors">FAQ</a>
            <Link href="/login" className="text-[14px] font-bold text-[#3478f6] hover:opacity-80">Masuk</Link>
            <Link href="/register" className="px-6 py-2.5 bg-[#3478f6] text-white rounded-xl text-[14px] font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">Daftar</Link>
          </div>

          <button className="md:hidden text-[#1a2332]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[90] bg-white transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden pt-24 px-8`}>
        <div className="flex flex-col gap-6">
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-bold text-[#1a2332]">Fitur</a>
          <a href="#steps" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-bold text-[#1a2332]">Cara Kerja</a>
          <a href="#faq" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-bold text-[#1a2332]">FAQ</a>
          <div className="h-px bg-[#eef2f6]" />
          <Link href="/login" className="text-[18px] font-bold text-[#3478f6]">Masuk</Link>
          <Link href="/register" className="w-full py-4 bg-[#3478f6] text-white rounded-2xl text-[18px] font-bold text-center">Daftar Sekarang</Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60 -mr-40 -mt-40 -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#eff6ff] rounded-full blur-[100px] opacity-40 -ml-20 -mb-20 -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-2 px-4 bg-blue-50 text-[#3478f6] text-[11px] font-black uppercase tracking-widest rounded-full border border-blue-100 mb-6">
              #1 Virtual Number Provider
            </span>
            <h1 className="text-[42px] md:text-[62px] font-black text-[#1a2332] leading-[1.1] tracking-tighter mb-6 underline-offset-8 decoration-[#3478f6]/30">
              Verifikasi <br /> <span className="text-[#3478f6]">Tanpa Ribet</span> <br /> dengan Sekali Klik.
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#8696a7] font-medium leading-relaxed max-w-[500px] mb-10">
              Sedia ribuan nomor virtual berkualitas untuk 1.700+ aplikasi dari berbagai negara. Dapatkan OTP instan dan otomatis 24 jam nonstop.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/register" className="w-full sm:w-auto px-10 py-4 bg-[#3478f6] text-white rounded-2xl text-[16px] font-bold shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                 Mulai Sekarang <ChevronRight size={18} />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-4 bg-[#f8fafc] text-[#1a2332] rounded-2xl text-[16px] font-bold border border-[#eef2f6] hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2">
                 Lihat Layanan
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-[#8696a7] font-bold">
                <span className="text-[#1a2332]">2,500+</span> User Aktif Menanti
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="relative">
             <div className="relative z-10 p-4 bg-white/20 backdrop-blur-xl rounded-[40px] border border-white/40 shadow-2xl overflow-hidden group">
                <img src="/hero_illustration.png" alt="Hero" className="w-full h-auto rounded-[32px] group-hover:scale-105 transition-transform duration-1000" />
                
                {/* Floating app badges */}
                <div className="absolute top-10 -right-4 bg-white p-3 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 animate-bounce shadow-blue-100/50" style={{ animationDuration: "3s" }}>
                   <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white">
                      <MessageCircle size={16} />
                   </div>
                   <span className="text-[12px] font-black text-[#1a2332]">WhatsApp OTP</span>
                </div>

                <div className="absolute bottom-20 -left-6 bg-white p-3 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 animate-pulse shadow-blue-100" style={{ animationDuration: "4s" }}>
                   <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                      <Globe size={16} />
                   </div>
                   <span className="text-[12px] font-black text-[#1a2332]">70+ Countries</span>
                </div>
             </div>

             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-200/50 rounded-full blur-[80px] -z-10 animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Aplikasi", value: "1,700+" },
              { label: "Negara", value: "70+" },
              { label: "OTP Masuk", value: "500k+" },
              { label: "Response", value: "< 1s" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <h3 className="text-[32px] md:text-[42px] font-black text-[#3478f6] tracking-tighter mb-1">{stat.value}</h3>
                <p className="text-[12px] md:text-[14px] font-bold text-[#8696a7] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16 underline-offset-4 decoration-[#3478f6]/20">
            <h2 className="text-[32px] md:text-[42px] font-black text-[#1a2332] tracking-tight mb-4">Mengapa Vanness Store?</h2>
            <p className="text-[16px] text-[#8696a7] font-medium leading-relaxed">
              Kami membangun layanan ini dengan satu tujuan: memberikan pengalaman verifikasi tercepat dan termurah di Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white border border-[#eef2f6] hover:border-[#3478f6]/30 hover:shadow-2xl hover:shadow-blue-50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {f.icon}
                </div>
                <h4 className="text-[20px] font-black text-[#1a2332] mb-3">{f.title}</h4>
                <p className="text-[15px] text-[#8696a7] font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="steps" className="py-24 bg-[#3478f6] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[32px] md:text-[42px] font-black text-white tracking-tight leading-none mb-4">Cara Kerja Kami</h2>
            <p className="text-white/70 font-bold fs-6 tracking-wide">4 Langkah mudah mendapatkan nomor virtual</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="mb-6 relative">
                  <span className="text-[52px] font-black text-white/20 group-hover:text-white/40 transition-colors leading-none">{s.number}</span>
                  {i < 3 && <div className="hidden md:block absolute top-[28px] left-[100px] right-[-40px] border-t-2 border-dashed border-white/20" />}
                </div>
                <h4 className="text-[20px] font-bold text-white mb-2">{s.title}</h4>
                <p className="text-white/60 text-[14px] font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Icons Grid */}
      <section className="py-24 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-4">
               {apps.map((app, i) => (
                 <div key={i} className="px-8 py-4 bg-[#f8fafc] rounded-2xl flex items-center gap-3 border border-transparent hover:border-[#eef2f6] hover:bg-white transition-all shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${app.color}`} />
                    <span className="text-[14px] font-bold text-[#1a2332]">{app.name}</span>
                 </div>
               ))}
               <div className="px-8 py-4 bg-[#eff6ff] rounded-2xl flex items-center gap-3 border border-blue-100 text-[#3478f6]">
                  <span className="text-[14px] font-black">+ 1,700 Lainnya</span>
               </div>
            </div>
         </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 text-center bg-white rounded-[40px] border border-[#eef2f6] p-12 md:p-20 shadow-2xl shadow-blue-50">
            <h2 className="text-[32px] md:text-[48px] font-black text-[#1a2332] tracking-tight mb-6">Siap untuk mencoba kehebatannya?</h2>
            <p className="text-[16px] text-[#8696a7] font-medium mb-10 max-w-[500px] mx-auto">
               Dapatkan nomor virtual pertamamu hari ini dan rasakan kecepatan verifikasi tanpa batas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link href="/register" className="w-full sm:w-auto px-12 py-5 bg-[#3478f6] text-white rounded-2xl text-[16px] font-bold shadow-xl shadow-blue-100/50 hover:scale-105 active:scale-95 transition-all">
                  Buat Akun Sekarang
               </Link>
               <Link href="/login" className="w-full sm:w-auto px-12 py-5 bg-white text-[#1a2332] rounded-2xl text-[16px] font-bold border border-[#eef2f6] hover:bg-[#f8fafc] active:scale-95 transition-all">
                  Kembali Login
               </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#eef2f6]">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 bg-[#3478f6] rounded-lg flex items-center justify-center text-white font-black text-[14px]">V</div>
               <span className="text-[16px] font-black text-[#1a2332] tracking-tight">Vanness Store</span>
            </div>
            <p className="text-[14px] text-[#8696a7] font-medium">&copy; 2026 TOKO OTP. All rights reserved.</p>
            <div className="flex items-center gap-6">
               <a href="#" className="text-[#8696a7] hover:text-[#3478f6] transition-colors"><Smartphone size={20} /></a>
               <a href="#" className="text-[#8696a7] hover:text-[#3478f6] transition-colors"><Globe size={20} /></a>
            </div>
         </div>
      </footer>
    </div>
  );
};
