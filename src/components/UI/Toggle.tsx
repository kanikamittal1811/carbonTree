import React from 'react';
import { Leaf } from 'lucide-react';
import './UI.css';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
}) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      className={`toggle-wrapper ${checked ? 'checked animate-scale-up' : ''}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <div className="toggle-info">
        <div className="toggle-icon-holder">
          <Leaf size={22} />
        </div>
        <span className="toggle-label-text">{label}</span>
      </div>

      <div className="toggle-pill">
        <div className="toggle-handle" />
      </div>
    </div>
  );
};
