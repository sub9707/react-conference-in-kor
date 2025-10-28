import { useId } from 'react';
import type { CodeBlock as CodeBlockType } from '../../types';

interface CodeBlockProps {
  block: CodeBlockType;
}

export default function CodeBlock({ block }: CodeBlockProps) {
  const codeId = useId();

  return (
    <div id={codeId} className="my-6 rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-950">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-400">{block.language}</span>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-100 font-mono">{block.content}</code>
      </pre>
    </div>
  );
}