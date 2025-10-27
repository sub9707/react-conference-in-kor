// server/src/middleware/validation.js
import { AppError } from './errorHandler.js';

// Article 생성/수정 유효성 검사
export function validateArticle(req, res, next) {
  const { title, slug, year, content } = req.body;

  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('제목은 필수입니다');
  }

  if (!slug || slug.trim().length === 0) {
    errors.push('슬러그는 필수입니다');
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('슬러그는 소문자, 숫자, 하이픈만 사용할 수 있습니다');
  }

  if (!year || !Number.isInteger(year) || year < 2013 || year > new Date().getFullYear() + 1) {
    errors.push('올바른 연도를 입력해주세요');
  }

  if (!content) {
    errors.push('컨텐츠는 필수입니다');
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 400));
  }

  next();
}

// Article 수정 유효성 검사 (부분 업데이트)
export function validateArticleUpdate(req, res, next) {
  const { slug, year } = req.body;

  const errors = [];

  if (slug !== undefined && (slug.trim().length === 0 || !/^[a-z0-9-]+$/.test(slug))) {
    errors.push('올바른 슬러그 형식이 아닙니다');
  }

  if (year !== undefined && (!Number.isInteger(year) || year < 2013 || year > new Date().getFullYear() + 1)) {
    errors.push('올바른 연도를 입력해주세요');
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 400));
  }

  next();
}