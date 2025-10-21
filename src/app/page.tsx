"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative h-screen w-full bg-[url('/galaxy4.avif')] bg-cover bg-center overflow-hidden inset-0 object-contain">
      {/* Moon
      <Image
        src="/moon1.png"
        width={500}
        height={500}
        alt="Moon"
        className="absolute -top-8 -left-20 w-60  sm:w-64 md:w-96 lg:w-[500px] opacity-90"
      />

      {/* Sun */}
      {/* <Image
        src="/sun1.png"
        width={500}
        height={500}
        alt="Sun"
        className="absolute bottom-0 right-0 w-60 sm:w-64 md:w-96 lg:w-[500px] opacity-90"
      /> */}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-50">
        <p className="text-white text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg">
          Check the weather
        </p>
        <p className="text-white text-lg sm:text-xl md:text-2xl font-medium mt-3 drop-shadow">
          Enter a city to get the weather forecast
        </p>

        <div className="flex items-center gap-2 mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter a city"
            className="flex-1 rounded-lg px-4 py-3 sm:py-4 bg-[#173d97] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLoading(true);
                router.push(`/weather/${(e.target as HTMLInputElement).value}`);
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector(
                "input"
              ) as HTMLInputElement | null;
              if (input?.value) {
                setLoading(true);
                router.push(`/weather/${input.value}`);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-4 rounded-lg font-semibold cursor-pointer"
          >
            {
              loading ? (
                <Image
                  src={"/loading.svg"}
                  width={16}
                  height={16}
                  alt="loading"
                  className="loading-svg"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(46%) sepia(42%) saturate(2564%) hue-rotate(192deg) brightness(99%) contrast(99%)',
                  }}
                />
              ) : (
                "Search"
              )
            }
          </button>
        </div>
      </div>
    </div>
  );
}
