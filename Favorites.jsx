import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Bookmark, Trash2, ArrowUpRight, Sun, CloudRain } from 'lucide-react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await API.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.favorites || []);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      const res = await API.delete(`/favorites/${id}`);
      if (res.data.success) {
        setFavorites(favorites.filter((f) => f._id !== id));
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <Bookmark className="h-7 w-7 text-sky-400" />
            <span>Favorite Locations</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage your saved cities with live weather monitoring.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400">Loading saved locations...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 p-8 space-y-4 max-w-md mx-auto">
          <Bookmark className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Favorite Cities Saved</h3>
          <p className="text-xs text-slate-400">Search for cities and click "Save City" to quickly monitor them here.</p>
          <Link to="/search" className="inline-block px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-semibold">
            Search Weather
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav._id} className="glass-card rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between hover:border-sky-500/40 transition">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{fav.locationName}</h3>
                    <p className="text-xs text-slate-400">{fav.country}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(fav._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Remove Favorite"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {fav.weather && (
                  <div className="my-4 flex items-center justify-between">
                    <div>
                      <span className="text-4xl font-extrabold text-white">{fav.weather.temp}°</span>
                      <p className="text-xs text-slate-400 capitalize">{fav.weather.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400 space-y-1">
                      <p>Humidity: <span className="text-white font-medium">{fav.weather.humidity}%</span></p>
                      <p>Wind: <span className="text-white font-medium">{fav.weather.windSpeed} km/h</span></p>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={`/search?city=${encodeURIComponent(fav.locationName)}`}
                className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-sky-400 flex items-center justify-center space-x-1 transition"
              >
                <span>Full Weather & Forecast</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
