'use client';

import Link from 'next/link';
import { Tag as TagIcon } from 'lucide-react';

interface TagProps {
  name: string;
  variant?: 'default' | 'primary';
}

export function Tag({ name, variant = 'default' }: TagProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105';
  const variantClasses = {
    default: 'bg-fd-muted/50 text-fd-muted-foreground hover:bg-fd-muted border border-fd-border',
    primary: 'bg-fd-primary/10 text-fd-primary hover:bg-fd-primary/20 border border-fd-primary/20',
  };

  // Нормализуем тег: lowercase и trim для правильного URL
  const normalizedTag = name.toLowerCase().trim();
  const encodedTag = encodeURIComponent(normalizedTag);

  return (
    <Link 
      href={`/docs/tags/${encodedTag}`}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <TagIcon className="w-3.5 h-3.5" />
      {name}
    </Link>
  );
}

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 my-4 pb-4 border-b border-fd-border">
      <span className="text-sm text-fd-muted-foreground font-medium">Теги:</span>
      {tags.map((tag) => (
        <Tag key={tag} name={tag} />
      ))}
    </div>
  );
}

// Популярные теги для главной страницы
export const POPULAR_TAGS = [
  'godex',
  'zebra',
  'brother',
  'калибровка',
  'настройка',
  'печать',
  'драйвер',
  'обслуживание',
  'этикетки',
  'бейджи',
];

interface PopularTagsProps {
  title?: string;
}

export function PopularTags({ title = 'Популярные теги' }: PopularTagsProps) {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-4 text-fd-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {POPULAR_TAGS.map((tag) => (
          <Tag key={tag} name={tag} variant="primary" />
        ))}
      </div>
    </div>
  );
}

