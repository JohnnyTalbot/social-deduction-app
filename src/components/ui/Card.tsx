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
          className={`flex ${side === 'left' ? 'justify-end' : 'justify-start'} w-auto`}
        >
          <div
            className="inline-flex p-5 cursor-pointer"
            onClick={() => {
              if (isLinked) {
                setOpenCard?.(0);
              } else {
                setInternalOpen(false);
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
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {shouldRender && children}
      </div>
    </div>
  );
}


interface CardPopupProps {
  title?: string,
  open:boolean, 
  setOpen: (open: boolean) => void
}

export function CardPopup({title='', open, setOpen, children, className = '', ...props }: CardPopupProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${open ? '' : 'hidden'} absolute w-full h-screen flex justify-center items-center px-[50px] py-[50px]`}>
      <div 
        className="absolute w-full h-screen z-1"
        onClick={() => {
          setOpen(false)
          }}
      />
      <div
        className={`w-full h-full bg-card p-5 pb-15 z-2 max-w-[1000px] ${className}`}
        style={{
          boxSizing: 'border-box',
          background: 'rgba(209, 187, 135, 0.7)',
          border: '3px solid #000000',
          boxShadow: '-5px 5px 0px #000000',
          borderRadius: '30px'
        }}
        {...props}
      >
        <div
          className={`flex items-center justify-between w-auto`}
        >
          <div>
            <p className='text-5xl text-[#51277D]'>{title}</p>
          </div>
          <div
            className="p-2 cursor-pointer"
            onClick={() => {
              setOpen(false)
            }}
          >
            <svg className="cursor-pointer" width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.389165 0.396985C0.907962 -0.119475 1.74899 -0.119372 2.26766 0.397215L7.46409 5.56937L12.6671 0.387816C13.1856 -0.128942 14.0266 -0.12932 14.5456 0.386971C15.0646 0.903261 15.0649 1.74071 14.5464 2.25747L9.34236 7.4401L14.6111 12.7422C15.1297 13.2588 15.1296 14.0963 14.6108 14.6127C14.092 15.1292 13.251 15.1291 12.7323 14.6125L7.46471 9.31145L2.31188 14.5723C1.79338 15.089 0.95235 15.0894 0.433382 14.5731C-0.0855855 14.0568 -0.0859656 13.2194 0.432533 12.7026L5.58644 7.44072L0.388934 2.26748C-0.129735 1.7509 -0.129632 0.913446 0.389165 0.396985Z" fill="#F54242"/>
            </svg>
          </div>
        </div>
        {children}
      </div>
    </div>
    
  );
}
