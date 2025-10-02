
'use client';

import { apiUrls } from '@/lib/apiUrls';
import { useState, useEffect } from 'react';

async function getRoles() {
  const res = await fetch(apiUrls.getRoles, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
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

    try {
      const res = await fetch(apiUrls.getRoles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRoleName }),
      });

      if (!res.ok) {
        throw new Error('Failed to create role');
      }

      setNewRoleName('');
      const newRole = await res.json();
      setRoles([...roles, newRole.data]);
      alert('Role created successfully!');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Roles</h1>
      <div className="mb-4">
        <form onSubmit={handleCreateRole}>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter new role name"
            className="border px-2 py-1 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Create Role
          </button>
        </form>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/2 text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
            <th className="w-1/2 text-left py-3 px-4 uppercase font-semibold text-sm">Permissions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {roles.map((role: any) => (
            <tr key={role._id}>
              <td className="text-left py-3 px-4">{role.name}</td>
              <td className="text-left py-3 px-4"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
