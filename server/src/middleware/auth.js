// server/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

export function verifyPassword(password) {
  return password === process.env.ADMIN_PASSWORD;
}

export function generateToken() {
  return jwt.sign(
    { admin: true, timestamp: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('인증 토큰이 필요합니다', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) {
      return next(new AppError('관리자 권한이 필요합니다', 403));
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}