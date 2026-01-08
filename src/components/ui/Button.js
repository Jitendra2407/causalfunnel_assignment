import React from 'react';

const Button = ({ children, onClick, disabled, className = '', variant = 'primary' }) => {
  const baseStyles = "px-6 py-2 rounded-lg font-semibold transition-all duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
