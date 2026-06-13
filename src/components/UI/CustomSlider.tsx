import React from 'react';
import './UI.css';

interface SliderOption {
  label: string;
}

interface CustomSliderProps {
  options: SliderOption[];
  value: number;
  onChange: (index: number) => void;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  options,
  value,
  onChange,
}) => {
  const maxIndex = options.length - 1;
  const percentage = maxIndex > 0 ? (value / maxIndex) * 100 : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="slider-container">
      <div className="slider-track-wrapper">
        {/* Filled green track */}
        <div 
          className="slider-track-fill" 
          style={{ width: `${percentage}%` }}
        />
        
        {/* Snap nodes for each option step */}
        <div className="slider-stops">
          {options.map((_, index) => (
            <div 
              key={index} 
              className={`slider-stop-node ${index <= value ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Visible glowing thumb indicator */}
        <div 
          className="slider-thumb-indicator" 
          style={{ left: `${percentage}%` }}
        />

        {/* Underlying native input for touch and keyboard accessibility */}
        <input
          type="range"
          min="0"
          max={maxIndex}
          value={value}
          onChange={handleInputChange}
          className="slider-input"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={value}
          aria-valuetext={options[value]?.label}
        />
      </div>

      {/* Selectable label items underneath */}
      <div className="slider-labels-list">
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={`slider-label-item ${index === value ? 'active' : ''}`}
            onClick={() => onChange(index)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
