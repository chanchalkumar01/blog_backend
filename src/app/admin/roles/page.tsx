
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
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Roles Management</h1>
            </div>
        </div>

        <div className="mb-6 bg-muted/50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Create a New Role</h2>
            <form onSubmit={handleCreateRole} className="flex items-center gap-4">
                <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter new role name"
                    className="flex-grow px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
                <button type="submit" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Create
                </button>
            </form>
            {error && (
                <div className="mt-3 bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-2 rounded-md text-sm">
                    <strong className="font-bold">Error: </strong>
                    <span>{error}</span>
                </div>
            )}
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role Name</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                    {loading ? (
                        <tr>
                            <td colSpan={2} className="text-center py-12">
                                <p className="text-lg font-semibold">Loading roles...</p>
                            </td>
                        </tr>
                    ) : roles.length === 0 ? (
                         <tr>
                            <td colSpan={2} className="text-center py-12">
                                <p className="text-lg font-semibold">No roles found.</p>
                            </td>
                        </tr>
                    ) : (
                        roles.map((role: any) => (
                            <tr key={role._id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{role.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDeleteRole(role._id)} className="text-red-600 hover:text-red-700">
                                        <TrashIcon className="h-5 w-5 inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}
