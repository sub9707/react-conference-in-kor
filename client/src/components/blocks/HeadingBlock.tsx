import type { HeadingBlock as HeadingBlockType } from '../../types';
import RichTextRenderer from '../common/RichTextRenderer';

interface HeadingBlockProps {
  block: HeadingBlockType;
}

export default function HeadingBlock({ block }: HeadingBlockProps) {
  const { id, level, content } = block;

  const baseClass = "font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8 scroll-mt-24";
  
  const Component: React.ElementType = `h${level}`;
  const sizeClasses = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl"
  };

  return (
    <Component id={id} className={`${baseClass} ${sizeClasses[level]}`}>
      <RichTextRenderer content={content} />
    </Component>
  );
}