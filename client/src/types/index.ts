// client/src/types/index.ts

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

// 인라인 텍스트 스타일
export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
  backgroundColor?: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
}

// 리치 텍스트 조각
export interface TextSegment {
  text: string;
  styles?: TextStyle;
}

// 리치 텍스트 (문자열 또는 세그먼트 배열)
export type RichText = string | TextSegment[];

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
  content: RichText;
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  content: RichText;
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
  items: RichText[];
}

export interface CalloutBlock {
  id: string;
  type: 'callout';
  variant: 'info' | 'warning' | 'error' | 'success';
  content: RichText;
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