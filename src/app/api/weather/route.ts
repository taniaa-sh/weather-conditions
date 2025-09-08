// app/api/weather/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") || "Tehran";
const apiKey = process.env.WEATHER_API_KEY;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=fa`
    );

    const data = await res.json();
    console.log("Weather API Response:", data); 
    return NextResponse.json(data);
  } catch (err) {
    console.error("Weather API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
