import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './components/Analytics';
import DeviceList from './components/DeviceList';
import About from './components/About';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'devices':
        return <DeviceList />;
      case 'about':
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-[var(--bg-dark)]" data-name="app" data-file="App.jsx">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 p-6 md:p-8 ml-0 md:ml-64">
          {renderPage()}
        </div>
      </div>
    </ErrorBoundary>
  );
}
