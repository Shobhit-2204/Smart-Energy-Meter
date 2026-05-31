import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { correctCurrent, correctPower, isSimulatedDevice } from './sensorCorrection';

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
    
    // Subscribe to realtime updates
    const subscription = supabase
      .channel('public:devices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        (payload) => {
          console.log('Device update:', payload);
          fetchDevices();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: true }); // Always sort by creation date
      
      if (error) throw error;
      setDevices(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRelayState = async (deviceId, newState) => {
    try {
      // Optimistic update: update local state immediately
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId ? { ...device, relay_state: newState } : device
        )
      );

      // Then update in database
      const { error } = await supabase
        .from('devices')
        .update({ relay_state: newState })
        .eq('id', deviceId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error updating relay state:', err);
      setError(err.message);
      // Revert on error
      await fetchDevices();
    }
  };

  return { devices, loading, error, updateRelayState, refetch: fetchDevices };
};

export const useLiveMonitor = (devices = []) => {
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveMonitor = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('live_monitor')
        .select('*');
      
      if (error) throw error;
      
      const dataMap = {};
      (data || []).forEach((item) => {
        const deviceName = devices.find(d => d.id === item.device_id)?.name ?? '';
        const sim = isSimulatedDevice(deviceName);
        dataMap[item.device_id] = {
          ...item,
          current: correctCurrent(item.current, sim),
          power: correctPower(item.current, item.voltage, sim),
        };
      });
      setLiveData(dataMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching live monitor:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMonitor();
  }, [devices]);

  useEffect(() => {
    // Subscribe to realtime updates
    const subscription = supabase
      .channel('public:live_monitor')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_monitor' },
        (payload) => {
          console.log('Live monitor update:', payload);
          if (payload.new) {
            const deviceName = devices.find(d => d.id === payload.new.device_id)?.name ?? '';
            const sim = isSimulatedDevice(deviceName);
            const correctedRow = {
              ...payload.new,
              current: correctCurrent(payload.new.current, sim),
              power: correctPower(payload.new.current, payload.new.voltage, sim),
            };
            setLiveData((prev) => ({
              ...prev,
              [payload.new.device_id]: correctedRow,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [devices]);

  return { liveData, loading, error, refetch: fetchLiveMonitor };
};

export const useEnergyLogs = (deviceId = null) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnergyLogs();
    
    // Subscribe to realtime updates for energy_logs
    const subscription = supabase
      .channel('public:energy_logs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'energy_logs' },
        (payload) => {
          console.log('Energy log update:', payload);
          fetchEnergyLogs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [deviceId]);

  const fetchEnergyLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('energy_logs')
        .select('*');
      
      if (deviceId) {
        query = query.eq('device_id', deviceId);
      }
      
      const { data, error } = await query.order('recorded_at', { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching energy logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTotalMonthlyEnergyByDevice = (deviceId) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return logs
      .filter((log) => {
        const logDate = new Date(log.recorded_at);
        return log.device_id === deviceId && logDate >= monthStart;
      })
      .reduce((sum, log) => sum + (log.energy_kwh || 0), 0);
  };

  const getTotalMonthlyEnergy = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return logs
      .filter((log) => {
        const logDate = new Date(log.recorded_at);
        return logDate >= monthStart;
      })
      .reduce((sum, log) => sum + (log.energy_kwh || 0), 0);
  };

  return { 
    logs, 
    loading, 
    error, 
    getTotalMonthlyEnergyByDevice,
    getTotalMonthlyEnergy,
    refetch: fetchEnergyLogs 
  };
};

export const useBudget = () => {
  const [budget, setBudgetState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user email or use a default identifier (since we don't have user auth)
  const getUserIdentifier = () => {
    return localStorage.getItem('userEmail') || 'default_user';
  };

  useEffect(() => {
    fetchBudget();
    
    // Subscribe to realtime updates
    const subscription = supabase
      .channel('public:user_budgets')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_budgets' },
        (payload) => {
          console.log('Budget update:', payload);
          fetchBudget();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const userIdentifier = getUserIdentifier();
      const { data, error } = await supabase
        .from('user_budgets')
        .select('*')
        .eq('user_email', userIdentifier)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      setBudgetState(data || null);
      setError(null);
    } catch (err) {
      console.error('Error fetching budget:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setBudget = async (monthlyLimit) => {
    try {
      const userIdentifier = getUserIdentifier();
      
      if (budget) {
        // Update existing budget
        const { error } = await supabase
          .from('user_budgets')
          .update({ 
            monthly_budget_limit: monthlyLimit,
            updated_at: new Date().toISOString()
          })
          .eq('user_email', userIdentifier);
        
        if (error) throw error;
      } else {
        // Insert new budget
        const { error } = await supabase
          .from('user_budgets')
          .insert({
            user_email: userIdentifier,
            monthly_budget_limit: monthlyLimit,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      await fetchBudget();
      return true;
    } catch (err) {
      console.error('Error setting budget:', err);
      setError(err.message);
      return false;
    }
  };

  return { 
    budget, 
    loading, 
    error, 
    setBudget,
    refetch: fetchBudget 
  };
};
