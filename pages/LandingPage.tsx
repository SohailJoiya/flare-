import React, { useState, useEffect } from 'react';
import Button from '../components/Button';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const fullText = "Your Gateway to Network Earnings and Rewards.";
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    setTypedText('');
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(prevText => prevText + fullText.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        // Keep cursor blinking but you can also hide it
        // setShowCursor(false); 
      }
    }, 75); // Typing speed in ms

    return () => clearInterval(typingInterval);
  }, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark p-4">
      <div className="text-center">
        <div className="text-center mb-8">
            <h1 className="text-8xl font-black text-brand-primary leading-none flare-animated">
                FLARE
            </h1>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider mt-1">
                Auto Earning
            </h2>
        </div>
        <p className="text-xl text-gray-400 mb-8 h-7">
          {typedText}
          {showCursor && <span className="typing-cursor">|</span>}
        </p>
        <div className="space-x-4">
          <Button onClick={() => onNavigate('login')}>Log In</Button>
          <Button onClick={() => onNavigate('signup')} variant="secondary">
            Sign Up
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .flare-animated {
          background-image: linear-gradient(to right, #E61E4D 20%, #ffffff 50%, #E61E4D 80%);
          background-size: 200% auto;
          color: #fff;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        @keyframes blink {
            50% { opacity: 0; }
        }
        .typing-cursor {
            animation: blink 1s step-end infinite;
            display: inline-block;
            margin-left: 2px;
            font-weight: 200;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;