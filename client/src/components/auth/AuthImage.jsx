import React from 'react';

const AuthImage = ({ imageUrl, className = '' }) => {
  return (
    <div
      className={`hidden md:block w-1/2 bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      // Tambahkan role dan label untuk accessibility
      role="img"
      aria-label="Gambaran suasana panjat tebing atau outdoor"
    />
  );
};

export default AuthImage;