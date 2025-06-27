import { useState, useEffect, useRef } from 'react';

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
  const [isHovering, setIsHovering] = useState(false)
  const [maxHeight, setMaxHeight] = useState(open ? 'none' : '0px');
  const [shouldRender, setShouldRender] = useState(open);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!isOpen) setShouldRender(true); // allow render before measuring
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const content = contentRef.current;

    if (isOpen && content) {
      // Wait for next tick to ensure DOM is painted
      requestAnimationFrame(() => {
        const scrollHeight = content.scrollHeight;
        setMaxHeight(`${scrollHeight}px`);
      });
    } else {
      setMaxHeight('0px');

      // After collapse transition ends, hide content to prevent tabbing/focus
      const timeout = setTimeout(() => setShouldRender(false), 500); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen, children]);

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
        transform: !isOpen ? 
          side === 'left' ? 
          (isHovering ? 'translateX(-5px)' : 'translateX(-15px)') : 
          (isHovering ? 'translateX(5px)' : 'translateX(15px)') : 'none',
        maxWidth: isOpen ? '500px' : '100px',
        transition: 'max-width 0.5s ease-in-out, transform 0.3s ease-in-out',
      }}
      {...props}
    >
      {/* Toggle Button */}
      {isOpen ? (
        <div
          className={`p-5 absolute top-0 ${side === 'left' ? 'right-0' : 'left-0'} cursor-pointer z-10`}
          onClick={toggle}
        >
          <svg width="30" height="5" viewBox="0 0 30 5" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 2.25C0 1.00736 1.00707 0 2.24936 0H27.7506C28.9929 0 30 1.00736 30 2.25C30 3.49264 28.9929 4.5 27.7506 4.5H2.24936C1.00707 4.5 0 3.49264 0 2.25Z"
              fill="#51277D"
            />
          </svg>
        </div>
      ) : (
        <div
          className="flex justify-end p-5 cursor-pointer w-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => {
            toggle();
            setIsHovering(false);
          }}
        >
          {icon}
        </div>
      )}

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        style={{
          maxHeight,
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          opacity: isOpen ? 1 : 0,
          padding: isOpen ? '1.5rem 0' : '0',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {shouldRender && children}
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
