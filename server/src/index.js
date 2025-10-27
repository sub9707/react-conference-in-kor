// server/src/index.js
import dotenv from 'dotenv';
import app from './app.js';
import { testConnection } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// 데이터베이스 연결 테스트
testConnection()
  .then(() => {
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});