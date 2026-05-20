import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser, loginUser, resetPassword } from '../services/mockDb';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';

// Component Imports
import AuthBackground from '../components/Auth/AuthBackground';
import AuthForm from '../components/Auth/AuthForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);

  useEffect(() => {
    if (location.state?.mode === 'signup') {
      setIsLogin(false);
      setIsForgot(false);
    }
  }, [location.state]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showLoginLoader, setShowLoginLoader] = useState(false);
  const [destinationPath, setDestinationPath] = useState('');

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setIsForgot(false);
    setErrorMsg('');
    setSuccessMsg('');
    setName('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isForgot) {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccessMsg(result.message);
        setEmail('');
      } else {
        setErrorMsg(result.message);
      }
    } else if (!isLogin) {
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
        let dest = '/employee';
        if (role === 'superadmin') dest = '/superadmin';
        else if (role === 'admin') dest = '/admin';
        
        setDestinationPath(dest);
        setShowLoginLoader(true);
      } else {
        setErrorMsg(result.message);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-5 overflow-hidden gradient-mesh font-body select-none">
      {showLoginLoader && (
        <Loader 
          onFinish={() => {
            navigate(destinationPath);
          }} 
        />
      )}
      
      {/* Theme Toggle - fixed top right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AuthBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[480px] animate-fadeIn">
        <AuthForm 
          isLogin={isLogin}
          isForgot={isForgot}
          setIsForgot={setIsForgot}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
          handleSubmit={handleSubmit}
          toggleAuthMode={toggleAuthMode}
        />

        {/* Footer Report */}
        <div className="mt-8 text-center opacity-30">
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Project Management System © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
