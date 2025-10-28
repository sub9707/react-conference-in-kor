// client/src/App.tsx 수정 필요
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/common/ThemeToggle';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}