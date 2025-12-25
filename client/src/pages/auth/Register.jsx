import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import logo from '../../assets/logo.jpg';
import AuthImage from '../../components/auth/AuthImage';

const Register = () => {
  // --- PERBARUI GAMBAR DI SINI ---
  const imageUrl = "https://images.unsplash.com/photo-1761171489299-9ff5d9f928b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000";

  return (
    <div className="h-full py-10 md:py-0 md:min-h-screen flex flex-col md:flex-row bg-content-bg text-text-main">
      {/* 1. Bagian Form (Kiri) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12 order-last md:order-first">
        <div className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <img 
            src={logo} 
            alt="Rockstar Climbing Logo" 
            className="h-12 object-contain mb-6 mx-auto" 
          />
          <h1 className="text-3xl font-bold text-text-main text-center mb-4">
            Buat Akun Baru
          </h1>
          <p className="text-text-muted text-center mb-8">
            Mulai petualangan Anda bersama kami.
          </p>

          <form className="space-y-5">
            {/* Nama Lengkap */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                <User size={20} />
              </span>
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                <Mail size={20} />
              </span>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                <Lock size={20} />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-theme-primary text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <UserPlus size={18} className="mr-2" />
              Daftar
            </button>
          </form>

          <p className="text-center text-text-muted mt-8">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-theme-primary-dark hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </div>

      {/* 2. Bagian Gambar (Kanan) */}
      <AuthImage imageUrl={imageUrl} />
    </div>
  );
};

export default Register;