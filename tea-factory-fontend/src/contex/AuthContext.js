import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user data on app start
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Store user data in state and localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    return true;
  };

  const logout = () => {
    // Clear user data
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return currentUser?.role === 'inventoryAdmin';
  };

  const isSupplier = () => {
    return currentUser?.role === 'supplier';
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAdmin,
        isSupplier,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);