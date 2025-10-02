
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', icon: HomeIcon, text: 'Dashboard' },
    { href: '/admin/users', icon: UsersIcon, text: 'Users' },
    { href: '/admin/roles', icon: ShieldCheckIcon, text: 'Roles' },
    { href: '/admin/blogs', icon: DocumentTextIcon, text: 'Blogs' },
  ];

  return (
    <aside
      className="w-64 bg-surface text-foreground p-6 flex flex-col shadow-lg"
      style={{
        background: 'var(--surface)',
        color: 'var(--foreground)',
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="text-3xl font-extrabold mb-10 text-primary">Admin</div>
      <nav className="flex-grow">
        <ul className="space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'hover:bg-primary-light hover:text-white'
                    }`}
                >
                  <link.icon className="h-6 w-6 mr-4" />
                  <span className="font-medium">{link.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
