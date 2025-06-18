import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey'));

  const verifyAdminKey = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/auth/verify-admin-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminKey }),
      });

      if (response.ok) {
        setIsAdmin(true);
        return true;
      } else {
        setIsAdmin(false);
        localStorage.removeItem('adminKey');
        setAdminKey(null);
        return false;
      }
    } catch (error) {
      console.error('Admin verification failed:', error);
      setIsAdmin(false);
      localStorage.removeItem('adminKey');
      setAdminKey(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [adminKey]);

  // Check if admin key is valid on app start
  useEffect(() => {
    if (adminKey) {
      verifyAdminKey();
    }
  }, [adminKey, verifyAdminKey]);

  const login = async (key) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/auth/verify-admin-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminKey: key }),
      });

      if (response.ok) {
        // Store the admin key
        localStorage.setItem('adminKey', key);
        setAdminKey(key);
        setIsAdmin(true);
        toast.success('Admin access granted!');
        return true;
      } else {
        toast.error('Invalid admin key');
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminKey');
    setAdminKey(null);
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  const value = {
    isAdmin,
    isLoading,
    login,
    logout,
    adminKey,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 