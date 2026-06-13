import React, { useState } from 'react';
import { Calculator } from './components/Calculator';
import { HistoryDashboard } from './components/HistoryDashboard';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { Sprout, LogIn, LogOut, History, User as UserIcon } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
  const { user, logout, isFirebaseActive } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleToggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    <div className="app-container">
      {/* Background visual elements */}
      <div className="bg-glow-spot-1" />
      <div className="bg-glow-spot-2" />

      {/* Header Bar */}
      <header className="app-header">
        <div className="container header-inner">
          <div className="app-brand" onClick={() => { setShowHistory(false); }}>
            <Sprout size={28} className="brand-logo-icon" />
            <span className="brand-text">CarbonTree</span>
          </div>

          <div className="header-actions">
            {isFirebaseActive && (
              <>
                {user ? (
                  <div className="user-profile-menu">
                    <div className="user-info">
                      <UserIcon size={16} className="text-emerald" />
                      <span className="user-name">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                    </div>

                    <button 
                      type="button" 
                      className={`btn-header-action btn-history ${showHistory ? 'active' : ''}`}
                      onClick={handleToggleHistory}
                      title={showHistory ? "View Calculator" : "View History"}
                    >
                      <History size={16} />
                      {showHistory ? 'Calculator' : 'My History'}
                    </button>

                    <button 
                      type="button" 
                      className="btn-header-action btn-logout"
                      onClick={async () => {
                        await logout();
                        setShowHistory(false);
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
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
        {showHistory && user ? (
          <HistoryDashboard onViewCalculator={() => setShowHistory(false)} />
        ) : (
          <Calculator />
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
