// server/src/models/Article.js
import { query } from '../config/database.js';

class Article {
  // 모든 공개된 글 조회 (연도별 필터링 가능)
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        id, title, slug, year, conference, speaker, date, 
        summary, tags, thumbnail, view_count, created_at, updated_at
      FROM articles 
      WHERE published = true
    `;
    const params = [];

    // 연도 필터
    if (filters.year) {
      sql += ' AND year = ?';
      params.push(filters.year);
    }

    // 태그 필터
    if (filters.tag) {
      sql += ' AND JSON_CONTAINS(tags, ?)';
      params.push(JSON.stringify(filters.tag));
    }

    sql += ' ORDER BY date DESC, id DESC';

    // 페이지네이션
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }
    }

    const results = await query(sql, params);
    
    // tags를 JSON 파싱
    return results.map(article => ({
      ...article,
      tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags
    }));
  }

  // slug로 글 조회 (공개된 글만)
  static async findBySlug(slug) {
    const sql = `
      SELECT * FROM articles 
      WHERE slug = ? AND published = true
    `;
    const results = await query(sql, [slug]);
    
    if (results.length === 0) return null;
    
    const article = results[0];
    
    // 조회수 증가
    await this.incrementViewCount(article.id);
    
    return {
      ...article,
      tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags,
      content: typeof article.content === 'string' ? JSON.parse(article.content) : article.content
    };
  }

  // ID로 글 조회 (관리자용 - 비공개 포함)
  static async findById(id) {
    const sql = 'SELECT * FROM articles WHERE id = ?';
    const results = await query(sql, [id]);
    
    if (results.length === 0) return null;
    
    const article = results[0];
    return {
      ...article,
      tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags,
      content: typeof article.content === 'string' ? JSON.parse(article.content) : article.content
    };
  }

  // 글 생성
  static async create(data) {
    const sql = `
      INSERT INTO articles 
      (title, slug, year, conference, speaker, date, summary, tags, 
       video_url, thumbnail, content, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      data.title,
      data.slug,
      data.year,
      data.conference || null,
      data.speaker || null,
      data.date || null,
      data.summary || null,
      JSON.stringify(data.tags || []),
      data.video_url || null,
      data.thumbnail || null,
      JSON.stringify(data.content),
      data.published || false
    ];

    const result = await query(sql, params);
    return result.insertId;
  }

  // 글 수정
  static async update(id, data) {
    const fields = [];
    const params = [];

    // 업데이트할 필드만 추가
    if (data.title !== undefined) {
      fields.push('title = ?');
      params.push(data.title);
    }
    if (data.slug !== undefined) {
      fields.push('slug = ?');
      params.push(data.slug);
    }
    if (data.year !== undefined) {
      fields.push('year = ?');
      params.push(data.year);
    }
    if (data.conference !== undefined) {
      fields.push('conference = ?');
      params.push(data.conference);
    }
    if (data.speaker !== undefined) {
      fields.push('speaker = ?');
      params.push(data.speaker);
    }
    if (data.date !== undefined) {
      fields.push('date = ?');
      params.push(data.date);
    }
    if (data.summary !== undefined) {
      fields.push('summary = ?');
      params.push(data.summary);
    }
    if (data.tags !== undefined) {
      fields.push('tags = ?');
      params.push(JSON.stringify(data.tags));
    }
    if (data.video_url !== undefined) {
      fields.push('video_url = ?');
      params.push(data.video_url);
    }
    if (data.thumbnail !== undefined) {
      fields.push('thumbnail = ?');
      params.push(data.thumbnail);
    }
    if (data.content !== undefined) {
      fields.push('content = ?');
      params.push(JSON.stringify(data.content));
    }
    if (data.published !== undefined) {
      fields.push('published = ?');
      params.push(data.published);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const sql = `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }

  // 글 삭제
  static async delete(id) {
    const sql = 'DELETE FROM articles WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // 조회수 증가
  static async incrementViewCount(id) {
    const sql = 'UPDATE articles SET view_count = view_count + 1 WHERE id = ?';
    await query(sql, [id]);
  }

  // 연도별 통계
  static async getYearStats() {
    const sql = `
      SELECT 
        year,
        COUNT(*) as count
      FROM articles
      WHERE published = true
      GROUP BY year
      ORDER BY year DESC
    `;
    return await query(sql);
  }

  // 모든 태그 조회
  static async getAllTags() {
    const sql = 'SELECT DISTINCT tags FROM articles WHERE published = true';
    const results = await query(sql);
    
    const tagSet = new Set();
    results.forEach(row => {
      const tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
      if (Array.isArray(tags)) {
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet).sort();
  }

  // 관리자용 - 모든 글 조회 (비공개 포함)
  static async findAllForAdmin(filters = {}) {
    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (filters.published !== undefined) {
      sql += ' AND published = ?';
      params.push(filters.published);
    }

    sql += ' ORDER BY updated_at DESC';

    const results = await query(sql, params);
    
    return results.map(article => ({
      ...article,
      tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags,
      content: typeof article.content === 'string' ? JSON.parse(article.content) : article.content
    }));
  }
}

export default Article;