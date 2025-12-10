export default function Sidebar({ currentPage, setCurrentPage }) {
  try {
    const navItems = [
      { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
      { id: 'analytics', icon: 'chart-bar', label: 'Analytics' },
      { id: 'devices', icon: 'cpu', label: 'Devices' },
      { id: 'about', icon: 'info', label: 'About' }
    ];

    return (
      <div 
        className="fixed left-0 top-0 h-full w-64 bg-[var(--bg-card)] border-r border-gray-800 p-6 hidden md:block"
        data-name="sidebar"
        data-file="components/Sidebar.jsx"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center">
              <div className="icon-zap text-xl text-white"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">EnergyMeter</h2>
              <p className="text-xs text-[var(--text-secondary)]">Smart Monitoring</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <div className={`icon-${item.icon} text-lg mr-3`}></div>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}
