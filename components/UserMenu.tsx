import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { User, Settings, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserMenuProps {
  user: SupabaseUser;
  onLogout: () => void;
}

function UserMenu({ user, onLogout }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      onClick: () => {
        router.push('/dashboard');
        setIsOpen(false);
      },
    },
    {
      label: 'View Public Profile',
      icon: <UserCircle className="w-4 h-4" />,
      onClick: () => {
        router.push(`/creators/${user.id}`);
        setIsOpen(false);
      },
    },
    {
      label: 'Profile Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => {
        router.push('/dashboard/settings');
        setIsOpen(false);
      },
    },
    {
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => {
        onLogout();
        setIsOpen(false);
      },
      className: 'text-red-600 hover:bg-red-50',
    },
  ];

  const displayName = user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      user.email?.split('@')[0] ||
                      'User';

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.avatar;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {displayName[0].toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm
                  hover:bg-gray-100 transition-colors
                  ${item.className || 'text-gray-700'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
