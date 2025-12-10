import { useDevices } from '../utils/supabaseHooks';

const DEVICE_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'];
const DEVICE_ICONS = ['lightbulb', 'laptop', 'wind', 'fan', 'zap'];

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

export default function DeviceList() {
  try {
    const { devices, loading } = useDevices();

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-96">
          <p className="text-[var(--text-secondary)]">Loading devices...</p>
        </div>
      );
    }

    // Sort devices by ID to ensure consistent ordering
    const sortedDevices = [...devices].sort((a, b) => a.id.localeCompare(b.id));

    return (
      <div data-name="device-list-page" data-file="components/DeviceList.jsx">
        <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Device Management</h1>
        
        <div className="space-y-4">
          {sortedDevices.map((device) => {
            const color = getDeviceColor(device.id);
            const icon = getDeviceIcon(device.id);

            return (
              <div key={device.id} className="card">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${color}`}>
                    <div className={`icon-${icon} text-2xl text-white`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">{device.name}</h3>
                    <p className="text-[var(--text-secondary)]">
                      {device.description || 'No description'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--text-secondary)]">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      device.relay_state ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-gray-600 bg-opacity-20 text-gray-400'
                    }`}>
                      {device.relay_state ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error('DeviceList component error:', error);
    return null;
  }
}
