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

type CardSideProps = {
  side?: 'left' | 'right';
  open?: boolean;
  icon?: React.ReactNode;
  cardIndex?: number;
  setOpenCard?: (index: number) => void;
};

export function CardSide(
  { children, className = '', side = 'left', cardIndex = 0, setOpenCard, open, icon, ...props }:
  CardSideProps & React.HTMLAttributes<HTMLDivElement>
) {
  const isLinked = !!setOpenCard && cardIndex !== 0;

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isLinked ? !!open : internalOpen;

  const [isHovering, setIsHovering] = useState(false);
  const [maxHeight, setMaxHeight] = useState(isOpen ? 'none' : '0px');
  const [shouldRender, setShouldRender] = useState(isOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!isOpen) setShouldRender(true);

    if (isLinked) {
      setOpenCard?.(cardIndex);
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const content = contentRef.current;

    if (isOpen && content) {
      requestAnimationFrame(() => {
        const scrollHeight = content.scrollHeight;
        setMaxHeight(`${scrollHeight}px`);
      });
    } else {
      setMaxHeight('0px');
      const timeout = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, children]);

  return (
    <div
      className={`bg-card transition-all duration-500 ease-in-out ${className}`}
      style={{
        boxSizing: 'border-box',
        borderTop: '3px solid #000000',
        borderBottom: '8px solid #000000',
        borderLeft: side === 'right' ? '5px solid #000000' : 'none',
        borderRight: side === 'left' ? '3px solid #000000' : 'none',
        borderBottomRightRadius: side === 'left' ? '30px' : '0',
        borderTopRightRadius: side === 'left' ? '30px' : '0',
        borderBottomLeftRadius: side === 'right' ? '30px' : '0',
        borderTopLeftRadius: side === 'right' ? '30px' : '0',
        padding: !isOpen
          ? side === 'right'
            ? isHovering ? '0 15px 0 0' : '0 5px 0 0'
            : isHovering ? '0 0 0 15px' : '0 0 0 5px'
          : 'none',
        maxWidth: isOpen ? '500px' : '100px',
        transition: 'max-width 0.5s ease-in-out, padding 0.3s ease-in-out',
      }}
      {...props}
    >
      {/* Toggle Button */}
      {isOpen ? (
        <div
          className={`flex ${side === 'left' ? 'justify-end' : 'justify-start'} p-5 pb-0 cursor-pointer`}
          onClick={() => {
            if (isLinked) {
              setOpenCard?.(0); // close all in the group
            } else {
              setInternalOpen(false); // close standalone
            }
          }}
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
          className={`flex ${side === 'left' ? 'justify-end' : 'justify-start'} p-5 cursor-pointer`}
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
