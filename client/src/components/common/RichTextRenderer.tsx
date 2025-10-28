import type { RichText, TextSegment, TextStyle } from '../../types';

interface RichTextRendererProps {
  content: RichText;
  className?: string;
}

function getStyleClasses(styles?: TextStyle): string {
  if (!styles) return '';

  const classes: string[] = [];

  // 텍스트 스타일
  if (styles.bold) classes.push('font-bold');
  if (styles.italic) classes.push('italic');
  if (styles.underline) classes.push('underline');
  if (styles.strikethrough) classes.push('line-through');
  if (styles.code) classes.push('font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm');

  // 텍스트 색상
  const colorClasses: Record<NonNullable<TextStyle['color']>, string> = {
    default: '',
    gray: 'text-gray-600 dark:text-gray-400',
    brown: 'text-amber-700 dark:text-amber-400',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
    red: 'text-red-600 dark:text-red-400',
  };

  // 배경색
  const backgroundClasses: Record<NonNullable<TextStyle['backgroundColor']>, string> = {
    default: '',
    gray: 'bg-gray-200 dark:bg-gray-700',
    brown: 'bg-amber-200 dark:bg-amber-900/30',
    orange: 'bg-orange-200 dark:bg-orange-900/30',
    yellow: 'bg-yellow-200 dark:bg-yellow-900/30',
    green: 'bg-green-200 dark:bg-green-900/30',
    blue: 'bg-blue-200 dark:bg-blue-900/30',
    purple: 'bg-purple-200 dark:bg-purple-900/30',
    pink: 'bg-pink-200 dark:bg-pink-900/30',
    red: 'bg-red-200 dark:bg-red-900/30',
  };

  if (styles.color && styles.color !== 'default') {
    classes.push(colorClasses[styles.color]);
  }

  if (styles.backgroundColor && styles.backgroundColor !== 'default') {
    classes.push(backgroundClasses[styles.backgroundColor], 'px-1');
  }

  return classes.join(' ');
}

export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  // 단순 문자열인 경우
  if (typeof content === 'string') {
    return <span className={className}>{content}</span>;
  }

  // 리치 텍스트 세그먼트 배열인 경우
  return (
    <span className={className}>
      {content.map((segment: TextSegment, index: number) => (
        <span key={index} className={getStyleClasses(segment.styles)}>
          {segment.text}
        </span>
      ))}
    </span>
  );
}