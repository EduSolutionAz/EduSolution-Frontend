import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import FaqPage from './pages/FaqPage';
import CountryPage from './pages/CountryPage';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6eeee] text-[#080d4a] gap-3">
      <h1 className="text-2xl font-bold">404 — Səhifə tapılmadı</h1>
      <a href="/faq" className="underline">
        FAQ-a qayıt
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Açılışda birbaşa FAQ-a göndər */}
        <Route path="/" element={<Navigate to="/faq" replace />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route path="/country/:slug" element={<CountryPage />} />
        <Route path="/countries/:slug" element={<CountryPage />} />
        <Route path="/germany" element={<Navigate to="/country/germany" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
