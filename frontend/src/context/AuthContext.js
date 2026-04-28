import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Callbacks registered by App.js to avoid circular imports
let _onLoginCallbacks = [];

export const registerOnLogin = (fn) => {
  _onLoginCallbacks.push(fn);
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const s = localStorage.getItem('userInfo');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login = async (data) => {
    // Save to state and localStorage FIRST so getToken() works in contexts
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));

    // Now trigger merge+fetch for cart and wishlist
    for (const fn of _onLoginCallbacks) {
      try { await fn(); } catch (e) { console.error('onLogin callback:', e); }
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('wishlistItems');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
