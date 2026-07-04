import React, { forwardRef } from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const { className = '', ...rest } = props;
  return (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      {...rest}
    />
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
