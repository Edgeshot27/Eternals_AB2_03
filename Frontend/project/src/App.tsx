import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dash from './components/Dash';
import GoogleCallback from './components/GoogleCallback';
import Patient from './components/Patient';
import Chat from './components/Chat'; // Import the Chat component

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Check for existing token and fetch user data on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Add this if your backend uses cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else if (response.status === 401) {
        // Token expired or invalid
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  };

  const handleLogin = async (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    await fetchUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', String(newValue));
      return newValue;
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register onRegisterSuccess={() => <Navigate to="/login" />} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dash
                token={localStorage.getItem('token') || ''}
                userData={userData}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/auth/google/callback"
          element={<GoogleCallback onLogin={handleLogin} />}
        />
        <Route
          path="/patient/:id"
          element={
            isLoggedIn ? (
              <Patient
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat"
          element={
            isLoggedIn ? (
              <Chat isDarkMode={isDarkMode} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

