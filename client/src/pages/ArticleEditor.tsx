// client/src/pages/ArticleEditor.tsx
import { useEffect, useState, useTransition } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../api/admin';
import { useEditor } from '../contexts/EditorContext';
import MetadataForm from '../components/editor/MetadataForm';
import BlockEditor from '../components/editor/BlockEditor';

function SaveToast({ message, show }: { message: string; show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <span className="text-green-600 dark:text-green-400 font-medium text-sm">
        {message}
      </span>
    </div>
  );
}

function EditorContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, loadArticle, createNewArticle, getContent, isDirty, updateMetadata, isSaving, lastSaved, saveNow } = useEditor();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // 자동 저장 완료 시 토스트 표시
  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaveToast(true);
      const timer = setTimeout(() => {
        setShowSaveToast(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [lastSaved, isSaving]);

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

  const handleSave = async () => {
    if (!article || isPending) return;

    startTransition(async () => {
      setSaveStatus('saving');

      try {
        if (article.id === 0) {
          // 새 글 생성
          const content = getContent();
          const newArticle = await adminApi.createArticle({
            ...article,
            content,
          });

          loadArticle(newArticle);
          navigate(`/admin/editor/${newArticle.id}`, { replace: true });
          setSaveStatus('saved');

          setTimeout(() => setSaveStatus(null), 2000);
        } else {
          // 기존 글 업데이트 (자동 저장으로 처리됨)
          await saveNow();
          setSaveStatus('saved');

          setTimeout(() => setSaveStatus(null), 2000);
        }
      } catch (err: any) {
        console.error('Save error:', err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    });
  };

  const handlePublishToggle = async () => {
    if (!article || article.id === 0 || isPending) return;

    startTransition(async () => {
      try {
        const updatedArticle = await adminApi.togglePublish(article.id, !article.published);
        loadArticle(updatedArticle);
      } catch (err: any) {
        console.error('Publish toggle error:', err);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        <Link
          to="/admin/articles"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/admin/articles"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>목록으로</span>
        </Link>

        <div className="flex items-center gap-4">
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

      {/* 자동 저장 토스트 */}
      <SaveToast message="✓ 저장되었습니다" show={showSaveToast} />
    </div>
  );
}

export default EditorContent;