// client/src/types.ts

export interface Article {
  id: number;
  title: string;
  slug: string;
  year: number;
  conference?: string;
  speaker?: string;
  date: string;
  summary?: string;
  tags: string[];
  video_url?: string;
  thumbnail?: string;
  content?: ArticleContent;
  published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleContent {
  blocks: Block[];
}

export type Block = 
  | HeadingBlock
  | ParagraphBlock
  | CodeBlock
  | ListBlock
  | CalloutBlock
  | ImageBlock
  | VideoBlock;

export interface HeadingBlock {
  id: string;
  type: 'heading';
  level: 1 | 2 | 3;
  content: string;
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  content: string;
}

export interface CodeBlock {
  id: string;
  type: 'code';
  language: string;
  content: string;
}

export interface ListBlock {
  id: string;
  type: 'list';
  listType: 'bullet' | 'numbered' | 'checkbox';
  items: string[];
}

export interface CalloutBlock {
  id: string;
  type: 'callout';
  variant: 'info' | 'warning' | 'error' | 'success';
  content: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export interface VideoBlock {
  id: string;
  type: 'video';
  url: string;
  platform: 'youtube' | 'vimeo';
}

export interface YearStat {
  year: number;
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ArticlesResponse extends ApiResponse<Article[]> {
  count: number;
}