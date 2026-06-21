import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      const errorObject = err as { code?: string; message?: string };
      if (errorObject.code !== 'auth/popup-closed-by-user') {
        setError(errorObject.message || 'Google authentication failed.');
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      const errorObject = err as { code?: string; message?: string };
      let friendlyError = errorObject.message || 'Authentication failed.';
      if (errorObject.code === 'auth/user-not-found' || errorObject.code === 'auth/wrong-password' || errorObject.code === 'auth/invalid-credential') {
        friendlyError = 'Invalid email or password.';
      } else if (errorObject.code === 'auth/email-already-in-use') {
        friendlyError = 'This email is already registered.';
      } else if (errorObject.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email address.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel auth-card animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="auth-header">
          <h2 className="auth-title">Join CarbonTree</h2>
          <p className="auth-subtitle">
            Create an account to save your calculations and track your carbon reduction progress over time.
          </p>
        </div>

        {error && (
          <div className="auth-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="auth-actions">
          {/* 1. Primary Action: Google Authentication */}
          <button 
            type="button" 
            className="btn-google-auth" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.64 5.64 0 0 1 8.35 13a5.64 5.64 0 0 1 5.64-5.6c1.478 0 2.825.568 3.847 1.49l3.12-3.12A9.92 9.92 0 0 0 13.99 3c-5.52 0-10 4.48-10 10s4.48 10 10 10c5.82 0 9.77-4.1 9.77-9.97 0-.67-.06-1.3-.18-1.745H12.24Z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span className="auth-divider-text">or</span>
          </div>

          {/* 2. Secondary Action: Collapsible Email Form */}
          {!showEmailForm ? (
            <button 
              type="button" 
              className="btn-toggle-email"
              onClick={() => setShowEmailForm(true)}
            >
              <Mail size={16} />
              Continue with Email & Password
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="auth-email-form">
              <div className="input-group">
                <label htmlFor="auth-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={16} />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="auth-password">Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={16} />
                  <input
                    id="auth-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-submit-email"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>

              <div className="auth-mode-switch">
                <span>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                </span>
                <button
                  type="button"
                  className="btn-mode-toggle"
                  onClick={() => setIsSignUp(!isSignUp)}
                  disabled={loading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

              <button 
                type="button" 
                className="btn-hide-email"
                onClick={() => {
                  setShowEmailForm(false);
                  setError('');
                }}
                disabled={loading}
              >
                Cancel Email Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
