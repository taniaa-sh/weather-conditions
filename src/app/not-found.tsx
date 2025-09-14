"use client";

import { useState } from "react";
import Image from "next/image";

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [radius, setRadius] = useState(700);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const normalized = distance / maxDistance;

    const newRadius = 2000 - (2000 - 700) * normalized;

    setMousePos({ x: e.clientX, y: e.clientY });
    setRadius(newRadius);
  };

  return (
    <div
      className="relative w-full h-screen custom-cursor-pointer"
      onMouseMove={handleMouseMove}
    >
      {/* Background image */}
      <Image
        src={"/dark6.avif"}
        alt="weather"
        fill
        className="object-cover"
      />

      {/* Black overlay with circular transparent spot */}
      <div
        className="hidden sm:block absolute inset-0 bg-black pointer-events-none"
        style={{
          maskImage: `radial-gradient(circle ${radius}px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%)`,
          WebkitMaskImage: `radial-gradient(circle ${radius}px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%)`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          transition: "mask-image 0.2s ease, -webkit-mask-image 0.2s ease",
        }}
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col gap-6  items-center justify-center px-4 sm:px-10 lg:px-[100px] py-12 sm:py-20 lg:py-[100px] overflow-x-hidden text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="notfound">
            <span>P</span>
            <span>a</span>
            <span className="disable">g</span>
            <span className="blink">e</span>
            <span>&nbsp;</span>
            <span>n</span>
            <span className="blink">o</span>
            <span>t</span>
            <span>&nbsp;</span>
            <span>f</span>
            <span className="ghost">o</span>
            <span className="disable">u</span>
            <span className="blink">n</span>
            <span>d</span>
          </div>

          <p className="text-sm md:text-xl text-white mt-2">
            Hmmm, the page you were looking for doesn't seem to exist anymore.
          </p>
        </div>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-white text-black px-4 py-2 flex justify-center items-center  rounded-lg mt-4"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
