"use client";

import React from "react";
import { ChevronRight, MessageSquare, Send, Facebook, HelpCircle } from "lucide-react";

export const PromoBanner = ({ onOrderClick }: { onOrderClick: () => void }) => {
  return (
    <div className="px-5 py-3">
      <button
        onClick={onOrderClick}
        className="w-full rounded-[28px] p-7 pb-6 relative overflow-hidden text-left active:scale-[0.98] transition-transform"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #fb923c 40%, #bef264 100%)" }}
      >
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-white text-[20px] font-extrabold tracking-tight leading-tight text-center mb-1">
            Get Virtual Number
          </h2>
          <p className="text-white/70 text-[11px] font-medium text-center leading-snug mb-8">
            OTP access for 1,038+ apps<br />across 193 countries
          </p>

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center -space-x-1.5">
              <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white border-2 border-white/30 shadow-sm">
                <MessageSquare size={16} strokeWidth={2.5} />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0088cc] flex items-center justify-center text-white border-2 border-white/30 shadow-sm">
                <Send size={14} strokeWidth={2.5} />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white border-2 border-white/30 shadow-sm">
                <Facebook size={16} strokeWidth={2.5} />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#6366f1] flex items-center justify-center text-white border-2 border-white/30 shadow-sm">
                <HelpCircle size={16} strokeWidth={2.5} />
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-2 border-white/30 shadow-sm">
                <span className="text-[9px] font-extrabold">+99</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white font-bold text-[13px]">
              Beli Nomor <ChevronRight size={16} strokeWidth={3} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
