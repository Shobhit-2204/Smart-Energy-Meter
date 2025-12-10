import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

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

export const useLiveMonitor = () => {
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLiveMonitor();
    
    // Subscribe to realtime updates
    const subscription = supabase
      .channel('public:live_monitor')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_monitor' },
        (payload) => {
          console.log('Live monitor update:', payload);
          if (payload.new) {
            setLiveData((prev) => ({
              ...prev,
              [payload.new.device_id]: payload.new,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchLiveMonitor = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('live_monitor')
        .select('*');
      
      if (error) throw error;
      
      const dataMap = {};
      (data || []).forEach((item) => {
        dataMap[item.device_id] = item;
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
