import { useEffect, useState, useTransition } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../api/admin';
import { useEditor } from '../contexts/EditorContext';
import MetadataForm from '../components/editor/MetadataForm';
import BlockEditor from '../components/editor/BlockEditor';

function EditorContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, loadArticle, createNewArticle, getContent, isDirty, updateMetadata } = useEditor();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 기존 글 로드 또는 새 글 생성
  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        if (id) {
          const loadedArticle = await adminApi.getArticle(parseInt(id));
          if (!cancelled) loadArticle(loadedArticle);
        } else {
          if (!cancelled) createNewArticle();
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || '글을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = () => {
    if (!article) return;

    startTransition(() => {
      setSaveStatus('saving');

      (async () => {
        try {
          const content = getContent();

          if (article.id === 0) {
            // 새 글 생성
            const result = await adminApi.createArticle({
              ...article,
              content,
            });
            updateMetadata({ id: result.id });
            setSaveStatus('saved');
            setTimeout(() => navigate(`/admin/edit/${result.id}`), 1000);
          } else {
            // 기존 글 수정
            await adminApi.updateArticle(article.id, {
              ...article,
              content,
            });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 2000);
          }
        } catch (err) {
          console.error('Save error:', err);
          setSaveStatus('error');
          setTimeout(() => setSaveStatus(null), 3000);
        }
      })();
    });
  };

  const handlePublishToggle = () => {
    if (!article || article.id === 0) return;

    startTransition(() => {
      (async () => {
        try {
          await adminApi.togglePublish(article.id, !article.published);
          updateMetadata({ published: !article.published });
        } catch (err) {
          console.error('Publish error:', err);
        }
      })();
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-light-text dark:text-dark-text">글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <Link 
          to="/admin" 
          className="text-light-text dark:text-dark-text hover:text-purple-600 transition-colors"
        >
          ← 목록으로
        </Link>
        
        <div className="flex gap-3 items-center">
          {saveStatus && (
            <span className={`text-sm font-medium ${
              saveStatus === 'saved' ? 'text-green-600' :
              saveStatus === 'saving' ? 'text-blue-600' :
              'text-red-600'
            }`}>
              {saveStatus === 'saved' && '✓ 저장됨'}
              {saveStatus === 'saving' && '저장 중...'}
              {saveStatus === 'error' && '저장 실패'}
            </span>
          )}

          {article.id !== 0 && (
            <button
              onClick={handlePublishToggle}
              disabled={isPending}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                article.published
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {article.published ? '발행 취소' : '발행하기'}
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {/* 메타데이터 폼 */}
      <MetadataForm />

      {/* 블록 에디터 */}
      <div className="mt-8">
        <BlockEditor />
      </div>
    </div>
  );
}

export default EditorContent;
