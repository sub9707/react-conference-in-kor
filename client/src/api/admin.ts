// client/src/api/admin.ts
import type { Article, ArticleContent } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const adminApi = {
  // 모든 글 조회 (비공개 포함)
  async getArticles(): Promise<Article[]> {
    const response = await fetch(`${API_URL}/api/admin/articles`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // 글 상세 조회
  async getArticle(id: number): Promise<Article> {
    const response = await fetch(`${API_URL}/api/admin/articles/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // 글 생성
  async createArticle(articleData: {
    title: string;
    slug: string;
    year: number;
    conference?: string;
    speaker?: string;
    date?: string;
    summary?: string;
    tags: string[];
    video_url?: string;
    thumbnail?: string;
    content: ArticleContent;
    published: boolean;
  }): Promise<Article> {
    const response = await fetch(`${API_URL}/api/admin/articles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(articleData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // 글 수정
  async updateArticle(id: number, updates: Partial<Article>): Promise<Article> {
    const response = await fetch(`${API_URL}/api/admin/articles/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // 글 삭제
  async deleteArticle(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/admin/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  },

  // 발행 토글
  async togglePublish(id: number, published: boolean): Promise<Article> {
    const response = await fetch(`${API_URL}/api/admin/articles/${id}/publish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ published }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};