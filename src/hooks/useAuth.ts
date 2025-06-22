import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return { isAuthenticated, logout };
};
