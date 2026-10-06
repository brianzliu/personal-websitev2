import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // production gets SOUL.md / STYLE.md from env vars (they're gitignored); this only matters for local builds
  outputFileTracingIncludes: { "/api/chat": ["./soul/*.md"] },
};

export default nextConfig;
