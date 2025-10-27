// server/src/routes/admin.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateArticle, validateArticleUpdate } from '../middleware/validation.js';
import {
  getAllArticlesForAdmin,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublish
} from '../controllers/articleController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/articles', getAllArticlesForAdmin);
router.get('/articles/:id', getArticleById);
router.post('/articles', validateArticle, createArticle);
router.patch('/articles/:id', validateArticleUpdate, updateArticle);
router.delete('/articles/:id', deleteArticle);
router.post('/articles/:id/publish', togglePublish);

export default router;