import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthImage from '../../components/auth/AuthImage';
import logo from '../../assets/logo.webp';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  
  const token = searchParams.get('token');
  
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);

  const imageUrl = "https://images.unsplash.com/photo-1516592673884-4a382d1124c2?fm=jpg&q=60&w=3000";

  // Cek jika tidak ada token di URL, kembalikan ke login
  useEffect(() => {
    if (!token) {
      toast.error("Token reset tidak valid");
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }
    if (passwords.new.length < 6) {
        toast.error("Password minimal 6 karakter");
        return;
    }
    
    await resetPassword(token, passwords.new);
  };

  return (
    <div className="bg-content-bg/30 h-full py-10 md:py-0 md:min-h-screen flex flex-col md:flex-row text-text-main">
      <AuthImage imageUrl={imageUrl} />

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
          <img src={logo} alt="Logo" className="h-12 object-contain mb-6 mx-auto" />

          <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
          <p className="text-text-muted text-center mb-8">
            Create new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"><Lock size={20} /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="New Password"
                className="w-full pl-12 pr-12 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
                value={passwords.new} 
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"><Lock size={20} /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Konfirmasi Password Baru"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
                value={passwords.confirm} 
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-theme-primary text-white font-medium py-3 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Ubah Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-theme-primary transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Cancel & Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;