

function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
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

export default Card;
