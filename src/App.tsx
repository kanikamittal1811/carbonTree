import React, { useState } from 'react';
import { Calculator } from './components/Calculator';
import { HistoryDashboard } from './components/HistoryDashboard';
import { Challenges } from './components/Challenges';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { Sprout, LogIn, LogOut, History, User as UserIcon, Trophy } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
  const { user, logout, isFirebaseActive } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'calculator' | 'challenges' | 'history'>('calculator');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  return (
    <div className="app-container">
      {/* Background visual elements */}
      <div className="bg-glow-spot-1" />
      <div className="bg-glow-spot-2" />

      {/* Header Bar */}
      <header className="app-header">
        <div className="container header-inner">
          <div className="app-brand" onClick={() => { setCurrentView('calculator'); }}>
            <Sprout size={28} className="brand-logo-icon" />
            <span className="brand-text">CarbonTree</span>
          </div>

          <div className="header-actions">
            {/* Eco Challenges Tab (always visible to everyone) */}
            <button 
              type="button" 
              className={`btn-header-action btn-challenges ${currentView === 'challenges' ? 'active' : ''}`}
              onClick={() => setCurrentView('challenges')}
              title="Eco Challenges"
            >
              <Trophy size={16} />
              Challenges
            </button>

            {isFirebaseActive && (
              <>
                {user ? (
                  <div className="user-profile-menu">
                    <button 
                      type="button" 
                      className={`btn-header-action btn-history ${currentView === 'history' ? 'active' : ''}`}
                      onClick={() => setCurrentView('history')}
                      title="My History"
                    >
                      <History size={16} />
                      My History
                    </button>

                    <div 
                      className={`user-profile-dropdown-container ${isProfileOpen ? 'open' : ''}`}
                      onMouseEnter={() => setIsProfileOpen(true)}
                      onMouseLeave={() => setIsProfileOpen(false)}
                    >
                      <button 
                        type="button" 
                        className="btn-profile-trigger"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        title="User Settings"
                      >
                        <UserIcon size={18} className="text-emerald" />
                      </button>
                      
                      <div className="user-dropdown-menu">
                        <div className="user-dropdown-info">
                          <span className="user-dropdown-title">Logged in as</span>
                          <span className="user-dropdown-name">
                            {user.displayName || user.email?.split('@')[0] || 'User'}
                          </span>
                        </div>
                        
                        <div className="dropdown-divider" />
                        
                        <button 
                          type="button" 
                          className="btn-dropdown-action btn-logout"
                          onClick={async () => {
                            setIsProfileOpen(false);
                            await logout();
                            setCurrentView('calculator');
                          }}
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="btn-header-action btn-login"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                )}
              </>
            )}

            {!isFirebaseActive && (
              <div className="badge-status">
                <span className="badge-status-dot offline animate-pulse-glow" />
                Local Mode
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main assessment body */}
      <main className="app-main container">
        {currentView === 'history' && user ? (
          <HistoryDashboard onViewCalculator={() => setCurrentView('calculator')} />
        ) : currentView === 'challenges' ? (
          <Challenges onStartCalculator={() => setCurrentView('calculator')} />
        ) : (
          <Calculator onViewChallenges={() => setCurrentView('challenges')} />
        )}
      </main>

      {/* Footer disclaimer and references */}
      <footer className="app-footer">
        <div className="container footer-inner">
          <p>
            This calculator estimates carbon impact based on global baseline data and standard 22 kg CO₂/tree absorption metrics.
          </p>
          <p>
            {user ? (
              <span>☁️ <strong>Cloud Saving Active:</strong> Your assessments are saved securely to your account.</span>
            ) : (
              <span>🔒 <strong>Privacy First (Guest Mode):</strong> Your selections are kept local. Sign in to save assessments to history.</span>
            )}
          </p>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default App;
