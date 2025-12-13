import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useDevices } from '../utils/supabaseHooks';

// Calculate tiered pricing
const calculateTieredPrice = (units) => {
  let totalPrice = 0;
  let remainingUnits = units;

  // 0-200 units: ₹3 per unit
  if (remainingUnits > 0) {
    const tier1Units = Math.min(remainingUnits, 200);
    totalPrice += tier1Units * 3;
    remainingUnits -= tier1Units;
  }

  // 201-400 units: ₹4.50 per unit
  if (remainingUnits > 0) {
    const tier2Units = Math.min(remainingUnits, 200);
    totalPrice += tier2Units * 4.50;
    remainingUnits -= tier2Units;
  }

  // 401-800 units: ₹6.50 per unit
  if (remainingUnits > 0) {
    const tier3Units = Math.min(remainingUnits, 400);
    totalPrice += tier3Units * 6.50;
    remainingUnits -= tier3Units;
  }

  // 801-1200 units: ₹7 per unit
  if (remainingUnits > 0) {
    const tier4Units = Math.min(remainingUnits, 400);
    totalPrice += tier4Units * 7;
    remainingUnits -= tier4Units;
  }

  // Above 1200 units: ₹8 per unit
  if (remainingUnits > 0) {
    totalPrice += remainingUnits * 8;
  }

  return totalPrice;
};

export default function DashboardStats() {
  const { devices } = useDevices();
  const [totalPower, setTotalPower] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalEnergy = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const targetMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Use the same RPC function as the chart
        const { data, error } = await supabase
          .rpc('get_monthly_stats', { target_month: targetMonthStr });

        if (error) throw error;

        // Sum all energy values across all devices and days
        const total = data.reduce((sum, row) => sum + (row.total_kwh || 0), 0);
        setTotalPower(Math.round(total * 100) / 100);
      } catch (err) {
        console.error('Error fetching total energy:', err);
        setTotalPower(0);
      } finally {
        setLoading(false);
      }
    };

    if (devices.length > 0) {
      fetchTotalEnergy();
    }
  }, [devices]);

  try {
    const totalBill = Math.round(calculateTieredPrice(totalPower) * 100) / 100;

    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        data-name="dashboard-stats"
        data-file="components/DashboardStats.jsx"
      >
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[var(--text-secondary)] text-sm mb-1">Total Energy Consumed</p>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                {loading ? '...' : `${totalPower} kWh`}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <div className="icon-zap text-2xl text-blue-400"></div>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">This month</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[var(--text-secondary)] text-sm mb-1">Total Bill</p>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">₹{loading ? '...' : totalBill}</h2>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="icon-indian-rupee text-2xl text-green-400"></div>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">For {new Date().toLocaleString('default', { month: 'long' })}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DashboardStats component error:', error);
    return null;
  }
}
