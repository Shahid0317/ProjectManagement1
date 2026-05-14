import React from 'react';
import { History, Search, Calendar, ArrowRight } from 'lucide-react';

const EmployeeProjectLedger = ({ 
  filteredProjects, 
  searchTerm, 
  setSearchTerm, 
  setActiveProject, 
  setActiveTab 
}) => {
  return (
    <section className="glass-card p-10 lg:p-12 animate-fadeIn">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-5">
             <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl">
                <History className="text-brand-secondary" size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Project Archive</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Operational History Registry</p>
             </div>
          </div>

          <div className="relative w-full md:w-80">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
             <input 
               type="text" 
               placeholder="FILTER LOGS..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="input-luxury !py-3 !pl-12 !pr-4 text-[10px] font-black uppercase tracking-widest w-full"
             />
          </div>
       </div>

       <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-slate-900/60 shadow-inner">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                   <th className="py-6 px-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Identifier</th>
                   <th className="py-6 px-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeframe</th>
                   <th className="py-6 px-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Status</th>
                   <th className="py-6 px-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Terminal</th>
                </tr>
             </thead>
             <tbody>
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                     <td className="py-8 px-10">
                        <p className="font-bold text-base text-white uppercase">{proj.projectName}</p>
                        <p className="text-[10px] text-brand-primary font-bold mt-1 tabular-nums">HEX: {proj.id.substring(0, 12)}</p>
                     </td>
                     <td className="py-8 px-10">
                        <div className="flex items-center gap-3 text-slate-400">
                           <Calendar size={14} />
                           <span className="text-[11px] font-bold tabular-nums">{proj.startDate} → {proj.deadline}</span>
                        </div>
                     </td>
                     <td className="py-8 px-10">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                        }`}>
                           {proj.status}
                        </span>
                     </td>
                     <td className="py-8 px-10">
                        <button 
                          onClick={() => { setActiveProject(proj); setActiveTab('work'); }}
                          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-brand-primary/20 hover:border-brand-primary/30 transition-all"
                        >
                          Re-Open Node
                        </button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </section>
  );
};

export default EmployeeProjectLedger;
