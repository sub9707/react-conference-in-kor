import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin';
import type { Article } from '../types';
import { useAuth } from '../contexts/AuthContext';

function ArticleListContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchArticles = async () => {
      try {
        const data = await adminApi.getArticles();
        if (!cancelled) setArticles(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message || '게시글을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-light-text dark:text-dark-text">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-light-text dark:text-dark-text">게시글 관리</h1>
        <Link
          to="/admin/new"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          + 새 글 작성
        </Link>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-light-text dark:text-dark-text">제목</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-light-text dark:text-dark-text">연도</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-light-text dark:text-dark-text">상태</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-light-text dark:text-dark-text">조회수</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-light-text dark:text-dark-text">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-light-text dark:text-dark-text">{article.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{article.slug}</div>
                </td>
                <td className="px-6 py-4 text-light-text dark:text-dark-text">{article.year}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.published 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {article.published ? '발행됨' : '비공개'}
                  </span>
                </td>
                <td className="px-6 py-4 text-light-text dark:text-dark-text">{article.view_count}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/edit/${article.id}`}
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    편집
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ArticleList() {
  const { logout } = useAuth();

  return (
    <>
      <div className="bg-light-surface dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-light-text dark:text-dark-text hover:text-purple-600 transition-colors">
            ← 홈으로
          </Link>
          <button
            onClick={logout}
            className="text-red-600 dark:text-red-400 hover:underline"
          >
            로그아웃
          </button>
        </div>
      </div>

      <ArticleListContent />
    </>
  );
}
