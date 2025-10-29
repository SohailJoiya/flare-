import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'px-6 py-2.5 rounded-lg font-semibold focus:outline-none focus:ring-4 transition-all duration-300 transform hover:-translate-y-0.5';
  
  const styles = {
    primary: 'bg-gradient-to-r from-rose-500 to-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 focus:ring-brand-primary/50',
    secondary: 'bg-transparent text-brand-gray border border-brand-gray hover:bg-brand-gray hover:text-white focus:ring-brand-gray/50',
    success: 'bg-gradient-to-r from-rose-500 to-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 focus:ring-brand-primary/50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30',
  };

  const finalClassName = `${baseClasses} ${styles[variant]} ${className || ''}`;

  return (
    <button className={finalClassName.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;