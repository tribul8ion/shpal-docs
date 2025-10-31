import { source } from '@/lib/source';
import Link from 'next/link';
import { Tag as TagIcon } from 'lucide-react';

export default function TagsPage() {
  const allPages = source.getPages();
  const tagCounts = new Map<string, number>();

  // Подсчитываем количество документов для каждого тега
  allPages.forEach((page) => {
    // Получаем frontmatter напрямую
    const pageData = page.data as any;
    
    // Теги должны быть в page.data напрямую
    const tags = pageData.tags;
    
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      tagsArray.forEach((tag: string) => {
        if (tag && typeof tag === 'string') {
          const lowerTag = tag.toLowerCase().trim();
          if (lowerTag) {
            tagCounts.set(lowerTag, (tagCounts.get(lowerTag) || 0) + 1);
          }
        }
      });
    }
  });

  // Сортируем теги по популярности
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TagIcon className="w-8 h-8 text-fd-primary" />
          <h1 className="text-4xl font-bold">Все теги</h1>
        </div>
        <p className="text-fd-muted-foreground">
          Найдите документацию по тегам. Всего тегов: {sortedTags.length}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTags.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/docs/tags/${encodeURIComponent(tag)}`}
            className="group flex items-center justify-between p-4 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-muted/50 transition-all hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-fd-primary" />
              <span className="font-medium text-fd-foreground">#{tag}</span>
            </div>
            <span className="text-sm font-bold text-fd-primary bg-fd-primary/10 px-2 py-1 rounded-full">
              {count}
            </span>
          </Link>
        ))}
      </div>

      {sortedTags.length === 0 && (
        <div className="text-center py-12 text-fd-muted-foreground">
          <TagIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Теги пока не добавлены</p>
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: 'Все теги',
  description: 'Поиск документации по тегам',
};

