import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QUESTIONS, CATEGORIES, AnswersState } from '../data/questions';
import { StepCard } from './StepCard';
import { ResultsView } from './ResultsView';
import { calculateCarbonFootprint } from '../utils/calculator';
import { ArrowLeft, ArrowRight, TreePine, UserCheck, Zap, X } from 'lucide-react';
import './Calculator.css';

// Seed state with defaults
const getInitialAnswers = (): AnswersState => {
  const defaults: AnswersState = {};
  QUESTIONS.forEach((q) => {
    defaults[q.id] = q.defaultValue;
  });
  return defaults;
};

interface CalculatorProps {
  onViewChallenges?: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onViewChallenges }) => {
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

  useEffect(() => {
    if (resultsData) {
      localStorage.setItem('carbontree_latest_calculation', JSON.stringify(resultsData));
    }
  }, [resultsData]);

  useEffect(() => {
    const isWizardActive = step > -1 && step < totalSteps;
    if (isWizardActive) {
      document.body.classList.add('wizard-active');
    } else {
      document.body.classList.remove('wizard-active');
    }
    return () => {
      document.body.classList.remove('wizard-active');
    };
  }, [step, totalSteps]);

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
                <UserCheck size={20} />
              </div>
              <h3>Progress Sync</h3>
              <p>Sign in to save assessment history, subscribe to weekly goals, and earn custom badges.</p>
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
        createPortal(
          <div className="wizard-overlay animate-fade-in">
            {/* Left panel: Sidebar */}
            <div className="wizard-sidebar">
              <div className="wizard-brand">
                <TreePine size={28} className="wizard-brand-icon" />
                <span>CarbonTree</span>
              </div>
              
              <div className="wizard-sidebar-footer">
                <p>Calculate your annual footprint in equivalent trees cut.</p>
              </div>
            </div>

            {/* Right panel: Content */}
            <div className="wizard-content-area">
              {/* Top Navigation */}
              <div className="wizard-top-nav">
                <button 
                  type="button" 
                  className="btn-wizard-prev" 
                  onClick={handleBack}
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
                
                <button 
                  type="button" 
                  className="btn-wizard-close" 
                  onClick={handleRestart}
                  aria-label="Close Assessment"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Question main container */}
              <div className="wizard-question-container">
                <span className="wizard-question-category" style={{ color: currentCategory.color }}>
                  {currentCategory.title}
                </span>
                
                <h2 className="wizard-question-title">{currentQuestion.title}</h2>
                <p className="wizard-question-desc">{currentQuestion.description}</p>

                {/* StepCard - renders inner inputs only */}
                <div className="wizard-card-body">
                  <StepCard
                    question={currentQuestion}
                    currentValue={answers[currentQuestion.id]}
                    onChange={(val) => handleAnswerChange(currentQuestion.id, val)}
                  />
                </div>

                {/* Navigation Action */}
                <div className="wizard-action-container">
                  <button
                    type="button"
                    className="btn-wizard-continue"
                    onClick={handleNext}
                  >
                    {step === totalSteps - 1 ? 'Analyze Impact' : 'Continue'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Bottom Progress Tracker */}
              <div className="wizard-progress-footer">
                <div className="wizard-progress-steps">
                  {CATEGORIES.map((cat) => {
                    const isCurrent = cat.id === currentQuestion.category;
                    const currentCategoryIndex = CATEGORIES.findIndex(c => c.id === currentQuestion.category);
                    const thisCategoryIndex = CATEGORIES.findIndex(c => c.id === cat.id);
                    const isCompleted = thisCategoryIndex < currentCategoryIndex;
                    
                    const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
                    const firstIndex = QUESTIONS.findIndex((q) => q.category === cat.id);
                    const lastIndex = firstIndex + catQuestions.length - 1;
                    
                    let progress = 0;
                    if (step > lastIndex) {
                      progress = 100;
                    } else if (step >= firstIndex && step <= lastIndex) {
                      progress = Math.round(((step - firstIndex) / catQuestions.length) * 100);
                    }

                    return (
                      <div 
                        key={cat.id} 
                        className={`wizard-progress-step-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      >
                        <span className="step-label">{cat.title}</span>
                        <div className="step-underline-track">
                          <div 
                            className="step-underline-fill" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      )}

      {/* CASE 3: Results Dashboard */}
      {isResults && resultsData && (
        <ResultsView 
          result={resultsData} 
          onRestart={handleRestart} 
          onViewChallenges={onViewChallenges}
        />
      )}
    </div>
  );
};
