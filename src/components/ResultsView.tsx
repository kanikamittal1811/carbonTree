import React, { useState, useEffect } from 'react';
import { CalculationResult, GLOBAL_AVERAGE_FOOTPRINT } from '../utils/calculator';
import { CATEGORIES } from '../data/questions';
import { DynamicIcon } from './UI/IconCard';
import { TreePine, RefreshCw, Lightbulb, Cloud, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveFootprintResult } from '../utils/firebaseService';
import { AuthModal } from './AuthModal';
import './ResultsView.css';

interface ResultsViewProps {
  result: CalculationResult;
  onRestart: () => void;
  onViewChallenges?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRestart,
  onViewChallenges,
}) => {
  const { breakdown, totalCO2, treesCut, averageComparison } = result;

  const { user, isFirebaseActive } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      await saveFootprintResult(
        user.uid,
        totalCO2,
        treesCut,
        averageComparison,
        breakdown
      );
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      setSaveError('Failed to save calculation.');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save if the user signs in after clicking "Save"
  useEffect(() => {
    if (user && !isSaved && !isSaving && showAuthModal) {
      handleSave();
      setShowAuthModal(false);
    }
  }, [user, showAuthModal]);

  // Determine user footprint badge
  let impactBadgeText = 'Climate Ally';
  let impactBadgeClass = 'eco-hero';
  let impactDescription = 'Your footprint is low enough that your lifestyle is very close to carbon neutral. Keep up the clean habits!';

  if (treesCut >= 100 && treesCut < 250) {
    impactBadgeText = 'Balanced Footprint';
    impactBadgeClass = 'moderate';
    impactDescription = 'Your footprint is on par with the sustainable average, but there are multiple high-impact areas where you can trim carbon.';
  } else if (treesCut >= 250) {
    impactBadgeText = 'Resource Intensive';
    impactBadgeClass = 'high';
    impactDescription = 'Your footprint is substantially above global sustainability targets. Focus on shifting your transportation and diet habits first.';
  }

  // Dynamic recommendations based on highest carbon source
  const sortedCategories = Object.entries(breakdown)
    .map(([key, val]) => ({ id: key, value: val }))
    .sort((a, b) => b.value - a.value);

  const getRecommendation = (catId: string) => {
    switch (catId) {
      case 'energy':
        return {
          title: 'Power with Renewables',
          desc: 'Switch to a 100% green energy tariff or add solar panels. Lowering your winter thermostat by 1°C saves up to 10% on energy bills.',
          icon: 'Sun',
        };
      case 'transport':
        return {
          title: 'Commute Wisely',
          desc: 'Consider working from home 1-2 days, active commuting (biking/walking) for short trips, or switching to a hybrid or electric vehicle.',
          icon: 'Bike',
        };
      case 'food':
        return {
          title: 'Eat Green & Reduce Waste',
          desc: 'Introduce "Meatless Mondays" or adopt a flexitarian diet. Animal livestock, particularly beef, is 5x more carbon-heavy than poultry or grains.',
          icon: 'Leaf',
        };
      case 'lifestyle':
        return {
          title: 'Circular Shopping & Sorting',
          desc: 'Avoid fast fashion and tech upgrades. Focus on local repairs and composting. Sorting paper and plastic diverts waste from methane-heavy landfills.',
          icon: 'Recycle',
        };
      default:
        return {
          title: 'Eco action',
          desc: 'Make slight adjustments in your daily spending and habits.',
          icon: 'Sprout',
        };
    }
  };

  // Forest grid simulator: draw 40 tree nodes
  const totalGridNodes = 40;
  const choppedCount = Math.min(totalGridNodes, Math.round((treesCut / 300) * totalGridNodes)); 
  // Let's scale it so that a heavy footprint (e.g. 300 trees) chops almost all 40 nodes, 
  // and a small footprint chops very few. 
  // Minimum chopped is 1 if treesCut > 0.
  const visualChopped = treesCut > 0 ? Math.max(1, choppedCount) : 0;

  // Format carbon total (e.g., 2400 kg -> 2.4 tonnes)
  const formattedCO2 = (totalCO2 / 1000).toFixed(1);

  return (
    <div className="results-container animate-fade-in">
      {/* 1. Main Impact Metric Header */}
      <div className="glass-panel results-header-card">
        <span className={`badge-impact ${impactBadgeClass}`}>
          {impactBadgeText}
        </span>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginTop: '8px', zIndex: 1, position: 'relative' }}>
          {impactDescription}
        </p>

        <div className="tree-hero-display">
          <div className="tree-large-icon-wrapper animate-float">
            <TreePine size={64} />
          </div>
          <div className="tree-cut-number">
            {treesCut.toLocaleString()}
          </div>
          <div className="tree-cut-label">
            Trees Cut Equivalent / Year
          </div>
          <p className="tree-cut-sub">
            Your annual lifestyle footprint releases carbon equivalent to cutting down{' '}
            <strong>{treesCut} mature trees</strong>.
          </p>
        </div>

        <div className="co2-total-badge">
          Total Emissions: <strong>{formattedCO2} metric tons</strong> of CO2e per year ({totalCO2.toLocaleString()} kg)
        </div>
      </div>

      {/* 2. Detailed Breakdown Grid */}
      <div className="results-grid-layout">
        
        {/* Category Share List */}
        <div className="glass-panel breakdown-card">
          <h3 className="breakdown-title-bar">Impact Breakdown</h3>
          <div className="breakdown-list">
            {CATEGORIES.map((cat) => {
              const catEmissions = breakdown[cat.id as keyof typeof breakdown] || 0;
              const catPercentage = totalCO2 > 0 ? Math.round((catEmissions / totalCO2) * 100) : 0;

              return (
                <div key={cat.id} className="breakdown-item">
                  <div className="breakdown-item-header">
                    <div className="breakdown-item-title-info">
                      <div 
                        className="breakdown-item-icon" 
                        style={{ background: cat.gradient }}
                      >
                        <DynamicIcon name={cat.icon} size={16} />
                      </div>
                      <span>{cat.title}</span>
                    </div>
                    <div className="breakdown-item-value">
                      {catEmissions.toLocaleString()} kg
                    </div>
                  </div>
                  
                  <div className="breakdown-bar-track">
                    <div 
                      className="breakdown-bar-fill" 
                      style={{ 
                        width: `${catPercentage}%`,
                        background: cat.gradient 
                      }}
                    />
                  </div>
                  <div className="breakdown-item-percentage">
                    {catPercentage}% of total footprint
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forest Simulator */}
        <div className="glass-panel forest-card">
          <h3 className="breakdown-title-bar">Visual Forest Plot</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            Visualizing your share of resource absorption. Red stumps represent the trees required to offset your emissions.
          </p>

          <div className="forest-grid">
            {Array.from({ length: totalGridNodes }).map((_, index) => {
              const isChopped = index < visualChopped;
              return (
                <div 
                  key={index} 
                  className={`forest-tree-node ${isChopped ? 'chopped' : 'healthy'}`}
                >
                  <TreePine size={20} />
                </div>
              );
            })}
          </div>

          <div className="forest-legend">
            <div className="legend-item">
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-emerald)', display: 'inline-block' }} />
              <span>Healthy Forest</span>
            </div>
            <div className="legend-item">
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span>Emissions Debt</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Your footprint is <strong>{averageComparison}%</strong> of the standard global average ({GLOBAL_AVERAGE_FOOTPRINT.toLocaleString()} kg).
          </div>
        </div>

      </div>

      {/* Gamification Challenges CTA Card */}
      <div className="glass-panel challenges-cta-card animate-scale-up" style={{ marginTop: '24px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ 
            background: 'var(--gradient-primary)', 
            padding: '12px', 
            borderRadius: '16px', 
            color: 'white',
            boxShadow: '0 4px 15px rgba(var(--color-emerald-rgb), 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={32} />
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: 'var(--color-text-primary)', textAlign: 'left' }}>Kickstart Your Reduction Plan!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, textAlign: 'left' }}>
              Take action based on your footprint results. Subscribe to weekly challenges, tick off daily eco-tasks, and collect unique badges to showcase your progress!
            </p>
          </div>
          {onViewChallenges && (
            <button 
              type="button" 
              className="btn-save-footprint" 
              style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', fontWeight: 700, whiteSpace: 'nowrap' }}
              onClick={onViewChallenges}
            >
              Start Challenges
            </button>
          )}
        </div>
      </div>

      {/* 3. Actionable Green Tips */}
      <div className="glass-panel tips-card">
        <h3 className="breakdown-title-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={22} className="text-emerald" style={{ color: 'var(--color-emerald)' }} />
          Personalized Eco-Reduction Plan
        </h3>
        
        <div className="tips-list">
          {sortedCategories.slice(0, 3).map(({ id }) => {
            const tip = getRecommendation(id);
            return (
              <div key={id} className="tip-item">
                <div className="tip-icon-holder">
                  <DynamicIcon name={tip.icon} size={20} />
                </div>
                <div className="tip-content">
                  <h4 className="tip-title">{tip.title}</h4>
                  <p className="tip-desc">{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="results-footer-wrapper">
        {saveError && (
          <div className="save-error-msg animate-scale-up">
            <AlertTriangle size={14} />
            <span>{saveError}</span>
          </div>
        )}

        <div className="results-footer">
          <button 
            type="button" 
            className="btn-restart" 
            onClick={onRestart}
          >
            <RefreshCw size={18} />
            Start Fresh
          </button>

          {isFirebaseActive && (
            <>
              {isSaved ? (
                <div className="save-status-msg success animate-scale-up">
                  <CheckCircle size={16} />
                  <span>Saved to History</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-save-footprint"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Cloud size={16} />
                      {user ? 'Save to History' : 'Sign In & Save'}
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Auth Modal Trigger for Guest Saves */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
