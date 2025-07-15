import { NavLink, useNavigate } from "react-router-dom";
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';

function UserAvatar({ user }: { user: any }) {
  return (
    <div className="w-10 h-10 rounded-full bg-pebble flex items-center justify-center">
      {user?.firstName ? (
        <span className="text-steel font-medium">
          {user.firstName.charAt(0)}{user.lastName?.charAt(0)}
        </span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    </div>
  );
}

export function Header() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const activeStyle = {
    fontWeight: 'bold',
    color: '#1E361E' // portola-green
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-sand pt-4 sticky top-0 z-50">
      <nav className="max-w-3xl mx-auto px-2 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <p className="font-serif font-bold text-xl text-portola-green">Borrower Portal</p>
          
          {/* Navigation - only show if authenticated */}
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <NavLink to="/borrower-profile" className="font-sans text-sm text-steel hover:text-portola-green" style={({ isActive }) => isActive ? activeStyle : undefined}>Profile</NavLink>
              <NavLink to="/my-loan" className="font-sans text-sm text-steel hover:text-portola-green" style={({ isActive }) => isActive ? activeStyle : undefined}>My Loan</NavLink>
              <NavLink to="/activity" className="font-sans text-sm text-steel hover:text-portola-green" style={({ isActive }) => isActive ? activeStyle : undefined}>Activity</NavLink>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-portola-green"></div>
          ) : isAuthenticated ? (
            <>
              <Button variant="outline" size="md">Apply for a new loan</Button>
              <div className="flex items-center gap-2">
                <UserAvatar user={user} />
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="text-steel border-steel hover:bg-pebble"
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                size="md"
                className="text-steel border-steel hover:bg-pebble"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/register')}
                size="md"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </nav>
      <div className="max-w-3xl mx-auto mt-3">
        <div className="w-full h-px bg-burnished-brass opacity-50"></div>
      </div>
    </header>
  );
}