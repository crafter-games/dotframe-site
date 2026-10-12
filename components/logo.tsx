export function Mark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M5 2.5H2.5v11H5M11 2.5h2.5v11H11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="8" cy="8" r="2" className="fill-dot" />
    </svg>
  );
}
