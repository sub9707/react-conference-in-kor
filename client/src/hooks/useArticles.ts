import { useState, useTransition } from 'react';
import { getArticleBySlug } from '../services/api';
import type { Article } from '../types';

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadArticle = () => {
    startTransition(async () => {
      try {
        const response = await getArticleBySlug(slug);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setArticle(null);
      }
    });
  };

  return { article, error, isPending, loadArticle };
}