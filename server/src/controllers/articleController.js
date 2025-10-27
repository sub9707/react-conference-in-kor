// server/src/controllers/articleController.js
import Article from '../models/Article.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// 공개된 모든 글 조회
export const getAllArticles = asyncHandler(async (req, res) => {
  const { year, tag, limit, offset } = req.query;
  
  const filters = {};
  if (year) filters.year = parseInt(year);
  if (tag) filters.tag = tag;
  if (limit) filters.limit = parseInt(limit);
  if (offset) filters.offset = parseInt(offset);

  const articles = await Article.findAll(filters);

  res.json({
    success: true,
    data: articles,
    count: articles.length
  });
});

// slug로 글 조회
export const getArticleBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  
  const article = await Article.findBySlug(slug);
  
  if (!article) {
    throw new AppError('글을 찾을 수 없습니다', 404);
  }

  res.json({
    success: true,
    data: article
  });
});

// 연도별 통계
export const getYearStats = asyncHandler(async (req, res) => {
  const stats = await Article.getYearStats();

  res.json({
    success: true,
    data: stats
  });
});

// 모든 태그 조회
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Article.getAllTags();

  res.json({
    success: true,
    data: tags
  });
});

// ===== 관리자 전용 =====

// 관리자용 - 모든 글 조회 (비공개 포함)
export const getAllArticlesForAdmin = asyncHandler(async (req, res) => {
  const { published } = req.query;
  
  const filters = {};
  if (published !== undefined) {
    filters.published = published === 'true';
  }

  const articles = await Article.findAllForAdmin(filters);

  res.json({
    success: true,
    data: articles,
    count: articles.length
  });
});

// ID로 글 조회 (관리자용)
export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const article = await Article.findById(parseInt(id));
  
  if (!article) {
    throw new AppError('글을 찾을 수 없습니다', 404);
  }

  res.json({
    success: true,
    data: article
  });
});

// 글 생성
export const createArticle = asyncHandler(async (req, res) => {
  const articleData = req.body;
  
  // slug 중복 체크
  const existingArticle = await Article.findBySlug(articleData.slug);
  if (existingArticle) {
    throw new AppError('이미 사용 중인 슬러그입니다', 409);
  }

  const articleId = await Article.create(articleData);

  res.status(201).json({
    success: true,
    message: '글이 생성되었습니다',
    data: { id: articleId }
  });
});

// 글 수정
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // 글 존재 확인
  const existingArticle = await Article.findById(parseInt(id));
  if (!existingArticle) {
    throw new AppError('글을 찾을 수 없습니다', 404);
  }

  // slug 변경 시 중복 체크
  if (updateData.slug && updateData.slug !== existingArticle.slug) {
    const duplicateSlug = await Article.findBySlug(updateData.slug);
    if (duplicateSlug) {
      throw new AppError('이미 사용 중인 슬러그입니다', 409);
    }
  }

  const updated = await Article.update(parseInt(id), updateData);

  if (!updated) {
    throw new AppError('글 수정에 실패했습니다', 500);
  }

  res.json({
    success: true,
    message: '글이 수정되었습니다'
  });
});

// 글 삭제
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Article.delete(parseInt(id));

  if (!deleted) {
    throw new AppError('글을 찾을 수 없습니다', 404);
  }

  res.json({
    success: true,
    message: '글이 삭제되었습니다'
  });
});

// 글 발행/발행 취소
export const togglePublish = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { published } = req.body;

  const article = await Article.findById(parseInt(id));
  if (!article) {
    throw new AppError('글을 찾을 수 없습니다', 404);
  }

  await Article.update(parseInt(id), { published });

  res.json({
    success: true,
    message: published ? '글이 발행되었습니다' : '발행이 취소되었습니다'
  });
});