import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image 
            src="/logo.svg" 
            alt="SHPAL Docs" 
            width={24} 
            height={24}
            className="size-5"
          />
          <span className="font-medium max-md:hidden [header_&]:text-[15px]">
            Shpal Docs
          </span>
        </>
      ),
      transparentMode: 'top',
    },
  };
}
