import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, User, Phone, Mail, Lock } from 'lucide-react';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signupWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    if (formData.password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    if (formData.phone.length < 10) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }

    setIsLoading(true);
    try {
      await signupWithEmail({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone
      });
      
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error: any) {
      console.error("Signup Error:", error);
      let msg = 'Failed to create account.';
      if (error.code === 'auth/email-already-in-use') msg = 'Email is already registered.';
      if (error.code === 'auth/weak-password') msg = 'Password is too weak.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error: any) {
      showToast('Google Signup Failed: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel */}
        <div className="hidden md:flex w-2/5 bg-[#2874f0] p-10 flex-col justify-between text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Looks like you're new here!</h2>
            <p className="text-blue-100 text-lg leading-relaxed">Sign up with your email to get started</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-3/5 p-10 flex flex-col justify-center">
          
          <form className="space-y-5" onSubmit={handleSignup}>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2"><User size={18} /></span>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 pl-8 focus:outline-none focus:border-[#2874f0] transition-colors bg-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2"><Phone size={18} /></span>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setFormData({ ...formData, phone: val });
                  }}
                  className="w-full border-b border-gray-300 py-2 pl-8 focus:outline-none focus:border-[#2874f0] transition-colors bg-transparent"
                  placeholder="Enter 10 digit number"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2"><Mail size={18} /></span>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 pl-8 focus:outline-none focus:border-[#2874f0] transition-colors bg-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2"><Lock size={18} /></span>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 pl-8 focus:outline-none focus:border-[#2874f0] transition-colors bg-transparent"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2"><Lock size={18} /></span>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 pl-8 focus:outline-none focus:border-[#2874f0] transition-colors bg-transparent"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#fb641b] text-white py-3 font-bold rounded-sm shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
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
            onClick={handleGoogleSignup}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 font-medium rounded-sm shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-3 relative group"
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          <div className="mt-auto text-center pt-6">
            <Link to="/login" className="bg-white text-[#2874f0] font-medium text-sm shadow-md px-10 py-3 rounded-sm hover:shadow-lg transition block w-fit mx-auto">
              Existing User? Log in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
