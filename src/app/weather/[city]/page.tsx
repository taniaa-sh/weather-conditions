"use client";

import { getWeatherBackground } from "@/utils/fetchData";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WeatherData {
    weather: { main: string; description: string }[];
    main: { temp: number; feels_like: number };
    name: string;
    sys: { country: string };
}

interface ForecastData {
    day: string;
    condition: string;
    temp_min: number;
    temp_max: number;
}

const mockForecast: ForecastData[] = [
    { day: "Tuesday", condition: "Clear", temp_min: 11, temp_max: 12 },
    { day: "Wednesday", condition: "Clear", temp_min: 13, temp_max: 15 },
    { day: "Thursday", condition: "Clear", temp_min: 12, temp_max: 14 },
];

export default function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { city } = useParams();

    const [searchCity, setSearchCity] = useState("");
    const router = useRouter();

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

    useEffect(() => {
        if (!city) {
            setWeather(null);
            setError("City is required");
            return;
        }

        async function fetchWeather() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
                const data = await res.json();

                if (data.cod && data.cod !== 200) {
                    setWeather(null);
                    setError(data.message || "Failed to fetch weather");
                } else {
                    setWeather(data);
                }
            } catch (err) {
                console.error(err);
                setWeather(null);
                setError("Server error");
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [city]);

    const bgImage = weather?.weather?.[0]?.main
        ? getWeatherBackground(weather.weather[0].main)
        : "/weatherBackgrounds/default.avif";

    return (
        <div className="relative w-full h-screen">
            {/* Background */}
            <Image
                src={bgImage}
                alt="weather"
                fill
                className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 flex flex-col gap-10 items-center justify-start px-4 sm:px-20 lg:px-[100px] py-20 sm:py-40 lg:py-[100px] overflow-auto">
                {loading ? (
                    <p className="text-white text-3xl self-center">Loading...</p>
                ) : error ? (
                    <p className="text-white text-2xl">{error}</p>
                ) : weather && weather.weather?.length > 0 ? (
                    <>
                        <div className="absolute top-28 left-0">
                            <div className="flex flex-col w-[120px]">
                                <div className="bg-indigo-600 text-white rounded-tr-4xl rounded-tl-none rounded-br-4xl p-4 flex flex-col items-center justify-center -mb-12 z-50">
                                    <Image src="/rainy.png" alt="Rain" width={32} height={32} />
                                    <p className="text-sm mt-2">Rain</p>
                                </div>

                                <div className="bg-[#7b83eb] text-white rounded-tr-4xl rounded-br-4xl p-4 flex items-center justify-center h-[120px] z-10">
                                    <p className="text-xl font-semibold self-end">13°C</p>
                                </div>
                            </div>
                        </div>
                        {/* Search Bar */}
                        <div className="absolute top-6 right-10 w-[250px]">
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full text-base sm:text-lg p-2 pr-10 rounded-full focus:outline-none bg-[#1C1C3C] text-white"
                            />
                            <Image
                                src="/search.svg"
                                alt="Search Icon"
                                width={20}
                                height={20}
                                className="absolute right-2 top-3 cursor-pointer"
                                onClick={handleSearch}
                            />
                        </div>

                        <div className="w-full bg-black/30 flex flex-col lg:flex-row gap-10 absolute bottom-0 lg:px-[50px] px-4 py-10 rounded-t-4xl">
                            {/* 3 Days Forecast */}
                            <div className="flex flex-col gap-4 items-center w-full">
                                <h2 className="text-white text-2xl font-semibold">3 Days Forecast</h2>
                                {mockForecast.map((day) => (
                                    <div key={day.day} className="flex items-center gap-2">
                                        <div className="bg-[#2a3854] px-4 py-5 flex gap-2 w-[250px] rounded-l-2xl z-0">
                                            <Image
                                                src={
                                                    day.condition.toLowerCase() === "clear"
                                                        ? "/sunny.png"
                                                        : day.condition.toLowerCase() === "rain"
                                                            ? "/rainy.png"
                                                            : "/cloudy.png"
                                                }
                                                alt={day.condition}
                                                width={34}
                                                height={34}
                                            />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-md text-white">{day.day}</p>
                                                <p className="text-xs text-gray-400">{day.condition}</p>
                                            </div>
                                        </div>
                                        <div className="bg-[#7b83eb] px-4 py-8 flex justify-center items-center text-sm rounded-2xl -ml-10 z-10 text-white">
                                            {day.temp_min}° / {day.temp_max}°
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Today's Highlights */}
                            <div className="flex flex-col gap-5 w-full mt-1">
                                <h2 className="text-white text-2xl font-semibold">Today's Highlights</h2>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <div className="bg-[#29295a] w-full rounded-lg p-4 flex gap-20">
                                        <div className="flex flex-col gap-10">
                                            <p className="text-md text-gray-400">Feels like</p>
                                            <p className="text-2xl text-white">{weather.main.feels_like}</p>
                                        </div>
                                        <div className="self-end">°C</div>
                                    </div>
                                    <div className="bg-[#29295a] w-full rounded-lg p-4 flex gap-10">Humidity: 70%</div>
                                    <div className="bg-[#29295a] w-full rounded-lg p-4 flex gap-10">Wind: 10 km/h</div>
                                    <div className="bg-[#29295a] w-full rounded-lg p-4 flex gap-10">Pressure: 1015 hPa</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-white text-2xl">City not found</p>
                )}
            </div>
        </div>
    );
}