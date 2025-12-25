import React from 'react';
import { Mail, Phone, MapPin, User, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-content-bg py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-text-main mb-12">
          Kontak Kami
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Form Kontak */}
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-main mb-2">
                Nama Anda
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User size={18} className="text-text-subtle" />
                </span>
                <input 
                  type="text" 
                  id="name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-main bg-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-2">
                Email Anda
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail size={18} className="text-text-subtle" />
                </span>
                <input 
                  type="email" 
                  id="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-main bg-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="anda@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-main mb-2">
                Pesan
              </label>
              <div className="relative">
                <textarea 
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-border-main bg-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-theme-primary text-white font-medium py-3 px-8 rounded-lg shadow-md hover:bg-theme-primary-dark transition-colors"
            >
              Kirim Pesan
            </button>
          </form>

          {/* Info Kontak */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-main">
              Info Lainnya
            </h2>
            <p className="text-text-muted">
              Jangan ragu untuk menghubungi kami melalui detail di bawah ini. Kami akan merespon secepat mungkin.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-theme-primary-dark flex-shrink-0" />
                <span className="text-text-main">info@rockstarclimbing.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-theme-primary-dark flex-shrink-0" />
                <span className="text-text-main">+62 812 3456 7890</span>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-theme-primary-dark flex-shrink-0 mt-1" />
                <span className="text-text-main">
                  Jl. Petualangan No. 45, <br />
                  Jakarta Selatan, Indonesia
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;