"use client";

import { useEffect, useState } from "react";
import { UserSidebar } from "~/app/_components/user-sidebar";
import { Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type WeaponSkin = {
  id: number;
  weaponName: string;
  weaponType: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  status?: string;
};

// ✅ Automatically connect to correct ValoArmory backend
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://valo-armory.vercel.app");

export default function UserPage() {
  const [weapons, setWeapons] = useState<WeaponSkin[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch weapons periodically
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchWeapons = async () => {
      try {
        const res = await fetch(`${baseURL}/api/public/skins`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to load weapons");

        const data: WeaponSkin[] = await res.json();

        // ✅ Show only active skins with valid image URLs
        const activeSkins = data.filter(
          (skin) =>
            skin.status === "Active" &&
            skin.imageUrl &&
            skin.imageUrl.trim() !== ""
        );

        setWeapons(activeSkins);
      } catch (err) {
        console.error("Error fetching weapon skins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons(); // first load
    interval = setInterval(fetchWeapons, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-[#f8f9fb] text-gray-900">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-[#111b26] mb-6">
          ValoShop
        </h1>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search weapons..."
                className="pl-10 border-gray-300"
              />
            </div>
          </div>

          <Button
            variant="outline"
            className="flex justify-between items-center text-gray-600 border-gray-300"
          >
            Weapon Type <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          <Button
            variant="outline"
            className="flex justify-between items-center text-gray-600 border-gray-300"
          >
            Rarity <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Weapon Cards */}
        {loading ? (
          <p className="text-gray-500 text-sm">Loading weapons...</p>
        ) : weapons.length === 0 ? (
          <p className="text-gray-500 italic">No active skins available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {weapons.map((weapon) => (
              <Card
                key={weapon.id}
                className="shadow-md hover:shadow-lg transition bg-white"
              >
                <CardHeader>
                  <Image
                    src={weapon.imageUrl || "/placeholder.jpg"}
                    alt={weapon.weaponName}
                    width={400}
                    height={200}
                    className="rounded-lg object-contain bg-[#f3f3f3]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-semibold">
                    {weapon.weaponName}
                  </CardTitle>
                  <p className="text-[#ff4655] font-bold">
                    {weapon.price ? `${weapon.price} VP` : "Free"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {weapon.description || "No description available."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
