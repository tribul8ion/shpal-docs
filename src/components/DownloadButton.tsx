import React from 'react';
import { Download } from 'lucide-react';

export function DownloadButton({ href, children, variant = 'secondary', ...props }: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  return (
    <a
      href={href}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={
        `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring ${
          variant === 'primary'
            ? 'bg-fd-primary text-fd-primary-foreground border-fd-primary hover:bg-fd-primary/90 shadow-sm'
            : 'bg-fd-card text-fd-card-foreground border-fd-border hover:bg-fd-accent hover:text-fd-accent-foreground hover:border-fd-accent'
        } ${props.className || ''}`
      }
      {...props}
    >
      <Download className="size-3.5 shrink-0" />
      <span>{children}</span>
    </a>
  );
}
