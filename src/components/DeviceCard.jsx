import { useDevices, useLiveMonitor } from '../utils/supabaseHooks';

const DEVICE_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'];
const DEVICE_ICONS = ['lightbulb', 'wind', 'laptop', 'fan', 'zap'];

// Create a stable color map for devices based on ID
const colorMap = new Map();
const iconMap = new Map();

const getDeviceColor = (deviceId) => {
  if (!colorMap.has(deviceId)) {
    colorMap.set(deviceId, DEVICE_COLORS[colorMap.size % DEVICE_COLORS.length]);
  }
  return colorMap.get(deviceId);
};

const getDeviceIcon = (deviceId) => {
  if (!iconMap.has(deviceId)) {
    iconMap.set(deviceId, DEVICE_ICONS[iconMap.size % DEVICE_ICONS.length]);
  }
  return iconMap.get(deviceId);
};

export default function DeviceCard() {
  try {
    const { devices, loading: devicesLoading, updateRelayState } = useDevices();
    const { liveData } = useLiveMonitor();

    const handleToggleDevice = async (deviceId, currentState) => {
      await updateRelayState(deviceId, !currentState);
    };

    if (devicesLoading) {
      return (
        <div className="flex justify-center items-center min-h-64">
          <p className="text-[var(--text-secondary)]">Loading devices...</p>
        </div>
      );
    }

    // Sort devices by ID to ensure consistent ordering
    const sortedDevices = [...devices].sort((a, b) => a.id.localeCompare(b.id));

    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-name="device-cards"
        data-file="components/DeviceCard.jsx"
      >
        {sortedDevices.map((device) => {
          const liveInfo = liveData[device.id] || {};
          const voltage = liveInfo.voltage || 0;
          const current = liveInfo.current || 0;
          const power = liveInfo.power || 0;
          const color = getDeviceColor(device.id);
          const icon = getDeviceIcon(device.id);

          return (
            <div key={device.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                  <div className={`icon-${icon} text-xl text-white`}></div>
                </div>
                <button
                  onClick={() => handleToggleDevice(device.id, device.relay_state)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    device.relay_state ? 'bg-[var(--primary-color)]' : 'bg-gray-600'
                  } relative`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    device.relay_state ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{device.name}</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Voltage</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{voltage.toFixed(2)}V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Current</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{current.toFixed(2)}A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Power</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{power.toFixed(2)}W</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  device.relay_state ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-gray-600 bg-opacity-20 text-gray-400'
                }`}>
                  {device.relay_state ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error('DeviceCard component error:', error);
    return null;
  }
}
