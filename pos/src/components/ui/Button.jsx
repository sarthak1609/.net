import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl cursor-pointer active:scale-[0.97]";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base"
  };
    
  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    outline: "border-2 border-teal-600 text-teal-700 hover:bg-teal-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
