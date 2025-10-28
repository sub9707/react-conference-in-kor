// client/src/pages/ArticleDetail.tsx
import { Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/common/Container';
import BlockRenderer from '../components/blocks/BlockRenderer';
import { useArticle } from '../hooks/useArticles';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function ArticleDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

function ArticleContent() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { article, error, isPending, loadArticle } = useArticle(slug!);
  const [contentRef, isVisible] = useScrollAnimation({ threshold: 0.1, once: true });

  useEffect(() => {
    loadArticle();
  }, [slug]);

  if (isPending) {
    return (
      <Container className="py-16">
        <ArticleDetailSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            글을 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error.message}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </Container>
    );
  }

  if (!article) {
    return null;
  }

  const formattedDate = new Date(article.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <Container className="py-16">
        <button
          onClick={() => navigate('/')}
          className="group mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>목록으로 돌아가기</span>
        </button>

        <article
          ref={contentRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <header className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
              {article.speaker && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{article.speaker}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={article.date}>{formattedDate}</time>
              </div>

              {article.conference && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-semibold text-sky-600 dark:text-sky-400">
                    {article.conference}
                  </span>
                </div>
              )}
            </div>

            {article.summary && (
              <p className="mt-6 text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.summary}
              </p>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none text-black">
            {article.content?.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>홈으로 돌아가기</span>
            </button>
          </footer>
        </article>
      </Container>
    </div>
  );
}

export default function ArticleDetail() {
  return (
    <Suspense fallback={
      <Container className="py-16">
        <ArticleDetailSkeleton />
      </Container>
    }>
      <ArticleContent />
    </Suspense>
  );
}