import { useState } from 'react';
import { useDevices } from '../utils/supabaseHooks';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../utils/supabaseClient';
import EnergyConsumptionChart from './EnergyConsumptionChart';

// --- CONFIGURATION ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const CURRENCY = "₹";

// Define pricing tiers to send to AI
const PRICING_TIERS_DESC = `
- 0 to 200 units: ₹3/unit
- 201 to 400 units: ₹4.50/unit
- 401 to 800 units: ₹6.50/unit
- 801 to 1200 units: ₹7/unit
- Above 1200 units: ₹8/unit
`;

export default function Analytics() {
  try {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [error, setError] = useState(null);
    
    const { devices } = useDevices();

    const handleMonthChange = (offset) => {
      setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - offset, 1));
    };

    const generateInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        // Determine if we're analyzing current month or a past month
        const now = new Date();
        const isCurrentMonth = selectedMonth.getFullYear() === now.getFullYear() && 
                              selectedMonth.getMonth() === now.getMonth();

        // Format: "2025-10" for the RPC function
        const targetMonthStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;

        // Fetch aggregated data using same RPC function as chart and dashboard
        const { data: statsData, error: dbError } = await supabase
          .rpc('get_monthly_stats', { target_month: targetMonthStr });

        if (dbError) throw dbError;

        // Aggregate Usage Data by Device
        let totalKwh = 0;
        const deviceUsage = {};

        statsData.forEach(row => {
          const kwh = Number(row.total_kwh) || 0;
          totalKwh += kwh;
          if (!deviceUsage[row.device_id]) {
            deviceUsage[row.device_id] = 0;
          }
          deviceUsage[row.device_id] += kwh;
        });

        // Map device IDs to names for better readability
        const deviceBreakdown = {};
        Object.entries(deviceUsage).forEach(([deviceId, kwh]) => {
          const device = devices.find(d => d.id === deviceId);
          const deviceName = device?.name || deviceId;
          deviceBreakdown[deviceName] = kwh.toFixed(2);
        });

        // Construct the Prompt for Gemini
        const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
        const currentDay = now.getDate();

        const prompt = `
Act as an expert Home Energy Auditor.

CONTEXT DATA:
- Analysis Month: ${selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
${isCurrentMonth ? `- Current Date: Day ${currentDay} of ${daysInMonth}` : `- Analysis Period: Full month (${daysInMonth} days)`}
- Total Usage: ${totalKwh.toFixed(2)} kWh
- Device Breakdown (Device: kWh): ${JSON.stringify(deviceBreakdown)}

PRICING STRUCTURE (Tiered):
${PRICING_TIERS_DESC}

TASK:
1. **Project** the total kWh for the end of the month based on current usage. ${isCurrentMonth ? `Use daily average from ${currentDay} days.` : 'Analyze the total consumption for this complete month.'}
2. **Calculate** the estimated bill using the PRICING STRUCTURE provided above. Apply the tiers correctly to the projected total. Show the calculation logic.
3. **Analyze** the device breakdown and provide 3 specific, actionable tips to reduce costs (focus on the highest consumers) considering weather condition according to ${selectedMonth} in Delhi, India Location.

OUTPUT FORMAT:
Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
{git remote add origin https://github.com/Shobhit-2204/Smart-Energy-Meter.git
git push -u origin main  
  "projected_kwh": 123.45,
  "estimated_bill": 456.78,
  "tips": [
    "Tip 1...",
    "Tip 2...",
    "Tip 3..."
  ]
}`;

        // Call Gemini API
        if (!GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY not found in environment variables');
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        // Safe Parsing
        const rawText = response.text();
        const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedResult = JSON.parse(jsonText);
        
        setAiData(parsedResult);

      } catch (err) {
        console.error("AI Insight Error:", err);
        setError(`Failed to analyze data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div data-name="analytics-page" data-file="components/Analytics.jsx">
        <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Analytics</h1>
        
        {/* Chart Section */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Energy Consumption History - {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleMonthChange(1)}
                className="px-3 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                ← Previous
              </button>
              <button
                onClick={() => handleMonthChange(-1)}
                disabled={selectedMonth >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                className="px-3 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                Next →
              </button>
            </div>
          </div>
          <EnergyConsumptionChart selectedMonth={selectedMonth} />
        </div>

        {/* AI Insights Section */}
        <div className="w-full">
          {/* TRIGGER BUTTON */}
          {!aiData && !loading && (
            <button 
              onClick={generateInsights}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.01]"
            >
              <div className="icon-sparkles text-lg text-yellow-300"></div>
              <span>Get AI Energy Analysis</span>
            </button>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center animate-pulse">
              <div className="icon-loader text-2xl text-blue-400 animate-spin mb-3"></div>
              <p className="text-gray-300">Analyzing usage patterns & calculating tiered pricing...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-200">
              <div className="icon-alert-triangle text-lg"></div>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-sm hover:underline">Dismiss</button>
            </div>
          )}

          {/* RESULTS DISPLAY */}
          {aiData && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl animate-in fade-in">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="icon-sparkles text-yellow-400 text-lg"></div>
                    Smart Energy Forecast
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Based on tiered pricing logic - {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
                <button 
                  onClick={() => setAiData(null)} 
                  className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                  <p className="text-slate-400 text-sm mb-1">Projected Month-End Usage</p>
                  <div className="text-2xl font-bold text-blue-400">
                    {aiData.projected_kwh} <span className="text-sm font-normal text-slate-500">kWh</span>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                  <p className="text-slate-400 text-sm mb-1">Estimated Month-End Bill</p>
                  <div className="text-2xl font-bold text-green-400 flex items-center gap-1">
                    <div className="icon-indian-rupee text-lg"></div>
                    {aiData.estimated_bill}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <div className="icon-lightbulb text-yellow-400 text-lg"></div>
                  Efficiency Recommendations
                </h4>
                <ul className="space-y-3">
                  {aiData.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm bg-slate-700/20 p-3 rounded-lg border-l-2 border-indigo-500">
                      <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-0.5 rounded mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Analytics component error:', error);
    return null;
  }
}
