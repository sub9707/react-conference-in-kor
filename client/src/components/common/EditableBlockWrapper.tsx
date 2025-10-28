import { useState, type ReactNode } from 'react';
import FloatingToolbar from './FloatingToolbar';
import type { TextStyle } from '../../types';

interface EditableBlockWrapperProps {
  children: ReactNode;
  editable?: boolean;
}

export default function EditableBlockWrapper({ 
  children, 
  editable = false 
}: EditableBlockWrapperProps) {
  const [showToolbar, setShowToolbar] = useState(false);

  const handleStyleChange = (style: Partial<TextStyle>) => {
    // TODO: 실제 스타일 적용 로직
    console.log('Style change:', style);
  };

  if (!editable) {
    return <>{children}</>;
  }

  return (
    <div
      onMouseUp={() => {
        const selection = window.getSelection();
        setShowToolbar(
          !!selection && !selection.isCollapsed && selection.toString().trim() !== ''
        );
      }}
    >
      {children}
      {showToolbar && <FloatingToolbar onStyleChange={handleStyleChange} />}
    </div>
  );
}