import { createContext, useContext, useState, ReactNode, useTransition, useId, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import type { Block, Article, ArticleContent } from '../types';

interface EditorContextType {
  article: Article | null;
  blocks: Block[];
  isPending: boolean;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  createNewArticle: () => void;
  loadArticle: (article: Article) => void;
  updateMetadata: (data: Partial<Article>) => void;
  addBlock: (afterBlockId?: string, type?: Block['type']) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (fromId: string, toId: string) => void;
  getContent: () => ArticleContent;
  saveNow: () => Promise<void>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const AUTO_SAVE_DELAY = 2000;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();
  const baseId = useId();
  const autoSaveTimerRef = useRef<number | null>(null);
  
  const articleRef = useRef(article);
  const blocksRef = useRef(blocks);
  const isDirtyRef = useRef(isDirty);
  const tokenRef = useRef(token);

  articleRef.current = article;
  blocksRef.current = blocks;
  isDirtyRef.current = isDirty;
  tokenRef.current = token;

  const performSave = useCallback(async () => {
    const currentArticle = articleRef.current;
    const currentBlocks = blocksRef.current;
    const currentIsDirty = isDirtyRef.current;
    const currentToken = tokenRef.current;

    if (!currentArticle || !currentIsDirty || currentArticle.id === 0 || !currentToken) return;

    setIsSaving(true);

    try {
      const content = { blocks: currentBlocks };
      const updatedArticle = {
        ...currentArticle,
        content,
        updated_at: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/api/admin/articles/${currentArticle.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to save: ${response.status}`);
      }

      const savedArticle = await response.json();
      
      setArticle(savedArticle);
      setIsDirty(false);
      setLastSaved(new Date());
      
      console.log('✅ Auto-saved successfully at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current !== null) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setTimeout(() => {
      performSave();
    }, AUTO_SAVE_DELAY);
  }, [performSave]);

  const markDirtyAndScheduleSave = useCallback(() => {
    setIsDirty(true);
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  const createNewArticle = useCallback(() => {
    const now = new Date();
    const newArticle: Article = {
      id: 0,
      title: '',
      slug: '',
      year: now.getFullYear(),
      date: now.toISOString().split('T')[0],
      tags: [],
      published: false,
      view_count: 0,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const initialBlock: Block = {
      id: `${baseId}-block-0`,
      type: 'paragraph',
      content: '',
    };

    setArticle(newArticle);
    setBlocks([initialBlock]);
    setIsDirty(false);
    setLastSaved(null);
  }, [baseId]);

  const loadArticle = useCallback((loadedArticle: Article) => {
    const formattedArticle = {
      ...loadedArticle,
      date: loadedArticle.date.includes('T') 
        ? loadedArticle.date.split('T')[0] 
        : loadedArticle.date,
    };
    
    setArticle(formattedArticle);
    setBlocks(formattedArticle.content?.blocks || []);
    setIsDirty(false);
    setLastSaved(new Date(formattedArticle.updated_at));
  }, []);

  const updateMetadata = useCallback((data: Partial<Article>) => {
    setArticle(prev => prev ? { ...prev, ...data } : null);
    markDirtyAndScheduleSave();
  }, [markDirtyAndScheduleSave]);

  const addBlock = useCallback((afterBlockId?: string, type: Block['type'] = 'paragraph') => {
    setBlocks(prevBlocks => {
      const afterIndex = afterBlockId
        ? prevBlocks.findIndex((b) => b.id === afterBlockId)
        : prevBlocks.length - 1;

      let newBlock: Block;

      switch (type) {
        case 'heading':
          newBlock = { id: `${baseId}-block-${Date.now()}`, type: 'heading', level: 1, content: '' } as Block;
          break;
        case 'code':
          newBlock = { id: `${baseId}-block-${Date.now()}`, type: 'code', language: 'javascript', content: '' } as Block;
          break;
        case 'list':
          newBlock = { id: `${baseId}-block-${Date.now()}`, type: 'list', listType: 'bullet', items: [''] } as Block;
          break;
        case 'callout':
          newBlock = { id: `${baseId}-block-${Date.now()}`, type: 'callout', variant: 'info', content: '' } as Block;
          break;
        case 'image':
          newBlock = { id: `${baseId}-block-${Date.now()}`, type: 'image', url: '', alt: '' } as Block;
          break;
        case 'video':
          newBlock = { id: `${baseId}-block-${Date.now()}`, type: 'video', url: '', platform: 'youtube' } as Block;
          break;
        default:
          newBlock = { id: `${baseId}-block-${Date.now()}`, type: 'paragraph', content: '' } as Block;
      }

      return [
        ...prevBlocks.slice(0, afterIndex + 1),
        newBlock,
        ...prevBlocks.slice(afterIndex + 1),
      ];
    });
    
    markDirtyAndScheduleSave();
  }, [baseId, markDirtyAndScheduleSave]);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prevBlocks => 
      prevBlocks.map((block) =>
        block.id === id ? { ...block, ...updates } as Block : block
      )
    );
    markDirtyAndScheduleSave();
  }, [markDirtyAndScheduleSave]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prevBlocks => {
      if (prevBlocks.length === 1) return prevBlocks;
      return prevBlocks.filter((block) => block.id !== id);
    });
    markDirtyAndScheduleSave();
  }, [markDirtyAndScheduleSave]);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks(prevBlocks => {
      const blockIndex = prevBlocks.findIndex((b) => b.id === id);
      if (blockIndex === -1) return prevBlocks;

      const originalBlock = prevBlocks[blockIndex];
      const newBlock: Block = {
        ...originalBlock,
        id: `${baseId}-block-${Date.now()}`,
      } as Block;

      return [
        ...prevBlocks.slice(0, blockIndex + 1),
        newBlock,
        ...prevBlocks.slice(blockIndex + 1),
      ];
    });
    
    markDirtyAndScheduleSave();
  }, [baseId, markDirtyAndScheduleSave]);

  const moveBlock = useCallback((fromId: string, toId: string) => {
    if (fromId === toId) return;

    setBlocks(prevBlocks => {
      const fromIndex = prevBlocks.findIndex((b) => b.id === fromId);
      const toIndex = prevBlocks.findIndex((b) => b.id === toId);

      if (fromIndex === -1 || toIndex === -1) return prevBlocks;

      const newBlocks = [...prevBlocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      
      return newBlocks;
    });
    
    markDirtyAndScheduleSave();
  }, [markDirtyAndScheduleSave]);

  const getContent = useCallback((): ArticleContent => {
    return { blocks: blocksRef.current };
  }, []);

  const saveNow = useCallback(async () => {
    if (autoSaveTimerRef.current !== null) {
      window.clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    await performSave();
  }, [performSave]);

  return (
    <EditorContext.Provider
      value={{
        article,
        blocks,
        isPending,
        isDirty,
        isSaving,
        lastSaved,
        createNewArticle,
        loadArticle,
        updateMetadata,
        addBlock,
        updateBlock,
        deleteBlock,
        duplicateBlock,
        moveBlock,
        getContent,
        saveNow,
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