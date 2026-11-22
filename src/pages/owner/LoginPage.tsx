import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('anuj123457');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/owner/dashboard';

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/owner/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      showToast('Welcome back, Authorized Owner', 'success');
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
      showToast(result.error || 'Authentication failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-forest-deep flex flex-col justify-between py-12 px-6 sm:px-8">
      
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-ivory/60 text-xs">
        <Link to="/" className="flex items-center gap-1.5 hover:text-ivory transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </Link>
        <span className="text-[10px] tracking-widest uppercase text-bronze font-semibold">
          Security Enforced
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border border-sand-dark/20 my-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-forest text-sand mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-light text-forest-deep tracking-wider uppercase">
            HAVENORA
          </h1>
          <p className="text-xs font-semibold tracking-luxury uppercase text-bronze mt-1">
            Private Owner Portal
          </p>
          <p className="text-xs text-charcoal/60 mt-2 font-light">
            Sign in with authorized owner credentials to access the property management system.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/70 mb-1.5">
              Owner Username / Access ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="anuj123457"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory/60 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal font-mono"
              />
              <User className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
            </div>
            <p className="text-[10px] text-charcoal/50 mt-1">
              Authorized Owner ID: <code className="text-forest font-semibold">anuj123457</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-charcoal/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-ivory/60 border border-sand-dark/40 rounded-lg focus:outline-none focus:border-forest text-charcoal"
              />
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-charcoal/40 hover:text-charcoal p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 text-xs font-semibold tracking-luxury uppercase bg-forest hover:bg-forest-deep text-ivory rounded-lg transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Authenticating Server-Side...</span> : <span>Sign In as Owner</span>}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-sand-dark/20 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] text-forest font-medium">
            <ShieldCheck className="w-4 h-4 text-bronze" />
            <span>Strict Access Control</span>
          </div>
          <p className="text-[10px] text-charcoal/60 mt-1 leading-relaxed">
            Restricted to authorized owner credentials only (<code className="font-mono text-forest">anuj123457</code>).
            Protected by Vercel Edge Middleware and rate limiting.
          </p>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-ivory/40 max-w-md mx-auto">
        <p>Private Owner Portal · Anuj Digital Hospitality Platform</p>
        <p className="text-[10px] mt-1 text-ivory/30">
          Protected by Vercel Edge Middleware, HTTP-only secure session cookies, and rate limiting.
        </p>
      </div>

    </div>
  );
};
