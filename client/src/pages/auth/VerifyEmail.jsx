import React, { useState, useRef } from 'react';
import { ShieldCheck, RefreshCcw } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const VerifyEmail = () => {
  const { verifyOTP, resendOTP, loading } = useAuth();
  // State untuk 6 digit OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    // Pastikan input adalah angka
    if (isNaN(element.value)) return false;

    // Update state OTP pada index tertentu
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Pindah fokus ke input berikutnya jika ada isinya
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Pindah fokus ke input sebelumnya saat tekan Backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    try {
      // Panggil hook verifyOTP (redirect ditangani di dalam hook)
      await verifyOTP(otpValue);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-content-bg p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-theme-primary/10 text-theme-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-text-main mb-2">Verifikasi Akun</h1>
        <p className="text-text-muted mb-8">
          Masukkan 6 digit kode OTP yang telah dikirimkan ke email Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-border-main rounded-xl focus:border-theme-primary focus:ring-1 focus:ring-theme-primary outline-none transition-all bg-gray-50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.includes('')}
            className="w-full bg-theme-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-theme-primary-dark transition-all disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi Akun'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-main">
          <p className="text-text-muted text-sm mb-4">Tidak menerima kode?</p>
          <button
            onClick={handleResend}
            disabled={loading}
            className="flex items-center justify-center mx-auto text-theme-primary font-medium hover:text-theme-primary-dark transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Kirim Ulang Kode
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;