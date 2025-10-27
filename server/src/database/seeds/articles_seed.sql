-- server/src/database/seeds/articles_seed.sql

INSERT INTO articles (title, slug, year, conference, speaker, date, summary, tags, content, published) VALUES
(
  'React Server Components 소개',
  'react-server-components-intro',
  2024,
  'React Conf 2024',
  'Dan Abramov',
  '2024-05-15',
  'React Server Components의 기본 개념과 작동 원리를 살펴봅니다.',
  '["React", "Server Components", "RSC"]',
  '{
    "blocks": [
      {
        "id": "block-1",
        "type": "heading",
        "level": 1,
        "content": "React Server Components란?"
      },
      {
        "id": "block-2",
        "type": "paragraph",
        "content": "React Server Components는 서버에서 렌더링되는 새로운 컴포넌트 유형입니다. 클라이언트 번들 크기를 줄이고 서버의 리소스를 활용할 수 있습니다."
      },
      {
        "id": "block-3",
        "type": "heading",
        "level": 2,
        "content": "주요 특징"
      },
      {
        "id": "block-4",
        "type": "list",
        "listType": "bullet",
        "items": [
          "Zero Bundle Size: 서버 컴포넌트는 클라이언트 번들에 포함되지 않습니다",
          "Direct Backend Access: 데이터베이스나 파일 시스템에 직접 접근 가능",
          "Automatic Code Splitting: 컴포넌트 단위로 자동 코드 스플리팅"
        ]
      },
      {
        "id": "block-5",
        "type": "code",
        "language": "jsx",
        "content": "// Server Component\nasync function BlogPost({ id }) {\n  const post = await db.posts.findById(id);\n  return <article>{post.content}</article>;\n}"
      }
    ]
  }',
  true
),
(
  'React 19의 새로운 기능',
  'react-19-new-features',
  2024,
  'React Conf 2024',
  'Sophie Alpert',
  '2024-05-16',
  'React 19 버전에서 추가된 새로운 기능들을 알아봅니다.',
  '["React", "React 19", "New Features"]',
  '{
    "blocks": [
      {
        "id": "block-1",
        "type": "heading",
        "level": 1,
        "content": "React 19 새로운 기능"
      },
      {
        "id": "block-2",
        "type": "paragraph",
        "content": "React 19는 성능 개선과 개발자 경험 향상에 초점을 맞춘 메이저 업데이트입니다."
      },
      {
        "id": "block-3",
        "type": "heading",
        "level": 2,
        "content": "주요 변경사항"
      },
      {
        "id": "block-4",
        "type": "list",
        "listType": "bullet",
        "items": [
          "Actions: 비동기 작업을 위한 새로운 패턴",
          "use Hook: Promise를 직접 사용할 수 있는 훅",
          "Document Metadata: head 태그 관리 개선"
        ]
      }
    ]
  }',
  true
),
(
  'useTransition과 Concurrent Features',
  'use-transition-concurrent-features',
  2023,
  'React Advanced 2023',
  'Andrew Clark',
  '2023-10-20',
  'useTransition과 Concurrent 기능을 활용한 부드러운 사용자 경험 구현',
  '["React", "Concurrent", "useTransition", "Performance"]',
  '{
    "blocks": [
      {
        "id": "block-1",
        "type": "heading",
        "level": 1,
        "content": "Concurrent React 이해하기"
      },
      {
        "id": "block-2",
        "type": "paragraph",
        "content": "Concurrent React는 사용자 상호작용을 차단하지 않고 UI를 업데이트할 수 있게 해줍니다."
      },
      {
        "id": "block-3",
        "type": "code",
        "language": "jsx",
        "content": "function SearchResults() {\n  const [isPending, startTransition] = useTransition();\n  const [query, setQuery] = useState(\"\");\n\n  function handleChange(e) {\n    startTransition(() => {\n      setQuery(e.target.value);\n    });\n  }\n\n  return (\n    <>\n      <input onChange={handleChange} />\n      {isPending && <Spinner />}\n      <Results query={query} />\n    </>\n  );\n}"
      }
    ]
  }',
  true
);