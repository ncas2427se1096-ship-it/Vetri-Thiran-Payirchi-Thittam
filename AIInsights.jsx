import React, { useState, useEffect } from 'react';
import API from '../services/api';
import AIInsightCard from '../components/AIInsightCard';
import { Sparkles, Compass, Shirt, ShieldAlert, History } from 'lucide-react';

export default function AIInsights() {
  const [city, setCity] = useState('London');
  const [promptType, setPromptType] = useState('general');
  const [insights, setInsights] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/insights', { city, promptType });
      if (res.data.success) {
        setInsights(res.data.insights);
      }
      fetchHistory();
    } catch (err) {
      console.error('AI insight generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get('/ai/history');
      if (res.data.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchInsights();
  }, [promptType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>Powered by Google Gemini AI</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Weather Insight Engine</h1>
        <p className="text-sm text-slate-400">
          Generate intelligent weather summaries, clothing advice, travel precautions, and severe weather analysis.
        </p>
      </div>

      {/* Control Panel */}
      <div className="glass-card p-6 rounded-2xl border border-slate-700/60 max-w-3xl mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Insight Mode</label>
            <select
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="general">Comprehensive Summary</option>
              <option value="travel">Travel & Commute Precautions</option>
              <option value="health">Clothing & Activity Guide</option>
              <option value="severe">Severe Weather Advisory</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>{loading ? 'Analyzing Atmospheric Data...' : 'Generate Gemini AI Insights'}</span>
        </button>
      </div>

      {/* Main Output */}
      {insights && (
        <div className="max-w-4xl mx-auto">
          <AIInsightCard insights={insights} locationName={city} />
        </div>
      )}

      {/* Saved AI Insight Logs */}
      {history.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-slate-200">
            <History className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold">Saved AI Insight Logs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item) => (
              <div key={item._id} className="glass-card p-4 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-center text-xs text-indigo-300">
                  <span className="font-bold text-white text-sm">{item.locationName}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-3">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
