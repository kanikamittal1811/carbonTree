import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

interface FooterLink {
  label: string;
  route: string;
}

const PLATFORM_LINKS: FooterLink[] = [
  { label: 'Calculator', route: ROUTES.CALCULATE },
  { label: 'Challenges', route: ROUTES.CHALLENGES },
];

const RESOURCE_LINKS: FooterLink[] = [
  { label: 'Methodology', route: `${ROUTES.RESOURCES}?section=methodology` },
  { label: 'Climate Blog', route: `${ROUTES.RESOURCES}?section=blog` },
  { label: 'Carbon Offset Guide', route: `${ROUTES.RESOURCES}?section=offset` },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'About', route: ROUTES.ABOUT },
];

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleLinkClick = (route: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(route);
    if (route === ROUTES.ABOUT) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderLinkColumn = (title: string, links: FooterLink[]) => (
    <div>
      <h4 className="text-white font-label-md text-label-md uppercase tracking-widest mb-6">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.route}>
            <a 
              className="hover:text-eco-green transition-colors font-body-md text-left text-white/70 inline-block" 
              href="#"
              onClick={(e) => handleLinkClick(link.route, e)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-forest-deep text-white/80 py-16 px-margin-mobile md:px-8 lg:px-margin-desktop border-t border-white/5 z-20">
      <div className="max-w-container-max mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Branding Column */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-eco-green" style={{ fontSize: '24px' }}>park</span>
            <span className="font-headline-md text-headline-md font-bold text-white">Carbon Tree</span>
          </div>
          <p className="font-body-md text-body-md mb-6 max-w-xs text-white/70">
            Empowering individuals and organizations to reach net-zero through transparency and action.
          </p>
          <div className="flex gap-4 items-center">
            <button 
              type="button"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-white ${
                copied ? 'bg-eco-green scale-105' : 'bg-white/5 hover:bg-eco-green hover:scale-105'
              }`}
              onClick={handleShareClick}
              aria-label="Share website link"
            >
              <span className="material-symbols-outlined text-[20px]">
                {copied ? 'done' : 'share'}
              </span>
            </button>
            {copied && (
              <span className="text-xs text-eco-green font-semibold animate-fade-in">
                Link copied!
              </span>
            )}
          </div>
        </div>

        {/* Links Columns */}
        {renderLinkColumn('Platform', PLATFORM_LINKS)}
        {renderLinkColumn('Resources', RESOURCE_LINKS)}
        {renderLinkColumn('Legal', LEGAL_LINKS)}
      </div>

      {/* Dynamic Disclaimer Section */}
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
  );
};
