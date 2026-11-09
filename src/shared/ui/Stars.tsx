export function Stars({ value, max }: { value: number; max: number }) {
  const filled = max === 0 ? 0 : Math.round((value / max) * 3);
  return (
    <span aria-label={`${value} de ${max} completados`} role="img">
      {[0, 1, 2].map((i) => (
        <span key={i} aria-hidden="true" style={{ opacity: i < filled ? 1 : 0.25 }}>
          ⭐
        </span>
      ))}
    </span>
  );
}
