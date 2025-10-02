
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-gray-300 p-6">
      <div className="text-3xl font-extrabold mb-8 text-white">Admin</div>
      <nav className="space-y-2">
        <Link href="/admin" className="block py-3 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">Dashboard</Link>
        <Link href="/admin/users" className="block py-3 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">Users</Link>
        <Link href="/admin/roles" className="block py-3 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">Roles</Link>
        <Link href="/admin/blogs" className="block py-3 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">Blogs</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
