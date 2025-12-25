
import React, { useState, useEffect, useRef } from 'react';
import { CircleUser, LogOut, ChevronDown, Menu, Bell, Search } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";

const Header = ({ isSidebarOpen, setIsOpen }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-content-bg p-5 sticky top-0 z-10 border-b border-border-main">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => setIsOpen(!isSidebarOpen)} className="text-text-muted hover:text-text-main focus:outline-none md:hidden mr-4">
            <Menu size={24} />
          </button>

          {/* <div className="relative hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-text-subtle" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-xs pl-10 pr-4 py-2 rounded-lg border-none bg-app-bg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div> */}
        </div>

        <div className="flex items-center space-x-5 md:space-x-6">
          {/* <button className="text-text-muted hover:text-text-main relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full"></span>
          </button> */}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-text-muted hover:text-text-main group"
            >
              <CircleUser size={28} className="text-text-main" />
              <span className="text-text-main font-medium hidden sm:block">
                {user?.role || "User"}
              </span>
              <ChevronDown size={16} className={`${isDropdownOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
            </button>

            <div
              className={`absolute right-0 mt-3 w-60 bg-content-bg rounded-lg shadow-xl ring-1 ring-border-main overflow-hidden z-20 transition-all duration-200 ease-out ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              style={{ transformOrigin: 'top right' }}
            >
              <div className="py-1">
                <div className="px-4 py-3 border-b border-border-main bg-zinc-50">
                  <p className="text-sm font-semibold text-text-main">{user?.name}</p>
                  <p className="text-xs text-text-muted">{user?.email}</p>
                </div>
                <button
                  className="w-full text-left flex items-center px-4 py-3 text-sm text-text-muted hover:bg-zinc-100 hover:text-text-main"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3" size={16} />
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


