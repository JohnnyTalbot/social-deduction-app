import React from 'react';

interface ButtonProps{
  text: string;
  className?: string;
}

function Button({text, className, ...props}: ButtonProps) {
  return(
    <div>
      <button className={`rounded bg-[#EFE8D6] text-[#7B5D4E] px-5 py-2 cursor-pointer ${className}`} {...props}>
        {text}
      </button>
    </div>
  )
}

export default Button;