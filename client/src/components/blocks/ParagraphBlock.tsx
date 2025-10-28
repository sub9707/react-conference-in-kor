import { useId } from 'react';
import type { ParagraphBlock as ParagraphBlockType } from '../../types';
import RichTextRenderer from '../common/RichTextRenderer';

interface ParagraphBlockProps {
  block: ParagraphBlockType;
}

export default function ParagraphBlock({ block }: ParagraphBlockProps) {
  const paragraphId = useId();

  return (
    <p id={paragraphId} className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
      <RichTextRenderer content={block.content} />
    </p>
  );
}