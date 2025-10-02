
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import ThemeSwitcher from './ThemeSwitcher';

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
      className="w-64 bg-card text-card-foreground p-4 flex flex-col border-r border-border"
    >
      <div className="px-4 py-2 mb-6">
        <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span>{link.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto p-4">
        <ThemeSwitcher />
      </div>
    </aside>
  );
};

export default Sidebar;
