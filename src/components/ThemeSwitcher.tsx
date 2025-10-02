
'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6 mr-4" />
      ) : (
        <MoonIcon className="h-6 w-6 mr-4" />
      )}
      <span className="font-medium">
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </span>
    </button>
  );
};

export default ThemeSwitcher;
