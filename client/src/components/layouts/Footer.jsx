import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import logo from '../../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-content-bg border-t border-border-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom 1: Logo dan Copyright */}
          <div className="space-y-4">
            <img 
              className="h-10 object-contain" 
              src={logo} 
              alt="Rockstar Climbing Hold Indonesia Logo" 
            />
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Rockstar Climbing Hold. <br />
              All rights reserved.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider">
              MENU
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/product" className="text-sm text-text-muted hover:text-text-main transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-text-muted hover:text-text-main transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-text-muted hover:text-text-main transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-text-muted hover:text-text-main transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Media Sosial */}
          <div>
            <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider">
              FOLLOW US
            </h3>
            <div className="flex space-x-5 mt-4">
              <a href="#" className="text-text-muted hover:text-text-main transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-text-main transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-text-main transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;