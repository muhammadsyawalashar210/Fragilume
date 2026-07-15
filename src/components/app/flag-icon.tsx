// Inline SVG flag icons for language selection.
// Crisp at small sizes (20-28px). No image assets required.

export function FlagIcon({
  code,
  size = 20,
  className,
}: {
  code: "id" | "us";
  size?: number;
  className?: string;
}) {
  if (code === "id") return <IndonesiaFlag size={size} className={className} />;
  return <UsFlag size={size} className={className} />;
}

// Indonesia: top half red (#E70011), bottom half white. 3:2 ratio.
function IndonesiaFlag({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const w = size * 1.5;
  const h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 30 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Indonesia"
    >
      <rect width="30" height="20" rx="2" fill="#fff" />
      <rect width="30" height="10" rx="2" fill="#E70011" />
      <rect y="8" width="30" height="2" fill="#E70011" />
      <rect width="30" height="20" rx="2" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
    </svg>
  );
}

// United States: 13 stripes + blue canton with stars. 19:10 ratio.
function UsFlag({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const w = size * 1.9;
  const h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 190 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="English (US)"
    >
      <defs>
        <clipPath id="usflag-clip">
          <rect width="190" height="100" rx="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#usflag-clip)">
        {/* 13 stripes: 7 red + 6 white */}
        <rect width="190" height="100" fill="#fff" />
        <rect width="190" height="7.69" y="0" fill="#B22234" />
        <rect width="190" height="7.69" y="15.38" fill="#B22234" />
        <rect width="190" height="7.69" y="30.77" fill="#B22234" />
        <rect width="190" height="7.69" y="46.15" fill="#B22234" />
        <rect width="190" height="7.69" y="61.54" fill="#B22234" />
        <rect width="190" height="7.69" y="76.92" fill="#B22234" />
        <rect width="190" height="7.69" y="92.31" fill="#B22234" />
        {/* Blue canton */}
        <rect width="76" height="53.85" fill="#3C3B6E" />
        {/* Stars (simplified grid: 5 rows × 6 cols = 30 stars, recognizable at small size) */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={6.33 + col * 12.67}
              cy={5.38 + row * 10.77}
              r={1.3}
              fill="#fff"
            />
          )),
        )}
      </g>
      <rect
        width="190"
        height="100"
        rx="3"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="0.5"
      />
    </svg>
  );
}
