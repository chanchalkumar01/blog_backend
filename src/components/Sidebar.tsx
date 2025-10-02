
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import ThemeSwitcher from './ThemeSwitcher';

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', icon: HomeIcon, text: 'Dashboard' },
    { href: '/admin/users', icon: UsersIcon, text: 'Users' },
    { href: '/admin/roles', icon: ShieldCheckIcon, text: 'Roles' },
    { href: '/admin/blogs', icon: DocumentTextIcon, text: 'Blogs' },
    { href: '/admin/settings', icon: Cog6ToothIcon, text: 'Settings' },
  ];

  return (
    <aside
      className="w-64 bg-card text-card-foreground p-6 flex flex-col shadow-lg"
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
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-accent hover:text-accent-foreground'
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
      <div className="mt-auto">
        <ThemeSwitcher />
      </div>
    </aside>
  );
};

export default Sidebar;
