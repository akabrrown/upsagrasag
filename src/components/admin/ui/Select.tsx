import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
  options: { value: string; label: string }[];
};

const Select: React.FC<SelectProps> = ({ className = '', options, ...rest }) => {
  return (
    <select
      className={`w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
