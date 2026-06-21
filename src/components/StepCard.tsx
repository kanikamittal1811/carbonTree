import React from 'react';
import { Question } from '../data/questions';
import { IconCard } from './UI/IconCard';
import { CustomSlider } from './UI/CustomSlider';
import { Toggle } from './UI/Toggle';
import './Calculator.css';

interface StepCardProps {
  question: Question;
  currentValue: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  question,
  currentValue,
  onChange,
}) => {
  return (
    <div className="step-card animate-fade-in" key={question.id}>
      <div className="step-card-body">
        {question.type === 'select' && question.options && (
          <div className="options-grid">
            {question.options.map((opt) => (
              <IconCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                iconName={opt.icon}
                isSelected={currentValue === opt.value}
                onClick={() => onChange(opt.value)}
              />
            ))}
          </div>
        )}

        {question.type === 'slider' && question.sliderOptions && (
          <CustomSlider
            options={question.sliderOptions}
            value={currentValue as number}
            onChange={(index) => onChange(index)}
          />
        )}

        {question.type === 'toggle' && (
          <Toggle
            label={question.toggleLabel || ''}
            checked={!!currentValue}
            onChange={(checked) => onChange(checked)}
          />
        )}
      </div>
    </div>
  );
};
