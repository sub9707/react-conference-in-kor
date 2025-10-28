import { useId } from 'react';
import type { ListBlock as ListBlockType } from '../../types';
import RichTextRenderer from '../common/Richtextrenderer';

interface ListBlockProps {
  block: ListBlockType;
}

export default function ListBlock({ block }: ListBlockProps) {
  const listId = useId();
  const { listType, items } = block;

  const ListComponent = listType === 'numbered' ? 'ol' : 'ul';
  const listClass = listType === 'numbered' 
    ? 'list-decimal list-inside space-y-2' 
    : 'list-disc list-inside space-y-2';

  return (
    <ListComponent id={listId} className={`${listClass} mb-6 text-gray-700 dark:text-gray-300 ml-4`}>
      {items.map((item, index) => (
        <li key={`${listId}-item-${index}`} className="leading-relaxed">
          <RichTextRenderer content={item} />
        </li>
      ))}
    </ListComponent>
  );
}