import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';

const ProjectBrief = ({ 
  activeProject, 
  handleStatusChange, 
  delayReasonText, 
  setDelayReasonText, 
  handleDelaySubmit 
}) => {
  if (!activeProject) return null;

  return (
    <div className="xl:col-span-2 space-y-8">
       <div className="glass-card p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-transparent opacity-50"></div>
          <div className="flex items-center gap-6 mb-8">
             <div className="p-3 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                <Zap className="text-brand-primary animate-pulse" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">{activeProject.projectName}</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Operational Briefing</p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-950/20 border border-white/5 p-2 rounded-2xl flex gap-2">
                {['Ongoing', 'On-Hold', 'Completed'].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => handleStatusChange(stat)}
                    className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      activeProject.status === stat 
                        ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_30px_rgba(99,102,241,0.2)] scale-[1.02]' 
                        : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {stat}
                  </button>
                ))}
             </div>

             {activeProject.delayRequest && !activeProject.delayReason && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl animate-fadeIn">
                   <div className="flex items-center gap-3 mb-4 text-red-400">
                      <AlertTriangle size={18} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Delay Report Required</p>
                   </div>
                   <form onSubmit={handleDelaySubmit} className="space-y-4">
                      <textarea 
                        placeholder="EXPLAIN DELAY..." 
                        value={delayReasonText}
                        onChange={(e) => setDelayReasonText(e.target.value)}
                        required
                        className="input-luxury !bg-slate-950/40 text-xs h-24"
                      />
                      <button type="submit" className="w-full py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
                        Submit Report
                      </button>
                   </form>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default ProjectBrief;
