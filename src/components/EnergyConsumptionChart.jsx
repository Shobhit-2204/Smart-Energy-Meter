import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../utils/supabaseClient';
import { useDevices } from '../utils/supabaseHooks';
import { useEffect, useState, useMemo } from 'react';

export default function EnergyConsumptionChart({ selectedMonth }) {
  const { devices } = useDevices();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default to current month if none selected
  const displayMonthDate = selectedMonth || new Date();
  
  // Format: "2025-10" for the SQL function
  const targetMonthStr = `${displayMonthDate.getFullYear()}-${String(displayMonthDate.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    const fetchAggregatedData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching stats for: ${targetMonthStr}`);

        // CALL THE RPC FUNCTION (Server-Side Aggregation)
        const { data, error } = await supabase
          .rpc('get_monthly_stats', { target_month: targetMonthStr });

        if (error) throw error;

        // Transform Data for Recharts with CUMULATIVE totals
        // Incoming: [{ day_date: '2025-10-01', device_id: '...', total_kwh: 1.5 }, ...]
        // Outgoing: [{ date: '01/10', 'Bulb': 1.5, 'AC': 12.0 }, ...] (with cumulative sums)

        const processed = {};
        
        data.forEach(row => {
          // Format Date: "2025-10-01" -> "01/10"
          const [yyyy, mm, dd] = row.day_date.split('-');
          const displayDate = `${dd}/${mm}`;

          if (!processed[displayDate]) {
            processed[displayDate] = { date: displayDate };
          }

          // Find Device Name
          const device = devices.find(d => d.id === row.device_id);
          const deviceName = device ? device.name : 'Unknown';

          processed[displayDate][deviceName] = row.total_kwh;
        });

        // Convert Object to Array and sort by day
        let sortedData = Object.values(processed).sort((a, b) => {
          // Sort by day number
          return parseInt(a.date.split('/')[0]) - parseInt(b.date.split('/')[0]);
        });

        // Calculate CUMULATIVE totals for each device
        const cumulativeData = [];
        const cumulativeTotals = {}; // Track running totals per device
        
        sortedData.forEach(dayData => {
          const newDayData = { date: dayData.date };
          
          // For each device, add today's usage to the cumulative total
          Object.keys(dayData).forEach(key => {
            if (key !== 'date') {
              if (!cumulativeTotals[key]) {
                cumulativeTotals[key] = 0;
              }
              cumulativeTotals[key] += dayData[key];
              newDayData[key] = parseFloat(cumulativeTotals[key].toFixed(2));
            }
          });
          
          cumulativeData.push(newDayData);
        });

        const finalChartData = cumulativeData;

        setChartData(finalChartData);
        console.log('Chart data processed:', finalChartData.length, 'days');

      } catch (err) {
        console.error("Chart Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (devices.length > 0) {
      fetchAggregatedData();
    }
  }, [targetMonthStr, devices]);

  // Extract unique device names for lines
  const deviceNames = useMemo(() => {
    if (chartData.length === 0) return [];
    const keys = new Set();
    chartData.forEach(row => Object.keys(row).forEach(k => {
      if (k !== 'date') keys.add(k);
    }));
    return Array.from(keys).sort();
  }, [chartData]);

  const colors = ['#3b82f6', '#ef4444', '#fbbf24', '#10b981', '#8b5cf6'];

  if (loading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <div className="text-[var(--text-secondary)]">Loading chart data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex justify-center items-center text-[var(--text-secondary)] flex-col">
        <p>No data found for {displayMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        <p className="text-xs mt-2">Total logs in system: {devices.length > 0 ? 'Check database' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: '400px', minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 50, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            label={{ value: 'Date (DD/MM)', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            label={{ value: 'Cumulative Energy (kWh)', angle: -90, position: 'center', offset: 40 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
            formatter={(value) => {
              if (typeof value === 'number') return value.toFixed(2) + ' kWh';
              return value;
            }}
          />
          <Legend wrapperStyle={{ color: '#9ca3af', paddingTop: '20px' }} />
          {deviceNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
