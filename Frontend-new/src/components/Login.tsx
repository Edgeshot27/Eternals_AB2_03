import React, { useState, useEffect } from "react";
import Helmet from './Helemt/Helmet';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "An error occurred during login.");
      }

      // Call the onLogin prop with the token
      onLogin(data.access_token);

      setLoading(false);
      toast.success(data.message);
      navigate('/dashboard'); // Changed to match your App.tsx route
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleGoogleLogin = () => {
    // Update the URL to match your backend URL
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <Helmet title='Login'>
      <section className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
          {loading ? (
            <div className="text-center">
              <h5 className="font-bold text-white">Loading...</h5>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-3xl mb-4 text-white text-center">Welcome Back!</h3>
              <h6 className="mb-6 text-gray-300 text-center">Login to continue</h6>

              <form onSubmit={signInWithEmail}>
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Let's go
                </button>

                <div className="mt-4">
                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400">Or</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google Logo"
                      className="w-5 h-5"
                    />
                    Sign in with Google
                  </button>
                </div>

                <p className="mt-6 text-gray-300 text-center">
                  Don't have an account?{' '}
                  <Link to='/register' className="text-blue-500 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </Helmet>
  );
};

export default Login;