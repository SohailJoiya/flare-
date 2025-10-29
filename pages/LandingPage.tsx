import React from 'react';
import Button from '../components/Button';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark p-4">
      <div className="text-center">
        <div className="text-center mb-8">
            <h1 className="text-8xl font-black text-brand-primary leading-none">
                FLARE
            </h1>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider mt-1">
                Auto Earning
            </h2>
        </div>
        <p className="text-xl text-gray-400 mb-8">
          Your Gateway to Network Earnings and Rewards.
        </p>
        <div className="space-x-4">
          <Button onClick={() => onNavigate('login')}>Log In</Button>
          <Button onClick={() => onNavigate('signup')} variant="secondary">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;