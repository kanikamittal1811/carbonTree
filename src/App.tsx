import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Calculator } from './components/Calculator';
import { HistoryDashboard } from './components/HistoryDashboard';
import { Challenges } from './components/Challenges';
import { Resources } from './components/Resources';
import { About } from './components/About';
import { AuthModal } from './components/AuthModal';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { ROUTES } from './utils/constants';
import './App.css';

const ResourcesWrapper: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSection = searchParams.get('section') as 'methodology' | 'blog' | 'offset' | null;
  return (
    <Resources
      initialSection={initialSection}
      onClearSection={() => {
        setSearchParams({}, { replace: true });
      }}
    />
  );
};

const App: React.FC = () => {
  const { user, isFirebaseActive } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-forest-deep selection:bg-eco-green/20">
      <NavBar onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-1 w-full pt-16 z-10">
        <Routes>
          <Route 
            path={ROUTES.HOME} 
            element={<Calculator onViewChallenges={() => navigate(ROUTES.CHALLENGES)} />} 
          />
          <Route 
            path={ROUTES.CALCULATE} 
            element={<Calculator onViewChallenges={() => navigate(ROUTES.CHALLENGES)} />} 
          />
          <Route 
            path={ROUTES.CHALLENGES} 
            element={<Challenges onStartCalculator={() => navigate(ROUTES.HOME)} />} 
          />
          <Route 
            path={ROUTES.HISTORY} 
            element={isFirebaseActive && user ? (
              <HistoryDashboard onViewCalculator={() => navigate(ROUTES.HOME)} />
            ) : (
              <Navigate to={ROUTES.HOME} replace />
            )} 
          />
          <Route 
            path={ROUTES.RESOURCES} 
            element={<ResourcesWrapper />} 
          />
          <Route 
            path={ROUTES.ABOUT} 
            element={<About onStartCalculator={() => navigate(ROUTES.HOME)} />} 
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default App;
