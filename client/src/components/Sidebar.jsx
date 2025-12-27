import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Package,
  List,
  Tag,
  Ticket,
  Truck,
  ChevronDown,
  Users,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import logo from '../assets/logo.jpg';

const SidebarLink = ({ to, icon, text, isOpen, setIsOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = (e) => {
    if (!isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={`relative flex items-center h-10 p-3 my-1 rounded-lg transition-all duration-300 group ${
        isActive
          ? 'bg-gray-100 text-text-main font-semibold'
          : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
      } ${!isOpen ? 'justify-center' : ''}`}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span
        className={`transition-all duration-200 ${
          isOpen ? 'ml-3 opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden'
        }`}
      >
        {text}
      </span>

      {!isOpen && (
        <span className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
          {text}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isProdukOpen, setProdukOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isUser = user?.role === 'user';

  const isProdukActive =
    location.pathname.startsWith('/admin/produk') ||
    location.pathname.startsWith('/admin/kategori');

  useEffect(() => {
    if (isProdukActive && isOpen) {
      setProdukOpen(true);
    }
  }, [isProdukActive, location.pathname, isOpen]);

  const handleProdukClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setProdukOpen(true);
    } else {
      setProdukOpen(!isProdukOpen);
    }
  };

  const renderNavContent = () => (
    <nav
      className={`flex-1 px-4 py-4 space-y-1 overflow-x-hidden ${
        isOpen ? 'overflow-y-auto' : 'overflow-y-hidden'
      }`}
    >
      <SidebarLink
        to="/admin"
        icon={<LayoutGrid size={20} />}
        text="Dashboard"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {!isUser && (
        <div>
          <button
            onClick={handleProdukClick}
            className={`relative flex items-center justify-between w-full h-10 p-3 my-1 rounded-lg transition-all duration-300 group ${
              isProdukActive
                ? 'bg-gray-100 text-text-main font-semibold'
                : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
            } ${!isOpen ? 'justify-center' : ''}`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <Package size={20} />
              </div>
              <span
                className={`transition-all duration-200 ${
                  isOpen ? 'ml-3 opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden'
                }`}
              >
                Produk
              </span>
            </div>
            {isOpen && (
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isProdukOpen ? 'rotate-180' : ''
                }`}
              />
            )}

            {!isOpen && (
              <span className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Produk
              </span>
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              isProdukOpen && isOpen ? 'max-h-40' : 'max-h-0'
            }`}
          >
            {isOpen && (
              <div className="pl-5 my-1">
                <SidebarLink
                  to="/admin/produk"
                  icon={<List size={18} />}
                  text="List Produk"
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
                <SidebarLink
                  to="/admin/kategori"
                  icon={<Tag size={18} />}
                  text="Kategori"
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {!isUser && (
        <SidebarLink
          to="/admin/voucher"
          icon={<Ticket size={20} />}
          text="Voucher"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      
      <SidebarLink
        to="/admin/pengiriman"
        icon={<Truck size={20} />}
        text="Pengiriman"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <hr className="my-3 border-border-main" />

      <SidebarLink
        to="/admin/pesanan"
        icon={<History size={20} />}
        text="Pesanan"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {user?.role === "admin" && (
        <SidebarLink
          to="/admin/users"
          icon={<Users size={20} />}
          text="Manajemen User"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </nav>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-content-bg text-text-main border-r border-border-main transform transition-all duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 w-60'
            : '-translate-x-full w-60 md:translate-x-0 md:w-20'
        }`}
      >
        <div
          className={`relative flex items-center h-20 border-b border-border-main ${
            isOpen ? 'px-6 justify-center' : 'px-0 justify-center'
          }`}
        >
          <img
            src={logo}
            alt="Dashboard Logo"
            className={`transition-opacity duration-300 h-10 object-contain ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-4 text-text-muted hover:text-text-main md:hidden"
          >
            <X size={24} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-8 h-8 bg-white border border-border-main rounded-full shadow-sm text-text-muted hover:text-text-main hover:bg-gray-50 transition-all"
          >
            {isOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        {renderNavContent()}
      </aside>
    </>
  );
};

export default Sidebar;