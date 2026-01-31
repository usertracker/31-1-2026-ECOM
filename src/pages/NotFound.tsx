import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4 font-sans">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <div className="absolute mt-[-50px]">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#2874f0] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
            <Home size={20} /> Go to Homepage
        </Link>
      </div>
    </div>
  );
};
