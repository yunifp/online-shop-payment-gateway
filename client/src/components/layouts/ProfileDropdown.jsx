import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, LayoutDashboard, LogOut, User } from "lucide-react";
import useAuth from "../../hooks/useAuth"; // Import hook useAuth

const ProfileDropdown = ({ isOpen, onLinkClick }) => {
  const { logout } = useAuth();

  // Mengambil data user dari localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = async () => {
    onLinkClick(); // Tutup dropdown
    await logout(); // Jalankan fungsi logout
  };

  return (
    <div
      className={`absolute right-0 top-full mt-3 w-60 bg-content-bg rounded-lg shadow-xl border border-border-main z-40
                  transition-all duration-200 ease-out transform
                  ${
                    isOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
      style={{ transformOrigin: "top right" }}
    >
      <div className="p-2">
        {user ? (
          /* Tampilan jika user SUDAH login */
          <>
            <div className="px-3 py-2 mb-2 border-b border-border-main">
              <p className="text-sm font-semibold text-text-main truncate">
                {user.name}
              </p>
              <p className="text-xs text-text-muted">{user.email}</p>{" "}
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-theme-primary/10 text-theme-primary rounded">
                {user.role}
              </span>
            </div>

            <Link
              /* Redirect dashboard berdasarkan role */
              to={
                user.role === "admin" || user.role === "staff"
                  ? "/admin"
                  : "/customer"
              }
              onClick={onLinkClick}
              className="flex items-center w-full px-3 py-2.5 rounded-md text-sm text-text-main hover:bg-theme-primary-light hover:text-theme-primary-dark transition-colors"
            >
              <LayoutDashboard size={16} className="mr-2" />
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </>
        ) : (
          /* Tampilan jika user BELUM login */
          <>
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
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
