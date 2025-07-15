import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signIn } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { InputMedium } from '../components/InputMedium';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/borrower-profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Login failed');
      } else {
        // Successful login, navigate to borrower profile
        navigate('/borrower-profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex justify-center py-12 px-4">
      <div className="max-w-md w-full" style={{ marginTop: '25vh' }}>
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-portola-green mb-2">
            Borrower Portal
          </h1>
          <p className="font-sans text-sm text-steel">
            Sign in to access your account
          </p>
        </div>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-sans text-sm">
              {error}
            </div>
          )}
          
          <InputMedium
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
          />

          <InputMedium
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center">
              <p className="font-sans text-sm text-steel">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-medium text-portola-green hover:text-burnished-brass"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}