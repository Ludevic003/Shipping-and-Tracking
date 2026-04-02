import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
      setCurrentUser(pb.authStore.model);
      setUserToken(pb.authStore.token);
    }

    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (!model) {
        setCurrentUser(null);
        setUserToken(null);
      } else if (model.collectionName === 'users') {
        setCurrentUser(model);
        setUserToken(token);
      }
    });

    const restoreAdminSession = async () => {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('adminToken');
      
      if (token) {
        try {
          const response = await apiServerClient.fetch('/admin/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              console.error('[AuthContext] Admin session invalid (401). Clearing state.');
            } else {
              console.error(`[AuthContext] Admin session verification failed with status: ${response.status}`);
            }
            adminLogout();
          } else {
            const data = await response.json();
            if (data.authenticated) {
              setCurrentAdmin(data.user);
              setAdminToken(token);
              localStorage.setItem('auth_token', token);
            } else {
              console.error('[AuthContext] Admin session not authenticated in response.');
              adminLogout();
            }
          }
        } catch (error) {
          console.error('[AuthContext] Admin session verification failed:', error);
          adminLogout();
        }
      }
      
      setInitialLoading(false);
    };

    const restoreClientSession = () => {
      const clientToken = localStorage.getItem('pb_auth_token');
      // Client session is primarily handled by PocketBase authStore
    };

    restoreAdminSession();
    restoreClientSession();

    return () => {
      unsubscribe();
    };
  }, []);

  const clientLogin = async (email, password) => {
    try {
      const response = await apiServerClient.fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) throw new Error('Invalid credentials');
        if (response.status === 400) throw new Error('Missing email or password');
        throw new Error(data.error || 'Login failed');
      }

      if (data.user && data.token) {
        localStorage.setItem('pb_auth_token', data.token);
        setCurrentUser(data.user);
        setUserToken(data.token);
        return data.user;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await apiServerClient.fetch('/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Invalid email or password');
      }

      if (data.success && data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        
        setAdminToken(data.token);
        setCurrentAdmin(data.user);
        
        return { success: true, data };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      return { success: false, error: error.message || 'Network error occurred. Please try again.' };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('pb_admin_token');
    localStorage.removeItem('admin_user');
    
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('admin_user');
    
    setAdminToken(null);
    setCurrentAdmin(null);
  };

  const loginAsUser = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setUserToken(authData.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  };

  const login = async (email, password, type) => {
    if (type === 'admin') {
      return await adminLogin(email, password);
    } else {
      try {
        await clientLogin(email, password);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };

  const signup = async (data) => {
    try {
      await pb.collection('users').create({
        ...data,
        role: 'client'
      }, { $autoCancel: false });
      
      try {
        await clientLogin(data.email, data.password);
        return { success: true };
      } catch (loginErr) {
        return { success: true, warning: 'Account created but auto-login failed. Please log in manually.' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create account' };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    localStorage.removeItem('pb_auth_token');
    setCurrentUser(null);
    setUserToken(null);
    adminLogout();
  };

  const isAdminAuthenticated = !!adminToken;
  const isAdmin = !!currentAdmin;
  const isClient = !!currentUser;
  const isAuthenticated = isAdminAuthenticated || isClient;
  const userType = isAdminAuthenticated ? 'admin' : isClient ? 'user' : null;

  const value = useMemo(() => ({
    currentUser: currentUser ? { ...currentUser, userType: 'user' } : null,
    currentAdmin: currentAdmin ? { ...currentAdmin, userType: 'admin' } : null,
    userType,
    userToken,
    adminToken,
    initialLoading,
    login,
    clientLogin,
    adminLogin,
    adminLogout,
    loginAsUser,
    signup,
    logout,
    isAuthenticated,
    isAdminAuthenticated,
    isAdmin,
    isClient
  }), [currentUser, currentAdmin, userType, userToken, adminToken, initialLoading, isAuthenticated, isAdminAuthenticated, isAdmin, isClient]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};