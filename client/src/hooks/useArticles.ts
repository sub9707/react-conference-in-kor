import { useState, useTransition, useEffect } from 'react';
import { getArticleBySlug } from '../services/api';
import type { Article } from '../types';

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    
    startTransition(async () => {
      try {
        const response = await getArticleBySlug(slug);
        if (!cancelled) {
          setArticle(response.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다'));
          setArticle(null);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { article, error, isPending };
}