
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Calibrating the compressors...",
  "Tuning the EQs...",
  "Measuring LUFS levels...",
  "Analyzing stereo field...",
  "Scanning frequency spectrum...",
  "Checking for audio artifacts...",
  "Consulting the golden ears...",
];

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
       <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-brand-blue/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-brand-blue rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-semibold text-brand-light transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default Loader;
