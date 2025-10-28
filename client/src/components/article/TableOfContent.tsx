// client/src/components/article/TableOfContents.tsx

import { useId } from 'react';
import type { TocItem } from '../../types';

interface TableOfContentsProps {
  items: TocItem[];
  activeId: string;
  onItemClick: (id: string) => void;
}

export default function TableOfContents({ items, activeId, onItemClick }: TableOfContentsProps) {
  const navId = useId();

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      id={navId}
      className="fixed right-8 top-1/2 -translate-y-1/2 hidden xl:block max-w-xs z-10"
      aria-label="목차"
    >
      <div className="space-y-1">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const paddingClass = item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-4' : 'pl-8';
          
          return (
            <button
              key={`${navId}-${item.id}-${index}`}
              onClick={() => onItemClick(item.id)}
              className={`
                block w-full text-left py-2 px-3 text-sm transition-all duration-200
                ${paddingClass}
                ${isActive 
                  ? 'text-sky-600 dark:text-sky-400 opacity-100 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 opacity-50 hover:opacity-100'
                }
                bg-transparent border-none
              `}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <span className="line-clamp-2">
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}