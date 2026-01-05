import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthImage from '../../components/auth/AuthImage'; 
import logo from '../../assets/logo.jpg'; 
import useAuth from '../../hooks/useAuth';

const ForgotPassword = () => {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const imageUrl = "https://images.unsplash.com/photo-1516592673884-4a382d1124c2?fm=jpg&q=60&w=3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await forgotPassword(email);
    if (success) setIsSent(true);
  };

  return (
    <div className="h-full py-10 md:py-0 md:min-h-screen flex flex-col md:flex-row bg-content-bg text-text-main">
      <AuthImage imageUrl={imageUrl} />

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
          <img src={logo} alt="Logo" className="h-12 object-contain mb-6 mx-auto" />

          {!isSent ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-4">Lupa Password?</h1>
              <p className="text-text-muted text-center mb-8">
                Masukkan email yang terdaftar untuk menerima link reset password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"><Mail size={20} /></span>
                  <input 
                    type="email" required placeholder="Masukkan Email Anda"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-theme-primary text-white font-medium py-3 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all disabled:opacity-50"
                >
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6">
                <p className="font-semibold">Email Terkirim!</p>
                <p className="text-sm mt-1">Silakan cek kotak masuk atau spam email <b>{email}</b> untuk instruksi selanjutnya.</p>
              </div>
              <button 
                onClick={() => setIsSent(false)}
                className="text-theme-primary font-medium hover:underline"
              >
                Kirim ulang?
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-theme-primary transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;