
'use client';

import { useEffect, useState } from 'react';
import { apiUrls } from '@/lib/apiUrls';
import Link from 'next/link';
import {
  UsersIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(apiUrls.getUsers, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Failed to delete user');
        }
        setUsers(users.filter((user: any) => user._id !== userId));
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6" style={{ background: 'var(--surface)' }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <UsersIcon className="h-8 w-8 mr-4 text-primary" />
          <h1 className="text-3xl font-extrabold text-primary">Users</h1>
        </div>
        <Link
          href="/admin/users/create"
          className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Create User
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead style={{ background: 'var(--primary-light)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Roles</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-foreground">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{user.roles.join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                    <Link href={`/admin/users/${user._id}/edit`} className="text-primary hover:text-primary-dark mr-4">
                      <PencilIcon className="h-5 w-5 inline" />
                    </Link>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
