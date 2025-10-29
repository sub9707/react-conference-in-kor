import { useEditor } from '../../contexts/EditorContext';
import type { Block } from '../../types';

interface BlockTypeMenuProps {
  blockId: string;
  onClose: () => void;
}

export default function BlockTypeMenu({ blockId, onClose }: BlockTypeMenuProps) {
  const { updateBlock, deleteBlock, addBlock } = useEditor();

  const changeType = (type: Block['type'], additionalProps?: Partial<Block>) => {
    deleteBlock(blockId);
    addBlock(undefined, type);
    onClose();
  };

  const menuItems = [
    { icon: '📝', label: '텍스트', type: 'paragraph' as const },
    { icon: 'H1', label: '제목 1', type: 'heading' as const, props: { level: 1 } },
    { icon: 'H2', label: '제목 2', type: 'heading' as const, props: { level: 2 } },
    { icon: 'H3', label: '제목 3', type: 'heading' as const, props: { level: 3 } },
    { icon: '•', label: '글머리 기호', type: 'list' as const, props: { listType: 'bullet' } },
    { icon: '1.', label: '번호 매기기', type: 'list' as const, props: { listType: 'numbered' } },
    { icon: '<>', label: '코드', type: 'code' as const },
    { icon: '💡', label: 'Callout', type: 'callout' as const },
    { icon: '🖼️', label: '이미지', type: 'image' as const },
    { icon: '🎬', label: '비디오', type: 'video' as const },
  ];

  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-2 animate-slideIn">
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={() => changeType(item.type, item.props)}
          className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
        >
          <span className="text-xl w-6 text-center">{item.icon}</span>
          <span className="text-sm font-medium text-light-text dark:text-dark-text">{item.label}</span>
        </button>
      ))}
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}