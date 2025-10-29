import { useState, useId, useTransition, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const { login } = useAuth();
  const navigate = useNavigate();
  const inputId = useId();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setError('');

      const success = await login(password);

      startTransition(() => {
        if (success) {
          navigate('/admin');
        } else {
          setError('비밀번호가 올바르지 않습니다.');
          setPassword('');
        }
      });
    },
    [login, navigate, password]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900">관리자 로그인</h1>
          <p className="text-gray-600 mt-2">비밀번호를 입력하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor={inputId}
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              비밀번호
            </label>
            <input
              id={inputId}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              disabled={isPending}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            disabled={isPending || !password}
          >
            {isPending ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
