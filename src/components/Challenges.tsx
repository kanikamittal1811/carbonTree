import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFootprintHistory } from '../utils/firebaseService';
import { CHALLENGES, Challenge, Badge } from '../data/challengesData';
import { CATEGORIES } from '../data/questions';
import { DynamicIcon } from './UI/IconCard';
import { 
  getChallengesState, 
  saveChallengesState, 
  getFollowerCounts, 
  incrementFollowers, 
  decrementFollowers, 
  getInitialChallengesState,
  ChallengesState,
  UserChallengeProgress
} from '../utils/challengesService';
import { 
  Trophy, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  UserPlus, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import './Challenges.css';

interface ChallengesProps {
  onStartCalculator: () => void;
}

export const Challenges: React.FC<ChallengesProps> = ({ onStartCalculator }) => {
  const { user } = useAuth();
  
  // States
  const [challengesState, setChallengesState] = useState<ChallengesState>(getInitialChallengesState());
  const [followerCounts, setFollowerCounts] = useState<{ [challengeId: string]: number }>({});
  const [highestCategory, setHighestCategory] = useState<string | null>(null);
  const [sortedCategories, setSortedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  
  // Guest local discovery state (so shuffles are maintained in UI state for guest sessions)
  const [guestDiscoveryIds, setGuestDiscoveryIds] = useState<string[]>([]);
  
  // UI States
  const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);
  const [congratsBadge, setCongratsBadge] = useState<Badge | null>(null);
  const [expandedActiveCatId, setExpandedActiveCatId] = useState<string | null>(null);
  const [isCompletedHistoryOpen, setIsCompletedHistoryOpen] = useState<boolean>(false);

  // Load state
  const loadStateData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user challenges state
      const state = await getChallengesState(user ? user.uid : null);
      setChallengesState(state);

      const activeCats = Object.keys(state.active || {});
      if (activeCats.length > 0) {
        setExpandedActiveCatId(activeCats[0]);
      }

      // 2. Fetch follower counts
      const counts = await getFollowerCounts();
      setFollowerCounts(counts);

      // 3. Load highest carbon footprint category & sorted list of categories
      let highestCat: string | null = null;
      let sortedCats: string[] = [];
      if (user) {
        const history = await getFootprintHistory(user.uid);
        if (history && history.length > 0) {
          const latest = history[0];
          let maxVal = -1;
          Object.entries(latest.breakdown).forEach(([cat, val]) => {
            if (val > maxVal) {
              maxVal = val;
              highestCat = cat;
            }
          });
          sortedCats = Object.entries(latest.breakdown)
            .sort((a, b) => Number(b[1]) - Number(a[1]))
            .map(([cat]) => cat);
        }
      }
      
      // Fallback to localStorage if no user or no history
      if (sortedCats.length === 0) {
        const localCalcStr = localStorage.getItem('carbontree_latest_calculation');
        if (localCalcStr) {
          const calc = JSON.parse(localCalcStr);
          if (calc && calc.breakdown) {
            let maxVal = -1;
            Object.entries(calc.breakdown).forEach(([cat, val]) => {
              const numVal = Number(val);
              if (numVal > maxVal) {
                maxVal = numVal;
                highestCat = cat;
              }
            });
            sortedCats = Object.entries(calc.breakdown)
              .sort((a, b) => Number(b[1]) - Number(a[1]))
              .map(([cat]) => cat);
          }
        }
      }

      // Default order fallback if no footprint exists yet
      if (sortedCats.length === 0) {
        sortedCats = ['energy', 'transport', 'food', 'lifestyle'];
      }

      setHighestCategory(highestCat || sortedCats[0]);
      setSortedCategories(sortedCats);

      // Initialize guest discovery state if needed
      if (!user && guestDiscoveryIds.length === 0) {
        setGuestDiscoveryIds(state.discoveryIds);
      }
    } catch (error) {
      console.error('Error loading challenges board:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStateData();
  }, [user]);

  // Helper: Get active discovery pool of IDs
  const activeDiscoveryIds = user ? challengesState.discoveryIds : guestDiscoveryIds;

  // Helper: Shuffle / Refresh discovery pool
  const handleRefreshDiscovery = async () => {
    const categories: ('energy' | 'transport' | 'food' | 'lifestyle')[] = ['energy', 'transport', 'food', 'lifestyle'];
    const nextDiscovery: string[] = [];

    categories.forEach(cat => {
      const catChallenges = CHALLENGES.filter(c => c.categoryId === cat);
      // Filter out active or completed
      const available = catChallenges.filter(c => {
        const isActive = user && Object.values(challengesState.active).some(a => a?.challengeId === c.id);
        const isCompleted = user && challengesState.completed.includes(c.id);
        return !isActive && !isCompleted;
      });

      if (available.length > 0) {
        // Pick random
        const randomChallenge = available[Math.floor(Math.random() * available.length)];
        nextDiscovery.push(randomChallenge.id);
      }
    });

    if (user) {
      const updatedState = {
        ...challengesState,
        discoveryIds: nextDiscovery
      };
      setChallengesState(updatedState);
      await saveChallengesState(user.uid, updatedState);
    } else {
      setGuestDiscoveryIds(nextDiscovery);
    }
  };

  // Helper: Subscribe to a challenge (Signed-in only)
  const handleSubscribe = async (challenge: Challenge) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    const categoryId = challenge.categoryId;
    const activeInCat = challengesState.active[categoryId];

    // If already active in category, decrement old follower count first
    if (activeInCat) {
      await decrementFollowers(activeInCat.challengeId);
    }

    // Update state
    const newProgress: UserChallengeProgress = {
      challengeId: challenge.id,
      subscribedAt: new Date().toISOString(),
      completedDays: [],
      isCompleted: false
    };

    // Replace in discovery list
    const remainingInCat = CHALLENGES.filter(c => 
      c.categoryId === categoryId && 
      c.id !== challenge.id && 
      !challengesState.completed.includes(c.id) &&
      challengesState.active[categoryId]?.challengeId !== c.id
    );

    let nextDiscoveryId = '';
    if (remainingInCat.length > 0) {
      nextDiscoveryId = remainingInCat[Math.floor(Math.random() * remainingInCat.length)].id;
    }

    const nextDiscoveryIds = challengesState.discoveryIds.map(id => {
      const found = CHALLENGES.find(c => c.id === id);
      if (found && found.categoryId === categoryId) {
        return nextDiscoveryId;
      }
      return id;
    }).filter(Boolean);

    const updatedState = {
      ...challengesState,
      active: {
        ...challengesState.active,
        [categoryId]: newProgress
      },
      discoveryIds: nextDiscoveryIds
    };

    setChallengesState(updatedState);
    await saveChallengesState(user.uid, updatedState);
    await incrementFollowers(challenge.id);
    
    // Update local followers counter UI
    setFollowerCounts(prev => ({
      ...prev,
      [challenge.id]: (prev[challenge.id] || 0) + 1,
      ...(activeInCat ? { [activeInCat.challengeId]: Math.max(0, (prev[activeInCat.challengeId] || 1) - 1) } : {})
    }));
  };

  // Helper: Unsubscribe from an active challenge
  const handleUnsubscribe = async (categoryId: string, challengeId: string) => {
    if (!user) return;

    const confirmCancel = window.confirm('Are you sure you want to cancel this challenge? Your progress for this week will be lost.');
    if (!confirmCancel) return;

    const newActive = { ...challengesState.active };
    delete newActive[categoryId];

    // Restore to discovery list if slot is open
    const catAvailable = CHALLENGES.filter(c => 
      c.categoryId === categoryId && 
      !challengesState.completed.includes(c.id) &&
      c.id !== challengeId
    );

    let nextDiscovery = [...challengesState.discoveryIds];
    const discoveryHasCat = challengesState.discoveryIds.some(id => 
      CHALLENGES.find(c => c.id === id)?.categoryId === categoryId
    );

    if (!discoveryHasCat && catAvailable.length > 0) {
      nextDiscovery.push(challengeId);
    }

    const updatedState = {
      ...challengesState,
      active: newActive,
      discoveryIds: nextDiscovery
    };

    setChallengesState(updatedState);
    await saveChallengesState(user.uid, updatedState);
    await decrementFollowers(challengeId);

    setFollowerCounts(prev => ({
      ...prev,
      [challengeId]: Math.max(0, (prev[challengeId] || 1) - 1)
    }));
  };

  // Helper: Toggle a day checkmark (Signed-in only)
  const handleToggleDay = async (categoryId: string, dayIndex: number) => {
    if (!user) return;

    const progress = challengesState.active[categoryId];
    if (!progress) return;

    let updatedDays = [...progress.completedDays];
    if (updatedDays.includes(dayIndex)) {
      updatedDays = updatedDays.filter(d => d !== dayIndex);
    } else {
      updatedDays.push(dayIndex);
    }

    const updatedProgress = {
      ...progress,
      completedDays: updatedDays
    };

    const updatedState = {
      ...challengesState,
      active: {
        ...challengesState.active,
        [categoryId]: updatedProgress
      }
    };

    setChallengesState(updatedState);
    await saveChallengesState(user.uid, updatedState);
  };

  // Helper: Claim badge upon challenge completion
  const handleClaimBadge = async (categoryId: string, challenge: Challenge) => {
    if (!user) return;

    // Remove from active
    const newActive = { ...challengesState.active };
    delete newActive[categoryId];

    // Add to completed
    const newCompleted = [...challengesState.completed];
    if (!newCompleted.includes(challenge.id)) {
      newCompleted.push(challenge.id);
    }

    // Refresh discovery
    const catChallenges = CHALLENGES.filter(c => c.categoryId === categoryId);
    const available = catChallenges.filter(c => !newCompleted.includes(c.id));
    
    let nextDiscovery = [...challengesState.discoveryIds];
    // Filter out the active slots that are gone, replace with a fresh unsubscribed one
    nextDiscovery = nextDiscovery.filter(id => {
      const ch = CHALLENGES.find(c => c.id === id);
      return ch?.categoryId !== categoryId;
    });

    if (available.length > 0) {
      nextDiscovery.push(available[0].id);
    }

    const updatedState = {
      active: newActive,
      completed: newCompleted,
      discoveryIds: nextDiscovery
    };

    setChallengesState(updatedState);
    await saveChallengesState(user.uid, updatedState);
    await decrementFollowers(challenge.id);

    // Trigger celebration dialog/modal
    setCongratsBadge(challenge.badge);

    // Update followers counter
    setFollowerCounts(prev => ({
      ...prev,
      [challenge.id]: Math.max(0, (prev[challenge.id] || 1) - 1)
    }));
  };

  // Render Category Meta
  const getCategoryMeta = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId) || {
      title: 'General',
      color: '#4cae4f',
      gradient: 'linear-gradient(135deg, #3d8c40 0%, #4cae4f 100%)',
      icon: 'Sprout'
    };
  };
  // Recommendations logic
  const renderRecommendation = () => {
    if (!user) return null;

    if (!highestCategory || sortedCategories.length === 0) {
      return (
        <div className="glass-panel rec-banner animate-fade-in">
          <div className="rec-icon-box">
            <Trophy size={28} className="text-emerald animate-float" />
          </div>
          <div className="rec-text-box">
            <h4>Ready to customize your eco goals?</h4>
            <p>Calculate your precise carbon footprint to unlock tailored suggestions that help target your highest emission areas first.</p>
          </div>
          <button type="button" className="btn-rec-action" onClick={onStartCalculator}>
            Analyze Footprint
          </button>
        </div>
      );
    }

    // Find the first category in sorted order where the user has no active challenge
    // and there is at least one available (not active, not completed) challenge.
    let recommendedChallenge: Challenge | null = null;
    let recommendedCatId: string | null = null;

    for (const catId of sortedCategories) {
      const isActiveInCat = user && !!challengesState.active[catId];
      if (isActiveInCat) {
        continue;
      }

      const availableChallenge = CHALLENGES.find(c => {
        if (c.categoryId !== catId) return false;
        const isActive = user && Object.values(challengesState.active).some(a => a?.challengeId === c.id);
        const isCompleted = user && challengesState.completed.includes(c.id);
        return !isActive && !isCompleted;
      });

      if (availableChallenge) {
        recommendedChallenge = availableChallenge;
        recommendedCatId = catId;
        break;
      }
    }

    // If no recommended challenge could be found (e.g. all categories already have active challenges, or all completed)
    if (!recommendedChallenge || !recommendedCatId) {
      return null;
    }

    const recCatMeta = getCategoryMeta(recommendedCatId);
    const isHighest = recommendedCatId === highestCategory;

    return (
      <div className="glass-panel rec-banner highlighted animate-fade-in" style={{ borderLeftColor: recCatMeta.color }}>
        <div className="rec-icon-box" style={{ background: recCatMeta.gradient }}>
          <DynamicIcon name={recCatMeta.icon} size={22} />
        </div>
        <div className="rec-text-box">
          <h4>Personalized Suggestion</h4>
          <p>
            {isHighest ? (
              <span>Your data shows <strong>{recCatMeta.title}</strong> is your highest carbon impact area. </span>
            ) : (
              <span>Improve your footprint in <strong>{recCatMeta.title}</strong>. </span>
            )}
            Try subscribing to the <strong>{recommendedChallenge.title}</strong> challenge to cut down emissions!
          </p>
        </div>
        
        {user ? (
          <button 
            type="button" 
            className="btn-rec-action primary" 
            style={{ background: recCatMeta.gradient }}
            onClick={() => handleSubscribe(recommendedChallenge!)}
          >
            Quick Subscribe
          </button>
        ) : (
          <button 
            type="button" 
            className="btn-rec-action primary" 
            style={{ background: recCatMeta.gradient }}
            onClick={() => setIsAuthOpen(true)}
          >
            Sign In to Start
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="glass-panel challenges-loader-card animate-fade-in">
        <RefreshCw size={36} className="animate-spin text-emerald" style={{ color: 'var(--color-emerald)' }} />
        <p>Loading your weekly challenge dashboard...</p>
      </div>
    );
  }

  return (
    <div className="challenges-container animate-fade-in">
      
      {/* Celebration Congratulations Modal */}
      {congratsBadge && (
        <div className="congrats-overlay animate-fade-in">
          <div className="glass-panel congrats-card animate-scale-up">
            <div className="sparkles-container">
              <Sparkles size={48} className="text-yellow animate-float" />
            </div>
            <h2>Challenge Completed!</h2>
            <p className="congrats-subtitle">You have successfully completed all 7 days of weekly green tasks.</p>
            
            <div 
              className="congrats-badge-showcase" 
              style={{ 
                background: congratsBadge.gradient,
                boxShadow: `0 8px 30px ${congratsBadge.color}45`
              }}
            >
              <DynamicIcon name={congratsBadge.icon} size={48} />
            </div>
            
            <h3 className="congrats-badge-title">{congratsBadge.title}</h3>
            <p className="congrats-badge-desc">{congratsBadge.description}</p>
            
            <button 
              type="button" 
              className="btn-congrats-close"
              onClick={() => setCongratsBadge(null)}
            >
              Add to Gallery
            </button>
          </div>
        </div>
      )}

      {/* Main Headers */}
      <div className="challenges-header">
        <h2 className="challenges-main-title">Eco Action Weekly Challenges</h2>
        <p className="challenges-subtitle-text">
          Kickstart your carbon reductions. Learn sustainable habits, complete daily targets, and unlock credentials for your badge gallery.
        </p>
        <div className="heading-divider" />
      </div>

      {/* 1. Carbon Recommendation Banner */}
      {renderRecommendation()}

      {/* 2. Active Challenges (Only shown for Signed-in users with active challenges) */}
      {user && Object.keys(challengesState.active).length > 0 && (
        <section className="challenges-section animate-scale-up">
          <h3 className="section-title">My Subscribed Challenges</h3>
          <div className="active-challenges-accordion-container">
            {Object.entries(challengesState.active).map(([catId, progress]) => {
              const challenge = CHALLENGES.find(c => c.id === progress.challengeId);
              if (!challenge) return null;
              
              const catMeta = getCategoryMeta(catId);
              const completedCount = progress.completedDays.length;
              const isAllDone = completedCount === 7;
              const isExpanded = expandedActiveCatId === catId;

              return (
                <div 
                  key={challenge.id} 
                  className={`glass-panel active-challenge-card ${isExpanded ? 'expanded' : 'collapsed'}`}
                >
                  {/* Clickable Header for Accordion */}
                  <div 
                    className="active-card-accordion-header"
                    onClick={() => setExpandedActiveCatId(isExpanded ? null : catId)}
                  >
                    <div className="active-header-left-row">
                      <h4 className="active-card-title">{challenge.title}</h4>
                      
                      <div className="cat-label-pill" style={{ background: catMeta.gradient }}>
                        <DynamicIcon name={catMeta.icon} size={10} />
                        <span>{catMeta.title}</span>
                      </div>

                      <div className="follower-pill">
                        <span>👤 {(followerCounts[challenge.id] || challenge.baseFollowers).toLocaleString()} following</span>
                      </div>
                    </div>

                    <div className="active-header-right-row">
                      {/* Badge Icon with hover showing badge name */}
                      <div 
                        className="badge-mini-preview-pill" 
                        style={{ background: challenge.badge.gradient }}
                        title={challenge.badge.title}
                      >
                        <DynamicIcon name={challenge.badge.icon} size={14} />
                        <span className="tooltip-text">{challenge.badge.title}</span>
                      </div>

                      {/* Highlighted circles progress */}
                      <div className="progress-circles">
                        {Array.from({ length: 7 }).map((_, idx) => {
                          const isDone = progress.completedDays.includes(idx);
                          return (
                            <div 
                              key={idx} 
                              className={`progress-circle ${isDone ? 'done' : 'pending'}`}
                              style={isDone ? { 
                                background: catMeta.gradient || 'var(--gradient-primary)',
                                color: catMeta.color || 'var(--color-emerald)',
                                boxShadow: `0 0 8px ${catMeta.color || 'var(--color-emerald)'}80`
                              } : {}}
                              title={`Day ${idx + 1}: ${isDone ? 'Completed' : 'Pending'}`}
                            />
                          );
                        })}
                      </div>

                      <div className={`chevron-toggle-icon ${isExpanded ? 'rotated' : ''}`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="active-card-body animate-scale-up">
                      <p className="active-card-desc">{challenge.description}</p>

                      {/* Checklist spread horizontally */}
                      <div className="checklist-container horizontal">
                        <h5 className="checklist-title">7-Day Tasks Checklist</h5>
                        <div className="checklist-items-horizontal">
                          {challenge.days.map((dayText, idx) => {
                            const isDayChecked = progress.completedDays.includes(idx);
                            return (
                              <label key={idx} className={`horizontal-day-card ${isDayChecked ? 'checked' : ''}`}>
                                <div className="day-card-header">
                                  <span className="day-number">Day {idx + 1}</span>
                                  <input 
                                    type="checkbox" 
                                    checked={isDayChecked} 
                                    onChange={() => handleToggleDay(catId, idx)}
                                  />
                                </div>
                                <span className="day-text">{dayText}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="active-card-footer">
                        <button 
                          type="button" 
                          className="btn-cancel-challenge"
                          onClick={() => handleUnsubscribe(catId, challenge.id)}
                        >
                          Unsubscribe
                        </button>

                        {isAllDone && (
                          <button 
                            type="button" 
                            className="btn-claim-badge"
                            style={{ background: challenge.badge.gradient }}
                            onClick={() => handleClaimBadge(catId, challenge)}
                          >
                            <Trophy size={16} />
                            Claim Badge!
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2.5 Collapsible Past Completed Challenges History */}
      {user && challengesState.completed.length > 0 && (
        <section className="challenges-section completed-history-section animate-scale-up">
          <div 
            className="glass-panel completed-history-header-card"
            onClick={() => setIsCompletedHistoryOpen(!isCompletedHistoryOpen)}
          >
            <div className="completed-history-header-left">
              <CheckCircle2 className="text-emerald" size={20} />
              <h3>Past Completed Challenges ({challengesState.completed.length})</h3>
            </div>
            <div className={`chevron-toggle-icon ${isCompletedHistoryOpen ? 'rotated' : ''}`}>
              <ChevronDown size={20} />
            </div>
          </div>

          {isCompletedHistoryOpen && (
            <div className="completed-history-content">
              {challengesState.completed.map(completedId => {
                const challenge = CHALLENGES.find(c => c.id === completedId);
                if (!challenge) return null;
                const catMeta = getCategoryMeta(challenge.categoryId);

                return (
                  <div key={challenge.id} className="glass-panel completed-history-item-card animate-scale-up">
                    <div className="completed-item-header">
                      <div className="completed-item-title-row">
                        <div className="cat-label" style={{ background: catMeta.gradient }}>
                          <DynamicIcon name={catMeta.icon} size={10} />
                          <span>{catMeta.title}</span>
                        </div>
                        <h4>{challenge.title}</h4>
                      </div>
                      <div className="completed-item-badge-earned">
                        <div className="badge-mini-preview" style={{ background: challenge.badge.gradient }}>
                          <DynamicIcon name={challenge.badge.icon} size={12} />
                        </div>
                        <span>Badge Unlocked: <strong>{challenge.badge.title}</strong></span>
                      </div>
                    </div>

                    <p className="completed-item-desc">{challenge.description}</p>

                    {/* Horizontal 7 days tasks display (checked & read-only) */}
                    <div className="checklist-container horizontal">
                      <h5 className="checklist-title">Completed 7-Day Tasks</h5>
                      <div className="checklist-items-horizontal">
                        {challenge.days.map((dayText, idx) => (
                          <div key={idx} className="horizontal-day-card checked read-only">
                            <div className="day-card-header">
                              <span className="day-number">Day {idx + 1}</span>
                              <CheckCircle2 size={16} className="text-emerald" style={{ color: 'var(--color-emerald)' }} />
                            </div>
                            <span className="day-text">{dayText}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Guest Mode Active Challenges Message */}
      {!user && (
        <div className="glass-panel guest-cta-panel animate-scale-up">
          <div className="guest-cta-icon-box">
            <Lock size={28} className="text-muted" />
          </div>
          <div className="guest-cta-text">
            <h3>Subscribe to start tracking challenges!</h3>
            <p>Sign in with your account to activate weekly checklists, mark off completed tasks day by day, and earn custom badges for your profile.</p>
          </div>
          <button type="button" className="btn-guest-login" onClick={() => setIsAuthOpen(true)}>
            <UserPlus size={18} />
            Sign In & Subscribe
          </button>
        </div>
      )}

      {/* 3. Discovery Pool / Available Challenges */}
      <section className="challenges-section">
        <div className="section-header-row">
          <h3 className="section-title">Available Weekly Challenges</h3>
          <button type="button" className="btn-refresh" onClick={handleRefreshDiscovery} title="Shuffle Available Challenges">
            <RefreshCw size={14} />
            Refresh List
          </button>
        </div>

        <div className="discovery-challenges-grid">
          {activeDiscoveryIds.map(id => {
            const challenge = CHALLENGES.find(c => c.id === id);
            if (!challenge) return null;

            const catMeta = getCategoryMeta(challenge.categoryId);
            const isExpanded = expandedChallengeId === challenge.id;
            
            // Check if user is already subscribed to this category
            const isSubscribedToCat = user && !!challengesState.active[challenge.categoryId];

            return (
              <div key={challenge.id} className="glass-panel discovery-card animate-scale-up">
                <div className="discovery-header">
                  <div className="cat-label" style={{ background: catMeta.gradient }}>
                    <DynamicIcon name={catMeta.icon} size={12} />
                    <span>{catMeta.title}</span>
                  </div>

                  <span className="follower-count">
                    👤 {(followerCounts[challenge.id] || challenge.baseFollowers).toLocaleString()} following
                  </span>
                </div>

                <h4 className="discovery-title">{challenge.title}</h4>
                <p className="discovery-desc">{challenge.description}</p>

                <div className="discovery-badge-box">
                  <div className="badge-preview-icon" style={{ background: challenge.badge.gradient }}>
                    <DynamicIcon name={challenge.badge.icon} size={16} />
                  </div>
                  <div className="badge-preview-details">
                    <span className="badge-preview-title">Earns Badge: {challenge.badge.title}</span>
                    <p className="badge-preview-desc">{challenge.badge.description}</p>
                  </div>
                </div>

                {/* Collapsible details for guest & review */}
                <div className="collapsible-tasks-section">
                  <button 
                    type="button" 
                    className="btn-toggle-expand"
                    onClick={() => setExpandedChallengeId(isExpanded ? null : challenge.id)}
                  >
                    <span>{isExpanded ? 'Hide' : 'Preview'} 7-Day Tasks List</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="expanded-days-list animate-scale-up">
                      {challenge.days.map((dayText, idx) => (
                        <div key={idx} className="expanded-day-row">
                          <span className="day-bullet">Day {idx + 1}</span>
                          <span className="day-text">{dayText}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subscriptions buttons based on user status */}
                <div className="discovery-actions">
                  {user ? (
                    <button 
                      type="button" 
                      className="btn-subscribe-now"
                      style={{ background: catMeta.gradient }}
                      onClick={() => handleSubscribe(challenge)}
                    >
                      {isSubscribedToCat ? 'Swap Subscriptions' : 'Subscribe to Weekly Challenge'}
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-subscribe-now guest-btn"
                      onClick={() => setIsAuthOpen(true)}
                    >
                      Sign In to Subscribe
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Badges Earned Gallery */}
      <section className="challenges-section">
        <h3 className="section-title">Credentials & Badges Gallery</h3>
        
        {!user && (
          <div className="badge-locked-alert">
            <AlertCircle size={16} />
            <span>All badges are disabled. <strong>Sign in</strong> to start completing weekly challenges and unlock these credentials on your account.</span>
          </div>
        )}

        <div className="badges-gallery-grid">
          {CHALLENGES.map(challenge => {
            const isEarned = user && challengesState.completed.includes(challenge.id);
            const badge = challenge.badge;
            const catMeta = getCategoryMeta(challenge.categoryId);

            return (
              <div 
                key={badge.id} 
                className={`glass-panel badge-gallery-card ${isEarned ? 'earned' : 'locked'}`}
              >
                {isEarned ? (
                  <>
                    <div 
                      className="badge-main-circle animate-float"
                      style={{ 
                        background: badge.gradient,
                        boxShadow: `0 6px 20px ${badge.color}45`
                      }}
                    >
                      <DynamicIcon name={badge.icon} size={28} />
                    </div>
                    <h4 className="badge-title">{badge.title}</h4>
                    <span className="badge-category-tag" style={{ color: badge.color }}>{catMeta.title}</span>
                    <p className="badge-desc">{badge.description}</p>
                    <div className="badge-earned-date">
                      <CheckCircle2 size={12} className="text-emerald" />
                      <span>Unlocked Credential</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="badge-main-circle locked-circle">
                      <Lock size={24} className="text-muted" />
                    </div>
                    <h4 className="badge-title locked-title">{badge.title}</h4>
                    <span className="badge-category-tag locked-tag">{catMeta.title}</span>
                    <p className="badge-desc locked-desc">{badge.description}</p>
                    <div className="badge-earned-date locked-date">
                      <span>Challenge Locked</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Auth Modal Trigger */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
