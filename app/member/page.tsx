"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BalanceBar } from "@/components/BalanceBar";
import { PromoBanner } from "@/components/PromoBanner";
import { PendingOrder } from "@/components/PendingOrder";
import { NotificationBoard } from "@/components/NotificationBoard";
import { FAQ } from "@/components/FAQ";
import { BottomNav } from "@/components/BottomNav";
import { auth } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MemberDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { user } = await auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    };
    checkUser();

    // Listen for sign out
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#3478f6]" size={40} />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pb-24">
      <Header />
      <BalanceBar />
      <PendingOrder />
      <NotificationBoard />
      <FAQ />
      <BottomNav />
    </main>
  );
}
