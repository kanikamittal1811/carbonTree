import React, { useState } from 'react';
import { Calculator } from './components/Calculator';
import { HistoryDashboard } from './components/HistoryDashboard';
import { Challenges } from './components/Challenges';
import { Resources } from './components/Resources';
import { About } from './components/About';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import './App.css';

const App: React.FC = () => {
  const { user, logout, isFirebaseActive } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'calculator' | 'challenges' | 'history' | 'resources' | 'about'>('calculator');
  const [resourcesSection, setResourcesSection] = useState<'methodology' | 'blog' | 'offset' | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);


  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-forest-deep selection:bg-eco-green/20">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
        <nav className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto w-full">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => { 
              setCurrentView('calculator'); 
              // Dispatch custom event to tell Calculator to reset step if it's active
              window.dispatchEvent(new CustomEvent('reset-calculator-step'));
            }}
          >
            <span className="material-symbols-outlined text-eco-green" style={{ fontSize: '28px' }}>park</span>
            <span className="font-headline-md text-headline-md font-extrabold text-forest-deep tracking-tight">Carbon Tree</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              type="button"
              className={`relative font-label-md text-label-md transition-colors py-1 ${
                currentView === 'challenges' ? 'text-eco-green nav-item-active' : 'text-bark-gray hover:text-eco-green'
              }`}
              onClick={() => setCurrentView('challenges')}
            >
              Challenges
            </button>

            {isFirebaseActive && user && (
              <button 
                type="button"
                className={`relative font-label-md text-label-md transition-colors py-1 ${
                  currentView === 'history' ? 'text-eco-green nav-item-active' : 'text-bark-gray hover:text-eco-green'
                }`}
                onClick={() => setCurrentView('history')}
              >
                My History
              </button>
            )}

            {isFirebaseActive && user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button 
                  type="button"
                  className={`relative font-label-md text-label-md transition-colors py-1 flex items-center gap-1 ${
                    isProfileOpen ? 'text-eco-green' : 'text-bark-gray hover:text-eco-green'
                  }`}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  Profile
                  <span className="material-symbols-outlined text-[16px] transition-transform duration-200">expand_more</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-outline-variant/30 py-3 px-4 flex flex-col gap-2 z-50 animate-scale-up">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-bark-gray font-semibold">Logged in as</span>
                      <span className="text-sm font-semibold text-forest-deep truncate">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                    </div>
                    <div className="h-px bg-outline-variant/20 my-1" />
                    <button 
                      type="button" 
                      className="btn-logout flex items-center justify-center gap-2 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors text-xs font-bold"
                      onClick={async () => {
                        setIsProfileOpen(false);
                        await logout();
                        setCurrentView('calculator');
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              isFirebaseActive && (
                <button 
                  type="button"
                  className="bg-forest-deep text-white px-6 py-2 rounded-full font-label-md text-label-md hover:opacity-90 transition-all hover:scale-105"
                  onClick={() => setIsAuthOpen(true)}
                >
                  Get Started
                </button>
              )
            )}

            {!isFirebaseActive && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-eco-green/10 text-eco-green rounded-full font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse"></span>
                Local Mode
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            type="button"
            className="md:hidden p-2 text-forest-deep hover:bg-leaf-light rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant/20 bg-white/95 backdrop-blur-md px-margin-mobile py-4 flex flex-col gap-4 shadow-lg animate-fade-in z-40">
            <button 
              type="button"
              className={`text-left font-label-md text-label-md transition-colors py-2 ${
                currentView === 'challenges' ? 'text-eco-green font-bold' : 'text-bark-gray'
              }`}
              onClick={() => {
                setCurrentView('challenges');
                setIsMobileMenuOpen(false);
              }}
            >
              Challenges
            </button>

            {isFirebaseActive && user && (
              <button 
                type="button"
                className={`text-left font-label-md text-label-md transition-colors py-2 ${
                  currentView === 'history' ? 'text-eco-green font-bold' : 'text-bark-gray'
                }`}
                onClick={() => {
                  setCurrentView('history');
                  setIsMobileMenuOpen(false);
                }}
              >
                My History
              </button>
            )}

            {isFirebaseActive && user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/10">
                <div className="flex flex-col mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-bark-gray font-semibold">Logged in as</span>
                  <span className="text-sm font-semibold text-forest-deep truncate">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 rounded-full transition-colors text-xs font-bold"
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await logout();
                    setCurrentView('calculator');
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out
                </button>
              </div>
            ) : (
              isFirebaseActive && (
                <button 
                  type="button"
                  className="w-full bg-forest-deep text-white py-3 rounded-full font-label-md text-label-md text-center hover:opacity-90 transition-all"
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </button>
              )
            )}

            {!isFirebaseActive && (
              <div className="flex items-center justify-center gap-2 py-2 bg-eco-green/10 text-eco-green rounded-full font-label-sm text-label-sm font-semibold mt-2">
                <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse"></span>
                Local Mode
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main assessment body */}
      <main className="flex-1 w-full pt-16 z-10">
        {currentView === 'history' && user ? (
          <HistoryDashboard onViewCalculator={() => setCurrentView('calculator')} />
        ) : currentView === 'challenges' ? (
          <Challenges onStartCalculator={() => setCurrentView('calculator')} />
        ) : currentView === 'resources' ? (
          <Resources 
            initialSection={resourcesSection} 
            onClearSection={() => setResourcesSection(null)} 
          />
        ) : currentView === 'about' ? (
          <About onStartCalculator={() => setCurrentView('calculator')} />
        ) : (
          <Calculator onViewChallenges={() => setCurrentView('challenges')} />
        )}
      </main>

      {/* Standard Desktop/Mobile Footer */}
      <footer className="bg-forest-deep text-white/80 py-16 px-margin-mobile md:px-margin-desktop border-t border-white/5 z-20">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Branding Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-eco-green" style={{ fontSize: '24px' }}>park</span>
              <span className="font-headline-md text-headline-md font-bold text-white">Carbon Tree</span>
            </div>
            <p className="font-body-md text-body-md mb-6 max-w-xs text-white/70">
              Empowering individuals and organizations to reach net-zero through transparency and action.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-eco-green transition-colors text-white" href="#" aria-label="Share">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-eco-green transition-colors text-white" href="#" aria-label="Public Dashboard">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-label-md text-label-md uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="#"
                  className="hover:text-eco-green transition-colors font-body-md text-left text-white/70 inline-block"
                  onClick={(e) => { e.preventDefault(); setCurrentView('calculator'); }}
                >
                  Calculator
                </a>
              </li>
              <li><a className="hover:text-eco-green transition-colors font-body-md text-white/70 font-body-md text-left text-white/70" href="#">Impact Dashboard</a></li>
              <li>
                <a 
                  href="#"
                  className="hover:text-eco-green transition-colors font-body-md text-left text-white/70 inline-block"
                  onClick={(e) => { e.preventDefault(); setCurrentView('challenges'); }}
                >
                  Challenges
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-label-md text-label-md uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  className="hover:text-eco-green transition-colors font-body-md text-white/70" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('resources');
                    setResourcesSection('methodology');
                  }}
                >
                  Methodology
                </a>
              </li>
              <li>
                <a 
                  className="hover:text-eco-green transition-colors font-body-md text-white/70" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('resources');
                    setResourcesSection('blog');
                  }}
                >
                  Climate Blog
                </a>
              </li>
              <li>
                <a 
                  className="hover:text-eco-green transition-colors font-body-md text-white/70" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('resources');
                    setResourcesSection('offset');
                  }}
                >
                  Carbon Offset Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-label-md text-label-md uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  className="hover:text-eco-green transition-colors font-body-md text-white/70 inline-block" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dynamic Disclaimer Section (kept from original) */}
        <div className="max-w-container-max mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-white/50 flex flex-col gap-2">
          <p>
            This calculator estimates carbon impact based on global baseline data and standard 22 kg CO₂/tree absorption metrics.
          </p>
          <p>
            {user ? (
              <span className="inline-flex items-center gap-1 justify-center text-eco-green/90">
                <span className="material-symbols-outlined text-[14px]">cloud_done</span>
                <strong>Cloud Saving Active:</strong> Your assessments are saved securely to your account.
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 justify-center text-white/40">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <strong>Privacy First (Guest Mode):</strong> Your selections are kept local. Sign in to save assessments to history.
              </span>
            )}
          </p>
        </div>

        {/* Copyright and Status Indicator Row */}
        <div className="max-w-container-max mx-auto mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-sm text-label-sm text-white/40">© 2026 Carbon Tree </p>
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-white/40">
            <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse"></span>
            System Status: Operational
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default App;
