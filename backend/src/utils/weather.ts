import axios from 'axios'
import cityTimezones from 'city-timezones'

const weatherIcons: Record<string, string> = {
    Clear: "☀️",
    Rain: "🌧️",
    Clouds: "☁️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
}

export function extractCity(title: string): string | null {
    const words = title.split(' ')

    for (const word of words) {
        const match = cityTimezones.lookupViaCity(word)
        if (match && match.length > 0 && match[0]) {
            return match[0].city
        }
    }
    return null
}

export async function fetchWeather(city: string): Promise<{ city: string, temp: string, icon: string } | null> {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: city,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: 'metric'
                }
            }
        )

        const temp = Math.round(response.data.main.temp)
        const condition = response.data.weather[0].main
        const icon = weatherIcons[condition] ?? "🌡️"

        return { city, temp: `${temp}°C`, icon }

    } catch (error) {
        console.error(`Weather fetch failed for ${city}:`, error)
        return null
    }
}