// FILE: components/ui/input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...props }) => {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${props.className}`}
    />
  );
};

export { Input };