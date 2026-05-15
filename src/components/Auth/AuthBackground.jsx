import React from 'react';

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] left-[5%] animate-float flex flex-col gap-1 opacity-40">
        <div className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Project Management System</div>
        <div className="h-px w-20 bg-brand-primary"></div>
      </div>
      <div className="absolute bottom-[10%] right-[5%] animate-float flex flex-col items-end gap-1 opacity-20" style={{ animationDelay: '-3s' }}>
        <div className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.4em]">Employee Portal</div>
        <div className="h-px w-32 bg-brand-secondary"></div>
      </div>
    </div>
  );
};

export default AuthBackground;
