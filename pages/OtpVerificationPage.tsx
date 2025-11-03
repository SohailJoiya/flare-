import React, { useState, useRef } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

interface OtpVerificationPageProps {
  onVerify: (otp: string) => Promise<void>;
  purpose: 'signup' | 'reset-password';
}

const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({ onVerify, purpose }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const title = purpose === 'signup' ? 'Verify Your Account' : 'Verify Your Identity';
  const description = purpose === 'signup' 
    ? "We've sent a 6-digit code to your mobile number. Please enter it below to complete your registration."
    : "We've sent a 6-digit code to your email. Please enter it below to reset your password.";

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]!.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onVerify(otp.join(''));
      // App.tsx handles navigation on success
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-4">{title}</h2>
        <p className="text-center text-gray-400 mb-8">{description}</p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                ref={el => { if(el) inputRefs.current[index] = el }}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-14 text-center text-2xl font-semibold bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-brand-primary focus:border-brand-primary transition"
                required
                disabled={isLoading}
              />
            ))}
          </div>
          {error && <p className="text-center text-sm text-red-500 mb-4">{error}</p>}
          <Button type="submit" variant="success" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default OtpVerificationPage;
