import { useState, useEffect } from 'react';
import { Shield, Users, Database, Activity, Settings, Crown, Download, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  subscription_tier: string;
}

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalProjects: number;
  totalAssets: number;
  storageUsed: number;
}

export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalProjects: 0,
    totalAssets: 0,
    storageUsed: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content'>('overview');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role');

    const { data: usersData } = await supabase.rpc('get_all_users_admin');

    if (rolesData && usersData) {
      const usersWithRoles = usersData.map((u: any) => {
        const role = rolesData.find(r => r.user_id === u.id);
        return {
          ...u,
          role: role?.role || 'free',
          subscription_tier: 'N/A'
        };
      });
      setUsers(usersWithRoles);
    }
  };

  const loadStats = async () => {
    const { count: userCount } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true });

    const { count: subCount } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: projectCount } = await supabase
      .from('movie_projects')
      .select('*', { count: 'exact', head: true });

    const { count: assetCount } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true });

    setStats({
      totalUsers: userCount || 0,
      activeSubscriptions: subCount || 0,
      totalProjects: projectCount || 0,
      totalAssets: assetCount || 0,
      storageUsed: 0
    });
  };

  const makeAdmin = async (userId: string) => {
    try {
      await supabase
        .from('user_roles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      await supabase
        .from('admin_logs')
        .insert({
          admin_user_id: user?.id,
          action: 'grant_admin',
          target_user_id: userId,
          details: { timestamp: new Date().toISOString() }
        });

      loadUsers();
      alert('Admin role granted successfully!');
    } catch (error) {
      console.error('Error granting admin:', error);
      alert('Failed to grant admin role');
    }
  };

  const grantSubscription = async (userId: string, tierName: string) => {
    try {
      const { data: tier } = await supabase
        .from('subscription_tiers')
        .select('id')
        .eq('name', tierName)
        .single();

      if (!tier) {
        alert('Subscription tier not found');
        return;
      }

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          tier_id: tier.id,
          status: 'active',
          expires_at: expiresAt.toISOString()
        });

      await supabase
        .from('admin_logs')
        .insert({
          admin_user_id: user?.id,
          action: 'grant_subscription',
          target_user_id: userId,
          details: { tier: tierName, expires_at: expiresAt.toISOString() }
        });

      loadStats();
      alert(`${tierName} subscription granted successfully!`);
    } catch (error) {
      console.error('Error granting subscription:', error);
      alert('Failed to grant subscription');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-white/70">Admin privileges required</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="w-10 h-10 text-yellow-400" />
          <h1 className="text-4xl font-black text-purple-400">ADMIN DASHBOARD</h1>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'bg-black/30 text-white/70 hover:bg-black/50'
            }`}
          >
            <Activity className="w-5 h-5 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('users')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTab === 'users'
                ? 'bg-purple-600 text-white'
                : 'bg-black/30 text-white/70 hover:bg-black/50'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setSelectedTab('content')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTab === 'content'
                ? 'bg-purple-600 text-white'
                : 'bg-black/30 text-white/70 hover:bg-black/50'
            }`}
          >
            <Database className="w-5 h-5 inline mr-2" />
            Content
          </button>
        </div>

        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-black text-white">{stats.totalUsers}</span>
              </div>
              <p className="text-white/70">Total Users</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-green-500/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <Crown className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-black text-white">{stats.activeSubscriptions}</span>
              </div>
              <p className="text-white/70">Active Subscriptions</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <Database className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-black text-white">{stats.totalProjects}</span>
              </div>
              <p className="text-white/70">Total Projects</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <Upload className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-black text-white">{stats.totalAssets}</span>
              </div>
              <p className="text-white/70">Total Assets</p>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-3 px-4 text-purple-300">Email</th>
                    <th className="text-left py-3 px-4 text-purple-300">Role</th>
                    <th className="text-left py-3 px-4 text-purple-300">Created</th>
                    <th className="text-left py-3 px-4 text-purple-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-purple-500/10">
                      <td className="py-3 px-4 text-white/90">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : u.role === 'subscriber'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => makeAdmin(u.id)}
                              className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-bold transition-all"
                            >
                              Make Admin
                            </button>
                          )}
                          <button
                            onClick={() => grantSubscription(u.id, 'STUDIO')}
                            className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-bold transition-all"
                          >
                            Grant Studio
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'content' && (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Content Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/20">
                <div>
                  <p className="text-lg font-semibold text-white">Movie Projects</p>
                  <p className="text-white/60 text-sm">Total projects created by users</p>
                </div>
                <span className="text-3xl font-black text-purple-400">{stats.totalProjects}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/20">
                <div>
                  <p className="text-lg font-semibold text-white">Assets Uploaded</p>
                  <p className="text-white/60 text-sm">Total media files in storage</p>
                </div>
                <span className="text-3xl font-black text-purple-400">{stats.totalAssets}</span>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/40 to-black/40 rounded-2xl border-2 border-purple-400/50">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Admin Capabilities</h3>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Full access to all user projects and assets
                  </li>
                  <li className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-400" />
                    Unlimited uploads and exports
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-purple-400" />
                    Download any user content for review
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    Manage subscriptions and permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-400" />
                    Grant admin access to other users
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
