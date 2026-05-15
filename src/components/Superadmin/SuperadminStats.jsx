import React from 'react';
import { Globe, DollarSign, Activity, Server, ArrowRight } from 'lucide-react';

const SuperadminStats = ({ 
  allProjectsCount = 0, 
  totalBudget = 0, 
  subProjectsCount = 0, 
  nodeCount = 0,
  onTabChange,
  onShowStaff
}) => {
  
  const formatCurrency = (val) => {
    try {
      const num = parseFloat(val);
      return isNaN(num) ? '$0' : `$${num.toLocaleString()}`;
    } catch (e) {
      return '$0';
    }
  };

  const stats = [
    { id: 'projects', label: 'All Projects', value: allProjectsCount || 0, icon: Globe, color: 'brand-secondary', action: () => onTabChange('projects') },
    { id: 'budget', label: 'Total Budget', value: formatCurrency(totalBudget), icon: DollarSign, color: 'emerald-400', action: null },
    { id: 'reports', label: 'Daily Reports', value: subProjectsCount || 0, icon: Activity, color: 'brand-primary', action: () => {
      // Smooth scroll to reports section
      document.querySelector('#daily-reports-feed')?.scrollIntoView({ behavior: 'smooth' });
    }},
    { id: 'staff', label: 'Total Staff', value: nodeCount || 0, icon: Server, color: 'brand-accent', action: onShowStaff }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <button 
          key={i} 
          onClick={stat.action}
          disabled={!stat.action}
          className={`glass-card p-6 group relative overflow-hidden text-left transition-all duration-500 ${stat.action ? 'hover:scale-[1.02] hover:border-white/20' : 'cursor-default'}`}
        >
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-${stat.color}/10 rounded-xl border border-${stat.color}/20 transition-colors group-hover:bg-${stat.color}/20`}>
              {stat.icon && <stat.icon size={20} className={`text-${stat.color}`} />}
            </div>
            {stat.action && (
              <ArrowRight size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            )}
          </div>

          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
          <h3 className="text-3xl font-display font-bold text-white tracking-tighter">
            {stat.value !== undefined && stat.value !== null ? stat.value : '0'}
          </h3>

          {stat.action && (
            <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary">View Details</span>
               <div className="h-px flex-1 bg-brand-primary/20"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default SuperadminStats;
