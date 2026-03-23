"use client";

import React, { useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { auth } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { user } = await auth.getUser();
      if (user) {
        router.push("/member");
      }
    };
    checkUser();
  }, [router]);

  return <LandingPage />;
}
