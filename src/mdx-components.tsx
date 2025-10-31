import React from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import * as icons from 'lucide-react';
import { TagList } from '@/components/tags';
import { DownloadButton } from './components/DownloadButton';

// ImagePreview component для отображения изображений с подписью
function ImagePreview({ 
  src, 
  alt, 
  caption,
  ...props 
}: { 
  src: string; 
  alt?: string; 
  caption?: string;
  className?: string;
}) {
  // Используем обычный img для изображений из public, так как Next.js Image требует статических путей
  return (
    <figure className="my-6 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || caption || ''}
        className="max-w-sm w-full h-auto"
        loading="lazy"
        {...props}
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-fd-muted-foreground max-w-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// YouTubeVideo component для встраивания YouTube видео
function YouTubeVideo({ 
  id,
  title = 'YouTube video player',
  ...props 
}: { 
  id: string;
  title?: string;
  className?: string;
}) {
  return (
    <div className="my-6 w-full" {...props}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    InlineTOC,
    Steps,
    Step,
    ImagePreview,
    YouTubeVideo,
    TagList,
    DownloadButton,
    // Заменяем стандартный img на ImageZoom для автоматического zoom
    img: (props: any) => <ImageZoom {...props} />,
    ...components,
  } satisfies MDXComponents;
}

declare module 'mdx/types.js' {
  // Augment the MDX types to make it understand React.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}