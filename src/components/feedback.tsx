'use client';

import { ThumbsDown, ThumbsUp, MessageSquare, AlertTriangle } from 'lucide-react';
import { type SyntheticEvent, useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const rateButtonVariants = {
  base: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50',
  active: 'bg-fd-primary text-fd-primary-foreground border-fd-primary [&_svg]:fill-current shadow-sm',
  inactive: 'bg-fd-card text-fd-muted-foreground border-fd-border hover:bg-fd-accent hover:text-fd-accent-foreground',
};

export interface Feedback {
  opinion: 'good' | 'bad' | 'error';
  url?: string;
  message: string;
  pageTitle?: string;
  name?: string;
}

interface Result extends Feedback {
  submitted?: boolean;
}

export function Feedback() {
  const url = usePathname();
  const [previous, setPrevious] = useState<Result | null>(null);
  const [opinion, setOpinion] = useState<'good' | 'bad' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const item = localStorage.getItem(`docs-feedback-${url}`);
    if (item === null) return;
    setPrevious(JSON.parse(item) as Result);
  }, [url]);

  useEffect(() => {
    const key = `docs-feedback-${url}`;
    if (previous) localStorage.setItem(key, JSON.stringify(previous));
    else localStorage.removeItem(key);
  }, [previous, url]);

  function submit(e?: SyntheticEvent) {
    if (opinion == null || !message.trim()) return;

    startTransition(async () => {
      const feedback: Feedback = {
        opinion,
        message: message.trim(),
        url,
        pageTitle: document.title,
        name: name.trim() || undefined,
      };

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedback),
        });

        if (response.ok) {
          setPrevious({
            submitted: true,
            ...feedback,
          });
          setMessage('');
          setName('');
          setOpinion(null);
          setIsOpen(false);
        } else {
          console.error('Failed to submit feedback');
          alert('Не удалось отправить отзыв. Попробуйте позже.');
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Произошла ошибка при отправке отзыва.');
      }
    });

    e?.preventDefault();
  }

  const activeOpinion = previous?.opinion ?? opinion;
  const hasSubmitted = previous?.submitted ?? false;

  return (
    <div className="mt-8 pt-8 border-t border-fd-border">
      <div className="flex flex-col gap-4">
        {!hasSubmitted ? (
          <>
            <div className="flex flex-row items-center gap-3">
              <MessageSquare className="size-5 text-fd-muted-foreground" />
              <p className="text-sm font-medium text-fd-foreground">
                Был ли полезен этот материал?
              </p>
            </div>
            <div className="flex flex-row items-center gap-3 flex-wrap">
              <button
                disabled={previous !== null || isPending}
                className={cn(
                  rateButtonVariants.base,
                  activeOpinion === 'good'
                    ? rateButtonVariants.active
                    : rateButtonVariants.inactive,
                )}
                onClick={() => {
                  setOpinion('good');
                  setIsOpen(true);
                }}
              >
                <ThumbsUp className="size-4" />
                Полезно
              </button>
              <button
                disabled={previous !== null || isPending}
                className={cn(
                  rateButtonVariants.base,
                  activeOpinion === 'bad'
                    ? rateButtonVariants.active
                    : rateButtonVariants.inactive,
                )}
                onClick={() => {
                  setOpinion('bad');
                  setIsOpen(true);
                }}
              >
                <ThumbsDown className="size-4" />
                Нужно улучшить
              </button>
              <button
                disabled={previous !== null || isPending}
                className={cn(
                  rateButtonVariants.base,
                  activeOpinion === 'error'
                    ? 'bg-red-500/20 text-red-400 border-red-500/50 [&_svg]:fill-current shadow-sm'
                    : 'bg-fd-card text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50',
                )}
                onClick={() => {
                  setOpinion('error');
                  setIsOpen(true);
                }}
              >
                <AlertTriangle className="size-4" />
                Нашли ошибку?
              </button>
            </div>

            {isOpen && opinion && (
              <form
                className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2"
                onSubmit={submit}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя (необязательно)"
                  className="w-full border border-fd-border rounded-lg bg-fd-card text-fd-card-foreground p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring placeholder:text-fd-muted-foreground text-sm"
                />
                <textarea
                  autoFocus
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[100px] border border-fd-border rounded-lg bg-fd-card text-fd-card-foreground p-3 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring placeholder:text-fd-muted-foreground text-sm"
                  placeholder={
                    opinion === 'good'
                      ? 'Что именно было полезным? Ваши пожелания...'
                      : opinion === 'error'
                        ? 'Опишите найденную ошибку. Укажите, что именно не так, шаги для воспроизведения и любую другую полезную информацию...'
                        : 'Что можно улучшить? Опишите проблему или ваши предложения...'
                  }
                  onKeyDown={(e) => {
                    if (!e.shiftKey && e.key === 'Enter') {
                      submit(e);
                    }
                  }}
                />
                <div className="flex flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isPending || !message.trim()}
                    className="px-4 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm hover:bg-fd-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? 'Отправка...' : 'Отправить отзыв'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setOpinion(null);
                      setMessage('');
                      setName('');
                    }}
                    className="px-4 py-2 rounded-lg border border-fd-border bg-fd-card text-fd-card-foreground font-medium text-sm hover:bg-fd-accent transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="px-4 py-6 flex flex-col items-center gap-3 bg-fd-card text-fd-muted-foreground text-sm text-center rounded-xl border border-fd-border">
            <div className="flex items-center gap-2 text-fd-foreground font-medium">
              <ThumbsUp className="size-5 text-fd-primary" />
              Спасибо за ваш отзыв!
            </div>
            <p className="text-xs text-fd-muted-foreground">
              Ваше мнение поможет улучшить документацию
            </p>
            <button
              onClick={() => {
                setPrevious(null);
                setOpinion(null);
                setMessage('');
                setName('');
                setIsOpen(false);
              }}
              className="px-4 py-2 rounded-lg border border-fd-border bg-fd-secondary text-fd-secondary-foreground font-medium text-xs hover:bg-fd-accent transition-colors"
            >
              Оставить еще один отзыв
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
