"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const status = useAppStore((s) => s.status);
  const initialized = useAppStore((s) => s.initialized);
  const init = useAppStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!initialized) return;
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [initialized, status, router]);

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
