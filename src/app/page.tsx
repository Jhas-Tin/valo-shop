"use client";

import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/user");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0f1923] text-white overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/back.jpg"
          alt="Valorant Background"
          fill
          className="object-cover"
          priority
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#0f1923]/60 via-[#ff4655]/20 to-black/50"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <SignedOut>
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-8 py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold uppercase tracking-wider text-[#ff4655]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            Valo Shop
          </motion.h1>

          <motion.p
            className="text-gray-300 text-sm md:text-base tracking-widest uppercase mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Get Your Gear. Join the Battle Anywhere.
          </motion.p>

          <SignInButton mode="modal">
            <motion.button
              className="mt-8 px-10 py-3 bg-[#ff4655] text-white rounded-md font-semibold uppercase tracking-widest shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255,70,85,0.6)" }}
            >
              Shop Now
            </motion.button>
          </SignInButton>
        </motion.div>
      </SignedOut>
    </div>
  );
}
