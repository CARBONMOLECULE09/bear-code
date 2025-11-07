import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Coins, Search, FileCode, TrendingUp, Loader2 } from 'lucide-react';
import type { UserStats } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.getUserStats();
      setStats(response.data!);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Available Credits',
      value: user?.credits || 0,
      icon: Coins,
      color: 'bg-green-500',
      link: '/credits',
    },
    {
      title: 'Total Searches',
      value: stats?.totalSearches || 0,
      icon: Search,
      color: 'bg-blue-500',
      link: '/search',
    },
    {
      title: 'Indexed Documents',
      value: stats?.totalDocuments || 0,
      icon: FileCode,
      color: 'bg-purple-500',
      link: '/search',
    },
    {
      title: 'Credits Used',
      value: stats?.totalCreditsUsed || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/credits',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your Bear Code account
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-bear-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.title}
                  to={stat.link}
                  className="card hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/search"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-bear-500 hover:bg-bear-50 transition-all"
            >
              <Search className="w-6 h-6 text-bear-600" />
              <div>
                <p className="font-medium text-gray-900">Search Code</p>
                <p className="text-sm text-gray-600">Find similar code snippets</p>
              </div>
            </Link>

            <Link
              to="/search?tab=index"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-bear-500 hover:bg-bear-50 transition-all"
            >
              <FileCode className="w-6 h-6 text-bear-600" />
              <div>
                <p className="font-medium text-gray-900">Index Code</p>
                <p className="text-sm text-gray-600">Add code to your library</p>
              </div>
            </Link>

            <Link
              to="/credits"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-bear-500 hover:bg-bear-50 transition-all"
            >
              <Coins className="w-6 h-6 text-bear-600" />
              <div>
                <p className="font-medium text-gray-900">Buy Credits</p>
                <p className="text-sm text-gray-600">Get more credits</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        {stats && stats.totalSearches === 0 && stats.totalDocuments === 0 && (
          <div className="card bg-gradient-to-r from-bear-50 to-bear-100 border-bear-200">
            <h2 className="text-xl font-bold text-bear-900 mb-4">🚀 Getting Started</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-bear-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Index your first code snippet</p>
                  <p className="text-sm text-gray-600">
                    Add code to your library for semantic search
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-bear-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Search for similar code</p>
                  <p className="text-sm text-gray-600">
                    Use natural language to find relevant code snippets
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-bear-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Track your usage</p>
                  <p className="text-sm text-gray-600">
                    Monitor credits and view your search history
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/search"
              className="btn btn-primary mt-6 inline-flex items-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};
