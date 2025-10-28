import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });
  
  const formattedDate = new Date(article.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link to={`/article/${article.slug}`} className="group block">
        <article className="h-full bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            {article.thumbnail ? (
          <div className="relative h-48 overflow-hidden bg-linear-to-br from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
          </div>
            ) : null}

          <div className="p-6">
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {article.summary}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formattedDate}</span>
              </div>
              
              {article.speaker && (
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {article.speaker}
                </span>
              )}
            </div>

            {article.conference && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {article.conference}
                </span>
              </div>
            )}
          </div>

          <div className="absolute inset-0 border-2 border-transparent group-hover:border-sky-400 dark:group-hover:border-sky-500 rounded-2xl transition-colors pointer-events-none" />
        </article>
      </Link>
    </div>
  );
}