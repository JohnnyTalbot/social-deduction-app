import React from 'react';

function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & React.HTMLAttributes<HTMLDivElement>) {
  return(
    <button 
      className={`flex flex-col rounded text-light px-5 py-2 cursor-pointer ${className}`}
      style={{
        boxSizing: 'border-box',
        border: '3px solid #000000',
        boxShadow: '-5px 5px 0px #000000',
        borderRadius: '30px',
        background: 'linear-gradient(122deg, #51277D 55.45%, #9247E3 108.83%)',
      }}
      {...props}>
      {children}
    </button>
  )
}

export default Button;
