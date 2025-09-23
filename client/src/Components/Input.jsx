import React from 'react';


const Input = React.forwardRef(({ label, type = 'text', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <input
        type={type}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ref={ref}
        {...props}
      />
    </div>
  );
});

export default Input;