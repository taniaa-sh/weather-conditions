"use client";

import { getWeatherBackground } from "@/utils/fetchData";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WeatherData {
    weather: { main: string; description: string }[];
    main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number };
    name: string;
    sys: { country: string };
    wind: { speed: number };
    visibility: number;
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
            <Image src={bgImage} alt="weather" fill className="object-cover" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 flex flex-col gap-6 sm:gap-10 items-center justify-start px-4 sm:px-10 lg:px-[100px] py-12 sm:py-20 lg:py-[100px] overflow-x-hidden">
                {loading ? (
                    <p className="text-white text-2xl sm:text-3xl self-center">Loading...</p>
                ) : error ? (
                    <p className="text-white text-lg sm:text-2xl">{error}</p>
                ) : weather && weather.weather?.length > 0 ? (
                    <>
                        {/* Temperature + Weather Icon */}
                        <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] md:bg-black/30 absolute top-0 left-0 rounded-br-full">
                            <div className="absolute top-10 sm:top-16 left-0">
                                <div className="flex flex-col w-[100px] sm:w-[120px]">
                                    <div className="bg-indigo-600 text-white rounded-tr-4xl rounded-tl-none rounded-br-4xl p-3 sm:p-4 flex flex-col gap-2 items-center justify-center -mb-10 sm:-mb-12 z-50">
                                        {weather.weather[0].main === "Clouds" ? (
                                            <Image src="/cloudy.svg" alt="Clouds" width={40} height={40} />
                                        ) : weather.weather[0].main === "Rain" ? (
                                            <Image src="/rainy.svg" alt="Rain" width={40} height={40} />
                                        ) : weather.weather[0].main === "Clear" ? (
                                            <Image src="/sunny.svg" alt="Clear" width={40} height={40} />
                                        ) : weather.weather[0].main === "Snow" ? (
                                            <Image src="/snowy.svg" alt="Snow" width={40} height={40} />
                                        ) : (
                                            <Image src="/sunny.svg" alt="Default" width={40} height={40} />
                                        )}
                                        <p className="text-xs sm:text-sm mt-2">{weather.weather[0].main}</p>
                                    </div>

                                    <div className="bg-[#7b83eb] text-white rounded-tr-4xl rounded-br-4xl p-3 sm:p-4 flex items-center justify-center h-[100px] sm:h-[120px] z-10">
                                        <p className="text-lg sm:text-xl font-semibold self-end">
                                            {Math.round(weather.main.temp)} °<span className="text-xs sm:text-sm">C</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-28 sm:top-40 left-20 sm:left-40 w-full flex items-center gap-2">
                                <Image
                                    src="/location.svg"
                                    alt="Location"
                                    width={20}
                                    height={20}
                                    className="block md:hidden"
                                />
                                <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 md:text-white">
                                    {weather.name}
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="absolute top-6 right-4 sm:right-10 w-[160px] sm:w-[220px] md:w-[250px] z-50">
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full text-sm sm:text-base py-2 px-4 rounded-full focus:outline-none bg-[#1C1C3C] text-white"
                            />
                            <Image
                                src="/search.svg"
                                alt="Search Icon"
                                width={18}
                                height={18}
                                className="absolute right-4 top-2 md:top-3 cursor-pointer"
                                onClick={handleSearch}
                            />
                        </div>

                        {/* Forecast & Highlights */}
                        <div className="w-full bg-black/30 flex flex-col lg:flex-row gap-6 sm:gap-10 absolute bottom-0 lg:px-[50px] px-4 py-6 sm:py-10 rounded-t-3xl sm:rounded-t-4xl">
                            {/* 3 Days Forecast */}
                            <div className="flex flex-col gap-3 sm:gap-4 items-start md:items-center w-full">
                                <h2 className="text-white text-base sm:text-lg md:text-2xl font-semibold">
                                    3 Days Forecast
                                </h2>
                                {mockForecast.map((day) => (
                                    <div key={day.day} className="flex items-center gap-2">
                                        <div className="bg-[#2a3854] px-3 sm:px-4 py-3 sm:py-5 flex gap-2 w-[160px] sm:w-[200px] md:w-[250px] rounded-l-2xl z-0">
                                            <Image
                                                src={
                                                    day.condition.toLowerCase() === "clear"
                                                        ? "/sunny.svg"
                                                        : day.condition.toLowerCase() === "rain"
                                                            ? "/rainy.svg"
                                                            : day.condition.toLowerCase() === "clouds"
                                                                ? "/cloudy.svg"
                                                                : day.condition.toLowerCase() === "snow"
                                                                    ? "/snowy.svg"
                                                                    : "/sunny.svg"
                                                }
                                                alt={day.condition}
                                                width={28}
                                                height={28}
                                            />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm sm:text-md text-white">{day.day}</p>
                                                <p className="text-xs text-gray-400">{day.condition}</p>
                                            </div>
                                        </div>
                                        <div className="bg-[#7b83eb] px-3 sm:px-4 py-6 sm:py-8 flex justify-center items-center text-xs sm:text-sm rounded-2xl -ml-8 sm:-ml-10 z-10 text-white">
                                            {day.temp_min}° / {day.temp_max}°
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Today's Highlights */}
                            <div className="flex flex-col gap-4 sm:gap-5 w-full mt-1">
                                <h2 className="text-white text-base sm:text-lg md:text-2xl font-semibold">
                                    Today's Highlights
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                                    {/* Feels like */}
                                    <div className="bg-[#29295a] w-full rounded-lg p-3 sm:p-4 flex gap-4 sm:gap-6">
                                        <div className="flex flex-col gap-6 sm:gap-10 min-w-20 sm:min-w-24">
                                            <p className="text-sm sm:text-md text-gray-400">Feels like</p>
                                            <div className="text-lg sm:text-2xl text-white">
                                                {weather.main.feels_like} °<span className="text-sm">C</span>
                                            </div>
                                        </div>
                                        <div className="self-end flex items-center flex-col gap-1">
                                            <Image
                                                src="/temperature.svg"
                                                alt="Temp"
                                                width={24}
                                                height={24}
                                                className="self-start"
                                            />
                                            <p className="text-xs sm:text-sm text-gray-400">The temperature you actually feel</p>
                                        </div>
                                    </div>

                                    {/* Humidity */}
                                    <div className="bg-[#29295a] w-full rounded-lg p-3 sm:p-4 flex gap-4 sm:gap-6">
                                        <div className="flex flex-col gap-6 sm:gap-10 min-w-20 sm:min-w-24">
                                            <p className="text-sm sm:text-md text-gray-400">Humidity</p>
                                            <div className="text-lg sm:text-2xl text-white">
                                                {weather.main.humidity}<span className="text-sm">%</span>
                                            </div>
                                        </div>
                                        <div className="self-end flex items-center flex-col gap-1">
                                            <Image
                                                src="/humidity.svg"
                                                alt="Humidity"
                                                width={24}
                                                height={24}
                                                className="self-start"
                                            />
                                            <p className="text-xs sm:text-sm text-gray-400">The amount of water vapor in the air</p>
                                        </div>
                                    </div>

                                    {/* Wind speed */}
                                    <div className="bg-[#29295a] w-full rounded-lg p-3 sm:p-4 flex gap-4 sm:gap-6">
                                        <div className="flex flex-col gap-6 sm:gap-10 min-w-20 sm:min-w-24">
                                            <p className="text-sm sm:text-md text-gray-400">Wind speed</p>
                                            <div className="text-lg sm:text-2xl text-white">
                                                {weather.wind.speed} <span className="text-sm">m/s</span>
                                            </div>
                                        </div>
                                        <div className="self-end flex items-center flex-col gap-1">
                                            <Image
                                                src="/windSpeed.svg"
                                                alt="Wind"
                                                width={24}
                                                height={24}
                                                className="self-start"
                                            />
                                            <p className="text-xs sm:text-sm text-gray-400">How fast the wind is blowing right now</p>
                                        </div>
                                    </div>

                                    {/* Visibility */}
                                    <div className="bg-[#29295a] w-full rounded-lg p-3 sm:p-4 flex gap-4 sm:gap-6">
                                        <div className="flex flex-col gap-6 sm:gap-10 min-w-20 sm:min-w-24">
                                            <p className="text-sm sm:text-md text-gray-400">Visibility</p>
                                            <div className="text-lg sm:text-2xl text-white">
                                                {weather.visibility / 1000} <span className="text-sm">km</span>
                                            </div>
                                        </div>
                                        <div className="self-end flex items-center flex-col gap-1">
                                            <Image
                                                src="/glasses.svg"
                                                alt="Visibility"
                                                width={24}
                                                height={24}
                                                className="self-start"
                                            />
                                            <p className="text-xs sm:text-sm text-gray-400">The distance you can clearly see ahead</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-white text-lg sm:text-2xl">City not found</p>
                )}
            </div>
        </div>
    );
}