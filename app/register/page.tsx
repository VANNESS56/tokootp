"use client";

import React, { useState } from "react";
import { auth, supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Lengkapi semua field.");
      return;
    }

    // Strong Password Validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isMinLength = password.length >= 8;

    if (!isMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      toast.error(
        "Password harus minimal 8 karakter, mengandung huruf besar, angka, dan karakter spesial.",
        { duration: 4000 }
      );
      return;
    }

    if (!agreed) {
      toast.error("Setujui kebijakan privasi terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password, username);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Akun berhasil dibuat! Cek email untuk verifikasi.");
        router.push("/login");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Swal.fire({
      title: 'Coming Soon! 🚀',
      text: 'Fitur Registrasi Google sedang dikembangkan. Silakan daftar menggunakan Email & Password terlebih dahulu ya!',
      icon: 'info',
      confirmButtonText: 'Siap, Mengerti!',
      confirmButtonColor: '#4e73df'
    });
  };

  const handleGithubLogin = () => {
    Swal.fire({
      title: 'Coming Soon! 🚀',
      text: 'Fitur Registrasi GitHub sedang dikembangkan. Silakan daftar menggunakan Email & Password terlebih dahulu ya!',
      icon: 'info',
      confirmButtonText: 'Siap, Mengerti!',
      confirmButtonColor: '#4e73df'
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f4f8] px-4 py-10 relative overflow-hidden">
      {/* Decorative Dots */}
      <Dots />

      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 relative z-10">

        {/* Title */}
        <div className="text-center mb-7">
          <h1 className="text-[22px] font-extrabold text-[#1a2332] tracking-tight mb-1">
            Hello new member! 🚀
          </h1>
          <p className="text-[13px] text-[#8696a7] font-medium">
            Buat akun dan nikmati layanannya
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-white border border-[#eef2f6] rounded-xl py-3 text-[13px] font-bold text-[#1a2332] hover:bg-[#f8fafc] active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-2 bg-white border border-[#eef2f6] rounded-xl py-3 text-[13px] font-bold text-[#1a2332] hover:bg-[#f8fafc] active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a2332">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#eef2f6]" />
          <span className="text-[11px] text-[#b0bec5] font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-[#eef2f6]" />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          {/* Username */}
          <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#eef2f6] rounded-2xl px-4 py-3.5 focus-within:border-[#3478f6] transition-colors">
            <User size={18} className="text-[#b0bec5] flex-shrink-0" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#1a2332] placeholder:text-[#b0bec5]"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#eef2f6] rounded-2xl px-4 py-3.5 focus-within:border-[#3478f6] transition-colors">
            <Mail size={18} className="text-[#b0bec5] flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#1a2332] placeholder:text-[#b0bec5]"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#eef2f6] rounded-2xl px-4 py-3.5 focus-within:border-[#3478f6] transition-colors">
            <Lock size={18} className="text-[#b0bec5] flex-shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#1a2332] placeholder:text-[#b0bec5]"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#b0bec5] flex-shrink-0">
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Agree Checkbox */}
          <label className="flex items-center gap-2.5 py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-[#cbd5e1] text-[#3478f6] focus:ring-[#3478f6] accent-[#3478f6]"
            />
            <span className="text-[12px] text-[#8696a7] font-medium">
              I agree to <span className="text-[#3478f6] font-bold">privacy policy & terms</span>
            </span>
          </label>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold text-[14px] py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-purple-200 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #3478f6 100%)" }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Daftar"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-[13px] text-[#8696a7] font-medium mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#3478f6] font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

function Dots() {
  const dots = [
    { top: "8%", left: "6%", color: "#3478f6", size: 8 },
    { top: "12%", left: "10%", color: "#22c55e", size: 6 },
    { top: "5%", right: "8%", color: "#8b5cf6", size: 8 },
    { top: "10%", right: "12%", color: "#3478f6", size: 6 },
    { top: "15%", right: "6%", color: "#f59e0b", size: 5 },
    { bottom: "12%", left: "5%", color: "#3478f6", size: 7 },
    { bottom: "8%", left: "10%", color: "#8b5cf6", size: 5 },
    { bottom: "15%", left: "8%", color: "#22c55e", size: 6 },
    { bottom: "10%", right: "7%", color: "#3478f6", size: 6 },
    { bottom: "6%", right: "12%", color: "#f59e0b", size: 8 },
    { top: "45%", left: "3%", color: "#3478f6", size: 6 },
    { top: "50%", right: "4%", color: "#22c55e", size: 5 },
  ];

  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            bottom: d.bottom,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
          }}
        />
      ))}
    </>
  );
}
