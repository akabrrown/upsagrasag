import React from 'react';
import Input from '@/components/admin/ui/Input';
import Select from '@/components/admin/ui/Select';
import Textarea from '@/components/admin/ui/Textarea';
import { UseFormRegister, FieldError } from 'react-hook-form';

type AdminFormFieldProps = {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'url' | 'email' | 'datetime-local';
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  as?: 'input' | 'select' | 'textarea';
  options?: { value: string; label: string }[]; // for select
  required?: boolean;
};

export default function AdminFormField({
  label,
  name,
  type = 'text',
  placeholder = '',
  register,
  error,
  as = 'input',
  options = [],
  required = false,
}: AdminFormFieldProps) {
  const commonProps = {
    ...register(name, { required }),
    className: `w-full transition-transform duration-200 ease-out hover:scale-101 hover:shadow-md ${error ? 'border-red-500' : ''}`,
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor={name}>
        {label}{required && ' *'}
      </label>
      {as === 'input' && (
        <Input id={name} type={type} placeholder={placeholder} {...commonProps} />
      )}
      {as === 'select' && (
        <Select id={name} options={options} {...commonProps} />
      )}
      {as === 'textarea' && (
        <Textarea id={name} {...commonProps} />
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
