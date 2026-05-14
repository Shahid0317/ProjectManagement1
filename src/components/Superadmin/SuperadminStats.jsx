import React from 'react';
import { Globe, DollarSign, Activity, Server } from 'lucide-react';

const SuperadminStats = ({ allProjectsCount, totalBudget, subProjectsCount, nodeCount }) => {
  const stats = [
    { label: 'Global Operations', value: allProjectsCount, icon: Globe, color: 'brand-secondary' },
    { label: 'Total Capital', value: `$${totalBudget.toLocaleString()}`, icon: DollarSign, color: 'emerald-400' },
    { label: 'System Submissions', value: subProjectsCount, icon: Activity, color: 'brand-primary' },
    { label: 'System Nodes', value: nodeCount, icon: Server, color: 'brand-accent' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-8 group relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 bg-${stat.color}/10 rounded-2xl border border-${stat.color}/20`}>
              <stat.icon size={24} className={`text-${stat.color}`} />
            </div>
            <div className="h-1 w-8 bg-white/5 rounded-full mt-2"></div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
          <h3 className="text-4xl font-display font-bold text-white tracking-tighter">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default SuperadminStats;
