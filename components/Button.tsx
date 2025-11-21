import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  icon,
  type = 'button', // Default to 'button' to prevent unintended form submissions
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-3 border text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-200 focus:ring-brand-500",
    secondary: "border-transparent text-brand-700 bg-brand-100 hover:bg-brand-200 focus:ring-brand-500",
    outline: "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500",
    ghost: "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      type={type}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 -ml-1">{icon}</span>}
      {children}
    </button>
  );
};