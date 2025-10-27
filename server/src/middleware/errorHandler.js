// server/src/middleware/errorHandler.js

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err, req, res, next) {
  let { statusCode = 500, message } = err;

  // 운영 환경에서는 상세 에러 숨김
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    message = 'Internal server error';
  }

  // MySQL 에러 처리
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = '이미 존재하는 데이터입니다';
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = '참조된 데이터가 존재하지 않습니다';
  }

  // JWT 에러 처리
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '유효하지 않은 토큰입니다';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '토큰이 만료되었습니다';
  }

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

// Async 핸들러 래퍼
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};