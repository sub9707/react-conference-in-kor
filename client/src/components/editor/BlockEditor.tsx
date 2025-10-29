// client/src/components/editor/BlockEditor.tsx
import { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import type { Block, RichText } from '../../types';
import DragHandle from './DragHandle';
import BlockTypeMenu from './BlockTypeMenu';
import RichTextEditor from './RichTextEditor';

// RichText를 string으로 변환하는 헬퍼 함수
function richTextToString(content: RichText | undefined): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  return content.map(seg => seg.text).join('');
}

function BlockContent({ block }: { block: Block }) {
  const { updateBlock, addBlock, deleteBlock } = useEditor();
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // / 키로 블록 타입 메뉴
    if (e.key === '/' && block.type === 'paragraph') {
      const target = e.target as HTMLElement;
      if (target.textContent === '') {
        e.preventDefault();
        setShowTypeMenu(true);
        return;
      }
    }

    // Enter로 새 블록 추가
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(block.id);
      setTimeout(() => {
        const next = e.currentTarget
          .closest('.block-wrapper')
          ?.nextElementSibling?.querySelector('[contenteditable], input, textarea');
        (next as HTMLElement)?.focus();
      }, 50);
    }

    // Backspace로 빈 블록 삭제
    if (e.key === 'Backspace') {
      const target = e.target as HTMLElement;
      if (target.textContent === '') {
        e.preventDefault();
        deleteBlock(block.id);
      }
    }
  };

  // --- Paragraph ---
  if (block.type === 'paragraph') {
    return (
      <div className="relative" onKeyDown={handleKeyDown}>
        <RichTextEditor
          value={richTextToString(block.content)}
          onChange={(value) => updateBlock(block.id, { content: value })}
          placeholder="내용을 입력하세요. '/'를 입력하여 블록 타입 선택"
          className="w-full px-2 py-1 bg-transparent text-light-text dark:text-dark-text min-h-[28px]"
          multiline
        />
        {showTypeMenu && (
          <BlockTypeMenu blockId={block.id} onClose={() => setShowTypeMenu(false)} />
        )}
      </div>
    );
  }

  // --- Heading ---
  if (block.type === 'heading') {
    const HeadingTag: React.ElementType = `h${block.level}`;
    const fontSize =
      block.level === 1 ? 'text-3xl' : block.level === 2 ? 'text-2xl' : 'text-xl';

    return (
      <HeadingTag className={`${fontSize} font-bold`} onKeyDown={handleKeyDown}>
        <RichTextEditor
          value={richTextToString(block.content)}
          onChange={(value) => updateBlock(block.id, { content: value })}
          placeholder={`제목 ${block.level}`}
          className="w-full px-2 py-1 bg-transparent text-light-text dark:text-dark-text"
        />
      </HeadingTag>
    );
  }

  // --- Code ---
  if (block.type === 'code') {
    const [localValue, setLocalValue] = useState(block.content || '');
    const [isComposing, setIsComposing] = useState(false);

    useEffect(() => {
      if (block.content !== localValue) {
        setLocalValue(block.content || '');
      }
    }, [block.content]);

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
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            if (!isComposing) {
              updateBlock(block.id, { content: e.target.value });
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            updateBlock(block.id, { content: e.currentTarget.value });
          }}
          placeholder="코드를 입력하세요..."
          rows={5}
          className="w-full bg-transparent border-none outline-none text-green-400 font-mono text-sm resize-none"
        />
      </div>
    );
  }

  // --- List ---
  if (block.type === 'list') {
    return (
      <div className="space-y-1">
        {block.items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-light-text dark:text-dark-text mt-1">
              {block.listType === 'bullet' && '•'}
              {block.listType === 'numbered' && `${index + 1}.`}
              {block.listType === 'checkbox' && '☐'}
            </span>
            <RichTextEditor
              value={richTextToString(item)}
              onChange={(value) => {
                const newItems = [...block.items];
                newItems[index] = value;
                updateBlock(block.id, { items: newItems });
              }}
              placeholder="항목"
              className="flex-1 px-2 py-0.5 bg-transparent text-light-text dark:text-dark-text"
            />
          </div>
        ))}
      </div>
    );
  }

  // --- Callout ---
  if (block.type === 'callout') {
    const colors = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
      success: 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700',
    };

    return (
      <div className={`${colors[block.variant]} border-l-4 p-3 rounded`}>
        <RichTextEditor
          value={richTextToString(block.content)}
          onChange={(value) => updateBlock(block.id, { content: value })}
          placeholder="Callout 내용..."
          className="w-full bg-transparent text-light-text dark:text-dark-text"
          multiline
        />
      </div>
    );
  }

  // --- Image ---
  if (block.type === 'image') {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={block.url}
          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
          placeholder="이미지 URL"
          className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        />
        <input
          type="text"
          value={block.alt}
          onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
          placeholder="이미지 설명 (alt)"
          className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        />
        {block.url && (
          <img
            src={block.url}
            alt={block.alt}
            className="max-w-full h-auto rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>
    );
  }

  // --- Video ---
  if (block.type === 'video') {
    return (
      <div className="space-y-2">
        <select
          value={block.platform}
          onChange={(e) => updateBlock(block.id, { platform: e.target.value as 'youtube' | 'vimeo' })}
          className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
        </select>
        <input
          type="text"
          value={block.url}
          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
          placeholder="비디오 URL"
          className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        />
        {block.url && (
          <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">비디오 미리보기</span>
          </div>
        )}
      </div>
    );
  }

  return <div className="text-gray-500">지원하지 않는 블록 타입</div>;
}

