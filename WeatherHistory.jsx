import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

export default function WeatherHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await API.get('/weather/history');
      if (res.data.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch weather history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      const res = await API.delete('/weather/history');
      if (res.data.success) {
        setHistory([]);
      }
    } catch (err) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <History className="h-7 w-7 text-indigo-400" />
            <span>Weather Search History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Review your recent location searches and recorded weather conditions.</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400">Loading history logs...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 p-8 space-y-4 max-w-md mx-auto">
          <History className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Search History Found</h3>
          <p className="text-xs text-slate-400">Search for weather conditions across different cities to log your history.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-700/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Condition</th>
                  <th className="px-6 py-3.5">Temp</th>
                  <th className="px-6 py-3.5">Searched Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-white">
                      {item.locationName} <span className="text-xs font-normal text-slate-400">({item.country || 'Global'})</span>
                    </td>
                    <td className="px-6 py-4 capitalize text-sky-400">
                      {item.currentData?.condition || 'Clear'}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {item.currentData?.temp !== undefined ? `${item.currentData.temp}°C` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.searchedAt || item.createdAt || Date.now()).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/search?city=${encodeURIComponent(item.locationName)}`}
                        className="inline-flex items-center space-x-1 text-xs text-sky-400 hover:underline"
                      >
                        <span>Re-inspect</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
