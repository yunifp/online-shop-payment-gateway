import React from "react";
import { Target, Users, MapPin, Phone } from "lucide-react";
import logo from "../assets/logo.webp";

const AboutUs = () => {
  return (
    <div className="bg-content-bg/30">
      {/* 1. Hero Section */}
      <section className="bg-black border-b border-border-main py-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl text-white font-bold mb-4">About Us</h1>
          <p className="text-xl text-white text-text-muted max-w-2xl mx-auto">
            Get to know Rockstar Climbing Hold Indonesia and our passion for the
            world of climbing and movement.
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
                To become Indonesia’s leading local manufacturer of climbing
                holds and training equipment — creating safe, durable, and
                innovative products that support the growth of climbing gyms,
                athletes, and climbing communities across the nation.
              </p>
            </div>

            {/* Our Mission */}
            <div className="bg-white h-full p-8 rounded-lg shadow-sm border border-border-main">
              <div className="flex items-center text-theme-primary-dark mb-4">
                <Users size={32} className="mr-3" />
                <h2 className="text-3xl font-semibold">Our Mission</h2>
              </div>
              <p className="text-text-muted">
                We are committed to designing and producing ergonomic and
                reliable climbing holds, delivering professional customer
                support, and building an inclusive climbing ecosystem that
                prioritizes safety, sustainability, and community development in
                every adventure and training session.
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
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>

              <p className="text-text-muted text-white text-lg mb-4">
                Rockstar Climbing Hold Indonesia was born from a deep passion
                for climbing and the desire to create high–quality climbing
                holds proudly made in Indonesia. Starting from a small workshop,
                we began developing shapes, textures, and grip variations
                tailored to the needs of climbing gyms, athletes, and route
                setters across the country.
              </p>

              <p className="text-white text-text-muted opacity-80">
                From the beginning, we believed that every climbing hold should
                not only be functional, but also durable, ergonomic, and safe to
                use. Each Rockstar product goes through a careful design
                process, strength testing, and detailed finishing to ensure a
                comfortable grip experience for all climbing styles — from
                beginners to professionals.
              </p>

              <p className="text-white text-text-muted opacity-80 mt-4">
                Today, Rockstar Climbing Hold continues to grow alongside the
                Indonesian climbing community. We proudly support climbing gyms,
                training programs, competitions, and local route development —
                proving that locally crafted products can be competitive,
                reliable, and impactful for the growth of climbing culture in
                Indonesia.
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
              <MapPin
                size={24}
                className="text-theme-primary-dark mr-4 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="text-lg font-semibold text-left text-text-main">
                  Physical Address
                </h3>
                <p className="text-text-muted text-left">
                  JL. Lapang Rt 004 Rw 002 (Komplek Pabrik Soun)
                  <br />
                  Karangsoka, Bantarwuni, Kembaran, Banyumas
                  <br />
                  Central Java — 53181
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-border-main flex items-start">
              <Phone
                size={24}
                className="text-theme-primary-dark mr-4 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="text-lg font-semibold text-left text-text-main">
                  Get in Touch
                </h3>
                <p className="text-text-muted text-left">
                  Phone:&nbsp;
                  <a
                    href="https://wa.me/6288806123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:text-blue-600"
                  >
                    +62 88806123456
                  </a>
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
