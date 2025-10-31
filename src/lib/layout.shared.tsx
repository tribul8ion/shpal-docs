import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-medium max-md:hidden [header_&]:text-[15px]">
          Shpal Docs
        </span>
      ),
      transparentMode: 'top',
    },
  };
}
