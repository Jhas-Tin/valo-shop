import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, 

    domains: [
      "r39pi16irl.ufs.sh",
      "utfs.io",
      "files.edgestore.dev",
      "valo-armory.vercel.app",
      "localhost",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
    ],
  },
};

export default config;
