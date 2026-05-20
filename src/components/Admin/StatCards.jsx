import React from 'react';
import { Briefcase, Clock, CheckCircle, Users } from 'lucide-react';

const StatCards = ({ projects = [], employees = [], onTabChange }) => {
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  const extensionRequestsCount = projects.filter(p => p.extensionRequested === true || p.submissionRequested === true || p.reopenRequested === true).length;
  const verifiedAssetsCount = projects.filter(p => p.status === 'Completed').length;
  const employeesCount = employees.length;

  const stats = [
    { label: 'Active Projects', value: activeProjectsCount, icon: Briefcase, color: 'brand-primary' },
    { label: 'Project Requests', value: extensionRequestsCount, icon: Clock, color: 'brand-secondary', isExtension: true },
    { label: 'Verified Assets', value: verifiedAssetsCount, icon: CheckCircle, color: 'emerald-400' },
    { label: 'Employees', value: employeesCount, icon: Users, color: 'brand-accent' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          onClick={() => {
            if (stat.isExtension) {
              const element = document.getElementById('extension-requests-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            } else if (i === 3 && typeof onTabChange === 'function') {
              onTabChange('employees');
            } else if (i === 0 && typeof onTabChange === 'function') {
              onTabChange('ledger');
            }
          }}
          className={`glass-card p-8 group relative overflow-hidden transition-all duration-300 ${
            stat.isExtension ? 'cursor-pointer hover:border-brand-secondary/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]' : ''
          }`}
        >
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 bg-${stat.color}/10 rounded-2xl border border-${stat.color}/20 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} className={`text-${stat.color}`} />
            </div>
            {stat.isExtension && (
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[8px] font-black uppercase tracking-widest rounded-lg animate-pulse">
                Action Req.
              </span>
            )}
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
          <h3 className="text-4xl font-display font-bold text-white tracking-tighter">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
