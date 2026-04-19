import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Coffee } from 'lucide-react';
import { ApiClient } from '../utils/api';

const AuthView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestData = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

      try {
        const response = await ApiClient.post(endpoint, requestData);
        if (response.token && response.user) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          onLogin(response.user);
        } else {
          setError('Invalid response from server');
        }
      } catch (apiErr) {
        if (apiErr.message === 'Email already in use') {
          setError('This email is already registered.');
        } else if (apiErr.message === 'Invalid credentials') {
          setError('Email or password is incorrect.');
        } else {
          setError(apiErr.message || 'Authentication failed.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-white/50">

        {/* Branding Side */}
        <div className="md:w-5/12 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-5%] right-[-5%] w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl">
              <Coffee size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">
              Brewing Excellence <br />
              <span className="text-teal-200">Every Second.</span>
            </h1>
            <p className="text-teal-50/80 font-medium leading-relaxed max-w-xs">
              Experience the next generation of hospitality management with intelligent POS solutions.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-12 md:p-16 bg-white/40 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                {isLogin ? 'Welcome back' : 'Join 51Cafe'}
              </h2>
              <p className="text-slate-500 font-medium">
                {isLogin ? 'Sign in to your dashboard' : 'Start your free trial today'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-fadeIn">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">!</div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cafe Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                    <input
                      type="text" name="username" placeholder="Starbucks"
                      value={formData.username} onChange={handleInputChange} required={!isLogin}
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:outline-none focus:border-teal-500/50 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                  <input
                    type="email" name="email" placeholder="name@company.com"
                    value={formData.email} onChange={handleInputChange} required
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:outline-none focus:border-teal-500/50 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                  <input
                    type="password" name="password" placeholder="••••••••"
                    value={formData.password} onChange={handleInputChange} required
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:outline-none focus:border-teal-500/50 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-teal-600/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 text-lg"
              >
                {loading ? (
                  <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium text-sm">
                {isLogin ? "Ready to launch your cafe?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-teal-600 font-black hover:text-teal-700 underline underline-offset-4 transition-colors"
                >
                  {isLogin ? "Join now" : "Log in here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
