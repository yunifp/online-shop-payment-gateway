import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar'; 
import Footer from '../components/layouts/Footer';

// Import gambar sprite
import bgSprite1 from '../assets/holds-1.webp'; 
import bgSprite2 from '../assets/holds-2.webp'; 
import bgSprite3 from '../assets/holds-3.webp'; 
import bgSprite4 from '../assets/holds-4.webp'; 
import bgSprite5 from '../assets/holds-5.webp';

const PageLayout = () => {
  const [backgroundElements, setBackgroundElements] = useState([]);

  useEffect(() => {
    const bgSprites = [bgSprite1, bgSprite2, bgSprite3, bgSprite4, bgSprite5];
    const itemCount = 20; 
    const newElements = [];
    
    // Konfigurasi jarak aman
    // minDistance: Jarak minimal antar titik tengah gambar dalam satuan % layar.
    // Semakin besar angkanya, semakin renggang (tapi mungkin jumlah item tidak terpenuhi jika layar penuh)
    const minDistance = 15; 
    let attempts = 0;
    const maxAttempts = 1000; // Batas percobaan agar tidak infinite loop browser hang

    while (newElements.length < itemCount && attempts < maxAttempts) {
      attempts++;

      // Generate posisi random
      // Kita beri buffer 5% - 95% agar gambar tidak terlalu terpotong di pinggir layar
      const top = Math.random() * 90 + 5;
      const left = Math.random() * 90 + 5;

      let overlapping = false;

      // Cek jarak dengan semua elemen yang sudah ada di array newElements
      for (const el of newElements) {
        // Rumus jarak Euclidean (Pythagoras)
        const dx = el.left - left;
        const dy = el.top - top;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          overlapping = true;
          break; // Jika sudah ada 1 saja yang dekat, stop cek, ini overlapping
        }
      }

      // Jika tidak overlapping, masukkan ke array
      if (!overlapping) {
        const randomSpriteIndex = Math.floor(Math.random() * bgSprites.length);
        
        newElements.push({
          id: newElements.length,
          top,
          left,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0.6, 
          image: bgSprites[randomSpriteIndex]
        });
      }
    }

    setBackgroundElements(newElements);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-text-main relative overflow-hidden">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {backgroundElements.map((el) => (
          <img
            key={el.id}
            src={el.image}
            alt=""
            className="absolute w-32 h-32 object-contain" 
            style={{
              top: `${el.top}%`,
              left: `${el.left}%`,
              // Translate -50% memastikan posisi top/left berada di titik tengah gambar
              transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.scale})`,
              opacity: el.opacity, 
            }}
          />
        ))}
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;