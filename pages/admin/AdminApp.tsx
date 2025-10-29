import React from 'react';
import { User, DepositRequest, Notification, WithdrawalRequest, RequestStatus } from '../../types';
import Button from '../../components/Button';
import AdminDashboard from './AdminDashboard';
import AllUsersPage from './AllUsersPage';
import DepositRequestsPage from './DepositRequestsPage';
import NotificationsPage from './NotificationsPage';
import WithdrawRequestsPage from './WithdrawRequestsPage';
import Icon from '../../components/Icon';
import NotificationModal from '../../components/NotificationModal';

interface AdminAppProps {
  user: User;
  users: User[];
  requests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  // FIX: Add missing 'notifications' prop to align with usage in App.tsx and the component itself.
  notifications: Notification[];
  // FIX: Updated function signatures to return Promise<void> to match async handlers.
  onUpdateRequestStatus: (id: string, status: 'approved' | 'declined', data?: { reason: string }) => Promise<void>;
  onUpdateWithdrawalRequestStatus: (id: string, status: 'approved' | 'declined', data?: { reason: string }) => Promise<void>;
  onAddNotification: (data: { title: string; content: string; userId?: string }) => void;
  onUpdateNotification: (notification: Notification) => void;
  onDeleteNotification: (id: string) => void;
  onLogout: () => void;
}

type AdminPage = 'dashboard' | 'users' | 'deposits' | 'withdrawals' | 'notifications';
type UserFilter = 'all' | 'active' | 'inactive';
type RequestFilter = 'all' | RequestStatus;

const AdminApp: React.FC<AdminAppProps> = ({ 
    user, 
    users, 
    requests, 
    withdrawalRequests,
    onUpdateRequestStatus, 
    onUpdateWithdrawalRequestStatus,
    onLogout,
    notifications,
    onAddNotification,
    onUpdateNotification,
    onDeleteNotification,
}) => {
  const [currentPage, setCurrentPage] = React.useState<AdminPage>('dashboard');
  const [initialUserFilter, setInitialUserFilter] = React.useState<UserFilter>('all');
  const [initialDepositFilter, setInitialDepositFilter] = React.useState<RequestFilter>('all');
  const [initialWithdrawalFilter, setInitialWithdrawalFilter] = React.useState<RequestFilter>('all');
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);
  const notificationButtonRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notificationButtonRef.current && !notificationButtonRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsNotificationsOpen(false);
  };


  const handleNavigation = (page: AdminPage, filter?: UserFilter | RequestFilter) => {
    switch (page) {
      case 'users':
        setInitialUserFilter(filter as UserFilter || 'all');
        break;
      case 'deposits':
        setInitialDepositFilter(filter as RequestFilter || 'all');
        break;
      case 'withdrawals':
        setInitialWithdrawalFilter(filter as RequestFilter || 'all');
        break;
    }
    setCurrentPage(page);
  };

  const navItems: { id: AdminPage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icon path="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
    { id: 'users', label: 'All Users', icon: <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1-3.72a4 4 0 00-3-3.72m-3 3.72a4 4 0 00-3 3.72M3 21v-1a6 6 0 016-6m-6 6h12M15 21a6 6 0 00-6-6m6 6v-1a6 6 0 01-6-6" /> },
    { id: 'deposits', label: 'Deposits', icon: <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <Icon path="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { id: 'notifications', label: 'Notifications', icon: <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard requests={requests} withdrawalRequests={withdrawalRequests} users={users} onNavigate={handleNavigation} />;
      case 'users':
        return <AllUsersPage initialFilter={initialUserFilter} />;
      case 'deposits':
        return <DepositRequestsPage users={users} onUpdateRequestStatus={onUpdateRequestStatus} onAddNotification={onAddNotification} initialFilter={initialDepositFilter} />;
      case 'withdrawals':
        return <WithdrawRequestsPage users={users} onUpdateRequestStatus={onUpdateWithdrawalRequestStatus} onAddNotification={onAddNotification} initialFilter={initialWithdrawalFilter} />;
      case 'notifications':
        return <NotificationsPage 
            notifications={notifications}
            onAdd={onAddNotification}
            onUpdate={onUpdateNotification}
            onDelete={onDeleteNotification}
        />
      default:
        return <AdminDashboard requests={requests} withdrawalRequests={withdrawalRequests} users={users} onNavigate={handleNavigation} />;
    }
  };


  return (
    <div className="min-h-screen bg-brand-dark pb-20 md:pb-0">
      <header className="bg-brand-surface border-b border-gray-700">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => handleNavigation('dashboard')} className="font-bold text-xl text-white focus:outline-none transition-opacity hover:opacity-80">FAEARING <span className="text-brand-primary">Admin</span></button>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === item.id
                          ? 'bg-brand-primary text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative" ref={notificationButtonRef}>
                    <button 
                        onClick={() => setIsNotificationsOpen(prev => !prev)}
                        className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-primary"
                        aria-label="View notifications"
                    >
                        <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-brand-surface"></span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-brand-surface ring-1 ring-white/10 focus:outline-none z-50 border border-white/10">
                            <div className="py-1">
                                <div className="px-4 py-3 border-b border-white/10">
                                    <p className="text-sm font-semibold text-white">Notifications</p>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notif => (
                                    <button 
                                        key={notif.id} 
                                        onClick={() => handleNotificationClick(notif)}
                                        className="w-full text-left block px-4 py-3 text-sm text-gray-400 border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <p className="font-bold text-white">{notif.title}</p>
                                        <p className="mt-1 truncate">{notif.content}</p>
                                        <p className="text-xs text-gray-500 mt-2">{notif.date}</p>
                                    </button>
                                    )) : (
                                    <div className="px-4 py-5 text-center text-sm text-gray-500">
                                        No new notifications.
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              <span className="text-gray-300 hidden sm:block">Welcome, {user.firstName}</span>
              <Button onClick={onLogout} variant="secondary">Logout</Button>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-brand-surface border-t border-gray-700">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
            {navItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => handleNavigation(item.id)} 
                    type="button" 
                    className="inline-flex flex-col items-center justify-center font-medium px-2 group focus:outline-none"
                    aria-current={currentPage === item.id ? 'page' : undefined}
                >
                    <div className={`${currentPage === item.id ? 'text-brand-primary' : 'text-gray-400 group-hover:text-white'}`}>
                        {item.icon}
                    </div>
                    <span className={`text-xs text-center ${currentPage === item.id ? 'text-brand-primary' : 'text-gray-400 group-hover:text-white'}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
      </nav>
       {selectedNotification && (
        <NotificationModal 
            notification={selectedNotification} 
            onClose={() => setSelectedNotification(null)} 
        />
      )}
    </div>
  );
};

export default AdminApp;