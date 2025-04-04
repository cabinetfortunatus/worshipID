import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://your-backend.com/api/login', { email, password });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setUser({ token }); // Ideally, fetch user data using token
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
