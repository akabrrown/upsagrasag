import React, { forwardRef } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className = '', ...rest } = props;
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
export default Input;
