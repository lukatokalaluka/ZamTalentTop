import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home/HomePage';
import DiscoverPage from './pages/Discover/DiscoverPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import ProfilePage from './pages/Profile/ProfilePage';
import MarketplacePage from './pages/Marketplace/MarketplacePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import BookingPage from './pages/Booking/BookingPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function Toast({ message }) {
  if (!message) return null;

  return <div className="toast">{message}</div>;
}

function AppLayout({ theme, onToggleTheme, onShowToast }) {
  return (
    <>
      <Header theme={theme} onToggleTheme={onToggleTheme} onShowToast={onShowToast} />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage onShowToast={onShowToast} />} />
          <Route path="/discover" element={<DiscoverPage onShowToast={onShowToast} />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/login" element={<LoginPage onShowToast={onShowToast} />} />
          <Route path="/register" element={<RegisterPage onShowToast={onShowToast} />} />
          <Route path="/dashboard" element={<DashboardPage onShowToast={onShowToast} />} />
          <Route path="/booking/:slug" element={<BookingPage />} />
          <Route path="/talent/:slug" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const handleShowToast = (message) => {
    setToast(message);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onShowToast={handleShowToast}
      />
      <Toast message={toast} />
    </BrowserRouter>
  );
}

export default App;
