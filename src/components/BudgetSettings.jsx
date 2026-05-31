import { useState, useEffect } from 'react';
import { useBudget } from '../utils/supabaseHooks';
import '../styles/BudgetSettings.css';

export default function BudgetSettings() {
  const { budget, loading, error: fetchError, setBudget } = useBudget();
  const [budgetInput, setBudgetInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (budget && budget.monthly_budget_limit) {
      setBudgetInput(budget.monthly_budget_limit.toString());
    }
  }, [budget]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!budgetInput || parseFloat(budgetInput) <= 0) {
      setError('Please enter a valid budget amount greater than 0');
      return;
    }

    setSaving(true);
    try {
      const success = await setBudget(parseFloat(budgetInput));
      if (success) {
        setSuccessMessage(`Monthly budget limit set to ₹${parseFloat(budgetInput).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setError('Failed to save budget. Please try again.');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="budget-settings-container">
        <div className="flex items-center justify-center p-8">
          <div className="icon-loader text-3xl text-blue-400 animate-spin"></div>
          <p className="text-slate-400 ml-3">Loading budget settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-name="budget-settings-page" data-file="components/BudgetSettings.jsx">
      <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">Budget Settings</h1>
      <p className="text-[var(--text-secondary)] mb-8">Set your monthly electricity bill budget limit and track your spending</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Input Form */}
        <div className="budget-settings-form-section">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary-color)] bg-opacity-20 flex items-center justify-center">
                <div className="icon-wallet text-xl text-[var(--primary-color)]"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Monthly Budget</h2>
                <p className="text-xs text-[var(--text-secondary)]">Set your monthly electricity budget</p>
              </div>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Monthly Budget Limit (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] text-lg">
                    <div className="icon-indian-rupee"></div>
                  </span>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder="Enter your monthly budget"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-dark)] border border-gray-700 rounded-lg text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  💡 Tip: Set a realistic budget based on your historical usage to stay on track
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Current Budget
                </label>
                <div className="p-3 bg-[var(--bg-card)] border border-gray-700 rounded-lg">
                  {budget && budget.monthly_budget_limit ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Active Budget:</span>
                      <span className="text-2xl font-bold text-[var(--primary-color)]">
                        ₹{budget.monthly_budget_limit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[var(--text-secondary)] text-sm">No budget set. Enter an amount above and save.</p>
                  )}
                  {budget && (
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      Last updated: {new Date(budget.updated_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 flex items-start gap-3 text-green-200">
                  <div className="icon-check-circle text-lg mt-0.5"></div>
                  <div>
                    <p className="font-semibold text-sm">{successMessage}</p>
                  </div>
                </div>
              )}

              {(error || fetchError) && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-3 text-red-200">
                  <div className="icon-alert-triangle text-lg mt-0.5"></div>
                  <div>
                    <p className="font-semibold text-sm">{error || fetchError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-gradient-to-r from-[var(--primary-color)] to-indigo-600 hover:from-opacity-90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="icon-loader animate-spin text-lg"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <div className="icon-save text-lg"></div>
                    <span>Save Budget</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Information Section */}
        <div className="budget-settings-info-section">
          <div className="card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-info text-xl text-blue-400"></div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">How Budget Tracking Works</h3>
            </div>
            <div className="space-y-4 text-sm text-[var(--text-secondary)]">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold">1</div>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Set Your Budget</p>
                  <p>Enter your desired monthly electricity bill limit above</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold">2</div>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Track Actual Spending</p>
                  <p>View your current month's bill and compare it against your budget in Analytics</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold">3</div>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">See Projections</p>
                  <p>AI predicts your month-end bill based on current usage</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold">4</div>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Get Optimization Tips</p>
                  <p>Receive AI-powered suggestions to stay within budget</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-lightbulb text-xl text-yellow-400"></div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Budget Setting Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">→</span>
                <span><strong>Start Conservative:</strong> Review your past 3-6 months of bills and set a budget slightly lower to encourage savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">→</span>
                <span><strong>Consider Seasonality:</strong> Electricity usage varies by season. Adjust your budget for summer (AC) or winter (heating)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">→</span>
                <span><strong>Regular Review:</strong> Check your Analytics page monthly to monitor performance against budget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">→</span>
                <span><strong>Use AI Recommendations:</strong> Follow the efficiency tips to optimize consumption and stay on track</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
