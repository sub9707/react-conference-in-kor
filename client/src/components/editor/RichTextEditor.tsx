// client/src/components/editor/RichTextEditor.tsx
import { useState, useRef, useEffect } from 'react';
import type { TextStyle } from '../../types';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

interface ToolbarPosition {
  top: number;
  left: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = '',
  multiline = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>({ top: 0, left: 0 });
  const [isComposing, setIsComposing] = useState(false);
  const isInternalUpdate = useRef(false);

  // 외부에서 값이 변경될 때만 업데이트
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (currentHtml !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleInput = () => {
    if (!isComposing && editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => {
    setIsComposing(false);
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    
    if (!selection || selection.isCollapsed || selection.toString().trim() === '') {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) {
      setShowToolbar(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    const top = rect.top + window.scrollY - 60;
    const left = rect.left + window.scrollX + rect.width / 2;

    setToolbarPosition({ top, left });
    setShowToolbar(true);
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const applyStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyColor = (color: string) => {
    const colorMap: Record<string, string> = {
      default: '#374151',
      gray: '#6B7280',
      brown: '#92400E',
      orange: '#EA580C',
      yellow: '#CA8A04',
      green: '#16A34A',
      blue: '#2563EB',
      purple: '#9333EA',
      pink: '#DB2777',
      red: '#DC2626',
    };
    applyStyle('foreColor', colorMap[color]);
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`rich-text-editor outline-none ${className}`}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        style={{
          lineHeight: multiline ? '1.6' : '1.4',
        }}
      />

      {showToolbar && (
        <Toolbar
          position={toolbarPosition}
          onBold={() => applyStyle('bold')}
          onItalic={() => applyStyle('italic')}
          onUnderline={() => applyStyle('underline')}
          onStrikethrough={() => applyStyle('strikeThrough')}
          onCode={() => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
              const code = document.createElement('code');
              try {
                const range = selection.getRangeAt(0);
                range.surroundContents(code);
                if (editorRef.current) {
                  isInternalUpdate.current = true;
                  onChange(editorRef.current.innerHTML);
                }
              } catch (e) {
                // 복잡한 선택 영역은 무시
              }
            }
          }}
          onColor={applyColor}
          onClose={() => setShowToolbar(false)}
        />
      )}
    </div>
  );
}

// Toolbar 컴포넌트는 동일...
interface ToolbarProps {
  position: ToolbarPosition;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  onCode: () => void;
  onColor: (color: string) => void;
  onClose: () => void;
}

function Toolbar({
  position,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onCode,
  onColor,
  onClose,
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setTimeout(() => {
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed) {
            onClose();
          }
        }, 100);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const ToolbarButton = ({ onClick, icon, title }: { onClick: () => void; icon: React.ReactNode; title: string }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      title={title}
      type="button"
    >
      {icon}
    </button>
  );

  return (
    <div
      ref={toolbarRef}
      className="rich-text-toolbar fixed z-50 flex items-center gap-0.5 bg-white dark:bg-gray-800 shadow-2xl rounded-lg px-2 py-1.5 border border-gray-200 dark:border-gray-700"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <ToolbarButton
        onClick={onBold}
        title="굵게 (Ctrl+B)"
        icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
          </svg>
        }
      />

      <ToolbarButton
        onClick={onItalic}
        title="기울임 (Ctrl+I)"
        icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
          </svg>
        }
      />

      <ToolbarButton
        onClick={onUnderline}
        title="밑줄 (Ctrl+U)"
        icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
          </svg>
        }
      />

      <ToolbarButton
        onClick={onStrikethrough}
        title="취소선"
        icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/>
          </svg>
        }
      />

      <ToolbarButton
        onClick={onCode}
        title="코드"
        icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
        }
      />

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

      <div className="flex items-center gap-0.5">
        {(['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'] as const).map((color) => {
          const colorMap: Record<string, string> = {
            default: 'bg-gray-700 dark:bg-gray-300',
            red: 'bg-red-600',
            orange: 'bg-orange-600',
            yellow: 'bg-yellow-600',
            green: 'bg-green-600',
            blue: 'bg-blue-600',
            purple: 'bg-purple-600',
            pink: 'bg-pink-600',
          };

          return (
            <button
              key={color}
              onMouseDown={(e) => {
                e.preventDefault();
                onColor(color);
              }}
              className="w-5 h-5 rounded hover:ring-2 ring-gray-400 dark:ring-gray-500 transition-all"
              title={color}
              type="button"
            >
              <div className={`w-full h-full rounded ${colorMap[color]}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}