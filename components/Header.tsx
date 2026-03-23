"use client";

import React, { useEffect, useState } from "react";
import { User, Sun } from "lucide-react";
import { auth } from "@/lib/supabase";

export const Header = () => {
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");
  const [userName, setUserName] = useState("...");

  useEffect(() => {
    // Fetch real user from Supabase
    const fetchUser = async () => {
      const { user } = await auth.getUser();
      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User"
        );
      }
    };
    fetchUser();

    // Real-time greeting update
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) {
        setGreeting("Selamat pagi");
        setEmoji("☀️");
      } else if (hour >= 11 && hour < 15) {
        setGreeting("Selamat siang");
        setEmoji("🌤");
      } else if (hour >= 15 && hour < 18) {
        setGreeting("Selamat sore");
        setEmoji("🌅");
      } else {
        setGreeting("Selamat malam");
        setEmoji("🌙");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-5 pt-8 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-[#3a4a5c] flex items-center justify-center text-white font-bold text-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] border-2 border-[#f0f4f8] rounded-full pulse-dot" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#1a2332] leading-tight">{userName}</p>
          <p className="text-[12px] text-[#8696a7] font-medium leading-tight">
            {greeting} {emoji}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-full bg-white border border-[#eef2f6] flex items-center justify-center text-[#8696a7] active:scale-90 transition-transform">
          <Sun size={18} strokeWidth={2} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white border border-[#eef2f6] flex items-center justify-center text-[#8696a7] active:scale-90 transition-transform">
          <User size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
