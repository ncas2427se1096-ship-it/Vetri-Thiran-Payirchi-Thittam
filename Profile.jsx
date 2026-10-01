import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, CheckCircle2, Shield } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [tempUnit, setTempUnit] = useState(user?.preferences?.tempUnit || 'C');
  const [defaultCity, setDefaultCity] = useState(user?.preferences?.defaultCity || 'London');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notificationsEnabled ?? true
  );

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await updateProfile({
        name,
        preferences: { tempUnit, defaultCity, notificationsEnabled },
      });
      setMessage('Profile and account settings saved successfully!');
    } catch (err) {
      setMessage(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-6">
        <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
          <User className="h-7 w-7 text-sky-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Account Settings & Profile</h1>
          <p className="text-sm text-slate-400">Manage your user profile and weather unit preferences.</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-slate-700/60 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <User className="h-5 w-5 text-sky-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl px-3 py-2 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <span>Weather Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Temperature Unit</label>
              <select
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Dashboard City</label>
              <input
                type="text"
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
                placeholder="e.g. London"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="notifToggle"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="h-4 w-4 accent-sky-500 rounded border-slate-700"
            />
            <label htmlFor="notifToggle" className="text-xs text-slate-300 font-medium">
              Enable severe weather alerts & AI recommendation notifications
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-amber-400">
            <Shield className="h-4 w-4" />
            <span>Role: <strong className="capitalize">{user?.role || 'user'}</strong></span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm rounded-xl transition shadow-md"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
