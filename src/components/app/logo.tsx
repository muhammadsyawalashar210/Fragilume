// Inline SVG mark for Fragilume.
// Renders the five-circle "constellation" using currentColor so it
// adapts to the surrounding text color (black on light, white on dark).
// Prefer this over an <img> tag when the mark should inherit theme color.

export function LogoMark({
  className,
  size = 20,
  strokeWidth,
  title = "Fragilume",
}: {
  className?: string;
  size?: number;
  strokeWidth?: number;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g fill="currentColor">
        <circle cx="256" cy="360" r="104" />
        <circle cx="256" cy="256" r="78" />
        <circle cx="256" cy="152" r="62" />
        <circle cx="330" cy="288" r="31" />
        <circle cx="358" cy="184" r="42" />
      </g>
    </svg>
  );
}

// Full app icon: rounded-square amber backdrop + white mark.
// Use this for the onboarding hero, about dialog, and anywhere a
// self-contained colored badge is needed.
export function LogoBadge({
  className,
  size = 48,
  title = "Fragilume",
}: {
  className?: string;
  size?: number;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient
          id="fragilume-badge-bg"
          x1="0"
          y1="0"
          x2="512"
          y2="512"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient
          id="fragilume-badge-soft"
          x1="0"
          y1="0"
          x2="0"
          y2="512"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#fragilume-badge-bg)" />
      <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#fragilume-badge-soft)" />
      <g fill="#FFFEFB">
        <circle cx="256" cy="360" r="104" />
        <circle cx="256" cy="256" r="78" />
        <circle cx="256" cy="152" r="62" />
        <circle cx="330" cy="288" r="31" />
        <circle cx="358" cy="184" r="42" />
      </g>
    </svg>
  );
}
