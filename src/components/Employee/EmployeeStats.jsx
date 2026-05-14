import React from 'react';
import { Briefcase, AlertTriangle, Calendar } from 'lucide-react';

const EmployeeStats = ({ activeCount, pendingCount }) => {
  const stats = [
    { label: 'Active Projects', value: activeCount, icon: Briefcase, color: 'brand-primary' },
    { label: 'Pending Projects', value: pendingCount, icon: AlertTriangle, color: 'brand-accent' },
    { label: 'Operational Days', value: '14', icon: Calendar, color: 'brand-secondary' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-8 group relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              <h3 className="text-4xl font-display font-bold text-white tracking-tighter">{stat.value}</h3>
            </div>
            <div className={`p-4 bg-${stat.color}/10 rounded-2xl border border-${stat.color}/20 text-${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeStats;
