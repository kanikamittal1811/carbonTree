import React, { useState } from 'react';
import { QUESTIONS, CATEGORIES, AnswersState } from '../data/questions';
import { ProgressBar } from './ProgressBar';
import { StepCard } from './StepCard';
import { ResultsView } from './ResultsView';
import { calculateCarbonFootprint } from '../utils/calculator';
import { DynamicIcon } from './UI/IconCard';
import { ArrowLeft, ArrowRight, TreePine, ShieldCheck, Zap } from 'lucide-react';
import './Calculator.css';

// Seed state with defaults
const getInitialAnswers = (): AnswersState => {
  const defaults: AnswersState = {};
  QUESTIONS.forEach((q) => {
    defaults[q.id] = q.defaultValue;
  });
  return defaults;
};

export const Calculator: React.FC = () => {
  const [step, setStep] = useState<number>(-1); // -1 = Splash Intro, QUESTIONS.length = Results
  const [answers, setAnswers] = useState<AnswersState>(getInitialAnswers());

  const totalSteps = QUESTIONS.length;
  const isIntro = step === -1;
  const isResults = step === totalSteps;

  const currentQuestion = !isIntro && !isResults ? QUESTIONS[step] : null;
  const currentCategory = currentQuestion
    ? CATEGORIES.find((c) => c.id === currentQuestion.category)
    : null;

  const handleStart = () => {
    setStep(0);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else if (step === 0) {
      setStep(-1);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleRestart = () => {
    setAnswers(getInitialAnswers());
    setStep(-1);
  };

  // Compute results when we reach the end
  const resultsData = isResults ? calculateCarbonFootprint(answers) : null;

  return (
    <div className="calculator-wrapper animate-fade-in">
      
      {/* CASE 1: Intro Splash Screen */}
      {isIntro && (
        <div className="glass-panel intro-card">
          <div className="intro-badge">
            <TreePine size={16} />
            Environmental Impact assessment
          </div>
          
          <h1 className="intro-title">Carbon Footprint Calculator</h1>
          
          <p className="intro-desc">
            Discover your environmental impact without dealing with complicated utility bills or confusing numbers. 
            Answer a few simple lifestyle questions and see your carbon footprint translated into trees.
          </p>

          <div className="intro-features">
            <div className="intro-feature-card">
              <div className="intro-feature-icon">
                <Zap size={20} />
              </div>
              <h3>Interactive Inputs</h3>
              <p>Simple icons, sliders, and toggles instead of keyboard numbers.</p>
            </div>
            
            <div className="intro-feature-card">
              <div className="intro-feature-icon">
                <TreePine size={20} />
              </div>
              <h3>Tangible Impact</h3>
              <p>See your greenhouse gas outputs calculated in number of trees cut.</p>
            </div>

            <div className="intro-feature-card">
              <div className="intro-feature-icon">
                <ShieldCheck size={20} />
              </div>
              <h3>100% Private</h3>
              <p>No account or storage required. Data is cleared once closed or refreshed.</p>
            </div>
          </div>

          <button 
            type="button" 
            className="btn-start" 
            onClick={handleStart}
          >
            Start Assessment
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* CASE 2: Active Questionnaire wizard */}
      {!isIntro && !isResults && currentQuestion && currentCategory && (
        <>
          {/* Active Category tracker header */}
          <div className="category-header animate-scale-up">
            <div className="category-info">
              <div 
                className="category-icon-wrapper" 
                style={{ 
                  background: currentCategory.gradient,
                  boxShadow: `0 4px 15px ${currentCategory.color}35`
                }}
              >
                <DynamicIcon name={currentCategory.icon} size={20} />
              </div>
              <span className="category-title-text" style={{ color: currentCategory.color }}>
                {currentCategory.title}
              </span>
            </div>
            <span className="category-step-counter">
              Question {step + 1} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <ProgressBar current={step} total={totalSteps} />

          {/* Question card */}
          <StepCard
            question={currentQuestion}
            currentValue={answers[currentQuestion.id]}
            onChange={(val) => handleAnswerChange(currentQuestion.id, val)}
          />

          {/* Wizard Navigation */}
          <div className="nav-buttons-container">
            <button
              type="button"
              className="btn-nav-back"
              onClick={handleBack}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="button"
              className="btn-nav-next"
              onClick={handleNext}
            >
              {step === totalSteps - 1 ? 'Analyze Impact' : 'Continue'}
              <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      {/* CASE 3: Results Dashboard */}
      {isResults && resultsData && (
        <ResultsView 
          result={resultsData} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};
