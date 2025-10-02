
import { apiUrls } from '@/lib/apiUrls';
import Link from 'next/link';

async function getUsers() {
  const res = await fetch(apiUrls.getUsers, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function UsersPage() {
  try {
    const users = await getUsers();

    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Users</h1>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Username</th>
              <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Roles</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.data.map((user: any) => (
              <tr key={user._id}>
                <td className="text-left py-3 px-4">{user.username}</td>
                <td className="text-left py-3 px-4">{user.email}</td>
                <td className="text-left py-3 px-4">{user.roles.join(', ')}</td>
                <td className="text-left py-3 px-4">
                  <Link href={`/admin/users/${user._id}/edit`} className="text-blue-500 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error: any) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Users</h1>
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }
}
