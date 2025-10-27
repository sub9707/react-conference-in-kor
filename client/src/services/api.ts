// client/src/services/api.ts
import { Article, YearStat, ApiResponse, ArticlesResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getArticles(params: Record<string, string | number> = {}): Promise<ArticlesResponse> {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${API_URL}/api/articles${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  const res = await fetch(`${API_URL}/api/articles/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

export async function getYearStats(): Promise<ApiResponse<YearStat[]>> {
  const res = await fetch(`${API_URL}/api/articles/stats/years`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getAllTags(): Promise<ApiResponse<string[]>> {
  const res = await fetch(`${API_URL}/api/articles/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}