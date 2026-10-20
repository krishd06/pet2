import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AdvisorWidget from './components/AdvisorWidget.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import QuestionnairePage from './pages/QuestionnairePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import ExplorePetsPage from './pages/ExplorePetsPage.jsx';
import PetDetailPage from './pages/PetDetailPage.jsx';
import AdoptableAnimalsPage from './pages/AdoptableAnimalsPage.jsx';
import TrialFosterPage from './pages/TrialFosterPage.jsx';
import First30DaysPage from './pages/First30DaysPage.jsx';
import AdvisorPage from './pages/AdvisorPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-sand-50">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quiz" element={<QuestionnairePage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/pets" element={<ExplorePetsPage />} />
          <Route path="/pets/:slug" element={<PetDetailPage />} />
          <Route path="/adopt" element={<AdoptableAnimalsPage />} />
          <Route path="/foster" element={<TrialFosterPage />} />
          <Route path="/first-30-days" element={<First30DaysPage />} />
          <Route path="/advisor" element={<AdvisorPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Floating AI Advisor Widget available across all pages */}
      <AdvisorWidget />

      <Footer />
    </div>
  );
}
