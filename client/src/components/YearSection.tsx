import ArticleCard from './ArticleCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { Article } from '../types';

interface YearSectionProps {
  year: number;
  articles: Article[];
  count: number;
}

export default function YearSection({ year, articles, count }: YearSectionProps) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, once: true });

  return (
    <section ref={ref} className="mb-20">
      <div className={`flex items-center gap-4 mb-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}>
        <div className="relative">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 bg-clip-text text-transparent">
            {year}
          </h2>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 rounded-full" />
        </div>
        <span className="text-sm font-medium px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300">
          {count}개의 글
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </section>
  );
}