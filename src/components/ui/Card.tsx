import { useState } from 'react';

export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-card p-5 ${className}`}
      style={{
        boxSizing: 'border-box',
        border: '3px solid #000000',
        boxShadow: '-5px 5px 0px #000000',
        borderRadius: '30px',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardSide(
  { children, className = '', side = 'left', open = false, icon, ...props }:
  { side?: 'left' | 'right', open?: boolean, icon?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
) {
  const [isOpen, setIsOpen] = useState(open);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <div
      className={`absolute bg-card overflow-hidden transition-all duration-500 ease-in-out ${side === 'left' ? 'left-0' : 'right-0'} ${className}`}
      style={{
        boxSizing: 'border-box',
        border: '3px solid #000000',
        boxShadow: '-5px 5px 0px #000000',
        borderBottomRightRadius: side === 'left' ? '30px' : '0',
        borderTopRightRadius: side === 'left' ? '30px' : '0',
        borderBottomLeftRadius: side === 'right' ? '30px' : '0',
        borderTopLeftRadius: side === 'right' ? '30px' : '0',
        transform: !isOpen ? (isHovering ? 'translateX(-20px)' : 'translateX(-30px)') : 'none',
        maxWidth: isOpen ? '500px' : '100px',
        maxHeight: isOpen ? '600px' : '100px',
      }}
      {...props}
    >
      {/* Collapse Button */}
      {isOpen && (
        <div
          className={`p-5 absolute top-0 ${side === 'left' ? 'right-0' : 'left-0'} cursor-pointer z-10`}
          onClick={handleClick}
        >
          <svg width="30" height="5" viewBox="0 0 30 5" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 2.25C0 1.00736 1.00707 0 2.24936 0H27.7506C28.9929 0 30 1.00736 30 2.25C30 3.49264 28.9929 4.5 27.7506 4.5H2.24936C1.00707 4.5 0 3.49264 0 2.25Z" fill="#51277D"/>
          </svg>
        </div>
      )}

      {!isOpen && (
        <div
          className='flex justify-end p-5 cursor-pointer w-full'
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => {
            setIsHovering(false);
            handleClick();
          }}
        >
          {icon}
        </div>
      )}

      <div
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'py-6 h-auto opacity-100' : 'p-0 h-0 opacity-0 pointer-events-none'}`}
      >
        {children}
      </div>
    </div>
  );
}

export function CardPopup({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-card p-5 ${className}`}
      style={{
        boxSizing: 'border-box',
        border: '3px solid #000000',
        boxShadow: '-5px 5px 0px #000000',
        borderRadius: '30px',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
