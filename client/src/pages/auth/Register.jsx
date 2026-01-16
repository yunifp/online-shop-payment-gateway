import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import logo from '../../assets/logo.webp';
import AuthImage from '../../components/auth/AuthImage';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const imageUrl = "https://images.unsplash.com/photo-1761171489299-9ff5d9f928b6?fm=jpg&q=60&w=3000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (error) {
      // Error handling sudah ditangani useAuth (toast)
      // Kita bisa reset password field jika gagal
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="bg-content-bg/30 h-full py-10 md:py-0 md:min-h-screen flex flex-col md:flex-row text-text-main">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12 order-last md:order-first">
        <div className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <img 
            src={logo} 
            alt="Rockstar Climbing Logo" 
            className="h-12 object-contain mb-6 mx-auto" 
          />
          <h1 className="text-3xl font-bold text-text-main text-center mb-4">
            Create New Account
          </h1>
          <p className="text-text-muted text-center mb-8">
            Start your adventure with us.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                <User size={20} />
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                <Mail size={20} />
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                <Lock size={20} />
              </span>
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-theme-primary text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <UserPlus size={18} className="mr-2" />
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-text-muted mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-theme-primary-dark hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <AuthImage imageUrl={imageUrl} />
    </div>
  );
};

export default Register;