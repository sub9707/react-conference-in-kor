import { useState, useEffect, useRef, useId } from 'react';
import type { TextStyle } from '../../types';

interface FloatingToolbarProps {
  onStyleChange: (style: Partial<TextStyle>) => void;
}

export default function FloatingToolbar({ onStyleChange }: FloatingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const toolbarId = useId();

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || selection.toString().trim() === '') {
        setIsVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // 툴바 위치 계산
      const toolbarHeight = 48;
      const top = rect.top + window.scrollY - toolbarHeight - 8;
      const left = rect.left + window.scrollX + rect.width / 2;

      setPosition({ top, left });
      setIsVisible(true);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  if (!isVisible) return null;

  const ToolbarButton = ({ 
    onClick, 
    icon, 
    label 
  }: { 
    onClick: () => void; 
    icon: React.ReactNode; 
    label: string;
  }) => (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      title={label}
      type="button"
    >
      {icon}
    </button>
  );

  const ColorButton = ({ 
    color, 
    label 
  }: { 
    color: TextStyle['color']; 
    label: string;
  }) => {
    const colorMap: Record<string, string> = {
      default: 'bg-gray-900 dark:bg-gray-100',
      gray: 'bg-gray-500',
      brown: 'bg-amber-700',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      red: 'bg-red-500',
    };

    return (
      <button
        onClick={() => onStyleChange({ color })}
        className="w-6 h-6 rounded-full hover:ring-2 ring-gray-400 dark:ring-gray-600 transition-all"
        title={label}
        type="button"
      >
        <div className={`w-full h-full rounded-full ${colorMap[color || 'default']}`} />
      </button>
    );
  };

  return (
    <div
      ref={toolbarRef}
      id={toolbarId}
      className="fixed z-50 flex items-center gap-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1.5 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      {/* 굵게 */}
      <ToolbarButton
        onClick={() => onStyleChange({ bold: true })}
        label="굵게 (Ctrl+B)"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        }
      />

      {/* 기울임 */}
      <ToolbarButton
        onClick={() => onStyleChange({ italic: true })}
        label="기울임 (Ctrl+I)"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="19" y1="4" x2="10" y2="4" strokeWidth={2} strokeLinecap="round" />
            <line x1="14" y1="20" x2="5" y2="20" strokeWidth={2} strokeLinecap="round" />
            <line x1="15" y1="4" x2="9" y2="20" strokeWidth={2} strokeLinecap="round" />
          </svg>
        }
      />

      {/* 밑줄 */}
      <ToolbarButton
        onClick={() => onStyleChange({ underline: true })}
        label="밑줄 (Ctrl+U)"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3v10a5 5 0 0010 0V3M5 21h14" />
          </svg>
        }
      />

      {/* 취소선 */}
      <ToolbarButton
        onClick={() => onStyleChange({ strikethrough: true })}
        label="취소선"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M8 5v7m8-7v7m-6 7h4" />
          </svg>
        }
      />

      {/* 코드 */}
      <ToolbarButton
        onClick={() => onStyleChange({ code: true })}
        label="코드"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
      />

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* 색상 선택 */}
      <div className="flex items-center gap-1">
        <ColorButton color="default" label="기본" />
        <ColorButton color="gray" label="회색" />
        <ColorButton color="brown" label="갈색" />
        <ColorButton color="orange" label="주황" />
        <ColorButton color="yellow" label="노랑" />
        <ColorButton color="green" label="초록" />
        <ColorButton color="blue" label="파랑" />
        <ColorButton color="purple" label="보라" />
        <ColorButton color="pink" label="분홍" />
        <ColorButton color="red" label="빨강" />
      </div>
    </div>
  );
}