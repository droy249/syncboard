interface PresenceBarProps {
  count: number;
}

export function PresenceBar({ count }: PresenceBarProps) {
  // Show up to 5 colored dots, one per connected user
  const dots = Array.from({ length: Math.min(count, 5) }, (_, i) => i);

  return (
    <div className="presence-bar">
      <div className="presence-dots">
        {dots.map((i) => (
          <span
            key={i}
            className="presence-dot"
            style={{
              backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i],
            }}
          />
        ))}
      </div>
      <span>{count} {count === 1 ? 'user' : 'users'} online</span>
    </div>
  );
}