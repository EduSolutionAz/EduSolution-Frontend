import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import FaqPage from './pages/FaqPage';
import CountryPage from './pages/CountryPage';
import HomePage from './pages/HomePage';
import AdminLayout from './components/admin/AdminLayout';
import CountriesManager from './components/admin/CountriesManager';
import UniversitiesManager from './components/admin/UniversitiesManager';
import FacultiesManager from './components/admin/FacultiesManager';
import AdBoardManager from './components/admin/AdBoardManager';
import SpinPrizesManager from './components/admin/SpinPrizesManager';
import CommentUrlGenerator from './components/admin/CommentUrlGenerator';
import CommentPage from './pages/CommentPage';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6eeee] text-[#080d4a] gap-3">
      <h1 className="text-2xl font-bold">404 — Səhifə tapılmadı</h1>
      <a href="/" className="underline">
        Ana səhifəyə qayıt
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<AuthPage key="login" initialMode="login" />} />
        <Route path="/register" element={<AuthPage key="register" initialMode="register" />} />
         <Route path="/country/:slug" element={<CountryPage />} />
         <Route path="/countries/:slug" element={<CountryPage />} />
         <Route path="/comment/:id" element={<CommentPage />} />
         <Route path="/germany" element={<Navigate to="/country/germany" replace />} />

         <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<CountriesManager />} />
           <Route path="countries" element={<CountriesManager />} />
           <Route path="universities" element={<UniversitiesManager />} />
           <Route path="faculties" element={<FacultiesManager />} />
           <Route path="ads" element={<AdBoardManager />} />
           <Route path="prizes" element={<SpinPrizesManager />} />
           <Route path="comments" element={<CommentUrlGenerator />} />
         </Route>

         <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
