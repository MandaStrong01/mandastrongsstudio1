import { useState } from 'react';
import { X, Shield, Database, Users, Settings } from 'lucide-react';

interface DevToolsProps {
  onClose: () => void;
  userEmail?: string;
}

export function DevTools({ onClose, userEmail }: DevToolsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'database' | 'users' | 'settings'>('info');

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8">
      <div className="bg-zinc-950 border-2 border-[#7c3aed] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[#7c3aed]/30">
          <div className="flex items-center gap-3">
            <Shield size={28} className="text-[#7c3aed]" />
            <h2 className="text-2xl font-black uppercase text-white">Developer Tools</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition"
          >
            <X size={32} />
          </button>
        </div>

        <div className="flex border-b border-[#7c3aed]/30">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-4 font-bold uppercase text-sm transition ${
              activeTab === 'info'
                ? 'bg-[#7c3aed] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#7c3aed]/20'
            }`}
          >
            <Shield size={16} className="inline mr-2" />
            Info
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-6 py-4 font-bold uppercase text-sm transition ${
              activeTab === 'database'
                ? 'bg-[#7c3aed] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#7c3aed]/20'
            }`}
          >
            <Database size={16} className="inline mr-2" />
            Database
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 font-bold uppercase text-sm transition ${
              activeTab === 'users'
                ? 'bg-[#7c3aed] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#7c3aed]/20'
            }`}
          >
            <Users size={16} className="inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-4 font-bold uppercase text-sm transition ${
              activeTab === 'settings'
                ? 'bg-[#7c3aed] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#7c3aed]/20'
            }`}
          >
            <Settings size={16} className="inline mr-2" />
            Settings
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-black/50 border border-[#7c3aed]/30 rounded-xl p-6">
                <h3 className="text-lg font-black uppercase mb-4 text-white">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current User:</span>
                    <span className="text-white font-bold">{userEmail || 'Not logged in'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Version:</span>
                    <span className="text-white font-bold">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Environment:</span>
                    <span className="text-white font-bold">{import.meta.env.MODE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Database:</span>
                    <span className="text-green-400 font-bold">● Connected</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-[#7c3aed]/30 rounded-xl p-6">
                <h3 className="text-lg font-black uppercase mb-4 text-white">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Open Dev Tools:</span>
                    <span className="text-white font-mono bg-zinc-800 px-2 py-1 rounded">Ctrl+Shift+D</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/20 border border-blue-600/50 rounded-xl p-6">
                <p className="text-blue-400 text-sm">
                  <strong>Note:</strong> Developer tools are only accessible to authenticated users.
                  Use these tools to manage your account, view database information, and configure settings.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="bg-black/50 border border-[#7c3aed]/30 rounded-xl p-6">
                <h3 className="text-lg font-black uppercase mb-4 text-white">Database Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Connection:</span>
                    <span className="text-green-400 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Provider:</span>
                    <span className="text-white font-bold">Supabase</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-xl p-6">
                <p className="text-yellow-400 text-sm">
                  Direct database manipulation through dev tools is disabled for security.
                  Use the Supabase dashboard for advanced database operations.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-black/50 border border-[#7c3aed]/30 rounded-xl p-6">
                <h3 className="text-lg font-black uppercase mb-4 text-white">User Management</h3>
                <p className="text-zinc-400 text-sm">
                  User management features are available through the admin dashboard.
                  Contact support for admin access.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-black/50 border border-[#7c3aed]/30 rounded-xl p-6">
                <h3 className="text-lg font-black uppercase mb-4 text-white">Application Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Theme</label>
                    <select className="w-full bg-zinc-900 border border-[#7c3aed] p-3 rounded-lg text-white outline-none">
                      <option>Dark (Default)</option>
                      <option disabled>Light (Coming Soon)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Default Export Quality</label>
                    <select className="w-full bg-zinc-900 border border-[#7c3aed] p-3 rounded-lg text-white outline-none">
                      <option>8K</option>
                      <option>4K</option>
                      <option>HD</option>
                      <option>SD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#7c3aed]/30 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-zinc-800 text-white rounded-xl font-bold uppercase hover:bg-zinc-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
