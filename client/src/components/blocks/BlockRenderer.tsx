import { Suspense } from 'react';
import type { Block } from '../../types';
import HeadingBlock from './HeadingBlock';
import ParagraphBlock from './ParagraphBlock';
import CodeBlock from './CodeBlock';
import ListBlock from './ListBlock';
import CalloutBlock from './CalloutBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';

interface BlockRendererProps {
  block: Block;
}

function BlockFallback() {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 rounded mb-4" />
  );
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  return (
    <Suspense fallback={<BlockFallback />}>
      {block.type === 'heading' && <HeadingBlock block={block} />}
      {block.type === 'paragraph' && <ParagraphBlock block={block} />}
      {block.type === 'code' && <CodeBlock block={block} />}
      {block.type === 'list' && <ListBlock block={block} />}
      {block.type === 'callout' && <CalloutBlock block={block} />}
      {block.type === 'image' && <ImageBlock block={block} />}
      {block.type === 'video' && <VideoBlock block={block} />}
    </Suspense>
  );
}