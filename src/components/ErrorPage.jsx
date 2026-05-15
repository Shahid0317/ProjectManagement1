import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, WifiOff, Ghost, RefreshCcw, Home } from 'lucide-react';

const ErrorPage = ({ type = '500', message }) => {
  const navigate = useNavigate();

  const errorConfigs = {
    '404': {
      icon: Ghost,
      title: 'Mission Lost',
      code: 'ERR_NOT_FOUND_404',
      desc: 'The coordinates you provided do not exist in our system registry. This node may have been decommissioned.',
      color: 'brand-secondary'
    },
    '500': {
      icon: AlertTriangle,
      title: 'System Breach',
      code: 'ERR_INTERNAL_500',
      desc: 'An unexpected protocol failure has occurred within the core synchronization engine. Our engineers are investigating.',
      color: 'red-500'
    },
    'OFFLINE': {
      icon: WifiOff,
      title: 'Signal Lost',
      code: 'ERR_OFFLINE_DISCONNECT',
      desc: 'Connection to the central data node has been severed. Please check your uplink and try again.',
      color: 'brand-primary'
    }
  };

  const config = errorConfigs[type] || errorConfigs['500'];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-backdrop selection:bg-brand-primary/30 p-6">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-${config.color}/10 rounded-full blur-[120px] animate-pulse`}></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px]"></div>
       </div>

       <div className="relative glass-card max-w-2xl w-full p-12 lg:p-20 text-center space-y-10 overflow-hidden group">
          {/* Animated Glitch Background */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-20"></div>
          
          <div className="relative flex flex-col items-center">
             <div className={`w-24 h-24 bg-inner-box border border-${config.color}/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-10 group-hover:scale-110 transition-transform duration-700`}>
                <Icon className={`text-${config.color} animate-float`} size={44} />
             </div>
             
             <div className="space-y-4">
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] text-${config.color}`}>Status Protocol: {config.code}</p>
                <h1 className="text-5xl lg:text-6xl font-display font-bold text-heading tracking-tighter uppercase italic italic-glitch">
                   {config.title}
                </h1>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-medium">
                   {message || config.desc}
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button 
               onClick={() => window.location.reload()}
               className="btn-luxury py-4 px-8 flex items-center justify-center gap-3 group/btn"
             >
                <RefreshCcw size={16} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                <span className="text-[10px] font-black uppercase tracking-widest">Retry Sync</span>
             </button>
             <button 
               onClick={() => navigate('/')}
               className="btn-luxury bg-white/5 border-white/10 hover:bg-white/10 py-4 px-8 flex items-center justify-center gap-3"
             >
                <Home size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Return Home</span>
             </button>
          </div>

          {/* Decorative Terminal Lines */}
          <div className="pt-10 border-t border-white/5 flex justify-between items-center opacity-20">
             <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Security Node: Active</p>
             <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-1 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
             </div>
          </div>
       </div>
    </div>
  );
};

export default ErrorPage;
