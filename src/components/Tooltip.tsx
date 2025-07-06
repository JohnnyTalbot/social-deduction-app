interface TooltipProps {
  content: string;
  x: number;
  y: number;
  visible: boolean;
}

export function Tooltip({ content, x, y, visible }: TooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none bg-card z-50 px-2 py-1 rounded-xl shadow"
      style={{
        top: y + 15,
        left: x + 15,
        maxWidth: '250px'
      }}
    >
      {content}
    </div>
  );
}
