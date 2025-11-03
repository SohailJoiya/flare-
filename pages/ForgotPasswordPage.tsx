import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

interface ForgotPasswordPageProps {
  onSendOtp: (email: string) => Promise<void>;
  onNavigate: (page: 'login') => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSendOtp, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSendOtp(email);
      // App.tsx handles navigation on success
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email" 
            id="email" 
            type="email" 
            required 
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <Button type="submit" variant="success" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Remembered your password?{' '}
          <button onClick={() => onNavigate('login')} className="font-semibold text-brand-primary hover:underline">
            Log In
          </button>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;