import { useBudget } from '../utils/supabaseHooks';
import '../styles/BudgetBar.css';

export default function BudgetBar({ actualBill, projectedBill, projectedKwh }) {
  const { budget, loading, error } = useBudget();

  if (loading) {
    return (
      <div className="budget-bar-container">
        <div className="budget-loading">Loading budget data...</div>
      </div>
    );
  }

  if (!budget || !budget.monthly_budget_limit) {
    return (
      <div className="budget-bar-container">
        <div className="budget-not-set">
          <p className="text-slate-400">No budget set yet. Please configure your monthly budget limit in Budget Settings.</p>
        </div>
      </div>
    );
  }

  const budgetLimit = budget.monthly_budget_limit;
  const actual = actualBill || 0;
  const projected = projectedBill || 0;

  // Calculate percentages
  const actualPercent = Math.min((actual / budgetLimit) * 100, 100);
  const projectedPercent = Math.min((projected / budgetLimit) * 100, 100);

  // Determine status
  const isActualExceeded = actual > budgetLimit;
  const isProjectedExceeded = projected > budgetLimit;
  const remainingBudget = Math.max(budgetLimit - actual, 0);

  // Calculate buffer status
  let bufferStatus = 'safe';
  if (projectedPercent > 100) {
    bufferStatus = 'exceeded';
  } else if (projectedPercent > 80) {
    bufferStatus = 'warning';
  }

  return (
    <div className="budget-bar-container">
      <div className="budget-header">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <div className="icon-wallet text-yellow-400 text-xl"></div>
          Budget Analysis
        </h3>
      </div>

      {/* Budget Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {/* Budget Limit Card */}
        <div className="budget-card budget-limit-card">
          <p className="text-slate-400 text-xs mb-1">Monthly Budget Limit</p>
          <div className="text-2xl font-bold text-cyan-400">
            <div className="icon-indian-rupee text-base inline"></div>
            {budgetLimit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Actual Bill Card */}
        <div className={`budget-card ${isActualExceeded ? 'budget-exceeded-card' : 'budget-normal-card'}`}>
          <p className="text-slate-400 text-xs mb-1">Current Bill (Today)</p>
          <div className={`text-2xl font-bold ${isActualExceeded ? 'text-red-400' : 'text-green-400'}`}>
            <div className="icon-indian-rupee text-base inline"></div>
            {actual.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          {isActualExceeded && <span className="text-xs text-red-400 mt-1 block">Exceeded by ₹{(actual - budgetLimit).toFixed(2)}</span>}
        </div>

        {/* Projected Bill Card */}
        <div className={`budget-card ${isProjectedExceeded ? 'budget-exceeded-card' : 'budget-normal-card'}`}>
          <p className="text-slate-400 text-xs mb-1">Projected Bill (Month End)</p>
          <div className={`text-2xl font-bold ${isProjectedExceeded ? 'text-red-400' : 'text-yellow-400'}`}>
            <div className="icon-indian-rupee text-base inline"></div>
            {projected.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          {isProjectedExceeded && <span className="text-xs text-red-400 mt-1 block">May exceed by ₹{(projected - budgetLimit).toFixed(2)}</span>}
        </div>

        {/* Remaining Budget Card */}
        <div className="budget-card budget-remaining-card">
          <p className="text-slate-400 text-xs mb-1">Remaining Budget</p>
          <div className={`text-2xl font-bold ${remainingBudget > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <div className="icon-indian-rupee text-base inline"></div>
            {remainingBudget.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <span className={`text-xs mt-1 block ${remainingBudget > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {remainingBudget > 0 ? `${((remainingBudget / budgetLimit) * 100).toFixed(1)}% left` : 'Over budget'}
          </span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="budget-bars-section">
        {/* Actual Bill Progress */}
        <div className="budget-bar-item mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-300">Actual Bill vs Budget</span>
            <span className={`text-sm font-bold ${isActualExceeded ? 'text-red-400' : 'text-green-400'}`}>
              {actualPercent.toFixed(1)}%
            </span>
          </div>
          <div className="budget-progress-bar">
            <div
              className={`budget-progress-fill actual-fill ${isActualExceeded ? 'exceeded' : ''}`}
              style={{ width: `${actualPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">₹{actual.toFixed(2)} / ₹{budgetLimit.toFixed(2)}</p>
        </div>

        {/* Projected Bill Progress */}
        <div className="budget-bar-item">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-300">Projected Bill vs Budget</span>
            <span className={`text-sm font-bold ${isProjectedExceeded ? 'text-red-400' : projectedPercent > 80 ? 'text-yellow-400' : 'text-blue-400'}`}>
              {projectedPercent.toFixed(1)}%
            </span>
          </div>
          <div className="budget-progress-bar">
            <div
              className={`budget-progress-fill projected-fill ${bufferStatus}`}
              style={{ width: `${projectedPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">₹{projected.toFixed(2)} / ₹{budgetLimit.toFixed(2)}</p>
        </div>
      </div>

      {/* Budget Alert/Recommendation */}
      <div className={`budget-alert mt-6 alert-${bufferStatus}`}>
        {bufferStatus === 'exceeded' && (
          <div className="flex items-start gap-3">
            <div className="icon-alert-triangle text-lg text-red-400 mt-0.5"></div>
            <div>
              <p className="font-semibold text-red-300">Budget Alert</p>
              <p className="text-xs text-red-200 mt-1">
                Your projected bill (₹{projected.toFixed(2)}) will exceed your budget limit (₹{budgetLimit.toFixed(2)}) by ₹{(projected - budgetLimit).toFixed(2)}. Implement optimization recommendations to reduce consumption.
              </p>
            </div>
          </div>
        )}
        {bufferStatus === 'warning' && (
          <div className="flex items-start gap-3">
            <div className="icon-alert-circle text-lg text-yellow-400 mt-0.5"></div>
            <div>
              <p className="font-semibold text-yellow-300">Budget Warning</p>
              <p className="text-xs text-yellow-200 mt-1">
                Your projected bill is at {projectedPercent.toFixed(1)}% of your budget. {Math.round((projectedPercent - 80))} percentage points more and you'll exceed your limit. Start implementing optimizations now.
              </p>
            </div>
          </div>
        )}
        {bufferStatus === 'safe' && (
          <div className="flex items-start gap-3">
            <div className="icon-check-circle text-lg text-green-400 mt-0.5"></div>
            <div>
              <p className="font-semibold text-green-300">On Track</p>
              <p className="text-xs text-green-200 mt-1">
                Your projected bill (₹{projected.toFixed(2)}) is within your budget limit (₹{budgetLimit.toFixed(2)}). You have ₹{(budgetLimit - projected).toFixed(2)} remaining.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mt-4 text-red-200 text-xs flex items-center gap-2">
          <div className="icon-alert-triangle text-lg"></div>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
