
'use client';

import { useEffect, useState } from 'react';
import { apiUrls } from '@/lib/apiUrls';
import {
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ icon: Icon, title, value, color, loading }: any) => (
  <div
    className="bg-surface rounded-lg shadow-lg p-6 flex items-center transition-transform transform hover:scale-105"
    style={{ background: 'var(--surface)' }}
  >
    <div className={`p-4 rounded-full mr-4`} style={{ backgroundColor: color, color: '#fff' }}>
      <Icon className="h-8 w-8" />
    </div>
    <div>
      <div className="text-lg font-semibold text-foreground">{title}</div>
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
      ) : (
        <div className="text-3xl font-bold text-primary">{value}</div>
      )}
    </div>
  </div>
);

export default function Home() {
  const [stats, setStats] = useState({ users: 0, roles: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, rolesRes, blogsRes] = await Promise.all([
          fetch(apiUrls.getUsers, { cache: 'no-store' }),
          fetch(apiUrls.getRoles, { cache: 'no-store' }),
          fetch(apiUrls.getBlogs, { cache: 'no-store' }),
        ]);

        if (!usersRes.ok || !rolesRes.ok || !blogsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();
        const blogsData = await blogsRes.json();

        setStats({
          users: usersData.data.length,
          roles: rolesData.data.length,
          blogs: blogsData.data.length,
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-primary">Admin Dashboard</h1>
        <p className="text-lg text-foreground mt-2">Welcome back, Admin!</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={UsersIcon}
          title="Total Users"
          value={stats.users}
          color="#1976D2"
          loading={loading}
        />
        <StatCard
          icon={ShieldCheckIcon}
          title="Total Roles"
          value={stats.roles}
          color="#F50057"
          loading={loading}
        />
        <StatCard
          icon={DocumentTextIcon}
          title="Total Blogs"
          value={stats.blogs}
          color="#4CAF50"
          loading={loading}
        />
      </div>

      <div className="mt-10 bg-surface rounded-lg shadow-lg p-6" style={{ background: 'var(--surface)' }}>
        <h2 className="text-2xl font-bold text-primary mb-4">Recent Activity</h2>
        <div className="flex items-center text-foreground">
          <ChartBarIcon className="h-8 w-8 mr-4 text-primary" />
          <p>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
