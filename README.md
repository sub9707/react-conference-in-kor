# React Conference Learning App

React 컨퍼런스 내용을 한국어로 학습하는 블로그 플랫폼

## 기술 스택

### Frontend
- React 18
- React Router
- Tiptap (노션 스타일 에디터)
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication

## 프로젝트 구조

```
react-conference-learning/
├── client/          # React 클라이언트
└── server/          # Node.js 서버
```

## 시작하기

### 1. 의존성 설치

```bash
# 클라이언트
cd client
npm install

# 서버
cd ../server
npm install
```

### 2. 환경 변수 설정

```bash
# client/.env
cp .env.example .env

# server/.env
cp .env.example .env
```

### 3. 데이터베이스 설정

```bash
# MySQL 데이터베이스 생성
mysql -u root -p
CREATE DATABASE react_conference;

# 마이그레이션 실행
cd server
npm run migrate
```

### 4. 개발 서버 실행

```bash
# 터미널 1 - 서버
cd server
npm run dev

# 터미널 2 - 클라이언트
cd client
npm run dev
```

## 주요 기능

- ✅ 연도별 React 컨퍼런스 글 리스트
- ✅ 상세 글 읽기 (블록 기반 렌더링)
- ✅ 관리자 페이지 (노션 스타일 에디터)
- ✅ 실시간 자동 저장
- ✅ 슬래시 커맨드 지원

## 라이선스

MIT
