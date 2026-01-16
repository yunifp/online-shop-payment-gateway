import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import logo from '../../assets/logo.webp';
import AuthImage from '../../components/auth/AuthImage';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { login, loading, redirectByRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect jika sudah login
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        redirectByRole(user.role);
      } catch (e) {
        localStorage.removeItem("user"); // Bersihkan jika data corrupt
      }
    }
  }, [redirectByRole]);

  const imageUrl = "https://images.pexels.com/photos/16824426/pexels-photo-16824426.jpeg?cs=srgb&dl=pexels-mohamed-hamdi-510308652-16824426.jpg&fm=jpg";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // PENTING: Kita tidak perlu logika 'if (role === ...)' disini lagi.
      // Hook useAuth sudah menangani redirect setelah login sukses.
      await login(email, password);
    } catch (err) {
      // Error handling sudah ditangani oleh toast di dalam useAuth.
      // Kita biarkan kosong atau reset form password jika mau.
      setPassword(""); 
    }
  };

  return (
    <div className="bg-content-bg/30 h-full py-10 md:py-0 md:min-h-screen flex flex-col md:flex-row text-text-main">
      <AuthImage imageUrl={imageUrl} />

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <img src={logo} alt="Rockstar Climbing Logo" className="h-12 object-contain mb-6 mx-auto" />

          <h1 className="text-3xl font-bold text-text-main text-center mb-4">Welcome Back</h1>
          <p className="text-text-muted text-center mb-8">Log in to your account to continue.</p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"><Mail size={20} /></span>
              <input 
                type="email" 
                placeholder="Email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"><Lock size={20} /></span>
              <input 
                type="password" 
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-main bg-zinc-50 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-theme-primary-dark hover:underline">Forgot password?</Link>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center bg-theme-primary text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <LogIn size={18} className="mr-2" />
              {loading ? "Processing..." : "Login"}
            </button>
          </form>

          <p className="text-center text-text-muted mt-8">
            Don't have an account? <Link to="/register" className="font-medium text-theme-primary-dark hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;