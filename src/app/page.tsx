"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const images = [
  "/cityPictures/world.avif",
  "/cityPictures/world2.avif",
  "/cityPictures/world3.avif",
  "/cityPictures/world4.avif",
  "/cityPictures/world5.avif",
  "/cityPictures/world6.avif",
  "/cityPictures/world7.avif",
  "/cityPictures/world8.avif",
  "/cityPictures/world9.avif",
  "/cityPictures/world10.avif",
  "/cityPictures/world11.avif",
];

export default function Home() {

  const [searchCity, setSearchCity] = useState("");
  const router = useRouter();
  const [randomImage, setRandomImage] = useState(images[0]);

  useEffect(() => {
    const random = images[Math.round(Math.random() * images.length)];
    setRandomImage(random);
  }, []);

  const handleSearch = () => {
    if (searchCity.trim() !== "") {
      router.push(`/weather/${searchCity.trim()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#1C1C3C] fixed flex inset-0 w-full h-full z-50 items-center justify-center px-4 sm:px-20 lg:px-[200px] py-20 sm:py-40 lg:py-[200px]">
      <div className="flex flex-col items-center justify-center rounded-xl overflow-hidden gap-4 bg-white z-50 w-full h-full relative">
        <Image
          src={randomImage}
          alt="Centered"
          fill
          className="object-cover w-full h-full"
        />
        <div
          className="absolute flex items-center gap-2 text-start text-xl sm:text-2xl md:text-3xl text-gray-700 px-4 sm:px-6 lg:px-6 py-2 sm:py-3 rounded-full shadow-lg w-[90%] sm:w-[80%] lg:w-[70%] bg-gray-300/90 backdrop-blur-sm z-50"
        >
          <Image
            src={"/search.svg"}
            alt="Search Icon"
            width={20}
            height={20}
            className="sm:w-6 sm:h-6 lg:w-6 lg:h-6 cursor-pointer"
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Search city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-base sm:text-lg lg:text-2xl focus:outline-0 focus:ring-0 focus:border-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
