import { useState, useMemo } from 'react';
import DashboardHome from '../pages/DashboardHome';
import UploadFiles from '../pages/UploadFiles';
import Transactions from '../pages/Transaction';
import Subscription from '../pages/Subscription';

type UserType = {
  id: number;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  credits?: number;
  // other fields omitted for brevity
};

function Dashboard({ user }: { user: string | null }) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // parse once, memoize to avoid repeated JSON.parse on rerenders
  const parsedUser = useMemo<UserType | null>(() => {
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }, [user]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'upload', label: 'Upload Files', icon: '📁' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'subscription', label: 'Subscription', icon: '⭐' }
  ];

const renderPage = () => {
  switch (currentPage) {
    case 'dashboard':
      return <DashboardHome setCurrentPage={setCurrentPage} />;
    case 'upload':
      return <UploadFiles userval={user} />;
    case 'transactions':
      return <Transactions userval = {user} />;
    case 'subscription':
      return <Subscription userdata={user} />;
    default:
      return <DashboardHome setCurrentPage={setCurrentPage} />;
  }
};


  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile navbar */}
        <div className="navbar lg:hidden bg-base-100 shadow-sm">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <span className="text-lg font-bold">FileSharing Dashboard</span>
          </div>
        </div>
        <main className="flex-1 bg-base-200 min-h-screen">{renderPage()}</main>
      </div>

      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-64 min-h-full bg-base-100">
          <div className="p-4">
            <ul className="menu space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-3 w-full text-left p-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
