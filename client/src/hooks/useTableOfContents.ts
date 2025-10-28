// client/src/hooks/useTableOfContents.ts

import { useState, useMemo, useTransition, useId } from 'react';
import type { Block, HeadingBlock } from '../types';
import type { TocItem } from '../types';

export function useTableOfContents(blocks: Block[]) {
  const [activeId, setActiveId] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const tocId = useId();

  // heading 블록들만 추출하여 목차 생성
  const tocItems = useMemo((): TocItem[] => {
    return blocks
      .filter((block): block is HeadingBlock => block.type === 'heading')
      .map((block) => ({
        id: block.id,
        text: typeof block.content === 'string' 
          ? block.content 
          : block.content.map(seg => seg.text).join(''),
        level: block.level,
      }));
  }, [blocks]);

  // 스크롤 스파이: 현재 보이는 섹션 추적
  const handleScroll = () => {
    const headings = tocItems.map(item => {
      const element = document.getElementById(item.id);
      if (!element) return null;
      
      const rect = element.getBoundingClientRect();
      return {
        id: item.id,
        top: rect.top,
        inView: rect.top >= 0 && rect.top <= window.innerHeight / 2,
      };
    }).filter(Boolean);

    // 화면 상단에 가장 가까운 heading 찾기
    const closestHeading = headings.reduce((closest, current) => {
      if (!current) return closest;
      if (!closest) return current;
      return Math.abs(current.top) < Math.abs(closest.top) ? current : closest;
    }, headings[0]);

    if (closestHeading && closestHeading.id !== activeId) {
      startTransition(() => {
        setActiveId(closestHeading.id);
      });
    }
  };

  // 부드러운 스크롤
  const scrollToHeading = (id: string) => {
    startTransition(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 100; // 헤더 높이 고려
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  };

  return {
    tocItems,
    activeId,
    isPending,
    tocId,
    handleScroll,
    scrollToHeading,
  };
}