'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Если items не предоставлены, генерируем из pathname
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    if (!pathname || pathname === '/docs' || pathname === '/') {
      return [];
    }

    const segments = pathname.split('/').filter(Boolean);
    const result: BreadcrumbItem[] = [
      { label: 'Главная', href: '/' },
    ];

    // Добавляем "Документация" если путь начинается с /docs
    if (segments[0] === 'docs') {
      result.push({ label: 'Документация', href: '/docs' });
    }

    // Генерируем остальные сегменты
    let currentPath = '';
    segments.forEach((segment, index) => {
      // Пропускаем сегмент 'docs', так как он уже обработан выше
      if (segment === 'docs' && index === 0) {
        currentPath = '/docs';
        return;
      }
      
      currentPath += `/${segment}`;
      
      // Красим названия сегментов
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/\b(Godx|Godex|Zebra|Brother|Hp)\b/gi, (match) => {
          const map: Record<string, string> = {
            'godx': 'GoDEX',
            'godex': 'GoDEX',
            'zebra': 'Zebra',
            'brother': 'Brother',
            'hp': 'HP',
          };
          return map[match.toLowerCase()] || match;
        });

      // Не добавляем последний сегмент как ссылку (текущая страница)
      if (index < segments.length - 1) {
        result.push({ label, href: currentPath });
      } else {
        // Последний элемент добавляем без ссылки (отобразится как текст)
        result.push({ label, href: currentPath });
      }
    });

    return result;
  })();

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Хлебные крошки"
      className={cn('flex items-center gap-2 text-sm text-fd-muted-foreground mb-6', className)}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={`${item.href}-${index}`} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 hover:text-fd-foreground transition-colors"
                  aria-label="Главная"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : isLast ? (
                <span className="text-fd-foreground font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-fd-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
              
              {!isLast && (
                <ChevronRight className="w-4 h-4 text-fd-muted-foreground/50" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

