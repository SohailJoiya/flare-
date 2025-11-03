import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../services/api';

interface EmailVerificationPageProps {
  email: string;
  onNavigate: (page: 'login') => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ email, onNavigate }) => {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    setIsSending(true);
    setMessage('');
    setError('');
    try {
      // This endpoint is assumed to exist on the backend.
      await api.post('/api/auth/resend-verification', { email });
      setMessage('A new verification email has been sent successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend email. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <Card className="w-full max-w-md text-center">
        <div className="mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12l6.75 4.5M12 12l-6.75 4.5" />
            </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-400 mb-6">
          We've sent a verification link to <strong className="text-white">{email}</strong>. Please open the email and click the link to activate your account.
        </p>
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                If you haven't received the email, please check your spam folder or click below to resend.
            </p>
            <Button onClick={handleResend} variant="secondary" className="w-full" disabled={isSending}>
                {isSending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
        </div>
        {message && <p className="text-sm text-green-400 mt-4">{message}</p>}
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
        <div className="mt-8 border-t border-gray-700 pt-6">
            <button onClick={() => onNavigate('login')} className="font-semibold text-brand-primary hover:underline">
                Back to Login
            </button>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
