import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="theme-toggle-btn"
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          {theme === 'dark' ? (
            <Moon size={14} className="text-indigo-300" />
          ) : (
            <Sun size={14} className="text-amber-500" />
          )}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
