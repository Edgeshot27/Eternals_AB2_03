import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [currentView, setCurrentView] = useState('login');
  const [userData, setUserData] = useState(null);

  const handleLogin = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
    fetchUserData(token);
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    setUserData(null);
    setCurrentView('login');
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  };

  const toggleView = () => {
    setCurrentView(currentView === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center mb-8">
              <Stethoscope className="h-10 w-10 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-blue-600">AIsculapius</h1>
            </div>
            
            {currentView === 'login' ? (
              <>
                <Login onLogin={handleLogin} />
                <p className="text-center mt-4 text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={toggleView}
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <>
                <Register onRegisterSuccess={() => setCurrentView('login')} />
                <p className="text-center mt-4 text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={toggleView}
                    className="text-blue-600 hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <Dashboard token={token} userData={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;