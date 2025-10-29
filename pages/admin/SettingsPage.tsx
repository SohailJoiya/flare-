import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

const SettingsPage: React.FC = () => {
  const [limit, setLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchLimit = async () => {
      setIsFetching(true);
      try {
        const response = await api.get<{ limit: number }>('/api/admin/settings/withdrawal-limit');
        setLimit(String(response.limit));
      } catch (err: any) {
        setError('Failed to load current withdrawal limit.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchLimit();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const numericLimit = parseFloat(limit);
    if (isNaN(numericLimit) || numericLimit < 0) {
      setError('Please enter a valid, non-negative number.');
      setIsLoading(false);
      return;
    }

    try {
      await api.put('/api/admin/settings/withdrawal-limit', { limit: numericLimit });
      setSuccessMessage('Withdrawal limit updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update the limit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white">System Settings</h1>
      
      <Card>
        <form onSubmit={handleSave}>
          <h2 className="text-2xl font-semibold text-white mb-4">Withdrawal Settings</h2>
          
          {isFetching ? (
             <p className="text-gray-400">Loading settings...</p>
          ) : (
            <div className="space-y-6">
                <Input
                    label="Daily Withdrawal Limit ($)"
                    id="withdrawalLimit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="e.g., 500"
                    required
                    disabled={isLoading}
                    min="0"
                    step="1"
                />
                <div className="flex items-center justify-end gap-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}
                    <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;