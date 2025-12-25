import React from 'react';
import { Target, Users, MapPin, Phone } from 'lucide-react';
import logo from '../assets/logo.jpg'; // Menggunakan logo Anda

const AboutUs = () => {
  return (
    <div className="bg-content-bg">
      {/* 1. Bagian Hero */}
      <section className="bg-black border-b border-border-main py-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl text-white font-bold text-text-main mb-4">
            Tentang Kami
          </h1>
          <p className="text-xl text-white text-text-muted max-w-2xl mx-auto">
            Mengenal lebih dekat Rockstar Climbing Hold Indonesia dan semangat kami untuk petualangan.
          </p>
        </div>
      </section>

      {/* 2. Bagian Misi & Visi */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Visi Kami */}
            <div className="bg-white h-full p-8 rounded-lg shadow-sm border border-border-main">
              <div className="flex items-center text-theme-primary-dark mb-4">
                <Target size={32} className="mr-3" />
                <h2 className="text-3xl font-semibold">Visi Kami</h2>
              </div>
              <p className="text-text-muted">
                Menjadi penyedia peralatan panjat tebing dan outdoor terdepan di Indonesia, menginspirasi setiap orang untuk menjelajahi alam dengan aman dan percaya diri.
              </p>
            </div>
            
            {/* Misi Kami */}
            <div className="bg-white h-full p-8 rounded-lg shadow-sm border border-border-main">
              <div className="flex items-center text-theme-primary-dark mb-4">
                <Users size={32} className="mr-3" />
                <h2 className="text-3xl font-semibold">Misi Kami</h2>
              </div>
              <p className="text-text-muted">
                Kami berkomitmen untuk menyediakan produk berkualitas tinggi, layanan pelanggan yang ahli, dan membangun komunitas yang peduli terhadap kelestarian alam dan keselamatan dalam berpetualang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bagian Sejarah Singkat (Placeholder) */}
      <section className="bg-black border-y border-border-main py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src={logo} 
                alt="Logo Rockstar Climbing Hold" 
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-white text-text-main mb-6">
                Cerita Kami
              </h2>
              <p className="text-text-muted text-white text-lg mb-4">
                Berawal dari kecintaan pada panjat tebing dan alam bebas, Rockstar Climbing Hold Indonesia didirikan pada [Tahun]...
              </p>
              <p className="text-white text-text-muted">
                (Placeholder untuk cerita singkat perusahaan. Jelaskan bagaimana perusahaan dimulai, nilai-nilai yang dipegang, dan dedikasi terhadap kualitas dan komunitas panjat tebing di Indonesia.)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bagian Kontak Lokasi */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-main mb-10">
            Kunjungi Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border-main flex items-start">
              <MapPin size={24} className="text-theme-primary-dark mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-left text-text-main">Alamat Fisik</h3>
                <p className="text-text-muted text-left">
                  (Placeholder) Jl. Petualang No. 123, Jakarta, Indonesia 12345
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border-main flex items-start">
              <Phone size={24} className="text-theme-primary-dark mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-left text-text-main">Hubungi Kami</h3>
                <p className="text-text-muted text-left">
                  (021) 1234-5678 / support@rockstarclimbing.id
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;