// components/UserSidebar.tsx
"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { ShoppingBag, Heart, HelpCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Shop", icon: ShoppingBag, href: "/user" },
  { label: "Wishlist", icon: Heart, href: "/user/wishlist" },
  { label: "Help", icon: HelpCircle, href: "/user/help" },
];

export function UserSidebar() {
  const { isLoaded, user } = useUser();
  const [selected, setSelected] = useState("Shop");

  if (!isLoaded) {
    return (
      <aside className="h-full w-full md:w-64 bg-transparent" />
    );
  }

  return (
    <aside className="h-full w-full md:w-64 bg-[#0f1923]/95 backdrop-blur-sm text-gray-300 flex flex-col justify-between p-6 border-r border-[#1a2632] z-10">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#ff4655] p-2 rounded-lg">
            <Image
              src="/valooo.png"
              alt="ValoShop"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <h1 className="text-lg font-bold text-white tracking-widest uppercase">
            VALOASHOP
          </h1>
        </div>

        <nav className="flex flex-col space-y-3">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setSelected(label)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm",
                selected === label
                  ? "bg-[#1a2632] text-white"
                  : "hover:bg-[#1a2632]/70 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 text-[#ff4655]" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-gray-400 text-xs font-medium">Signed in as</p>
          <p className="text-white text-sm font-semibold">
            {user?.firstName || "Agent"}
          </p>
        </div>

        <div className="relative w-10 h-10 rounded-full border-2 border-[#ff4655] flex items-center justify-center overflow-hidden shadow-[0_0_10px_#ff465580]">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-full",
              },
            }}
          />
        </div>
      </div>
    </aside>
  );
}
