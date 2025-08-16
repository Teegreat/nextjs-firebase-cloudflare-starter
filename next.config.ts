import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

const baseConfig: NextConfig = {};

const isDev = process.env.NODE_ENV === "development";

export default (async () => {
  if (isDev) {
    await setupDevPlatform();
  }
  return baseConfig;
})();
