import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './WeatherPage.css';

export default function WeatherPage(){
    const { cityName } = useParams();
  const [weather, setWeather] = useState({
    temperature: 0,
    weatherDescription: '',
    humidity: 0,
    windSpeed: 0,
    atmosphericPressure: 0
  });
  const API_KEY = `eb90323cf80927824cc1387b22449641`;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const data = response.data;
        setWeather({
          temperature: data.main.temp,
          weatherDescription: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          atmosphericPressure: data.main.pressure,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [cityName]);

  if (!weather) return <div>Loading...</div>;

  return (
    <div className="WeatherPage">
      <h2>Weather for {cityName}</h2>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Weather: {weather.weatherDescription}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.windSpeed} m/s</p>
      <p>Pressure: {weather.atmosphericPressure} hPa</p>
    </div>
  );
}