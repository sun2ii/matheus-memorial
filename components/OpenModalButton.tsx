'use client';

export const OPEN_WELCOME_EVENT = 'open-welcome-modal';

export default function OpenModalButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_WELCOME_EVENT))}
    >
      {children}
    </button>
  );
}
