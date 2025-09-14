"use client"

import React from 'react'
import animationData from "../../public/lottie/loading.json";
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,             // ← don’t render on server
    loading: () => null,    // optional loader
});

const Loading = () => {
    return (
        <div className="fixed inset-0 size-full bg-gray-500/50 flex flex-col items-center justify-center gap-4">
            <Lottie
                animationData={animationData}
                loop={true}
                reversed
                className={"size-[100px] sm:size-[200px]"}
            />
            <p className="text-white text-lg sm:text-2xl">LOADING ...</p>
        </div>
    )
}

export default Loading