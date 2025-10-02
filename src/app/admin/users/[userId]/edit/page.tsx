
'use client';

import { useEffect, useState } from 'react';
import { apiUrls } from '@/lib/apiUrls';

export default function EditUserPage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, rolesRes] = await Promise.all([
          fetch(apiUrls.getUserById(params.userId)),
          fetch(apiUrls.getRoles),
        ]);

        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }
        if (!rolesRes.ok) {
          throw new Error('Failed to fetch roles');
        }

        const userData = await userRes.json();
        const rolesData = await rolesRes.json();

        setUser(userData.data);
        setRoles(rolesData.data);
        setSelectedRoles(userData.data.roles.map((role: any) => role._id));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.userId]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleId)
        ? prevSelectedRoles.filter((id) => id !== roleId)
        : [...prevSelectedRoles, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
        const selectedRoleNames = roles
        .filter((role) => selectedRoles.includes(role._id))
        .map((role) => role.name);


      const res = await fetch(`/api/v1/users/${params.userId}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roles: selectedRoleNames }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user roles');
      }

      alert('User roles updated successfully!');
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit User: {user?.username}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Roles</h2>
          {roles.map((role) => (
            <div key={role._id} className="flex items-center">
              <input
                type="checkbox"
                id={role._id}
                value={role._id}
                checked={selectedRoles.includes(role._id)}
                onChange={() => handleRoleChange(role._id)}
                className="mr-2"
              />
              <label htmlFor={role._id}>{role.name}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Save Changes
        </button>
      </form>
    </div>
  );
}
