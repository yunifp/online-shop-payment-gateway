import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const ProfileDropdown = ({ isOpen, onLinkClick }) => {
  return (
    <div
      className={`absolute right-0 top-full mt-3 w-60 bg-content-bg rounded-lg shadow-xl border border-border-main z-40
                  transition-all duration-200 ease-out transform
                  ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      style={{ transformOrigin: 'top right' }}
    >
      <div className="p-2">
        {/* Nanti, Anda bisa menambahkan logika untuk menampilkan "Akun Saya" jika user sudah login */}
        
        <Link
          to="/login"
          onClick={onLinkClick}
          className="flex items-center w-full px-3 py-2.5 rounded-md text-sm text-text-main hover:bg-theme-primary-light hover:text-theme-primary-dark transition-colors"
        >
          <LogIn size={16} className="mr-2" />
          Login
        </Link>
        <Link
          to="/register"
          onClick={onLinkClick}
          className="flex items-center w-full px-3 py-2.5 rounded-md text-sm text-text-main hover:bg-theme-primary-light hover:text-theme-primary-dark transition-colors"
        >
          <UserPlus size={16} className="mr-2" />
          Daftar
        </Link>
      </div>
    </div>
  );
};

export default ProfileDropdown;