import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...rest }) => {
  const baseClasses = 'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors transform hover:shadow-md active:scale-95';
  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-primary/50';
  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
