import React from 'react';
import * as Icons from 'lucide-react';
import './UI.css';

// Safe dynamic icon resolver
export const DynamicIcon = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (Icons[name as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ size?: number; className?: string }>;
  return <IconComponent size={size} className={className} />;
};

interface IconCardProps {
  label: string;
  description: string;
  iconName: string;
  isSelected: boolean;
  onClick: () => void;
}

export const IconCard: React.FC<IconCardProps> = ({
  label,
  description,
  iconName,
  isSelected,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`icon-card ${isSelected ? 'selected animate-scale-up' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <div className="icon-card-icon-container">
        <DynamicIcon name={iconName} size={28} />
      </div>
      <div className="icon-card-label">{label}</div>
      <div className="icon-card-desc">{description}</div>
    </button>
  );
};
