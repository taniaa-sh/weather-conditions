"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const handleSearch = () => {
    const input = document.querySelector("input") as HTMLInputElement | null;
    if (input?.value.trim()) {
      setError("");
      setLoading(true);
      router.push(`/weather/${input.value}`);
    } else {
      setError("Please enter a city");
    }
  };

  return (
    <div className="relative h-screen w-full bg-[url('/galaxy4.avif')] bg-cover bg-center overflow-hidden inset-0 object-contain">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-50">
        <p className="text-white text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg">
          Check the weather
        </p>
        <p className="text-white text-lg sm:text-xl md:text-2xl font-medium mt-3 drop-shadow">
          Enter a city to get the weather forecast
        </p>

        <div className="flex flex-col gap-2 mt-6 w-full max-w-md">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter a city"
              className="flex-1 rounded-lg px-4 py-3 sm:py-4 bg-[#173d97] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-4 rounded-lg font-semibold cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Search"
              )}
            </button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-red-500 text-md text-start !mt-1"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
