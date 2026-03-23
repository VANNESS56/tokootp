"use client";

import React, { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "Apa itu TOKO OTP?",
    answer: "TOKO OTP adalah penyedia layanan verifikasi SMS virtual untuk kebutuhan aktivasi aplikasi dengan harga terjangkau dan proses instan.",
  },
  {
    question: "Bagaimana jika OTP tidak masuk?",
    answer: "Jangan khawatir! Jika OTP tidak masuk dalam 5 menit, Anda dapat membatalkan pesanan dan saldo akan dikembalikan 100% secara otomatis.",
  },
  {
    question: "Apakah saldo bisa hangus?",
    answer: "Tidak. Saldo Anda tidak akan pernah hangus dan dapat digunakan kapan saja tanpa batasan waktu.",
  },
  {
    question: "Metode pembayaran apa yang tersedia?",
    answer: "Saat ini kami mendukung metode pembayaran QRIS yang diproses secara otomatis dan real-time.",
  },
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="px-5 py-3 mb-8">
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircleQuestion size={18} className="text-[#f97316]" strokeWidth={2.5} />
          <h3 className="text-[16px] font-extrabold text-[#1a2332] tracking-tight">FAQ</h3>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, index) => (
            <div key={index} className="rounded-2xl bg-[#f8fafc] border border-[#eef2f6] overflow-hidden transition-all hover:bg-white">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left active:bg-[#f0f4f8] transition-colors"
              >
                <span className="text-[13px] font-bold text-[#1a2332] pr-4">{faq.question}</span>
                <motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} className="text-[#8696a7]" strokeWidth={2.5} />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div className="px-4 pb-4 text-[12px] leading-relaxed text-[#5a7a9a] font-medium">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
