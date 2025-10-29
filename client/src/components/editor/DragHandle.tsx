import { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';

interface DragHandleProps {
  blockId: string;
}

export default function DragHandle({ blockId }: DragHandleProps) {
  const { duplicateBlock, deleteBlock, moveBlock } = useEditor();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('blockId', blockId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedBlockId = e.dataTransfer.getData('blockId');
    if (draggedBlockId && draggedBlockId !== blockId) {
      moveBlock(draggedBlockId, blockId);
    }
  };

  return (
    <div
      className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag handle */}
      <button
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-50' : ''
        }`}
        title="드래그하여 이동"
      >
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
          <circle cx="4" cy="3" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="4" cy="13" r="1.5" />
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={() => duplicateBlock(blockId)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="복제"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 16 16">
            <rect x="2" y="5" width="8" height="9" rx="1" strokeWidth="1.5" />
            <path d="M6 5V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" strokeWidth="1.5" />
          </svg>
        </button>
        <button
          onClick={() => deleteBlock(blockId)}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
          title="삭제"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 16 16">
            <path d="M3 4h10M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v4M10 7v4" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}