export default function BlockEditor() {
  const { blocks, moveBlock } = useEditor();
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ blockId: string; position: 'before' | 'after' } | null>(null);

  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      const blockWrapper = target.closest('.block-wrapper');
      if (blockWrapper) {
        const blockId = blockWrapper.getAttribute('data-block-id');
        setDraggedBlockId(blockId);
      }
    };

    const handleDragEnd = () => {
      setDraggedBlockId(null);
      setDropTarget(null);
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedBlockId || draggedBlockId === blockId) {
      return;
    }

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;
    const mouseY = e.clientY;

    const position = mouseY < midPoint ? 'before' : 'after';

    if (dropTarget?.blockId === blockId && dropTarget?.position === position) {
      return;
    }

    setDropTarget({ blockId, position });
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedBlockId || !dropTarget || draggedBlockId === targetBlockId) {
      setDropTarget(null);
      return;
    }

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlockId);
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDropTarget(null);
      return;
    }

    let finalTargetId = targetBlockId;
    
    if (dropTarget.position === 'after') {
      if (targetIndex < blocks.length - 1) {
        finalTargetId = blocks[targetIndex + 1].id;
      }
    }

    moveBlock(draggedBlockId, finalTargetId);
    setDropTarget(null);
  };

  return (
    <div className="space-y-1 p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg">
      {blocks.map((block) => {
        const isDragging = draggedBlockId === block.id;
        const showLineBefore = dropTarget?.blockId === block.id && dropTarget.position === 'before';
        const showLineAfter = dropTarget?.blockId === block.id && dropTarget.position === 'after';

        return (
          <div key={block.id} className="relative">
            {showLineBefore && (
              <div className="absolute left-0 right-0 -top-0.5 h-0.5 bg-purple-500 dark:bg-purple-400 shadow-lg shadow-purple-500/50">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full" />
              </div>
            )}

            <div
              data-block-id={block.id}
              className={`block-wrapper relative group transition-opacity duration-150 rounded-lg ${
                isDragging ? 'opacity-30' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDrop={(e) => handleDrop(e, block.id)}
            >
              <DragHandle blockId={block.id} />
              <div className="pl-0 py-0.5">
                <BlockContent block={block} />
              </div>
            </div>

            {showLineAfter && (
              <div className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-purple-500 dark:bg-purple-400 shadow-lg shadow-purple-500/50">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}