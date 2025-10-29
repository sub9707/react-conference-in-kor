// client/src/components/editor/DragHandle.tsx
import { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';

interface DragHandleProps {
  blockId: string;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function ContextMenu({ x, y, onDuplicate, onDelete, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <button
        onClick={() => {
          onDuplicate();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 16">
          <rect x="2" y="5" width="8" height="9" rx="1" strokeWidth="1.5" />
          <path d="M6 5V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" strokeWidth="1.5" />
        </svg>
        <span>복제</span>
      </button>
      
      <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
      
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 16">
          <path d="M3 4h10M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v4M10 7v4" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>삭제</span>
      </button>
    </div>
  );
}

export default function DragHandle({ blockId }: DragHandleProps) {
  const { duplicateBlock, deleteBlock, moveBlock } = useEditor();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', blockId);
    
    const draggedElement = e.currentTarget.closest('.block-wrapper') as HTMLElement;
    if (draggedElement) {
      e.dataTransfer.setDragImage(draggedElement, 0, 0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedBlockId = e.dataTransfer.getData('text/plain');
    if (draggedBlockId && draggedBlockId !== blockId) {
      moveBlock(draggedBlockId, blockId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <>
      <div
        className={`absolute -left-10 top-0 h-full flex items-start pt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isDragOver ? 'opacity-100' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onContextMenu={handleContextMenu}
          className={`p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-grab active:cursor-grabbing transition-colors ${
            isDragging ? 'opacity-30' : ''
          }`}
          title="드래그하여 이동 | 우클릭으로 메뉴 열기"
          type="button"
        >
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="4" cy="3" r="1.5" />
            <circle cx="4" cy="8" r="1.5" />
            <circle cx="4" cy="13" r="1.5" />
            <circle cx="10" cy="3" r="1.5" />
            <circle cx="10" cy="8" r="1.5" />
            <circle cx="10" cy="13" r="1.5" />
          </svg>
        </button>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDuplicate={() => duplicateBlock(blockId)}
          onDelete={() => deleteBlock(blockId)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}