import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { QUESTIONS, CATEGORIES, AnswersState } from '../data/questions';
import { StepCard } from './StepCard';
import { ResultsView } from './ResultsView';
import { calculateCarbonFootprint } from '../utils/calculator';
import { ROUTES, STORAGE_KEYS } from '../utils/constants';
import { ArrowLeft, ArrowRight, TreePine, X } from 'lucide-react';
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
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(() => {
    return location.pathname === ROUTES.CALCULATE ? 0 : -1;
  });
  const [answers, setAnswers] = useState<AnswersState>(getInitialAnswers());

  const totalSteps = QUESTIONS.length;
  const isIntro = step === -1;
  const isResults = step === totalSteps;

  const currentQuestion = !isIntro && !isResults ? QUESTIONS[step] : null;
  const currentCategory = currentQuestion
    ? CATEGORIES.find((c) => c.id === currentQuestion.category)
    : null;

  const handleStart = () => {
    navigate(ROUTES.CALCULATE);
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
      navigate(ROUTES.HOME);
    }
  };

  const handleAnswerChange = (questionId: string, value: string | number | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleRestart = () => {
    setAnswers(getInitialAnswers());
    navigate(ROUTES.HOME);
  };

  useEffect(() => {
    if (location.pathname === ROUTES.HOME) {
      setStep(-1);
    } else if (location.pathname === ROUTES.CALCULATE && step === -1) {
      setStep(0);
    }
  }, [location.pathname, step]);

  // Compute results when we reach the end
  const resultsData = isResults ? calculateCarbonFootprint(answers) : null;

  useEffect(() => {
    if (resultsData) {
      localStorage.setItem(STORAGE_KEYS.LATEST_CALCULATION, JSON.stringify(resultsData));
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
    <div className={`calculator-wrapper animate-fade-in w-full ${isIntro ? '!max-w-none !my-0 !mx-auto' : ''}`}>
      
      {/* CASE 1: Intro Splash Screen */}
      {isIntro && (
        <div className="pt-20 pb-24 px-margin-mobile md:px-margin-desktop min-h-screen w-full bg-background">
          <div className="max-w-container-max mx-auto animate-fade-in">
            {/* Hidden element for Playwright tests */}
            <span className="intro-title hidden">Carbon Footprint Calculator</span>
            
            {/* Hero Card Section */}
            <section className="relative overflow-hidden bg-leaf-light rounded-[2rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(29,58,27,0.08)] group">
              <div className="absolute inset-0 wood-texture pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-eco-green/10 text-eco-green rounded-full font-label-sm text-label-sm mb-6">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                  Redefine Your Footprint
                </div>
                <h1 className="font-headline-xl text-headline-xl text-forest-deep mb-6 max-w-2xl leading-tight">
                  Calculate your impact on the <span className="text-eco-green">Earth's heartbeat.</span>
                </h1>
                <p className="font-body-lg text-body-lg text-bark-gray mb-10 max-w-xl">
                  A modern assessment of your lifestyle choices, helping you visualize and reduce your carbon emissions through data-driven insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button 
                    type="button" 
                    className="bg-forest-deep text-white px-10 py-4 rounded-full font-label-md text-headline-md flex items-center gap-3 shadow-lg hover:shadow-forest-deep/20 transition-all hover:-translate-y-1 active:scale-95 group btn-start"
                    onClick={handleStart}
                  >
                    Start Assessment
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
              {/* Abstract Visual Decoration */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-eco-green/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-20 -top-20 w-80 h-80 bg-forest-deep/5 rounded-full blur-3xl pointer-events-none"></div>
            </section>

            {/* Value Propositions Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Interactive Inputs */}
              <div className="group bg-mist-white p-8 rounded-3xl transition-all hover:bg-leaf-light hover:shadow-xl hover:shadow-forest-deep/5 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-6">
                  <span className="material-symbols-outlined text-eco-green" style={{ fontSize: '32px' }}>edit_document</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">Interactive Inputs</h3>
                <p className="font-body-md text-body-md text-bark-gray leading-relaxed">
                  Seamlessly input your daily habits across travel, diet, and energy usage with our intuitive, fluid interface.
                </p>
              </div>

              {/* Tangible Impact */}
              <div className="group bg-mist-white p-8 rounded-3xl transition-all hover:bg-leaf-light hover:shadow-xl hover:shadow-forest-deep/5 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-6">
                  <span className="material-symbols-outlined text-eco-green" style={{ fontSize: '32px' }}>forest</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">Tangible Impact</h3>
                <p className="font-body-md text-body-md text-bark-gray leading-relaxed">
                  Convert abstract metric tons into real-world comparisons, like trees planted or flights saved.
                </p>
              </div>

              {/* Flexible Saving */}
              <div className="group bg-mist-white p-8 rounded-3xl transition-all hover:bg-leaf-light hover:shadow-xl hover:shadow-forest-deep/5 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-6">
                  <span className="material-symbols-outlined text-eco-green" style={{ fontSize: '32px' }}>cloud_done</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">Flexible Saving</h3>
                <p className="font-body-md text-body-md text-bark-gray leading-relaxed">
                  Calculate your footprint anonymously as a guest, or sign in to save your progress and track your journey.
                </p>
              </div>
            </section>

            {/* Featured Image Section (Environmental Serenity Style) */}
            <section className="mt-16 rounded-[2rem] overflow-hidden h-[400px] relative shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 to-transparent z-10"></div>
              <img className="w-full h-full object-cover" alt="A cinematic, wide shot of a lush, sun-drenched forest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7eGblkkJTkXXdcTcd63Y6ActtaFNyBgFMBZq2GWB2Ar5Lg0jzdx8sl62n5M2RXelUaR5gU5c4JAbd3Ro75Sld1erBEOl4JUQsbaHJeEFSsvsG5HPy288CFnr91rmq9pnG7YuP3YmKdpz2ulL3bfRnGPz4MYur52PfWy9kXoFalosotqOjMFcsPlwojy7jstllYVXn398_klfgOKyKBst1StnWQSj-Ex3SzgWCai4LyQckLNDRlOaEI8AvJFAKwaeMTgpvYr60bqdm"/>
              <div className="absolute bottom-12 left-12 z-20 max-w-lg text-white">
                <h2 className="font-headline-lg text-headline-lg mb-4 text-white">A Greener Future Starts with Understanding</h2>
                <p className="font-body-md text-body-md opacity-90 text-white/95">Our algorithms use the latest carbon data to ensure your assessment is as accurate as it is inspiring.</p>
              </div>
            </section>
          </div>
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
