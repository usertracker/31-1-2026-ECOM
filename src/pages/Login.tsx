import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, Mail, Lock } from 'lucide-react';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      showToast('Logged in successfully!', 'success');
      navigate('/');
    } catch (error: any) {
      console.error("Login Error:", error);
      let msg = 'Failed to login.';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found') msg = 'Account not found.';
      if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error: any) {
      showToast('Google Login Failed: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Panel */}
        <div className="hidden md:flex w-2/5 bg-[#2874f0] p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Login</h2>
            <p className="text-blue-100 text-lg leading-relaxed">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-3/5 p-10 flex flex-col justify-center relative">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2">
                    <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 pl-8 focus:outline-none focus:border-[#2874f0] transition-colors bg-transparent text-base"
                  placeholder="Enter your email"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2">
                    <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 pl-8 focus:outline-none focus:border-[#2874f0] transition-colors bg-transparent text-base"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              By continuing, you agree to FlipZon's <a href="#" className="text-[#2874f0]">Terms of Use</a> and <a href="#" className="text-[#2874f0]">Privacy Policy</a>.
            </p>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#fb641b] text-white py-3 font-bold rounded-sm shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 font-medium rounded-sm shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-3 relative group"
          >
            <GoogleIcon />
            Login with Google
          </button>

          <div className="mt-auto text-center pt-8">
            <Link to="/signup" className="text-[#2874f0] font-medium text-sm hover:underline">
              New to FlipZon? Create an account
            </Link>
          </div>
          
        </div>

      </div>
    </div>
  );
};
