-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- 메타데이터
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  year INT NOT NULL,
  conference VARCHAR(100),
  speaker VARCHAR(100),
  date DATE,
  summary TEXT,
  tags JSON,
  video_url VARCHAR(500),
  thumbnail VARCHAR(500),
  
  -- 컨텐츠 (블록 기반 JSON)
  content JSON NOT NULL,
  
  -- 관리
  published BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_year (year),
  INDEX idx_published (published),
  INDEX idx_slug (slug)
);
