// server/src/routes/articles.js
import express from 'express';
import {
  getAllArticles,
  getArticleBySlug,
  getYearStats,
  getAllTags
} from '../controllers/articleController.js';

const router = express.Router();

// 공개 라우트 (인증 불필요)
router.get('/', getAllArticles);                    // GET /api/articles
router.get('/stats/years', getYearStats);            // GET /api/articles/stats/years
router.get('/tags', getAllTags);                     // GET /api/articles/tags
router.get('/:slug', getArticleBySlug);              // GET /api/articles/react-conf-2024

export default router;