import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Shield, Users, Activity, Bell, Server, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState('admin_notice');
  const [notifSentMsg, setNotifSentMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/stats'),
      ]);

      if (uRes.data.success) setUsers(uRes.data.users || []);
      if (sRes.data.success) setStats(sRes.data.stats);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {}
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await API.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {}
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setNotifSentMsg('');
    try {
      const res = await API.post('/notifications', {
        title: notifTitle,
        message: notifMsg,
        type: notifType,
        severity: 'low',
      });
      if (res.data.success) {
        setNotifSentMsg('System notification broadcast successfully!');
        setNotifTitle('');
        setNotifMsg('');
      }
    } catch (err) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <Shield className="h-7 w-7 text-amber-400" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">System monitoring, user role management, and broadcast alerts.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400">Loading system metrics...</div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center space-x-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Registered Users</p>
                <h3 className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</h3>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total API Calls</p>
                <h3 className="text-2xl font-bold text-white">{stats?.apiUsage?.totalApiCalls || 0}</h3>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Searches</p>
                <h3 className="text-2xl font-bold text-white">{stats?.totalSearches || 0}</h3>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center space-x-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">AI Insights Generated</p>
                <h3 className="text-2xl font-bold text-white">{stats?.totalInsights || 0}</h3>
              </div>
            </div>
          </div>

          {/* System Status & Broadcast Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Status & API Keys */}
            <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Server className="h-5 w-5 text-sky-400" />
                <span>System Resiliency & Status</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
                  <span className="text-xs text-slate-300">Smart Fallback Engine</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active & Resilient
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
                  <span className="text-xs text-slate-300">OpenWeather API Integration</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stats?.openWeatherKeyConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {stats?.openWeatherKeyConfigured ? 'Live API Key' : 'Smart Mock Fallback'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
                  <span className="text-xs text-slate-300">Google Gemini AI API Integration</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stats?.geminiKeyConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    {stats?.geminiKeyConfigured ? 'Live Gemini AI Key' : 'Smart Rule Engine Fallback'}
                  </span>
                </div>
              </div>
            </div>

            {/* Broadcast System Alert */}
            <form onSubmit={handleSendNotification} className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Bell className="h-5 w-5 text-indigo-400" />
                <span>Broadcast System Notification</span>
              </h3>

              {notifSentMsg && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  {notifSentMsg}
                </div>
              )}

              <div>
                <input
                  type="text"
                  required
                  placeholder="Notification Title"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={2}
                  placeholder="Notification message body..."
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-xl transition shadow-md"
              >
                Broadcast Notification
              </button>
            </form>
          </div>

          {/* User Management Table */}
          <div className="glass-card rounded-2xl border border-slate-700/60 overflow-hidden space-y-4 p-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="h-5 w-5 text-sky-400" />
              <span>User Account Management</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-semibold text-white">{u.name}</td>
                      <td className="px-4 py-3 text-slate-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 rounded-lg border border-slate-700 transition"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
