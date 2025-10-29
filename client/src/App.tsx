import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ThemeToggle from './components/common/ThemeToggle';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ArticleEditor from './pages/ArticleEditor';
import ArticleList from './pages/ArticleList';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<ArticleList />} />          {/* /admin */}
              <Route path="new" element={<ArticleEditor />} />   {/* /admin/new */}
              <Route path="edit/:id" element={<ArticleEditor />} /> {/* /admin/edit/:id */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
