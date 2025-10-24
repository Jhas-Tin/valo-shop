"use client";

import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import { UserSidebar } from "~/app/_components/user-sidebar";

type Purchase = {
  id: number;
  weaponId: number;
  weaponName: string;
  imageUrl?: string;
  price: number;
  userId: string;
  createdAt: string;
};

export default function PurchasedPage() {
  const { user, isLoaded } = useUser();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const baseURL =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://valo-armory.vercel.app";

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPurchases = async () => {
      try {
        const res = await fetch(
        `${baseURL}/api/public/purchases?userId=${user.id}`,
        { cache: "no-store" }
        );


        if (!res.ok) throw new Error("Failed to fetch purchases");

        const data: Purchase[] = await res.json();
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [isLoaded, user]);

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-gray-900 flex">
      <SignedOut>
        <div className="h-screen flex items-center justify-center w-full text-xl">
          Redirecting to login...
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex w-full">
          <UserSidebar />

          <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-extrabold text-[#111b26] mb-6">
              My Purchased Skins
            </h1>

            {loading ? (
              <p className="text-gray-500 text-sm">Loading your purchases...</p>
            ) : purchases.length === 0 ? (
              <p className="text-gray-500 italic">
                You haven’t purchased any skins yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                  >
                    <Image
                      src={p.imageUrl || "/placeholder.jpg"}
                      alt={p.weaponName}
                      width={400}
                      height={200}
                      className="w-full h-48 object-contain rounded-md bg-gray-100"
                    />
                    <div className="mt-3">
                      <h2 className="text-lg font-semibold text-[#111b26]">
                        {p.weaponName}
                      </h2>
                      <p className="text-[#ff4655] font-bold mt-1">
                        {p.price.toLocaleString()} VP
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Purchased on{" "}
                        <span className="font-medium text-gray-700">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
