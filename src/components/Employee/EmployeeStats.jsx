import React from 'react';
import { Briefcase, AlertTriangle, Calendar, ArrowRight, ChevronDown } from 'lucide-react';

const EmployeeStats = ({ projects = [], workingDays = 0, setActiveTab, setActiveProject }) => {
  const [openDropdown, setOpenDropdown] = React.useState(null);

  React.useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const activeProjects = projects.filter(p => p.status === 'Ongoing');
  const pendingProjects = projects.filter(p => p.status === 'On-Hold' || p.status === 'Pending');

  const stats = [
    { 
      type: 'active',
      label: 'Active Projects', 
      value: activeProjects.length, 
      icon: Briefcase, 
      color: 'brand-primary', 
      items: activeProjects 
    },
    { 
      type: 'pending',
      label: 'Pending Projects', 
      value: pendingProjects.length, 
      icon: AlertTriangle, 
      color: 'brand-accent', 
      items: pendingProjects 
    },
    { 
      type: 'working',
      label: 'Working Days', 
      value: workingDays, 
      icon: Calendar, 
      color: 'brand-secondary',
      items: []
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          onClick={(e) => {
            e.stopPropagation();
            if (stat.items.length > 0) {
              setOpenDropdown(prev => prev === stat.type ? null : stat.type);
            }
          }}
          className={`glass-card p-8 group relative transition-all duration-300 ${
            openDropdown === stat.type ? 'z-30' : 'z-10'
          } ${
            stat.items.length > 0 
              ? 'cursor-pointer hover:border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]' 
              : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</p>
                {stat.items.length > 0 && (
                  <ChevronDown size={11} className={`text-slate-500 transition-transform duration-300 ${openDropdown === stat.type ? 'rotate-180 text-brand-primary' : ''}`} />
                )}
              </div>
              <h3 className="text-4xl font-display font-bold text-white tracking-tighter">{stat.value}</h3>
            </div>
            <div className={`p-4 bg-${stat.color}/10 rounded-2xl border border-${stat.color}/20 text-${stat.color} transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon size={24} />
            </div>
          </div>

          {openDropdown === stat.type && stat.items.length > 0 && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="absolute left-0 right-0 top-[105%] bg-slate-950 border border-white/10 rounded-2xl p-4 z-50 shadow-2xl space-y-2 animate-fadeIn max-h-60 overflow-y-auto custom-scrollbar"
            >
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2 pb-1 border-b border-white/5">Select Mission</p>
              {stat.items.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    if (typeof setActiveProject === 'function') setActiveProject(proj);
                    if (typeof setActiveTab === 'function') setActiveTab('work');
                    setOpenDropdown(null);
                  }}
                  className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all group/item"
                >
                  <span className="truncate pr-4">{proj.projectName}</span>
                  <ArrowRight size={14} className="text-slate-500 group-hover/item:text-brand-primary group-hover/item:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployeeStats;
