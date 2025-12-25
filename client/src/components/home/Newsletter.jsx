import React from 'react';

const Newsletter = () => {
  return (
    <section className="bg-content-bg py-16 md:py-20 border-t border-border-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-text-main mb-4">
          Tetap Terhubung
        </h2>
        <p className="text-text-muted mb-8">
          Daftar untuk mendapatkan info terbaru, penawaran eksklusif, dan diskon 10% untuk pesanan pertama Anda.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Masukkan email Anda"
            className="flex-1 px-4 py-3 rounded-lg border border-border-main bg-white focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
          />
          <button 
            type="submit"
            className="bg-theme-primary text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-theme-primary-dark transition-colors"
          >
            Daftar
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;