
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="text-2xl font-bold mb-4">Admin Panel</div>
      <nav>
        <Link href="/" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link>
        <Link href="/users" className="block py-2 px-4 rounded hover:bg-gray-700">Users</Link>
        <Link href="/roles" className="block py-2 px-4 rounded hover:bg-gray-700">Roles</Link>
        <Link href="/blogs" className="block py-2 px-4 rounded hover:bg-gray-700">Blogs</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
