"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserSidebar } from "~/app/_components/user-sidebar";
import { Search } from "lucide-react";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

type WeaponSkin = {
  id: number;
  weaponName: string;
  weaponType: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  status?: string;
};

// ✅ Automatically select correct backend
const baseURL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001" // your backend when running locally
    : "https://valo-armory.vercel.app"; // your deployed API

export default function UserPage() {
  const { user } = useUser();
  const [weapons, setWeapons] = useState<WeaponSkin[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<WeaponSkin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const res = await fetch(`${baseURL}/api/public/skins`, {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to load weapons");

        const data: WeaponSkin[] = await res.json();
        const activeSkins = data.filter(
          (s) => s.status === "Active" && s.imageUrl && s.imageUrl.trim() !== ""
        );

        setWeapons(activeSkins);
        setFilteredWeapons(activeSkins);
      } catch (err) {
        console.error("Error fetching weapon skins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredWeapons(
      weapons.filter((w) => w.weaponName.toLowerCase().includes(term))
    );
  }, [searchTerm, weapons]);

  const handlePurchase = async (weapon: WeaponSkin) => {
    if (!user) {
      alert("⚠️ Please sign in to purchase.");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/purchased`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weaponId: weapon.id,
          weaponName: weapon.weaponName,
          imageUrl: weapon.imageUrl,
          price: weapon.price,
          userId: user.id, 
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to purchase weapon");
      }

      alert(`✅ Purchased ${weapon.weaponName} successfully!`);
    } catch (err) {
      console.error("Purchase error:", err);
      alert("❌ Failed to purchase weapon. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fb] text-gray-900">
      <UserSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-[#111b26] mb-6">
          ValoShop
        </h1>

        <div className="mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search weapons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:ring-[#ff4655] focus:border-[#ff4655]"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading weapons...</p>
        ) : filteredWeapons.length === 0 ? (
          <p className="text-gray-500 italic">No active skins found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredWeapons.map((weapon) => (
              <Card
                key={weapon.id}
                className="group bg-white border border-gray-200 hover:border-[#ff4655] transition-all shadow-sm hover:shadow-md rounded-xl overflow-hidden"
              >
                <div className="flex justify-center items-center bg-[#f9f9f9] h-[160px] relative">
                  <Image
                    src={weapon.imageUrl || "/placeholder.jpg"}
                    alt={weapon.weaponName}
                    width={220}
                    height={120}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-[#111b26] truncate">
                    {weapon.weaponName}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {weapon.description || "No description available."}
                  </p>
                  <p className="text-[#0078ff] font-bold text-sm mt-3">
                    {weapon.price
                      ? `${weapon.price.toLocaleString()} VP`
                      : "Free"}
                  </p>

                  <Button
                    onClick={() => handlePurchase(weapon)}
                    className="mt-4 w-full bg-[#ff4655] hover:bg-[#e13c4a] text-white font-semibold rounded-lg transition-all"
                  >
                    Purchase
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
