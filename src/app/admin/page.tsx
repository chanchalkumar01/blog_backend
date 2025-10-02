
'use client';

import { useEffect, useState } from 'react';
import { apiUrls } from '@/lib/apiUrls';
import {
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ icon: Icon, title, value, bgColorClass, loading }: any) => (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 flex items-center transition-transform transform hover:-translate-y-1">
        <div className={`p-3 rounded-full mr-4 ${bgColorClass}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
                <div className="h-7 w-16 bg-muted rounded-md animate-pulse mt-1"></div>
            ) : (
                <p className="text-2xl font-bold">{value}</p>
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
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Admin! Here's an overview of your site.</p>
      </div>

      {error && (
         <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-md mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={UsersIcon}
          title="Total Users"
          value={stats.users}
          bgColorClass="bg-primary"
          loading={loading}
        />
        <StatCard
          icon={ShieldCheckIcon}
          title="Total Roles"
          value={stats.roles}
          bgColorClass="bg-pink-600"
          loading={loading}
        />
        <StatCard
          icon={DocumentTextIcon}
          title="Total Blogs"
          value={stats.blogs}
          bgColorClass="bg-green-600"
          loading={loading}
        />
      </div>

      <div className="mt-10 bg-card text-card-foreground rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="flex items-center text-muted-foreground">
          <ChartBarIcon className="h-6 w-6 mr-3" />
          <p>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
