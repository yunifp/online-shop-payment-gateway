import React from "react";
import { Mail, Phone, MapPin, User, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-content-bg/30 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-text-main mb-12">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-main mb-2"
              >
                Your Name
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-main mb-2"
              >
                Your Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail size={18} className="text-text-subtle" />
                </span>
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-main bg-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-main mb-2"
              >
                Message
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-border-main bg-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-theme-primary text-white font-medium py-3 px-8 rounded-lg shadow-md hover:bg-theme-primary-dark transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-main">
              Get in Touch
            </h2>
            <p className="text-text-muted">
              Feel free to reach out to us using the details below. We will get
              back to you as soon as possible.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail
                  size={20}
                  className="text-theme-primary-dark flex-shrink-0"
                />
                <span className="text-text-main">
                  support@rockstarclimbinghold.com
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Phone
                  size={20}
                  className="text-theme-primary-dark flex-shrink-0"
                />
                <a
                  href="https://wa.me/6288806123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-blue-600"
                >
                  +62 88806123456
                </a>
              </div>
              <div className="flex items-start gap-4">
                <MapPin
                  size={20}
                  className="text-theme-primary-dark flex-shrink-0 mt-1"
                />
                <span className="text-text-main">
                  <p className="text-text-muted text-left">
                    JL. Lapang Rt 004 Rw 002 (Komplek Pabrik Soun)
                    <br />
                    Karangsoka, Bantarwuni, Kembaran, Banyumas
                    <br />
                    Central Java — 53181
                  </p>
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
