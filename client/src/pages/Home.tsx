// client/src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { getArticles, getYearStats } from '../services/api';
import Container from '../components/common/Container';
import YearSection from '../components/YearSection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {type Article, type YearStat} from '../types';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [yearStats, setYearStats] = useState<YearStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroRef, heroVisible] = useScrollAnimation({ threshold: 0.1, once: true });

  useEffect(() => {
    async function loadData() {
      try {
        const [articlesRes, statsRes] = await Promise.all([
          getArticles(),
          getYearStats()
        ]);
        setArticles(articlesRes.data);
        setYearStats(statsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const articlesByYear = articles.reduce<Record<number, Article[]>>((acc, article) => {
    const year = article.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(article);
    return acc;
  }, {});

  const years = Object.keys(articlesByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <Container className="relative z-10">
          <div
            ref={heroRef}
            className={`text-center transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                React Conference
              </span>
              <br />
              <span className="text-light-text dark:text-dark-text">Learning Hub</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              React 컨퍼런스의 주요 내용을 한국어로 학습하세요
            </p>

            <div className="flex justify-center gap-8 flex-wrap">
              {yearStats.map((stat) => (
                <div
                  key={stat.year}
                  className="px-6 py-3 bg-light-surface dark:bg-dark-surface rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.year}년
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-sky-500 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <Container className="py-16">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-20">
            {years.map((year) => (
              <YearSection
                key={year}
                year={Number(year)}
                articles={articlesByYear[Number(year)]}
                count={articlesByYear[Number(year)].length}
              />
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              아직 게시글이 없습니다
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              첫 번째 글을 작성해보세요!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}