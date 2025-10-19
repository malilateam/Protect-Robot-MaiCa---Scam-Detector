
import React from 'react';

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex justify-center items-center gap-4">
      <ShieldIcon />
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Protect Robot <span className="text-blue-600">MaiCa</span>
      </h1>
    </header>
  );
};

export default Header;
