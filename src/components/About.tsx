import React, { useState, useEffect, useRef } from 'react';
import { 
  Trees, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  Activity,
  Heart
} from 'lucide-react';
import './About.css';

interface AboutProps {
  onStartCalculator: () => void;
}

export const About: React.FC<AboutProps> = ({ onStartCalculator }) => {
  const [pledgeLevel, setPledgeLevel] = useState<'beginner' | 'moderate' | 'champion'>('moderate');
  const [activeTab, setActiveTab] = useState<'pillars' | 'science' | 'pledge'>('pillars');

  const pillarsRef = useRef<HTMLDivElement>(null);
  const scienceRef = useRef<HTMLDivElement>(null);
  const pledgeRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: 'pillars' | 'science' | 'pledge') => {
    setActiveTab(section);
    let targetRef;
    if (section === 'pillars') targetRef = pillarsRef;
    if (section === 'science') targetRef = scienceRef;
    if (section === 'pledge') targetRef = pledgeRef;

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      const getOffset = (ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return Infinity;
        return ref.current.offsetTop - 160;
      };

      const pillarsOffset = getOffset(pillarsRef);
      const scienceOffset = getOffset(scienceRef);
      const pledgeOffset = getOffset(pledgeRef);

      if (scrollPosition < 50) {
        setActiveTab('pillars');
        return;
      }

      if (scrollPosition >= pledgeOffset - 50) {
        setActiveTab('pledge');
      } else if (scrollPosition >= scienceOffset - 50) {
        setActiveTab('science');
      } else {
        setActiveTab('pillars');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run after a short delay to allow layouts to calculate offsetTop correctly
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const getPledgeDescription = () => {
    switch (pledgeLevel) {
      case 'beginner':
        return 'Pledge to reduce emissions by 10% this year (saving approx. 500 kg CO₂e, equivalent to growing 23 trees).';
      case 'moderate':
        return 'Pledge to reduce emissions by 25% this year (saving approx. 1,250 kg CO₂e, equivalent to growing 57 trees).';
      case 'champion':
        return 'Pledge to go Carbon Neutral by reducing at least 50% of emissions and offsetting the rest (saving 3,000+ kg CO₂e).';
      default:
        return '';
    }
  };

  return (
    <div className="about-page font-body-md">
      {/* Hero Header */}
      <div className="about-hero">
        <h1 className="font-display font-bold">
          About <span className="gradient-title">Carbon Tree</span>
        </h1>
        <p className="font-body-md text-bark-gray">
          Empowering communities and individuals to understand their ecological footprints, take gamified climate actions, and track their path toward net-zero.
        </p>
      </div>

      {/* Sticky Tab Navigator */}
      <div className="about-nav-tabs">
        <button 
          className={`about-tab-btn ${activeTab === 'pillars' ? 'active' : ''}`}
          onClick={() => scrollToSection('pillars')}
        >
          <Activity size={18} />
          Core Pillars
        </button>
        <button 
          className={`about-tab-btn ${activeTab === 'science' ? 'active' : ''}`}
          onClick={() => scrollToSection('science')}
        >
          <Trees size={18} />
          The Science
        </button>
        <button 
          className={`about-tab-btn ${activeTab === 'pledge' ? 'active' : ''}`}
          onClick={() => scrollToSection('pledge')}
        >
          <Heart size={18} />
          Climate Pledge
        </button>
      </div>

      {/* Core Pillars Section */}
      <div ref={pillarsRef} id="pillars" className="about-section">
        <h2 className="about-section-title font-display font-bold">Our Core Pillars</h2>
        <div className="about-pillars-grid">
          {/* Pillar 1 */}
          <div className="pillar-card">
            <div className="pillar-icon-wrap">
              <TrendingDown size={30} />
            </div>
            <h3 className="font-display font-bold">Science-First Estimates</h3>
            <p>
              We base our calculator factors on globally approved benchmarks. Our estimates use standard baselines like the 22 kg CO₂ tree absorption rate to keep carbon metrics concrete.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="pillar-card">
            <div className="pillar-icon-wrap">
              <ShieldCheck size={30} />
            </div>
            <h3 className="font-display font-bold">Privacy-First Design</h3>
            <p>
              Your personal details stay yours. Guest mode runs computations locally in your browser. Account synchronization is secure and fully optional.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="pillar-card">
            <div className="pillar-icon-wrap">
              <Activity size={30} />
            </div>
            <h3 className="font-display font-bold">Action-Oriented</h3>
            <p>
              Knowing your footprint is just the start. We help you transform awareness into action with gamified weekly challenges, community milestones, and rewards.
            </p>
          </div>
        </div>
      </div>

      {/* The Science & Trees Story */}
      <div ref={scienceRef} id="science" className="about-section">
        <div className="science-grid">
          {/* Left Column: text */}
          <div className="science-content">
            <h3 className="font-display font-bold">Translating Carbon to Trees</h3>
            <p>
              Most carbon calculators display results in metric tons or kilograms of CO₂. While scientifically accurate, these units are abstract for daily consumer choices. 
            </p>
            <p>
              At Carbon Tree, we represent your carbon impact using the concept of <b>equivalent tree absorption capacity</b>. A mature, healthy tree absorbs approximately 22 kg of carbon dioxide from the atmosphere every year. By showing your footprint in "trees required to absorb it," we make the ecological footprint tangible and inspiring.
            </p>
            
            {/* Stats */}
            <div className="science-stats-grid">
              <div className="stat-item">
                <div className="stat-number">22 kg</div>
                <div className="stat-label">CO₂ / Tree / Year</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Transparency Goal</div>
              </div>
            </div>
          </div>

          {/* Right Column: visual display */}
          <div className="science-visual">
            <div className="science-tree-display">
              <div className="tree-circle">
                <Trees size={48} />
              </div>
              <div className="absorption-badge">
                22 kg CO₂
              </div>
              <div className="absorption-sub">
                Absorbed by one mature tree annually
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pledge Card */}
      <div ref={pledgeRef} id="pledge" className="about-section">
        <div className="about-pledge-card">
          <div className="pillar-icon-wrap">
            <Heart size={28} />
          </div>
          <h3 className="font-display font-bold">Make Your Climate Pledge</h3>
          <p>
            Commit to a carbon reduction pledge and let Carbon Tree help you stay accountable.
          </p>

          <div className="pledge-options-row">
            <button 
              type="button" 
              className={`pledge-tag ${pledgeLevel === 'beginner' ? 'active' : ''}`}
              onClick={() => setPledgeLevel('beginner')}
            >
              🌱 Eco Starter (10%)
            </button>
            <button 
              type="button" 
              className={`pledge-tag ${pledgeLevel === 'moderate' ? 'active' : ''}`}
              onClick={() => setPledgeLevel('moderate')}
            >
              🌿 Climate Guard (25%)
            </button>
            <button 
              type="button" 
              className={`pledge-tag ${pledgeLevel === 'champion' ? 'active' : ''}`}
              onClick={() => setPledgeLevel('champion')}
            >
              🌳 Net-Zero Hero (50%+)
            </button>
          </div>

          <p className="font-body-md text-bark-gray font-semibold min-h-[40px] flex items-center justify-center">
            {getPledgeDescription()}
          </p>

          <button 
            type="button" 
            className="about-cta-btn"
            onClick={onStartCalculator}
          >
            Calculate Your Footprint Now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
