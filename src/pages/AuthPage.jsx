import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, BadgeIcon } from 'lucide-react';
import { registerUser, loginUser } from '../services/mockDb';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  
  // Feedback State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setSuccessMsg('');
    setName('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isLogin) {
      // Registration Logic
      const result = registerUser(name, employeeId, password);
      if (result.success) {
        setSuccessMsg(result.message);
        // Switch to login tab after brief delay or immediately
        setIsLogin(true);
        setName('');
        setPassword('');
      } else {
        setErrorMsg(result.message);
      }
    } else {
      // Login Logic
      const result = loginUser(employeeId, password);
      if (result.success) {
        // Route based on role
        const role = result.user.role;
        if (role === 'superadmin') {
          navigate('/superadmin');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      } else {
        setErrorMsg(result.message);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-5 overflow-hidden bg-slate-900 text-slate-50">
      
      {/* Background Shapes for modern aesthetic */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-60 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[100px] opacity-60 animate-float" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-60 animate-float" style={{ animationDelay: '-10s' }}></div>
      </div>
      
      {/* Auth Card */}
      <div className={`relative z-10 w-full max-w-[450px] bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-300`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {isLogin ? 'Enter your credentials to access your dashboard.' : 'Enter your details. Your HR/Admin must pre-authorize you first.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center font-medium animate-slideDown">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm text-center font-medium animate-slideDown">
            {successMsg}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          {/* Full Name - Only for Sign Up */}
          <div className={`flex flex-col gap-2 transition-all duration-300 ${!isLogin ? 'opacity-100 max-h-[100px] animate-slideDown' : 'opacity-0 max-h-0 overflow-hidden !m-0 !p-0 border-none pointer-events-none'}`}>
            <label className="text-sm font-medium text-slate-400">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors peer-focus:text-indigo-500" size={18} />
              <input 
                type="text" 
                placeholder="John Doe" 
                disabled={isLogin}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3.5 pr-3.5 pl-11 text-[15px] text-slate-50 transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 peer"
              />
            </div>
          </div>

          {/* Employee ID - Always visible */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Employee ID No.</label>
            <div className="relative flex items-center">
              <BadgeIcon className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors peer-focus:text-indigo-500" size={18} />
              <input 
                type="text" 
                placeholder="e.g. EMP-001" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required 
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3.5 pr-3.5 pl-11 text-[15px] text-slate-50 transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 peer"
              />
            </div>
          </div>

          {/* Password - Always visible */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors peer-focus:text-indigo-500" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3.5 pr-3.5 pl-11 text-[15px] text-slate-50 transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 peer"
              />
            </div>
          </div>

          {isLogin && (
            <div className="text-right -mt-2">
              <a href="#forgot" className="text-indigo-400 text-sm font-medium hover:text-indigo-300 hover:underline transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          <button 
            type="submit" 
            className="mt-2 bg-indigo-500 hover:bg-indigo-600 active:translate-y-0 hover:-translate-y-0.5 text-white border-none rounded-xl py-3.5 px-4 text-base font-semibold cursor-pointer flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_0_rgba(99,102,241,0.39)]"
          >
            <span>{isLogin ? 'Sign In' : 'Register'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <p className="text-slate-400 text-sm m-0">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              onClick={toggleAuthMode} 
              className="bg-transparent border-none text-indigo-400 text-sm font-semibold cursor-pointer pl-2 hover:text-indigo-300 hover:underline transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
