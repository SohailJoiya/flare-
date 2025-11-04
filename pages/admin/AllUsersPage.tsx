import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';
import Card from '../../components/Card';
import api from '../../services/api';
import { processUser } from '../../processors';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';

interface AllUsersPageProps {
  initialFilter?: 'all' | 'active' | 'inactive' | 'blocked';
}

type UserFilter = 'all' | 'active' | 'inactive' | 'blocked';
const ITEMS_PER_PAGE = 5;

const AllUsersPage: React.FC<AllUsersPageProps> = ({ initialFilter = 'all' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<UserFilter>(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearchTerm]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      if (filter === 'active') {
        params.append('status', 'active');
      } else if (filter === 'inactive') {
        params.append('status', 'inactive');
      } else if (filter === 'blocked') {
        params.append('status', 'blocked');
      }
      
      const response: any = await api.get(`/api/admin/users?${params.toString()}`);
      
      setUsers((response.results || []).map(processUser));
      setTotalPages(response.pages || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filter, debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBlockUser = async (userId: string) => {
    const confirmAction = window.confirm(
      `Are you sure you want to block this user? This will prevent them from accessing their account.`
    );

    if (confirmAction) {
      try {
        await api.put(`/api/admin/users/${userId}/block`, { "isActive": false });
        // Update user in local state for immediate feedback
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, status: 'blocked' } : user
          )
        );
      } catch (error) {
        console.error(`Failed to block user:`, error);
        alert(`Could not block the user. Please try again.`);
      }
    }
  };

  const handleUnblockUser = async (userId: string) => {
    const confirmAction = window.confirm(
      `Are you sure you want to unblock this user? They will regain access to their account.`
    );

    if (confirmAction) {
      try {
        await api.put(`/api/admin/users/${userId}/unblock`);
        // Update user in local state for immediate feedback
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, status: 'active' } : user
          )
        );
      } catch (error) {
        console.error(`Failed to unblock user:`, error);
        alert(`Could not unblock the user. Please try again.`);
      }
    }
  };


  const getUserLevel = (totalInvested: number): number => {
    if (totalInvested >= 30000) return 4;
    if (totalInvested >= 10000) return 3;
    if (totalInvested >= 5000) return 2;
    return 1;
  };

  const filterTabs: { label: string; value: UserFilter }[] = [
    { label: 'All Users', value: 'all' },
    { label: 'Active Users', value: 'active' },
    { label: 'Inactive Users', value: 'inactive' },
    { label: 'Blocked Users', value: 'blocked' },
  ];
  
  const pageTitle = filterTabs.find(tab => tab.value === filter)?.label || 'All Users';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
      <Card>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
            <div className="flex-grow md:max-w-sm">
                <label htmlFor="search" className="block text-sm font-medium text-brand-gray mb-2">
                    Search by Name, Email, or ID
                </label>
                <div className="relative">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-brand-surface border border-gray-700 rounded-lg p-2.5 pl-10 text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 shadow-inner shadow-black/20"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <nav className="flex space-x-6 border-b border-gray-700 md:border-b-0">
                {filterTabs.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`${
                            filter === tab.value
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-gray-400 hover:text-white'
                        } whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-sm font-semibold text-gray-400">User ID</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Join Date</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-center">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-center">Level</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-center">Team Count</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Total in Wallet</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center p-8 text-gray-500">Loading users...</td></tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-4 font-mono text-xs truncate max-w-[150px]">{user.id}</td>
                    <td className="p-4">{user.firstName} {user.lastName}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 text-sm text-gray-300 whitespace-nowrap">{user.joinDate}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        user.status === 'blocked' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {user.status === 'blocked' ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-center font-medium">{getUserLevel(user.totalInvested)}</td>
                    <td className="p-4 text-center">{user.teamSize.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-brand-primary">${user.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-4 text-center">
                      {user.status === 'active' ? (
                        <Button
                          onClick={() => handleBlockUser(user.id)}
                          variant="danger"
                          className="!px-3 !py-1 text-sm"
                        >
                          Block
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleUnblockUser(user.id)}
                          variant="success"
                          className="!px-3 !py-1 text-sm"
                        >
                          Unblock
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={9} className="text-center p-8 text-gray-500">
                        No {filter !== 'all' ? filter : ''} users found.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default AllUsersPage;