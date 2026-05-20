import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Database, Lock, ArrowRight, Cpu } from 'lucide-react';

const AuthForm = ({
  isLogin,
  isForgot,
  setIsForgot,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
  handleSubmit,
  toggleAuthMode
}) => {
  const navigate = useNavigate();
  return (
    <div className="glass-card p-10 sm:p-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Cpu size={80} className="text-heading" />
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold mb-4 tracking-tighter text-gradient">
          {isForgot ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join the Team')}
        </h2>
        <div className="flex justify-center gap-2 mb-4">
           <div className="h-1 w-8 bg-brand-primary rounded-full"></div>
           <div className="h-1 w-2 bg-inner-box rounded-full border border-white/5"></div>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] leading-loose">
          {isForgot ? 'Enter your email to receive a reset link' : (isLogin ? 'Please log in to your account' : 'Create your employee profile')}
        </p>
      </div>

      {/* Feedback */}
      {errorMsg && (
        <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] text-center font-black uppercase tracking-[0.2em] animate-shake shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] text-center font-black uppercase tracking-[0.2em] animate-zoomIn shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          {successMsg}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        
        {/* Full Name - Only for Sign Up */}
        {!isForgot && !isLogin && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="YOUR FULL NAME" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-luxury pl-14 font-black tracking-widest text-[10px]"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-1">Email Address</label>
          <div className="relative group">
            <Database className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="EMAIL@EXAMPLE.COM" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="input-luxury pl-14 font-black tracking-widest text-[10px]"
            />
          </div>
        </div>

        {/* Password */}
        {!isForgot && isLogin && (
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Password</label>
              <button 
                type="button"
                onClick={() => { setIsForgot(true); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="input-luxury pl-14"
              />
            </div>
          </div>
        )}
        {!isForgot && !isLogin && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="input-luxury pl-14"
              />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary w-full py-5 text-sm flex items-center justify-center gap-4 group"
        >
          <span>{isForgot ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </form>

      <div className="text-center mt-12 pt-8 border-t border-white/5">
        {isForgot ? (
          <button 
            type="button" 
            onClick={() => { setIsForgot(false); setErrorMsg(''); setSuccessMsg(''); }} 
            className="text-brand-primary hover:text-heading text-[10px] font-black uppercase tracking-widest transition-colors underline underline-offset-4"
          >
            Return to Sign In
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              {isLogin ? "New user?" : "Already have an account?"}
              <button 
                type="button" 
                onClick={toggleAuthMode} 
                className="text-brand-primary ml-2 hover:text-heading transition-colors underline underline-offset-4"
              >
                {isLogin ? 'Create Account' : 'Login Here'}
              </button>
            </p>
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">New Employee?</span>
              <button 
                type="button" 
                onClick={() => navigate('/register-employee')} 
                className="text-brand-primary hover:text-heading text-[9px] font-black uppercase tracking-widest transition-colors underline underline-offset-4"
              >
                Register / Request Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
