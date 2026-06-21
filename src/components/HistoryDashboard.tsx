import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFootprintHistory, SavedFootprint } from '../utils/firebaseService';
import { CATEGORIES } from '../data/questions';
import { DynamicIcon } from './UI/IconCard';
import { Calendar, TreePine, ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
import './HistoryDashboard.css';

interface HistoryDashboardProps {
  onViewCalculator: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ onViewCalculator }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<SavedFootprint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const data = await getFootprintHistory(user.uid);
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load your footprint history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // Format date helper
  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '';
    let date: Date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (
      timestamp &&
      typeof timestamp === 'object' &&
      'toDate' in timestamp &&
      typeof (timestamp as { toDate: () => Date }).toDate === 'function'
    ) {
      date = (timestamp as { toDate: () => Date }).toDate();
    } else {
      date = new Date(timestamp as string | number);
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="history-container animate-fade-in py-10 px-margin-mobile md:px-margin-desktop">
        <div className="glass-panel history-loader-card">
          <RefreshCw size={36} className="animate-spin text-emerald" style={{ color: 'var(--color-emerald)' }} />
          <p>Loading your environmental footprint logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container animate-fade-in py-10 px-margin-mobile md:px-margin-desktop">
      <div className="history-header-row">
        <button type="button" className="btn-back-to-calc" onClick={onViewCalculator}>
          <ArrowLeft size={16} />
          Back to Calculator
        </button>

        <h2 className="history-title">My Footprint History</h2>
      </div>

      {error && <div className="history-error-alert">{error}</div>}

      {history.length === 0 ? (
        <div className="glass-panel empty-history-card">
          <TreePine size={48} className="text-emerald" style={{ opacity: 0.5, color: 'var(--color-emerald)' }} />
          <h3>No footprint history saved yet</h3>
          <p>
            You haven't saved any calculations to your account. Run a new carbon assessment and save it to track your impact here.
          </p>
          <button type="button" className="btn-start-history" onClick={onViewCalculator}>
            Start Your First Assessment
          </button>
        </div>
      ) : (
        <div className="history-dashboard-grid">
          {/* Summary Box */}
          <div className="glass-panel history-summary-card">
            <div className="summary-stat">
              <span className="summary-stat-value">{history.length}</span>
              <span className="summary-stat-label">Assessments Saved</span>
            </div>
            
            <div className="summary-divider" />
            
            <div className="summary-stat">
              <span className="summary-stat-value">
                {(history.reduce((acc, curr) => acc + curr.totalCO2, 0) / history.length / 1000).toFixed(2)}t
              </span>
              <span className="summary-stat-label">Average Emissions</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-stat">
              <span className="summary-stat-value text-red">
                {Math.round(history.reduce((acc, curr) => acc + curr.treesCut, 0) / history.length)}
              </span>
              <span className="summary-stat-label">Average Tree Debt</span>
            </div>
          </div>

          {/* History Log List */}
          <div className="history-list">
            {history.map((log) => (
              <div key={log.id} className="glass-panel history-item-card">
                <div className="history-item-top">
                  <div className="history-item-date">
                    <Calendar size={14} className="text-muted" />
                    <span>{formatDate(log.timestamp)}</span>
                  </div>
                  
                  <div className="history-item-metrics">
                    <div className="metric-tag co2-tag">
                      <strong>{(log.totalCO2 / 1000).toFixed(1)} metric tons</strong> of CO2e/yr
                    </div>
                    <div className="metric-tag tree-tag">
                      <TreePine size={14} />
                      <strong>{log.treesCut}</strong> tree debt
                    </div>
                  </div>
                </div>

                <div className="history-item-breakdown">
                  <h4 className="breakdown-subtitle">
                    <BarChart2 size={14} /> Category Breakdown
                  </h4>
                  <div className="history-categories-grid">
                    {CATEGORIES.map((cat) => {
                      const catEmissions = log.breakdown[cat.id as keyof typeof log.breakdown] || 0;
                      const catPercentage = log.totalCO2 > 0 ? Math.round((catEmissions / log.totalCO2) * 100) : 0;

                      return (
                        <div key={cat.id} className="hist-cat-item">
                          <div className="hist-cat-label-row">
                            <div className="hist-cat-icon-title">
                              <div className="hist-cat-icon" style={{ background: cat.gradient }}>
                                <DynamicIcon name={cat.icon} size={12} />
                              </div>
                              <span className="hist-cat-title">{cat.title}</span>
                            </div>
                            <span className="hist-cat-val">{catPercentage}%</span>
                          </div>
                          
                          <div className="hist-cat-bar-track">
                            <div 
                              className="hist-cat-bar-fill" 
                              style={{ 
                                width: `${catPercentage}%`,
                                background: cat.gradient 
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
