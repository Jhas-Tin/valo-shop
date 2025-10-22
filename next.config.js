/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. 
 * This is especially useful for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
  },
  images: {
    // ✅ Allow external image sources (UploadThing, ValoArmory, etc.)
    domains: [
      "r39pi16irl.ufs.sh",   // your UploadThing host
      "utfs.io",             // alternate UploadThing domain
      "files.edgestore.dev", // (optional) EdgeStore
      "valo-armory.vercel.app", // your ValoArmory site
      "localhost",           // for local dev
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // wildcard for any UploadThing subdomain
      },
    ],
  },
};

export default config;
