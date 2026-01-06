import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Thermometer } from 'lucide-react';
import axios from 'axios';

const WeatherWidget = ({ city }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Mocking weather for now or using a placeholder API call
                // Replace with: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY`

                // Simulating API delay
                setTimeout(() => {
                    setWeather({
                        temp: Math.floor(Math.random() * (30 - 15) + 15),
                        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
                        humidity: 65
                    });
                    setLoading(false);
                }, 1000);

            } catch (err) {
                console.error("Weather fetch failed", err);
                setLoading(false);
            }
        };

        if (city) fetchWeather();
    }, [city]);

    if (loading) return <div className="weather-loading">Checking sky...</div>;
    if (!weather) return null;

    const renderIcon = () => {
        switch (weather.condition) {
            case 'Sunny': return <Sun size={20} color="#ff9500" />;
            case 'Cloudy': return <Cloud size={20} color="#8e8e93" />;
            case 'Rainy': return <CloudRain size={20} color="#0071e3" />;
            default: return <Thermometer size={20} />;
        }
    };

    return (
        <div className="weather-widget">
            <div className="weather-main">
                {renderIcon()}
                <span className="temp">{weather.temp}°C</span>
            </div>
            <div className="condition">{weather.condition}</div>
        </div>
    );
};

export default WeatherWidget;
