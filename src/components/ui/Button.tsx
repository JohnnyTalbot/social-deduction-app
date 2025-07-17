import React from 'react';

function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & React.HTMLAttributes<HTMLDivElement>) {
  return(
    <button 
      className={`custom-button flex flex-col items-center justify-center text-center text-light px-3 lg:px-5 py-2 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;
