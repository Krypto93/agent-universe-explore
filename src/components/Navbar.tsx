import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Marketplace</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link to="/agents">Browse Agents</Link>
            </Button>
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link to="/about">About</Link>
            </Button>

            {isAuthenticated ? (
              <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/signup" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
