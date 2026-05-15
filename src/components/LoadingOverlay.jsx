import React from 'react';
import { Shield, Loader2 } from 'lucide-react';

const LoadingOverlay = ({ message = "Synchronizing Data..." }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fadeIn">
       {/* Backdrop with theme-aware blur */}
       <div className="absolute inset-0 bg-backdrop backdrop-blur-2xl"></div>
       
       {/* Central Loading Unit */}
       <div className="relative flex flex-col items-center">
          <div className="relative mb-8">
             {/* Glowing Pulse Rings */}
             <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-3xl animate-pulse scale-150"></div>
             <div className="absolute inset-0 bg-brand-secondary/10 rounded-full blur-2xl animate-ping opacity-30"></div>
             
             {/* Icon Container */}
             <div className="relative w-24 h-24 bg-inner-box border border-brand-primary/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent"></div>
                <Shield className="text-brand-primary animate-float" size={40} />
                
                {/* Rotating Loader Ring */}
                <div className="absolute inset-0 border-2 border-transparent border-t-brand-primary/40 border-r-brand-primary/40 rounded-full animate-spin"></div>
             </div>
          </div>

          <div className="space-y-3 text-center">
             <div className="flex items-center justify-center gap-3">
                <Loader2 className="text-brand-primary animate-spin" size={16} />
                <h3 className="text-xl font-display font-bold text-heading tracking-tighter uppercase italic">
                   System <span className="text-brand-primary">Initializing</span>
                </h3>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">
                {message}
             </p>
          </div>

          {/* Decorative Terminal Line */}
          <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-brand-primary w-1/3 animate-loadingBar"></div>
          </div>
       </div>
    </div>
  );
};

export default LoadingOverlay;
