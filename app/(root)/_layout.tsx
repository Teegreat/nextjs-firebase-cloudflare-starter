"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { useAppStore } from "@/store";

const RootLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const status = useAppStore((s) => s.status);
  const initialized = useAppStore((s) => s.initialized);
  const init = useAppStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!initialized) return;
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [initialized, status, router]);

  if (!initialized) {
    return null;
  }

  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <h2 className="text-primary-100">Starter Template</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
