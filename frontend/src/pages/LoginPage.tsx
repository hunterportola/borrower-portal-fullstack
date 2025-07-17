import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/borrower-profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn(email, password);

    if (result.success) {
      navigate('/borrower-profile');
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
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
          
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-steel font-sans">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-portola-green focus:border-portola-green focus:z-10 sm:text-sm font-sans"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-steel font-sans">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-portola-green focus:border-portola-green focus:z-10 sm:text-sm font-sans"
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-portola-green hover:bg-burnished-brass focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-portola-green disabled:opacity-50 disabled:cursor-not-allowed font-sans"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
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