import React from 'react';
import { Target, Users, MapPin, Phone } from 'lucide-react';
import logo from '../assets/logo.jpg'; // Using your logo

const AboutUs = () => {
  return (
    <div className="bg-content-bg">
      {/* 1. Hero Section */}
      <section className="bg-black border-b border-border-main py-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl text-white font-bold mb-4">
            About Us
          </h1>
          <p className="text-xl text-white text-text-muted max-w-2xl mx-auto">
            Get to know Rockstar Climbing Hold Indonesia and our passion for the vertical world.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Our Vision */}
            <div className="bg-white h-full p-8 rounded-lg shadow-sm border border-border-main">
              <div className="flex items-center text-theme-primary-dark mb-4">
                <Target size={32} className="mr-3" />
                <h2 className="text-3xl font-semibold">Our Vision</h2>
              </div>
              <p className="text-text-muted">
                To be Indonesia's leading provider of climbing holds and outdoor equipment, inspiring everyone to explore their limits safely and confidently.
              </p>
            </div>
            
            {/* Our Mission */}
            <div className="bg-white h-full p-8 rounded-lg shadow-sm border border-border-main">
              <div className="flex items-center text-theme-primary-dark mb-4">
                <Users size={32} className="mr-3" />
                <h2 className="text-3xl font-semibold">Our Mission</h2>
              </div>
              <p className="text-text-muted">
                We are committed to delivering high-quality products, expert customer service, and building a community that values environmental sustainability and safety in every adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Story Section */}
      <section className="bg-black border-y border-border-main py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src={logo} 
                alt="Rockstar Climbing Hold Logo" 
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-white mb-6">
                Our Story
              </h2>
              <p className="text-text-muted text-white text-lg mb-4">
                Born from a deep love for rock climbing and the great outdoors, Rockstar Climbing Hold Indonesia was founded in [Year]...
              </p>
              <p className="text-white text-text-muted opacity-80">
                (Placeholder for company history. Describe how the company started, the core values you uphold, and your dedication to quality and the climbing community in Indonesia.)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact & Location Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-main mb-10">
            Visit Our Workshop
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border-main flex items-start">
              <MapPin size={24} className="text-theme-primary-dark mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-left text-text-main">Physical Address</h3>
                <p className="text-text-muted text-left">
                  (Placeholder) 123 Adventure St., Jakarta, Indonesia 12345
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border-main flex items-start">
              <Phone size={24} className="text-theme-primary-dark mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-left text-text-main">Get in Touch</h3>
                <p className="text-text-muted text-left">
                  JL. Lapang Rt 004 Rw 002 (Komplek Pabrik Soun)
                  Karangsoka,Bantarwuni,Kembaran,Banyumas,Jawa Tengah 53181<br/>
                  Phone: +62 88806123456<br/>
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