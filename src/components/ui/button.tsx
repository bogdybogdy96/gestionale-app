import React from 'react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
export function Button({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; className?: string; }) {
  return (
    <button {...props} className={`inline-flex items-center justify-center px-3 py-1 rounded-md hover:bg-gray-100 ${className || ''}`}>
      {children}
    </button>
  );
}