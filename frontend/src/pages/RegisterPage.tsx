import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signUp } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { InputMedium } from '../components/InputMedium';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/borrower-profile" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.error) {
        setError(result.error.message || 'Registration failed');
      } else {
        // Successful registration, navigate to borrower profile
        navigate('/borrower-profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
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
            Create your account to get started
          </p>
        </div>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-sans text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <InputMedium
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              label="First name"
            />
            
            <InputMedium
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              label="Last name"
            />
          </div>

          <InputMedium
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            label="Email address"
          />

          <InputMedium
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            label="Password"
          />

          <InputMedium
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Confirm password"
          />

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-center">
              <p className="font-sans text-sm text-steel">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-portola-green hover:text-burnished-brass"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}