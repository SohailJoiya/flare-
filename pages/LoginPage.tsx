import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

interface LoginPageProps {
  onLogin: (credentials: {email: string, password: string}) => Promise<void>;
  onNavigate: (page: 'signup' | 'landing' | 'forgot-password' | 'terms') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = React.useState('user@example.com');
  const [password, setPassword] = React.useState('123456');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin({ email, password });
      // On success, App.tsx will set the user and change the view.
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-7xl font-black text-brand-primary leading-none flare-animated">
                FLARE
            </h1>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-1">
                Auto Earning
            </h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Email" 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="user@example.com"
            disabled={isLoading}
          />
          <div>
            <Input 
              label="Password" 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
              disabled={isLoading}
            />
             <div className="text-right mt-2">
                <button 
                    onClick={() => onNavigate('forgot-password')} 
                    type="button"
                    className="text-sm font-semibold text-brand-primary hover:underline focus:outline-none"
                >
                    Forgot Password?
                </button>
            </div>
          </div>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <Button type="submit" variant="success" className="w-full !mt-8" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="font-semibold text-brand-primary hover:underline">
            Sign Up
          </button>
        </p>
        <p className="text-center text-xs text-gray-500 mt-4">
            By logging in, you agree to our{' '}
            <button onClick={() => onNavigate('terms')} className="underline hover:text-brand-primary focus:outline-none">
                Terms of Service
            </button>.
        </p>
      </Card>
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
      `}</style>
    </div>
  );
};

export default LoginPage;