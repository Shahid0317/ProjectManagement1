import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { registerUser, loginUser } from '../services/mockDb';

// Components
import ThemeToggle from '../components/ThemeToggle';
import AuthBackground from '../components/Auth/AuthBackground';
import AuthForm from '../components/Auth/AuthForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setSuccessMsg('');
    setName('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isLogin) {
      const result = await registerUser(name, email, password);
      if (result.success) {
        setSuccessMsg(result.message);
        setIsLogin(true);
        setName('');
        setPassword('');
      } else {
        setErrorMsg(result.message);
      }
    } else {
      const result = await loginUser(email, password);
      if (result.success) {
        const role = result.user.role;
        if (role === 'superadmin') navigate('/superadmin');
        else if (role === 'admin') navigate('/admin');
        else navigate('/employee');
      } else {
        setErrorMsg(result.message);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-5 overflow-hidden gradient-mesh font-body select-none">
      
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AuthBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[480px] animate-fadeIn">
        
        {/* Floating Logo Head */}
        <div className="flex justify-center mb-12 animate-zoomIn">
           <div className="relative group">
              <div className="absolute inset-0 bg-brand-primary/40 blur-2xl rounded-full group-hover:bg-brand-secondary/40 transition-all duration-700"></div>
              <div className="relative w-20 h-20 bg-slate-900/60 border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl glass-glow">
                 <ShieldCheck className="text-brand-primary group-hover:scale-110 transition-transform duration-500" size={32} />
              </div>
           </div>
        </div>

        <AuthForm 
          isLogin={isLogin} name={name} setName={setName} email={email} setEmail={setEmail} 
          password={password} setPassword={setPassword} errorMsg={errorMsg} successMsg={successMsg} 
          handleSubmit={handleSubmit} toggleAuthMode={toggleAuthMode} 
        />

        {/* Footer Report */}
        <div className="mt-8 text-center opacity-30 text-white">
           <p className="text-[9px] font-black uppercase tracking-[0.5em]">Infinite Luxury © System v4.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
