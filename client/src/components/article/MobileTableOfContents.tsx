// client/src/components/article/MobileTableOfContents.tsx

import { useState, useId, useTransition } from 'react';
import type { TocItem } from '../../types';

interface MobileTableOfContentsProps {
  items: TocItem[];
  activeId: string;
  onItemClick: (id: string) => void;
}

export default function MobileTableOfContents({ items, activeId, onItemClick }: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuId = useId();

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (id: string) => {
    startTransition(() => {
      onItemClick(id);
      setIsOpen(false);
    });
  };

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 목차 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 xl:hidden z-50 p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg transition-all duration-200 active:scale-95"
        aria-label="목차 열기"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 목차 패널 */}
      <div
        id={menuId}
        className={`
          fixed bottom-0 left-0 right-0 xl:hidden z-50
          bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          max-h-[70vh] overflow-hidden
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            목차
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 목차 리스트 */}
        <div 
          className="overflow-y-auto px-6 py-4 space-y-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item, index) => {
            const isActive = item.id === activeId;
            const paddingClass = item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-4' : 'pl-8';

            return (
              <button
                key={`${menuId}-${item.id}-${index}`}
                onClick={() => handleItemClick(item.id)}
                disabled={isPending}
                className={`
                  block w-full text-left py-3 px-4 rounded-lg text-sm transition-all duration-200
                  ${paddingClass}
                  ${isActive
                    ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                  ${isPending ? 'opacity-50' : ''}
                `}
              >
                <span className="line-clamp-2">
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}