export async function getCurrentWeather(city: string) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric&lang=en`,
        {
            cache: "no-cache",
            next: { revalidate: 60 },
        }
    )
    if (!res.ok) {
        throw new Error("Failed to fetch weather data");
    }
    return res.json();
}

export function getWeatherBackground(condition: string) {
  switch (condition.toLowerCase()) {
    case "clear":
      return "/weatherBackgrounds/sunny.avif";
    case "clouds":
      return "/weatherBackgrounds/cloud.avif";
    case "rain":
      return "/weatherBackgrounds/rainy.avif";
    case "drizzle":
      return "/weatherBackgrounds/rainy.avif";
    case "snow":
      return "/weatherBackgrounds/snow.avif";
    case "thunderstorm":
      return "/weatherBackgrounds/storm.avif";
    case "mist":
      return "/weatherBackgrounds/mist.avif";
    case "fog":
      return "/weatherBackgrounds/foggy.avif";
    default:
      return "/weatherBackgrounds/default.avif";
  }
}


