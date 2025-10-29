import { createContext, useContext, useState, ReactNode, useTransition, useId } from 'react';
import type { Block, Article, ArticleContent } from '../types';

interface EditorContextType {
  article: Article | null;
  blocks: Block[];
  isPending: boolean;
  isDirty: boolean;
  createNewArticle: () => void;
  loadArticle: (article: Article) => void;
  updateMetadata: (data: Partial<Article>) => void;
  addBlock: (afterBlockId?: string, type?: Block['type']) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (fromId: string, toId: string) => void;
  getContent: () => ArticleContent;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const baseId = useId();

  const createNewArticle = () => {
    const newArticle: Article = {
      id: 0,
      title: '',
      slug: '',
      year: new Date().getFullYear(),
      date: new Date().toISOString().split('T')[0],
      tags: [],
      published: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const initialBlock: Block = {
      id: `${baseId}-block-0`,
      type: 'paragraph',
      content: '',
    };

    setArticle(newArticle);
    setBlocks([initialBlock]);
    setIsDirty(false);
  };

  const loadArticle = (loadedArticle: Article) => {
    setArticle(loadedArticle);
    setBlocks(loadedArticle.content?.blocks || []);
    setIsDirty(false);
  };

  const updateMetadata = (data: Partial<Article>) => {
    if (!article) return;
    startTransition(() => {
      setArticle({ ...article, ...data });
      setIsDirty(true);
    });
  };

  const addBlock = (afterBlockId?: string, type: Block['type'] = 'paragraph') => {
    const afterIndex = afterBlockId
      ? blocks.findIndex((b) => b.id === afterBlockId)
      : blocks.length - 1;

    let newBlock: Block;

    switch (type) {
      case 'heading':
        newBlock = {
          id: `${baseId}-block-${Date.now()}`,
          type: 'heading',
          level: 1,
          content: '',
        } as Block;
        break;
      case 'code':
        newBlock = {
          id: `${baseId}-block-${Date.now()}`,
          type: 'code',
          language: 'javascript',
          content: '',
        } as Block;
        break;
      case 'list':
        newBlock = {
          id: `${baseId}-block-${Date.now()}`,
          type: 'list',
          listType: 'bullet',
          items: [''],
        } as Block;
        break;
      case 'callout':
        newBlock = {
          id: `${baseId}-block-${Date.now()}`,
          type: 'callout',
          variant: 'info',
          content: '',
        } as Block;
        break;
      case 'image':
        newBlock = {
          id: `${baseId}-block-${Date.now()}`,
          type: 'image',
          url: '',
          alt: '',
        } as Block;
        break;
      case 'video':
        newBlock = {
          id: `${baseId}-block-${Date.now()}`,
          type: 'video',
          url: '',
          platform: 'youtube',
        } as Block;
        break;
      default:
        newBlock = {
          id: `${baseId}-block-${Date.now()}`,
          type: 'paragraph',
          content: '',
        } as Block;
    }

    const updatedBlocks = [
      ...blocks.slice(0, afterIndex + 1),
      newBlock,
      ...blocks.slice(afterIndex + 1),
    ];

    startTransition(() => {
      setBlocks(updatedBlocks as Block[]);
      setIsDirty(true);
    });
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, ...updates } : block
    );

    startTransition(() => {
      setBlocks(updatedBlocks as Block[]);
      setIsDirty(true);
    });
  };

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) return;

    const updatedBlocks = blocks.filter((block) => block.id !== id);

    startTransition(() => {
      setBlocks(updatedBlocks as Block[]);
      setIsDirty(true);
    });
  };

  const duplicateBlock = (id: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === id);
    if (blockIndex === -1) return;

    const originalBlock = blocks[blockIndex];
    const newBlock: Block = {
      ...originalBlock,
      id: `${baseId}-block-${Date.now()}`,
    } as Block;

    const updatedBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      newBlock,
      ...blocks.slice(blockIndex + 1),
    ];

    startTransition(() => {
      setBlocks(updatedBlocks as Block[]);
      setIsDirty(true);
    });
  };

  const moveBlock = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    const fromIndex = blocks.findIndex((b) => b.id === fromId);
    const toIndex = blocks.findIndex((b) => b.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);

    startTransition(() => {
      setBlocks(newBlocks as Block[]);
      setIsDirty(true);
    });
  };

  const getContent = (): ArticleContent => {
    return { blocks };
  };

  return (
    <EditorContext.Provider
      value={{
        article,
        blocks,
        isPending,
        isDirty,
        createNewArticle,
        loadArticle,
        updateMetadata,
        addBlock,
        updateBlock,
        deleteBlock,
        duplicateBlock,
        moveBlock,
        getContent,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};