import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Shield, CloudRain, Sun, Compass, ArrowRight } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';

export default function Home() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/search?city=${encodeURIComponent(city.trim())}`);
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4 pt-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
          <Sparkles className="h-4 w-4 animate-spin-slow" />
          <span>Next-Generation AI Weather Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Real-Time Forecasts & <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            AI-Powered Recommendations
          </span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Stay ahead of the elements. Get hyper-accurate weather forecasts paired with personalized Google Gemini AI recommendations for clothing, travel precautions, and outdoor activities.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center bg-slate-800/80 p-2 rounded-2xl border border-slate-700 shadow-2xl focus-within:border-sky-500 transition">
          <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city (e.g. London, Tokyo, New York)..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm py-2"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-sky-500/20 flex items-center space-x-1"
          >
            <span>Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Popular Cities Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs text-slate-400">
          <span>Popular:</span>
          {['London', 'Tokyo', 'Paris', 'New York', 'Sydney'].map((c) => (
            <button
              key={c}
              onClick={() => navigate(`/search?city=${c}`)}
              className="hover:text-sky-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-700/60 hover:border-sky-500/40 transition">
          <div className="p-3 bg-sky-500/10 rounded-xl w-fit mb-4">
            <Sun className="h-6 w-6 text-sky-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Real-Time Forecasts</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Live atmospheric metrics including UV index, wind velocity, humidity, air quality, and 5-day multi-tier forecast trends.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-700/60 hover:border-indigo-500/40 transition">
          <div className="p-3 bg-indigo-500/10 rounded-xl w-fit mb-4">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Google Gemini AI</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Personalized clothing guidance, outdoor activity planning, travel precautions, and severe weather warnings generated instantly.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-700/60 hover:border-amber-500/40 transition">
          <div className="p-3 bg-amber-500/10 rounded-xl w-fit mb-4">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Resilient Fallback System</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            100% continuous uptime with intelligent fallback caching, ensuring uninterrupted weather insights even under network anomalies.
          </p>
        </div>
      </section>
    </div>
  );
}
