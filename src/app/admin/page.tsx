
'use client';

import { useEffect, useState } from 'react';
import { apiUrls } from '@/lib/apiUrls';
import {
    UsersIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const StatCard = ({ icon: Icon, title, value, description, loading }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="h-7 w-16 bg-muted rounded-md animate-pulse mt-1"></div>
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
            <p className="text-xs text-muted-foreground">
                {description}
            </p>
        </CardContent>
    </Card>
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
        <div >
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            </div>
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-md mb-6">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4"
            >
                <div className="flex flex-col items-center gap-1 text-center py-12">
                    <h3 className="text-2xl font-bold tracking-tight">
                        You have no products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        You can start selling as soon as you add a product.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-4">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    loading={loading}
                    icon={UsersIcon}
                    description="Total users in the system"
                />
                <StatCard
                    title="Total Roles"
                    value={stats.roles}
                    loading={loading}
                    icon={ShieldCheckIcon}
                    description="Total roles in the system"
                />
                <StatCard
                    title="Total Blogs"
                    value={stats.blogs}
                    loading={loading}
                    icon={DocumentTextIcon}
                    description="Total blogs in the system"
                />
            </div>


        </div>
    );
}
