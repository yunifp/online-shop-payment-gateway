import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Search, ShoppingCart, CircleUser, Menu, X } from "lucide-react";
import logo from "../../assets/logo.jpg";
import CartDropdown from "./CartDropdown";
import ProfileDropdown from "./ProfileDropdown";
import useCart from "../../hooks/useCart";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const { cart } = useCart();
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

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

  const handleSearchClick = () => {
    closeAllPopups();
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    setIsSearchExpanded(false);
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

        <nav className="flex flex-col space-y-4 p-4">
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

          <hr className="border-border-main" />

          <div className="flex items-center justify-around pt-4">
            <NavLink
              to="/cart"
              onClick={closeAllPopups}
              className="text-text-muted hover:text-text-main transition-colors p-2 relative"
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-theme-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/login"
              onClick={closeAllPopups}
              className="text-text-muted hover:text-text-main transition-colors p-2"
            >
              <CircleUser size={22} />
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
