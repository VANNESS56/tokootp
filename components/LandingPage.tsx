"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamically load Bootstrap CSS + Icons + JS only on landing page
  useEffect(() => {
    const bootstrapCss = document.createElement("link");
    bootstrapCss.rel = "stylesheet";
    bootstrapCss.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    bootstrapCss.id = "bootstrap-css";
    document.head.appendChild(bootstrapCss);

    const bootstrapIcons = document.createElement("link");
    bootstrapIcons.rel = "stylesheet";
    bootstrapIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
    bootstrapIcons.id = "bootstrap-icons-css";
    document.head.appendChild(bootstrapIcons);

    const bootstrapJs = document.createElement("script");
    bootstrapJs.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    bootstrapJs.id = "bootstrap-js";
    document.body.appendChild(bootstrapJs);

    return () => {
      document.getElementById("bootstrap-css")?.remove();
      document.getElementById("bootstrap-icons-css")?.remove();
      document.getElementById("bootstrap-js")?.remove();
    };
  }, []);

  const features = [
    {
      icon: "bi bi-lightning-charge-fill",
      color: "#3478f6",
      bg: "#eff6ff",
      title: "Instan & Otomatis",
      desc: "Order diproses otomatis dalam hitungan detik oleh sistem 24 jam.",
    },
    {
      icon: "bi bi-arrow-counterclockwise",
      color: "#16a34a",
      bg: "#f0fdf4",
      title: "Jaminan Refund",
      desc: "OTP tidak masuk? Saldo otomatis kembali 100% tanpa syarat.",
    },
    {
      icon: "bi bi-shield-check-fill",
      color: "#f59e0b",
      bg: "#fffbeb",
      title: "Aman & Terpercaya",
      desc: "Data pengguna dilindungi dengan enkripsi end-to-end penuh.",
    },
  ];

  const steps = [
    { num: "1", icon: "bi bi-person-plus-fill", title: "Daftar Akun", desc: "Buat akun gratis dalam hitungan menit" },
    { num: "2", icon: "bi bi-wallet2", title: "Isi Saldo", desc: "Top up instan via QRIS & E-Wallet" },
    { num: "3", icon: "bi bi-grid-fill", title: "Pilih Layanan", desc: "Pilih aplikasi dan negara tujuan" },
    { num: "4", icon: "bi bi-envelope-check-fill", title: "Terima OTP", desc: "Kode OTP langsung masuk ke dashboard" },
  ];

  const apps = [
    { name: "WhatsApp", icon: "bi bi-whatsapp", color: "#25D366" },
    { name: "Telegram", icon: "bi bi-telegram", color: "#0088cc" },
    { name: "Google", icon: "bi bi-google", color: "#4285F4" },
    { name: "Facebook", icon: "bi bi-facebook", color: "#1877F2" },
    { name: "Instagram", icon: "bi bi-instagram", color: "#E1306C" },
    { name: "Twitter", icon: "bi bi-twitter-x", color: "#14171a" },
    { name: "TikTok", icon: "bi bi-tiktok", color: "#ff0050" },
    { name: "Line", icon: "bi bi-line", color: "#00B900" },
  ];

  const stats = [
    { val: "1,700+", label: "Aplikasi" },
    { val: "70+", label: "Negara" },
    { val: "500k+", label: "OTP Sukses" },
    { val: "< 1 dtk", label: "Response" },
  ];

  return (
    <>
      <style>{`
        :root {
          --brand: #3478f6;
          --brand-dark: #2563eb;
          --dark: #0f172a;
          --muted: #64748b;
          --border: #e2e8f0;
          --surface: #f8fafc;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #fff;
          color: var(--dark);
        }

        /* NAVBAR */
        .lp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 18px 0;
          transition: all .3s ease;
          background: transparent;
        }
        .lp-nav.scrolled {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          padding: 12px 0;
          box-shadow: 0 1px 0 var(--border);
        }
        .lp-nav .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .lp-nav .logo-icon {
          width: 36px; height: 36px;
          background: var(--brand);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(52,120,246,.25);
        }
        .lp-nav .logo-name {
          font-size: 17px;
          font-weight: 800;
          color: var(--dark);
          letter-spacing: -0.5px;
        }
        .lp-nav .nav-link-item {
          font-size: 14px;
          font-weight: 600;
          color: var(--muted);
          text-decoration: none;
          transition: color .2s;
        }
        .lp-nav .nav-link-item:hover { color: var(--brand); }
        .btn-brand {
          background: var(--brand);
          color: #fff;
          border: none;
          font-weight: 700;
          border-radius: 10px;
          transition: all .2s;
          box-shadow: 0 4px 14px rgba(52,120,246,.3);
        }
        .btn-brand:hover {
          background: var(--brand-dark);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(52,120,246,.4);
        }
        .btn-outline-brand {
          background: transparent;
          color: var(--brand);
          border: 1.5px solid var(--brand);
          font-weight: 700;
          border-radius: 10px;
          transition: all .2s;
        }
        .btn-outline-brand:hover {
          background: var(--brand);
          color: #fff;
        }

        /* MOBILE NAV */
        .mobile-drawer {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: #fff;
          transform: translateX(100%);
          transition: transform .35s cubic-bezier(.4,0,.2,1);
          padding: 80px 32px 40px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .mobile-drawer.open { transform: translateX(0); }
        .mobile-drawer a {
          font-size: 20px;
          font-weight: 700;
          color: var(--dark);
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        }

        /* HERO */
        .hero-section {
          padding: 140px 0 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -120px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(52,120,246,.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          color: var(--brand);
          border: 1px solid #dbeafe;
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1.5px;
          color: var(--dark);
          margin-bottom: 20px;
        }
        .hero-title span { color: var(--brand); }
        .hero-desc {
          font-size: 17px;
          color: var(--muted);
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 32px;
        }
        .hero-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px 32px;
          position: relative;
        }
        .floating-chip {
          position: absolute;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,.08);
          font-size: 12px;
          font-weight: 700;
          color: var(--dark);
          animation: float 4s ease-in-out infinite;
        }
        .floating-chip.chip-1 { top: -12px; right: 24px; animation-delay: 0s; }
        .floating-chip.chip-2 { bottom: 20px; left: -16px; animation-delay: 2s; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .otp-demo {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--border);
        }
        .otp-demo .demo-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .otp-demo .demo-row:last-child { border-bottom: none; }
        .otp-icon-wrap {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .otp-code {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 4px;
          color: var(--brand);
        }
        .otp-status {
          background: #f0fdf4;
          color: #16a34a;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid #bbf7d0;
        }

        /* STATS */
        .stats-section {
          background: var(--dark);
          padding: 56px 0;
        }
        .stat-item { text-align: center; }
        .stat-val {
          font-size: 36px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* FEATURES */
        .feature-card {
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 28px;
          background: #fff;
          transition: all .25s;
          height: 100%;
        }
        .feature-card:hover {
          border-color: rgba(52,120,246,.3);
          box-shadow: 0 12px 40px rgba(52,120,246,.08);
          transform: translateY(-4px);
        }
        .feature-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
        }
        .feature-title {
          font-size: 17px;
          font-weight: 800;
          color: var(--dark);
          margin-bottom: 8px;
        }
        .feature-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
        }

        /* STEPS */
        .steps-section {
          background: var(--surface);
          padding: 96px 0;
        }
        .step-line {
          position: relative;
        }
        .step-line::after {
          content: '';
          position: absolute;
          top: 24px;
          left: calc(50% + 28px);
          right: calc(-50% + 28px);
          height: 1px;
          background: linear-gradient(90deg, var(--border), transparent);
          display: none;
        }
        @media (min-width: 768px) {
          .step-line::after { display: block; }
        }
        .step-num {
          width: 48px; height: 48px;
          background: var(--brand);
          color: #fff;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          font-weight: 900;
          margin: 0 auto 16px;
          position: relative;
          z-index: 1;
          box-shadow: 0 4px 16px rgba(52,120,246,.3);
        }
        .step-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--dark);
          margin-bottom: 6px;
        }
        .step-desc {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
          margin: 0;
        }

        /* APPS */
        .app-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 700;
          color: var(--dark);
          transition: all .2s;
          cursor: default;
        }
        .app-chip:hover {
          background: #fff;
          border-color: rgba(52,120,246,.3);
          box-shadow: 0 4px 16px rgba(0,0,0,.06);
          transform: translateY(-2px);
        }

        /* CTA */
        .cta-section {
          background: var(--brand);
          padding: 96px 0;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          background: rgba(255,255,255,.06);
          border-radius: 50%;
        }
        .cta-section::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 350px; height: 350px;
          background: rgba(0,0,0,.06);
          border-radius: 50%;
        }
        .cta-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }
        .cta-desc { color: rgba(255,255,255,.75); font-size: 16px; }
        .btn-white {
          background: #fff;
          color: var(--brand);
          font-weight: 700;
          border: none;
          border-radius: 10px;
          transition: all .2s;
        }
        .btn-white:hover {
          background: #f0f6ff;
          transform: translateY(-1px);
          color: var(--brand-dark);
        }
        .btn-ghost-white {
          background: rgba(255,255,255,.15);
          color: #fff;
          border: 1.5px solid rgba(255,255,255,.4);
          font-weight: 700;
          border-radius: 10px;
          transition: all .2s;
        }
        .btn-ghost-white:hover {
          background: rgba(255,255,255,.25);
          color: #fff;
        }

        /* FOOTER */
        .lp-footer {
          background: #fff;
          border-top: 1px solid var(--border);
          padding: 40px 0;
        }
        .footer-logo-text {
          font-size: 16px;
          font-weight: 800;
          color: var(--dark);
          letter-spacing: -0.3px;
        }
        .footer-copy {
          font-size: 13px;
          color: var(--muted);
        }
        .footer-link {
          font-size: 13px;
          color: var(--muted);
          text-decoration: none;
          font-weight: 600;
          transition: color .2s;
        }
        .footer-link:hover { color: var(--brand); }

        /* SECTION HEADING */
        .section-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--brand);
          margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 900;
          letter-spacing: -1px;
          color: var(--dark);
          margin-bottom: 14px;
        }
        .section-sub {
          font-size: 16px;
          color: var(--muted);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* DIVIDER */
        .divider-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--border);
          display: inline-block;
        }

        /* trusted bar */
        .trusted-bar {
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 14px 0;
          font-size: 12px;
          color: var(--muted);
          font-weight: 600;
          letter-spacing: .5px;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`lp-nav${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            {/* Logo */}
            <a href="/" className="nav-logo">
              <img src="/favicon.ico" alt="Toko OTP" style={{ width: 72, height: 72, borderRadius: 14, objectFit: "contain" }} />
            </a>

            {/* Desktop Links */}
            <div className="d-none d-md-flex align-items-center gap-4">
              <a href="#fitur" className="nav-link-item">Fitur</a>
              <a href="#cara-kerja" className="nav-link-item">Cara Kerja</a>
              <a href="#aplikasi" className="nav-link-item">Aplikasi</a>
              <Link href="/login" className="nav-link-item">Masuk</Link>
              <Link href="/register" className="btn btn-brand btn-sm px-4 py-2">
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="d-md-none border-0 bg-transparent p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"} fs-4 text-dark`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        <a href="#fitur" onClick={() => setMenuOpen(false)}>Fitur</a>
        <a href="#cara-kerja" onClick={() => setMenuOpen(false)}>Cara Kerja</a>
        <a href="#aplikasi" onClick={() => setMenuOpen(false)}>Aplikasi</a>
        <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: "#3478f6" }}>Masuk</Link>
        <Link href="/register" className="btn btn-brand py-3 text-center rounded-3 mt-2" onClick={() => setMenuOpen(false)}>
          Daftar Gratis
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left */}
            <div className="col-lg-6">

              <h1 className="hero-title">
                Verifikasi OTP<br />
                <span>Instan & Terpercaya</span>
              </h1>
              <p className="hero-desc">
                Ribuan nomor virtual untuk 1.700+ aplikasi dari 70+ negara. Proses otomatis, harga terjangkau, aktif 24 jam nonstop.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
                <Link href="/register" className="btn btn-brand btn-lg px-5 py-3">
                  Mulai Sekarang <i className="bi bi-arrow-right ms-1" />
                </Link>
                <Link href="/login" className="btn btn-outline-brand btn-lg px-5 py-3">
                  Masuk Akun
                </Link>
              </div>

              {/* Social proof */}
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex" style={{ marginLeft: 0 }}>
                  {[1, 2, 3, 4].map(i => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i + 14}`}
                      alt=""
                      style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        border: "2px solid #fff",
                        marginLeft: i > 1 ? -10 : 0,
                        objectFit: "cover"
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", margin: 0 }}>
                  <span style={{ color: "var(--dark)", fontWeight: 800 }}>2,500+</span> user aktif
                </p>
                <span className="divider-dot" />
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <i key={i} className="bi bi-star-fill" style={{ color: "#f59e0b", fontSize: 12 }} />
                  ))}
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginLeft: 4 }}>5.0</span>
                </div>
              </div>
            </div>

            {/* Right - OTP Demo Card */}
            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-card" style={{ position: "relative" }}>
                <div className="floating-chip chip-1">
                  <i className="bi bi-check-circle-fill" style={{ color: "#16a34a" }} />
                  OTP Masuk!
                </div>
                <div className="floating-chip chip-2">
                  <i className="bi bi-globe" style={{ color: "#3478f6" }} />
                  70+ Negara
                </div>

                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Live OTP Activity
                </p>
                <div className="otp-demo">
                  {[
                    { app: "WhatsApp", color: "#25D366", icon: "bi-whatsapp", code: "847 291" },
                    { app: "Google", color: "#4285F4", icon: "bi-google", code: "503 817" },
                    { app: "Telegram", color: "#0088cc", icon: "bi-telegram", code: "129 047" },
                  ].map((item, i) => (
                    <div className="demo-row" key={i}>
                      <div className="otp-icon-wrap" style={{ background: item.color + "18" }}>
                        <i className={`bi ${item.icon}`} style={{ color: item.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--dark)" }}>{item.app}</p>
                        <p className="otp-code" style={{ margin: 0, fontSize: 16 }}>{item.code}</p>
                      </div>
                      <span className="otp-status">Sukses</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3">
                  <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Diperbarui real-time</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse 2s infinite" }} />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BAR ── */}
      <div className="trusted-bar">
        <div className="container text-center">
          DIPERCAYA OLEH RIBUAN PENGGUNA &nbsp;·&nbsp; PEMBAYARAN AMAN &nbsp;·&nbsp; SUPPORT 24/7 &nbsp;·&nbsp; REFUND OTOMATIS
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="container">
          <div className="row g-4">
            {stats.map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="stat-item">
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="fitur" className="py-6" style={{ padding: "96px 0" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-eyebrow">Keunggulan</p>
            <h2 className="section-title">Mengapa Toko OTP?</h2>
            <p className="section-sub">
              Kami membangun layanan dengan satu tujuan: memberikan pengalaman verifikasi tercepat dan termurah.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {features.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="feature-card">
                  <div className="feature-icon" style={{ background: f.bg }}>
                    <i className={f.icon} style={{ color: f.color }} />
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="cara-kerja" className="steps-section">
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-eyebrow">Cara Kerja</p>
            <h2 className="section-title">4 Langkah Mudah</h2>
            <p className="section-sub">
              Dari daftar hingga menerima OTP hanya dalam menit.
            </p>
          </div>
          <div className="row g-4 text-center">
            {steps.map((s, i) => (
              <div className="col-6 col-md-3 step-line" key={i}>
                <div className="step-num">{s.num}</div>
                <div style={{ fontSize: 22, color: "var(--muted)", marginBottom: 12 }}>
                  <i className={s.icon} />
                </div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPS ── */}
      <section id="aplikasi" style={{ padding: "96px 0" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-eyebrow">Kompatibel</p>
            <h2 className="section-title">1,700+ Aplikasi Tersedia</h2>
            <p className="section-sub">
              Dari media sosial hingga layanan keuangan — semua terjangkau.
            </p>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {apps.map((app, i) => (
              <div className="app-chip" key={i}>
                <i className={app.icon} style={{ color: app.color, fontSize: 16 }} />
                {app.name}
              </div>
            ))}
            <div className="app-chip" style={{ background: "#eff6ff", borderColor: "#dbeafe", color: "#3478f6" }}>
              <i className="bi bi-plus-circle-fill" />
              1,692 Lainnya
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 12 }}>
            Bergabung Sekarang
          </p>
          <h2 className="cta-title">Siap Mulai Verifikasi Instan?</h2>
          <p className="cta-desc mb-4">
            Daftar gratis hari ini dan nikmati OTP instan dari ribuan nomor virtual aktif.
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link href="/register" className="btn btn-white btn-lg px-5 py-3">
              Buat Akun Gratis <i className="bi bi-arrow-right ms-1" />
            </Link>
            <Link href="/login" className="btn btn-ghost-white btn-lg px-5 py-3">
              Sudah Punya Akun
            </Link>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 24, fontWeight: 600 }}>
            Gratis · Tanpa kartu kredit · Setup &lt; 1 menit
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2">
                <img src="/favicon.ico" alt="Toko OTP" style={{ width: 52, height: 52, borderRadius: 12, objectFit: "contain" }} />
              </div>
            </div>
            <div className="col-md-4 text-md-center">
              <p className="footer-copy mb-0">&copy; 2026 Toko OTP. All rights reserved.</p>
            </div>
            <div className="col-md-4 d-flex justify-content-md-end gap-4">
              <a href="#" className="footer-link">Kebijakan Privasi</a>
              <a href="#" className="footer-link">Syarat & Ketentuan</a>
              <a href="#" className="footer-link">Kontak</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
