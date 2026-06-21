import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

interface NavItem {
  label: string;
  route: string;
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Challenges', route: ROUTES.CHALLENGES },
  { label: 'My History', route: ROUTES.HISTORY, requiresAuth: true },
];

interface NavBarProps {
  onOpenAuth: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ onOpenAuth }) => {
  const { user, logout, isFirebaseActive } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname;

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    navigate(ROUTES.HOME);
  };

  const handleNavClick = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  // Filter nav items based on auth state
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.requiresAuth || (isFirebaseActive && user)
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
      <nav className="flex items-center justify-between px-margin-mobile md:px-8 lg:px-margin-desktop h-16 max-w-container-max mx-auto w-full">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" 
          onClick={() => navigate(ROUTES.HOME)}
        >
          <span className="material-symbols-outlined text-eco-green" style={{ fontSize: '28px' }}>park</span>
          <span className="font-headline-md text-headline-md font-extrabold text-forest-deep tracking-tight">Carbon Tree</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {visibleItems.map((item) => (
            <button 
              key={item.route}
              type="button"
              className={`relative font-label-md text-label-md transition-colors py-1 ${
                currentView === item.route ? 'text-eco-green nav-item-active' : 'text-bark-gray hover:text-eco-green'
              }`}
              onClick={() => handleNavClick(item.route)}
            >
              {item.label}
            </button>
          ))}

          {isFirebaseActive && user ? (
            <div 
              className="relative"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <button 
                type="button"
                className="btn-profile-trigger flex items-center justify-center overflow-hidden"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="User Profile"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[20px]">person</span>
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-outline-variant/30 py-3 px-4 flex flex-col gap-2 z-50 animate-scale-up">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-bark-gray font-semibold">Logged in as</span>
                    <span className="text-sm font-semibold text-forest-deep truncate">
                      {displayName}
                    </span>
                  </div>
                  <div className="h-px bg-outline-variant/20 my-1" />
                  <button 
                    type="button" 
                    className="btn-logout flex items-center justify-center gap-2 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors text-xs font-bold"
                    onClick={handleSignOut}
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
                onClick={onOpenAuth}
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
          {visibleItems.map((item) => (
            <button 
              key={item.route}
              type="button"
              className={`text-left font-label-md text-label-md transition-colors py-2 ${
                currentView === item.route ? 'text-eco-green font-bold' : 'text-bark-gray'
              }`}
              onClick={() => handleNavClick(item.route)}
            >
              {item.label}
            </button>
          ))}

          {isFirebaseActive && user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/10">
              <div className="flex flex-col mb-2">
                <span className="text-[10px] uppercase tracking-wider text-bark-gray font-semibold">Logged in as</span>
                <span className="text-sm font-semibold text-forest-deep truncate">
                  {displayName}
                </span>
              </div>
              <button 
                type="button" 
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 rounded-full transition-colors text-xs font-bold"
                onClick={handleSignOut}
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
                  onOpenAuth();
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
  );
};
