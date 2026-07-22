export function WireframeInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.2" cy="6.8" r="1.1" strokeWidth="1.25" />
    </svg>
  );
}

export function WireframeYouTube({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.5 8.2c.2.9.5 2.9.5 3.8s-.3 2.9-.5 3.8c-.2.9-.9 1.6-1.8 1.8-1 .2-4.2.5-6.7.5s-5.7-.3-6.7-.5c-.9-.2-1.6-.9-1.8-1.8C4.3 14.9 4 12.9 4 12s.3-2.9.5-3.8c.2-.9.9-1.6 1.8-1.8C6.3 7.2 9.5 7 12 7s5.7.2 6.7.5c.9.2 1.6.9 1.8 1.7z" />
      <path d="M10.2 9.4v5.2l5.1-2.6-5.1-2.6z" />
    </svg>
  );
}

export function WireframeEmail({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7.5 12 13l8.5-5.5" />
    </svg>
  );
}
