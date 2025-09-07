
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center w-full max-w-4xl animate-fade-in">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-blue">
        Radio Ready
      </h1>
      <p className="mt-2 text-lg sm:text-xl text-brand-light font-medium">
        AI-Powered Music Track Analysis for Musicians & Engineers
      </p>
    </header>
  );
};

export default Header;
