"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";

export default function UserInit() {
  const init = useAppStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
  return null;
}
