import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import WeatherChart from '../components/WeatherChart';
import AIInsightCard from '../components/AIInsightCard';
import { Sparkles, Bookmark, History, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [city, setCity] = useState(user?.preferences?.defaultCity || 'London');
  const [weather, setWeather] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async (targetCity) => {
    setLoading(true);
    try {
      const [weatherRes, analyticsRes, aiRes] = await Promise.all([
        API.get(`/weather/current?city=${encodeURIComponent(targetCity)}`),
        API.get(`/weather/analytics?city=${encodeURIComponent(targetCity)}`),
        API.post('/ai/insights', { city: targetCity, promptType: 'general' }),
      ]);

      if (weatherRes.data.success) setWeather(weatherRes.data.data);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
      if (aiRes.data.success) setAiInsights(aiRes.data.insights);
    } catch (err) {
      console.error('Dashboard data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(city);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {user?.name || 'Explorer'} 👋</h1>
          <p className="text-sm text-slate-400 mt-1">Here is your live weather overview and AI forecast digest.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchDashboardData(city)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/ai-insights"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center space-x-1.5 hover:from-indigo-400 hover:to-sky-400 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Full AI Report</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Synthesizing real-time weather & AI recommendations...</p>
        </div>
      ) : (
        <>
          {/* Main Weather & AI Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {weather && (
                <WeatherCard
                  weather={weather.currentData}
                  locationName={weather.locationName}
                  country={weather.country}
                  isMock={weather.isMock}
                />
              )}

              {weather?.forecastData && (
                <ForecastCard forecast={weather.forecastData} />
              )}

              {analytics?.tempTrend && (
                <WeatherChart trend={analytics.tempTrend} />
              )}
            </div>

            {/* AI Insights & Quick Links */}
            <div className="space-y-6">
              {aiInsights && (
                <AIInsightCard insights={aiInsights} locationName={weather?.locationName || city} />
              )}

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/favorites"
                  className="glass-card p-4 rounded-xl border border-slate-700/60 hover:border-sky-500/40 transition flex items-center space-x-3 group"
                >
                  <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg group-hover:bg-sky-500/20 transition">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Favorites</h4>
                    <p className="text-[11px] text-slate-400">Saved Cities</p>
                  </div>
                </Link>

                <Link
                  to="/history"
                  className="glass-card p-4 rounded-xl border border-slate-700/60 hover:border-sky-500/40 transition flex items-center space-x-3 group"
                >
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500/20 transition">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">History</h4>
                    <p className="text-[11px] text-slate-400">Past Searches</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
