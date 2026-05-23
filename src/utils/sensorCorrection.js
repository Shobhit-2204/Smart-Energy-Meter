// ACS712-5A correction constants (empirically measured)
export const SENSOR_OFFSET = 130;
export const SENSOR_SCALE = 0.00126;

// isSimulated = true for AC device — skip correction, already correct
export function correctCurrent(rawAmps, isSimulated = false) {
  if (isSimulated) return Math.max(0, rawAmps ?? 0);
  if (rawAmps == null || isNaN(rawAmps)) return 0;
  return Math.max(0, (rawAmps - SENSOR_OFFSET) * SENSOR_SCALE);
}

export function correctPower(rawAmps, voltage = 230, isSimulated = false) {
  return correctCurrent(rawAmps, isSimulated) * Math.max(0, voltage ?? 230);
}

export function isSimulatedDevice(deviceName = '') {
  const normalized = String(deviceName ?? '').trim().toLowerCase();
  return normalized === 'ac' || normalized === 'air conditioner' || normalized === 'air-conditioner';
}
