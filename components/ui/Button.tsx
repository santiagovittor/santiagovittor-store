type ButtonProps = {
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

const base =
  "inline-flex items-center justify-center px-6 py-3 text-sm tracking-widest uppercase transition-colors duration-150 cursor-pointer border leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

const variants: Record<string, string> = {
  primary:
    "bg-[var(--accent)] text-black border-[var(--accent)] hover:bg-[var(--accent-2)] hover:border-[var(--accent-2)]",
  ghost:
    "bg-transparent text-[var(--text)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
};

export default function Button({
  variant = "primary",
  href,
  className = "",
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
