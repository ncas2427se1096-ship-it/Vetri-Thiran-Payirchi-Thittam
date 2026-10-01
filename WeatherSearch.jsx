import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import WeatherChart from '../components/WeatherChart';
import AIInsightCard from '../components/AIInsightCard';
import { Search, Sparkles } from 'lucide-react';

export default function WeatherSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'London';
  const [cityInput, setCityInput] = useState(initialCity);
  const [currentCity, setCurrentCity] = useState(initialCity);
  
  const [weather, setWeather] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const fetchWeatherData = async (cityToFetch) => {
    setLoading(true);
    setSaveSuccess('');
    try {
      const [wRes, aRes, aiRes, fRes] = await Promise.all([
        API.get(`/weather/current?city=${encodeURIComponent(cityToFetch)}`),
        API.get(`/weather/analytics?city=${encodeURIComponent(cityToFetch)}`),
        API.post('/ai/insights', { city: cityToFetch, promptType: 'general' }),
        API.get('/favorites').catch(() => ({ data: { favorites: [] } })),
      ]);

      if (wRes.data.success) setWeather(wRes.data.data);
      if (aRes.data.success) setAnalytics(aRes.data.analytics);
      if (aiRes.data.success) setAiInsights(aiRes.data.insights);
      if (fRes.data?.success) setFavorites(fRes.data.favorites);
    } catch (err) {
      console.error('Weather search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(currentCity);
  }, [currentCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setCurrentCity(cityInput.trim());
      setSearchParams({ city: cityInput.trim() });
    }
  };

  const isCurrentFavorite = favorites.some(
    f => f.locationName?.toLowerCase() === weather?.locationName?.toLowerCase()
  );

  const handleSaveFavorite = async () => {
    if (!weather) return;
    try {
      const res = await API.post('/favorites', {
        locationName: weather.locationName,
        country: weather.country,
      });
      if (res.data.success) {
        setSaveSuccess(`Added ${weather.locationName} to Favorites!`);
        setFavorites([...favorites, res.data.favorite]);
      }
    } catch (err) {
      setSaveSuccess(err.response?.data?.message || 'Already in favorites');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white">Weather Condition Search</h1>
        <p className="text-sm text-slate-400">Search any global city for live atmospheric data, forecasts, and AI insights.</p>

        <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-xl focus-within:border-sky-500 transition">
          <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Type city name..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm py-2"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm rounded-xl transition shadow-md"
          >
            Search
          </button>
        </form>

        {saveSuccess && (
          <p className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-lg border border-emerald-500/20 inline-block">
            {saveSuccess}
          </p>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Fetching meteorological metrics...</p>
        </div>
      ) : (
        weather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <WeatherCard
                weather={weather.currentData}
                locationName={weather.locationName}
                country={weather.country}
                isMock={weather.isMock}
                onSaveFavorite={handleSaveFavorite}
                isFavorite={isCurrentFavorite}
              />

              <ForecastCard forecast={weather.forecastData} />

              {analytics?.tempTrend && (
                <WeatherChart trend={analytics.tempTrend} title={`5-Day Temperature Trend for ${weather.locationName}`} />
              )}
            </div>

            <div className="space-y-6">
              {aiInsights && (
                <AIInsightCard insights={aiInsights} locationName={weather.locationName} />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
