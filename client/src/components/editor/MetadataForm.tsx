import { useEditor } from '../../contexts/EditorContext';

export default function MetadataForm() {
  const { article, updateMetadata } = useEditor();

  if (!article) return null;

  return (
    <div className="space-y-6 p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg">
      {/* 제목 */}
      <div>
        <input
          type="text"
          value={article.title || ''}
          onChange={(e) => updateMetadata({ title: e.target.value })}
          placeholder="제목을 입력하세요"
          className="w-full text-4xl font-bold bg-transparent border-none outline-none text-light-text dark:text-dark-text placeholder-gray-400"
        />
      </div>

      {/* 슬러그 */}
      <div>
        <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
          슬러그 (URL)
        </label>
        <input
          type="text"
          value={article.slug || ''}
          onChange={(e) => updateMetadata({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
          placeholder="url-slug"
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        />
      </div>

      {/* 연도, 컨퍼런스 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
            연도
          </label>
          <input
            type="number"
            value={article.year || new Date().getFullYear()}
            onChange={(e) => updateMetadata({ year: parseInt(e.target.value) || new Date().getFullYear() })}
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
            컨퍼런스
          </label>
          <input
            type="text"
            value={article.conference || ''}
            onChange={(e) => updateMetadata({ conference: e.target.value })}
            placeholder="React Conf 2024"
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
          />
        </div>
      </div>

      {/* 스피커, 날짜 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
            발표자
          </label>
          <input
            type="text"
            value={article.speaker || ''}
            onChange={(e) => updateMetadata({ speaker: e.target.value })}
            placeholder="Dan Abramov"
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
            날짜
          </label>
          <input
            type="date"
            value={article.date || ''}
            onChange={(e) => updateMetadata({ date: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
          />
        </div>
      </div>

      {/* 요약 */}
      <div>
        <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
          요약
        </label>
        <textarea
          value={article.summary || ''}
          onChange={(e) => updateMetadata({ summary: e.target.value })}
          placeholder="이 글의 요약을 작성하세요"
          rows={3}
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none resize-none"
        />
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
          태그 (쉼표로 구분)
        </label>
        <input
          type="text"
          value={(article.tags || []).join(', ')}
          onChange={(e) => updateMetadata({ tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
          placeholder="React, Hooks, Performance"
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        />
      </div>

      {/* 비디오 URL */}
      <div>
        <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
          비디오 URL
        </label>
        <input
          type="url"
          value={article.video_url || ''}
          onChange={(e) => updateMetadata({ video_url: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        />
      </div>

      {/* 썸네일 */}
      <div>
        <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
          썸네일 URL
        </label>
        <input
          type="url"
          value={article.thumbnail || ''}
          onChange={(e) => updateMetadata({ thumbnail: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-light-text dark:text-dark-text focus:border-purple-500 outline-none"
        />
      </div>
    </div>
  );
}