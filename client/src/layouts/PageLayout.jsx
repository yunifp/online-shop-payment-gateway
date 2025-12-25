import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar'; // Pastikan path import benar
import Footer from '../components/layouts/Footer'; // Pastikan path import benar

const PageLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-text-main">
      {/* Navbar di atas */}
      <Navbar />

      {/* Konten Halaman Utama */}
      <main className="flex-grow">
        {/* Outlet akan merender rute anak (misalnya, Homepage, Halaman Produk, dll.) */}
        <Outlet />
      </main>

      {/* Footer di bawah */}
      <Footer />
    </div>
  );
};

export default PageLayout;