"use client";

import HighlightCard from "@/components/HighlightCard";
import Loading from "@/components/Loading";
import { getWeatherBackground } from "@/utils/fetchData";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
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

interface ForecastData {
    day: string;
    condition: string;
    temp_min: number;
    temp_max: number;
}

export default function Weather() {
    const router = useRouter();
    const { city } = useParams();

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchCity, setSearchCity] = useState(city || "");

    const handleSearch = () => {
        if (searchCity !== "") {
            router.push(`/weather/${searchCity}`);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);

        if (!city) {
            setLoading(false);
            return
        }

        try {
            const res1 = await fetch(`/api/weather?city=${encodeURIComponent(city?.toString())}`);
            const res2 = await fetch(`/api/forcast?city=${encodeURIComponent(city?.toString())}`);
            const data1 = await res1.json();
            const data2 = await res2.json();

            if (data1.cod && Number(data1.cod) !== 200) {
                setWeather(null);
                setError(data1.message || "Failed to fetch weather");
            } else {
                setWeather(data1);

                if (data2.list && Array.isArray(data2.list)) {
                    const daily: Record<string, ForecastData> = {};

                    data2.list.forEach((item: any) => {
                        const date = new Date(item.dt * 1000);
                        const day = date.toLocaleDateString("en-US", { weekday: "long" });

                        if (!daily[day]) {
                            daily[day] = {
                                day,
                                condition: item.weather[0].main,
                                temp_min: item.main.temp_min,
                                temp_max: item.main.temp_max,
                            };
                        } else {
                            daily[day].temp_min = Math.min(daily[day].temp_min, item.main.temp_min);
                            daily[day].temp_max = Math.max(daily[day].temp_max, item.main.temp_max);
                        }
                    });

                    setForecast(Object.values(daily).slice(0, 3));
                }
            }
        } catch (err) {
            console.error(err);
            setWeather(null);
            setError("Server error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!city) {
            setWeather(null);
            setError("City is required");
            return;
        }
        fetchWeather();
    }, [city]);

    return (
        <div className="relative w-full h-screen">
            {/* Background */}
            <Image
                src={weather?.weather?.[0]?.main ? getWeatherBackground(weather.weather[0].main) : "/loading1.avif"}
                alt="weather"
                fill
                className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 flex flex-col gap-6 sm:gap-10 items-center justify-start px-4 sm:px-10 lg:px-[100px] py-12 sm:py-20 lg:py-[100px] overflow-y-auto overflow-x-hidden">
                {loading ? (
                    <Loading />
                ) : error ? (
                    notFound()
                ) : weather && weather.weather?.length > 0 ? (
                    <>
                        {/* Temperature + Weather Icon */}
                        <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:bg-black/30 absolute top-0 left-0 rounded-br-full">
                            <div className="absolute top-10 sm:top-16 left-0">
                                <div className="flex flex-col w-[100px] sm:w-[120px]">
                                    <div className="bg-indigo-600 text-white rounded-tr-4xl rounded-tl-none rounded-br-4xl p-3 sm:p-4 flex flex-col gap-2 items-center justify-center -mb-10 sm:-mb-12 z-50">
                                        {weather.weather[0].main === "Clouds" ? (
                                            <Image
                                                src="/cloudy.svg"
                                                alt="Clouds"
                                                width={40}
                                                height={40}
                                            />
                                        ) : weather.weather[0].main === "Rain" ? (
                                            <Image
                                                src="/rainy.svg"
                                                alt="Rain"
                                                width={40}
                                                height={40}
                                            />
                                        ) : weather.weather[0].main === "Clear" ? (
                                            <Image
                                                src="/sunny.svg"
                                                alt="Clear"
                                                width={40}
                                                height={40}
                                            />
                                        ) : weather.weather[0].main === "Snow" ? (
                                            <Image
                                                src="/snowy.svg"
                                                alt="Snow"
                                                width={40}
                                                height={40}
                                            />
                                        ) : (
                                            <Image
                                                src="/sunny.svg"
                                                alt="Default"
                                                width={40}
                                                height={40}
                                            />
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
                            <div className="absolute top-28 sm:top-40 left-20 sm:left-40 w-full items-center gap-2 hidden lg:flex">
                                <Image
                                    src="/location.svg"
                                    alt="Location"
                                    width={30}
                                    height={30}
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
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
                                    setSearchCity(value);
                                }}
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
                        <div className="static mt-40 md:mt-0 -mb-16 md:mb-0 md:absolute bottom-0 left-0 w-[calc(100%+32px)] sm:w-full bg-black/30 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 px-4 sm:px-10 lg:px-[50px] py-4 sm:py-6 lg:py-10 rounded-t-3xl sm:rounded-t-4xl">
                            {/* 3 Days Forecast */}
                            <div className="flex flex-col gap-3 sm:gap-4 items-start md:items-center w-full lg:w-1/2">
                                <h2 className="text-white text-base sm:text-lg md:text-2xl font-semibold">
                                    3 Days Forecast
                                </h2>
                                {forecast.map((day) => (
                                    <div key={day.day} className="flex items-center justify-start md:justify-center gap-2 w-full">
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
                                            {Math.round(day.temp_min)}° / {Math.round(day.temp_max)}°
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Today's Highlights */}
                            <div className="flex flex-col gap-4 sm:gap-5 w-full lg:w-1/2 mt-2 lg:mt-0">
                                <h2 className="text-white text-base sm:text-lg md:text-2xl font-semibold">
                                    Today's Highlights
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                                    {/* Feels like */}
                                    <HighlightCard
                                        title="Feels like"
                                        value={`${weather.main.feels_like} °C`}
                                        icon="/temperature.svg"
                                        description="The temperature you actually feel"
                                    />
                                    {/* Humidity */}
                                    <HighlightCard
                                        title="Humidity"
                                        value={`${weather.main.humidity}%`}
                                        icon="/humidity.svg"
                                        description="The amount of water vapor in the air"
                                    />
                                    {/* Wind speed */}
                                    <HighlightCard
                                        title="Wind speed"
                                        value={`${weather.wind.speed} m/s`}
                                        icon="/windSpeed.svg"
                                        description="How fast the wind is blowing right now"
                                    />
                                    {/* Visibility */}
                                    <HighlightCard
                                        title="Visibility"
                                        value={`${weather.visibility / 1000} km`}
                                        icon="/glasses.svg"
                                        description="The distance you can clearly see ahead"
                                    />
                                </div>
                            </div>
                        </div>

                    </>
                ) : (
                    null
                )}
            </div>
        </div>
    );
}