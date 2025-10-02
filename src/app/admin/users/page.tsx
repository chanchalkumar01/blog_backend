
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
      <div className="p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Users</h1>
          <Link href="/admin/users/create" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create User
          </Link>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Roles</th>
                <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.data.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-800">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{user.roles.join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                    <Link href={`/admin/users/${user._id}/edit`} className="text-blue-600 hover:text-blue-800 font-semibold">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-4">Users</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
        </div>
      </div>
    );
  }
}
