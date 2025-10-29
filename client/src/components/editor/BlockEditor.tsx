import { useState, useDeferredValue } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import type { Block } from '../../types';
import DragHandle from './DragHandle';
import BlockTypeMenu from './BlockTypeMenu';

// 각 블록 타입별 에디터
function BlockContent({ block }: { block: Block }) {
  const { updateBlock, addBlock, deleteBlock } = useEditor();
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  // RichText를 string으로 변환
  const getContentString = (content: any): string => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content.map(seg => seg.text).join('');
    }
    return '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // / 키로 타입 메뉴 열기
    if (e.key === '/' && block.type === 'paragraph' && getContentString(block.content) === '') {
      e.preventDefault();
      setShowTypeMenu(true);
      return;
    }

    // Enter로 새 블록 추가
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(block.id);
      // 다음 블록으로 포커스 이동
      setTimeout(() => {
        const nextBlock = e.currentTarget.closest('.block-wrapper')?.nextElementSibling?.querySelector('textarea, input');
        (nextBlock as HTMLElement)?.focus();
      }, 50);
    }

    // Backspace로 빈 블록 삭제
    if (e.key === 'Backspace' && (!('content' in block) || getContentString(block.content) === '')) {
      e.preventDefault();
      deleteBlock(block.id);
    }
  };

  // Paragraph
  if (block.type === 'paragraph') {
    return (
      <div className="relative">
        <textarea
          value={getContentString(block.content)}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="내용을 입력하세요. '/'를 입력하여 블록 타입 선택"
          rows={1}
          className="w-full px-2 py-1 bg-transparent border-none outline-none text-light-text dark:text-dark-text placeholder-gray-400 resize-none"
          style={{ minHeight: '32px' }}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
        {showTypeMenu && (
          <BlockTypeMenu blockId={block.id} onClose={() => setShowTypeMenu(false)} />
        )}
      </div>
    );
  }

  // Heading
  if (block.type === 'heading') {
    const HeadingTag: React.ElementType = `h${block.level}`;
    const fontSize = block.level === 1 ? 'text-3xl' : block.level === 2 ? 'text-2xl' : 'text-xl';
    
    return (
      <HeadingTag className={`${fontSize} font-bold`}>
        <input
          type="text"
          value={getContentString(block.content)}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder={`제목 ${block.level}`}
          className="w-full px-2 py-1 bg-transparent border-none outline-none text-light-text dark:text-dark-text placeholder-gray-400"
        />
      </HeadingTag>
    );
  }

  // Code
  if (block.type === 'code') {
    return (
      <div className="bg-gray-900 rounded-lg p-4 font-mono">
        <select
          value={block.language}
          onChange={(e) => updateBlock(block.id, { language: e.target.value })}
          className="mb-2 px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm border-none outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="jsx">JSX</option>
          <option value="tsx">TSX</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="python">Python</option>
        </select>
        <textarea
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          placeholder="코드를 입력하세요..."
          rows={5}
          className="w-full bg-transparent border-none outline-none text-green-400 font-mono text-sm resize-none"
        />
      </div>
    );
  }

  // List
  if (block.type === 'list') {
    return (
      <div className="space-y-2">
        {block.items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-light-text dark:text-dark-text mt-1">
              {block.listType === 'bullet' && '•'}
              {block.listType === 'numbered' && `${index + 1}.`}
              {block.listType === 'checkbox' && '☐'}
            </span>
            <input
              type="text"
              value={getContentString(item)}
              onChange={(e) => {
                const newItems = [...block.items];
                newItems[index] = e.target.value;
                updateBlock(block.id, { items: newItems });
              }}
              placeholder="항목"
              className="flex-1 px-2 py-1 bg-transparent border-none outline-none text-light-text dark:text-dark-text placeholder-gray-400"
            />
          </div>
        ))}
      </div>
    );
  }

  // Callout
  if (block.type === 'callout') {
    const colors = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
      success: 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700',
    };

    return (
      <div className={`${colors[block.variant]} border-l-4 p-4 rounded`}>
        <textarea
          value={getContentString(block.content)}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          placeholder="Callout 내용..."
          rows={2}
          className="w-full bg-transparent border-none outline-none text-light-text dark:text-dark-text placeholder-gray-400 resize-none"
        />
      </div>
    );
  }

  return <div className="text-gray-500">지원하지 않는 블록 타입</div>;
}

export default function BlockEditor() {
  const { blocks } = useEditor();
  const deferredBlocks = useDeferredValue(blocks);

  return (
    <div className="space-y-2 p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg">
      {deferredBlocks.map((block) => (
        <div key={block.id} className="block-wrapper relative group">
          <DragHandle blockId={block.id} />
          <div className="ml-0 group-hover:ml-10 transition-all duration-200">
            <BlockContent block={block} />
          </div>
        </div>
      ))}
    </div>
  );
}