import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CreditCard, Loader } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ambil token dan data transaksi yang dikirim dari CheckoutModal
  const { token } = location.state || {};

  useEffect(() => {
    // Jika tidak ada token (akses langsung ke URL tanpa checkout), kembalikan ke cart
    if (!token) {
      toast.error("Invalid payment session");
      navigate('/cart', { replace: true });
      return;
    }

    // Fungsi untuk memicu Snap Midtrans
    const triggerPayment = () => {
      if (window.snap) {
        window.snap.pay(token, {
          // PERUBAHAN: Gunakan window.location.replace() bukan navigate()
          // Ini akan me-refresh halaman sepenuhnya, mencegah blank screen, 
          // dan memastikan data terbaru terambil dari database.
          
          onSuccess: function(result) {
            toast.success("Payment Successful!");
            window.location.replace('/customer/pesanan');
          },
          onPending: function(result) {
            toast.success("Waiting for Payment...");
            window.location.replace('/customer/pesanan');
          },
          onError: function(result) {
            toast.error("Payment Failed");
            window.location.replace('/customer/pesanan');
          },
          onClose: function() {
            toast("Payment window closed");
            // Arahkan ke halaman pesanan agar user bisa bayar nanti (status pending)
            window.location.replace('/customer/pesanan'); 
          }
        });
      } else {
        toast.error("Payment system not ready. Please refresh.");
      }
    };

    // Panggil segera saat halaman dimuat
    triggerPayment();

  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-blue-600 animate-pulse" size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800">Loading Payment...</h2>
        <p className="text-gray-500">
            Payment is being processed and the payment window will open shortly.
        </p>

        {/* Tombol manual jika popup tidak muncul otomatis */}
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 font-medium hover:underline mt-4"
        >
          If Payment doesn't load, click here to reload.
        </button>

        <div className="pt-4 flex justify-center">
            <Loader className="animate-spin text-gray-400" size={24} />
        </div>
      </div>
    </div>
  );
};

export default Payment;