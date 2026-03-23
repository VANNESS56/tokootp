"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, Activity, User } from "lucide-react";

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Deposit", icon: CreditCard, path: "/deposit" },
    { name: "Activity", icon: Activity, path: "/activity" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex items-end justify-center pointer-events-none pb-4 px-4">
      <div className="mx-auto w-full max-w-[480px] pointer-events-auto">
        <div className="bg-white rounded-[24px] border border-[#eef2f6] shadow-[0_-4px_30px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-2xl transition-all active:scale-90 ${
                  isActive
                    ? "text-[#3478f6] bg-[#e8f0fe]"
                    : "text-[#b0bec5]"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-bold ${isActive ? "text-[#3478f6]" : "text-[#b0bec5]"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
