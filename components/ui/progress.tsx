// FILE: components/ui/Progress.tsx
"use client"
import React from 'react';

interface ProgressProps {
  value: number;
  max: number;
}

const Progress: React.FC<ProgressProps> = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-blue-600 h-4 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default Progress;