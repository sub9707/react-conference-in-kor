// server/src/controllers/authController.js
import { verifyPassword, generateToken } from '../middleware/auth.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new AppError('비밀번호를 입력해주세요', 400);
  }

  if (!verifyPassword(password)) {
    throw new AppError('비밀번호가 올바르지 않습니다', 401);
  }

  const token = generateToken();

  res.json({
    success: true,
    message: '로그인 성공',
    data: { token }
  });
});

export const verifyToken = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      admin: true,
      authenticated: true
    }
  });
});