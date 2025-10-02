
'use client';

import { apiUrls } from '@/lib/apiUrls';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    async function loadRoles() {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData.data);
      } catch (error: any) {
        setError(error.message);
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

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Roles</h1>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create a New Role</h2>
        <form onSubmit={handleCreateRole} className="flex items-center gap-4">
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter new role name"
            className="flex-grow px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          <button type="submit" className="inline-flex items-center justify-center px-6 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create
          </button>
        </form>
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Role Name</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.map((role: any) => (
              <tr key={role._id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-800">{role.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600"></td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
