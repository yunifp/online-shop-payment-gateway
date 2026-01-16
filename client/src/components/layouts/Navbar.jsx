import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { 
  Search, ShoppingCart, CircleUser, Menu, X, 
  LayoutDashboard, LogOut, LogIn 
} from "lucide-react"; // Import icon tambahan
import logo from "../../assets/logo.webp";
import CartDropdown from "./CartDropdown";
import ProfileDropdown from "./ProfileDropdown";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth"; // 1. Import useAuth

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const { cart } = useCart();
  const { logout } = useAuth(); // 2. Ambil fungsi logout
  const navigate = useNavigate();

  // 3. Ambil data user dari LocalStorage untuk pengecekan reaktif di UI
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  // 4. Helper untuk menentukan link dashboard berdasarkan role
  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin" || user.role === "staff") {
      return "/admin";
    }
    return "/customer";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartRef, profileRef]);

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  const closeAllPopups = (except = null) => {
    if (except !== "mobile") setMobileMenuOpen(false);
    if (except !== "cart") setIsCartOpen(false);
    if (except !== "profile") setIsProfileOpen(false);
  };

  const toggleCart = () => {
    const isOpen = isCartOpen;
    closeAllPopups("cart");
    setIsSearchExpanded(false);
    setIsCartOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    const isOpen = isMobileMenuOpen;
    closeAllPopups("mobile");
    setIsSearchExpanded(false);
    setMobileMenuOpen(!isOpen);
  };

  const toggleProfile = () => {
    const isOpen = isProfileOpen;
    closeAllPopups("profile");
    setIsSearchExpanded(false);
    setIsProfileOpen(!isOpen);
  };

  const handleMobileLogout = async () => {
    closeAllPopups();
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Products", path: "/product" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-content-bg shadow-sm border-b border-border-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <NavLink to="/" className="flex-shrink-0" onClick={closeAllPopups}>
            <img
              className="h-10 object-contain"
              src={logo}
              alt="Rockstar Climbing Hold Indonesia Logo"
            />
          </NavLink>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeAllPopups}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-theme-primary"
                      : "text-text-muted hover:text-text-main"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* DESKTOP ICONS */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative" ref={cartRef}>
              <button
                onClick={toggleCart}
                className="relative h-10 w-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-zinc-100"
                aria-label="Buka keranjang"
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-theme-primary text-white text-xs rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <CartDropdown
                isOpen={isCartOpen}
                items={cartItems}
                subtotal={subtotal}
              />
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="h-10 w-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-zinc-100"
                aria-label="Buka menu profil"
              >
                <CircleUser size={20} />
              </button>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onLinkClick={closeAllPopups}
              />
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-text-muted hover:text-text-main"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-50 bg-content-bg transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-between items-center h-20 px-4 border-b border-border-main">
          <NavLink to="/" onClick={closeAllPopups}>
            <img
              className="h-10 object-contain"
              src={logo}
              alt="Rockstar Climbing Hold Indonesia Logo"
            />
          </NavLink>
          <button
            onClick={closeAllPopups}
            className="text-text-muted hover:text-text-main"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 p-4">
          {/* Link Standar */}
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={closeAllPopups}
              className={({ isActive }) =>
                `text-base font-medium p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-theme-primary-light text-theme-primary"
                    : "text-text-muted hover:bg-zinc-50 hover:text-text-main"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* 5. Logic Tampilan Mobile berdasarkan User Login */}
          {user ? (
            <>
              <div className="pt-2 pb-2">
                <div className="px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-100">
                  <p className="text-sm font-semibold text-text-main">{user.name}</p>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>
              </div>

              {/* Link Dashboard */}
              <NavLink
                to={getDashboardLink()}
                onClick={closeAllPopups}
                className={({ isActive }) =>
                  `flex items-center text-base font-medium p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-theme-primary-light text-theme-primary"
                      : "text-text-muted hover:bg-zinc-50 hover:text-text-main"
                  }`
                }
              >
                <LayoutDashboard size={20} className="mr-3" />
                Dashboard
              </NavLink>

              {/* Tombol Logout */}
              <button
                onClick={handleMobileLogout}
                className="flex items-center w-full text-left text-base font-medium p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </>
          ) : (
            // Jika Belum Login
            <NavLink
              to="/login"
              onClick={closeAllPopups}
              className="flex items-center text-base font-medium p-3 rounded-lg text-text-muted hover:bg-zinc-50 hover:text-text-main transition-colors"
            >
              <LogIn size={20} className="mr-3" />
              Login / Register
            </NavLink>
          )}

          <hr className="border-border-main my-2" />

          {/* Bottom Icons Mobile */}
          <div className="flex items-center justify-around pt-2">
            <NavLink
              to="/cart"
              onClick={closeAllPopups}
              className="text-text-muted hover:text-text-main transition-colors p-2 relative"
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-theme-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </NavLink>
            
            {/* 6. PERBAIKAN PENTING: Ikon User mengarah ke Dashboard jika login */}
            {/* Ini mencegah error 400 "Already Logged In" karena tidak mengarah ke /login lagi */}
            <NavLink
              to={getDashboardLink()} 
              onClick={closeAllPopups}
              className={`transition-colors p-2 ${
                user ? "text-theme-primary" : "text-text-muted hover:text-text-main"
              }`}
            >
              <CircleUser size={24} />
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;