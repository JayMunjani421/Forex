import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CalculatorsPage from './pages/CalculatorsPage';
import LearnPage from './pages/LearnPage';
import ChartsPage from './pages/ChartsPage';
import AboutPage from './pages/AboutPage';
import GlossaryPage from './pages/GlossaryPage';
import MarketHoursPage from './pages/MarketHoursPage';
import BlogPage from './pages/BlogPage';
import MarketTodayPage from './pages/MarketTodayPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calculators" element={<CalculatorsPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="charts" element={<ChartsPage />} />
        <Route path="market-today" element={<MarketTodayPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="market-hours" element={<MarketHoursPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
