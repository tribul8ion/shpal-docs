import { source } from '@/lib/source';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params;
  const tag = decodeURIComponent(params.tag);

  // Получаем все страницы
  const allPages = source.getPages();
  
  // Фильтруем страницы по тегу
  const filteredPages = allPages.filter((page) => {
    const pageData = page.data as any;
    const tags = pageData.tags;
    
    if (!tags) return false;
    
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    return tagsArray.some((t: string) => {
      if (typeof t === 'string') {
        return t.toLowerCase().trim() === tag.toLowerCase().trim();
      }
      return false;
    });
  });

  if (filteredPages.length === 0) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-8">
        <Link 
          href="/docs/tags" 
          className="text-sm text-fd-muted-foreground hover:text-fd-foreground mb-4 inline-block"
        >
          ← Все теги
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-8 h-8 text-fd-primary" />
          <h1 className="text-4xl font-bold">#{tag}</h1>
        </div>
        <p className="text-fd-muted-foreground">
          Найдено документов: {filteredPages.length}
        </p>
      </div>

      <div className="grid gap-4">
        {filteredPages.map((page) => {
          const data = page.data as any;
          return (
            <Link
              key={page.url}
              href={page.url}
              className="block p-6 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-muted/50 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2 text-fd-foreground">
                {data.title}
              </h2>
              {data.description && (
                <p className="text-fd-muted-foreground line-clamp-2">
                  {data.description}
                </p>
              )}
              {data.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {(Array.isArray(data.tags) ? data.tags : [data.tags]).map((t: string) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-md bg-fd-primary/10 text-fd-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const allPages = source.getPages();
  const allTags = new Set<string>();

  allPages.forEach((page) => {
    const data = page.data as any;
    if (data.tags) {
      const tags = Array.isArray(data.tags) ? data.tags : [data.tags];
      tags.forEach((tag: string) => allTags.add(tag.toLowerCase()));
    }
  });

  return Array.from(allTags).map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

