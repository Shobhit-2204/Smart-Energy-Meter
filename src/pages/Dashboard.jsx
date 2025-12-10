import DashboardStats from '../components/DashboardStats';
import DeviceCard from '../components/DeviceCard';

export default function Dashboard() {
  try {
    return (
      <div data-name="dashboard-page" data-file="pages/Dashboard.jsx">
        <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Dashboard</h1>
        <DashboardStats />
        <DeviceCard />
      </div>
    );
  } catch (error) {
    console.error('Dashboard component error:', error);
    return null;
  }
}
