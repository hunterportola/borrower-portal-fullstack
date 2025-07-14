import { NavLink } from "react-router-dom";
import { Button } from './Button';

function UserAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-pebble flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
}

export function Header() {
  const activeStyle = {
    fontWeight: 'bold',
    color: '#1E361E' // portola-green
  };

  return (
    <header className="bg-sand pt-4 sticky top-0 z-50">
      <nav className="max-w-3xl mx-auto px-2 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <p className="font-serif font-bold text-xl text-portola-green">Borrower Portal</p>
          {/* --- 2. UPDATE LINKS TO USE NavLink --- */}
          <div className="flex items-center gap-4">
            <NavLink to="/applications" className="font-sans text-sm text-steel hover:text-portola-green">Applications</NavLink>
            <NavLink to="/" className="font-sans text-sm text-steel hover:text-portola-green" style={({ isActive }) => isActive ? activeStyle : undefined}>Loans</NavLink>
            <NavLink to="/activity" className="font-sans text-sm text-steel hover:text-portola-green" style={({ isActive }) => isActive ? activeStyle : undefined}>Activity</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="md">Apply for a new loan</Button>
          <NavLink to="/profile"><UserAvatar /></NavLink>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto mt-3">
        <div className="w-full h-px bg-burnished-brass opacity-50"></div>
      </div>
    </header>
  );
}