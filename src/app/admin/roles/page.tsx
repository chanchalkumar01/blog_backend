
'use client';

import { apiUrls } from '@/lib/apiUrls';
import { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

async function getRoles() {
  const res = await fetch(apiUrls.getRoles, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch roles');
  }
  return res.json();
}

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoles() {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newRoleName.trim()) {
      setError('Role name cannot be empty.');
      return;
    }

    try {
      const res = await fetch(apiUrls.getRoles, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create role');
      }

      const newRole = await res.json();
      setRoles([...roles, newRole.data]);
      setNewRoleName(''); // Clear input after successful creation
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const res = await fetch(`/api/roles/${roleId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Failed to delete role');
        }
        setRoles(roles.filter((role) => role._id !== roleId));
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6" style={{ background: 'var(--surface)' }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <ShieldCheckIcon className="h-8 w-8 mr-4 text-primary" />
          <h1 className="text-3xl font-extrabold text-primary">Roles</h1>
        </div>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold text-primary mb-4">Create a New Role</h2>
        <form onSubmit={handleCreateRole} className="flex items-center gap-4">
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter new role name"
            className="flex-grow px-4 py-2 text-foreground bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
          <button type="submit" className="inline-flex items-center justify-center px-6 py-2 text-base font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create
          </button>
        </form>
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead style={{ background: 'var(--primary-light)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Role Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role: any) => (
                <tr key={role._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-foreground">{role.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                    <button onClick={() => handleDeleteRole(role._id)} className="text-red-600 hover:text-red-800">
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
