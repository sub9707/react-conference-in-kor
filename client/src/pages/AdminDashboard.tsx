import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EditorProvider } from '../contexts/EditorContext';

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <EditorProvider>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        {/* Outlet이 자식 Route 렌더링 담당 */}
        <Outlet />
      </div>
    </EditorProvider>
  );
}
