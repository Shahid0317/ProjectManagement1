import React from 'react';
import { Zap, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

const ProjectBrief = ({ 
  activeProject, 
  handleStatusUpdate, 
  teamStatus = [],
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
                <h2 className="text-xl font-bold text-heading tracking-tight uppercase">{activeProject.projectName}</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Project Details</p>
             </div>
          </div>

          {activeProject.description && (
             <div className="mb-8 p-6 bg-inner-box/50 border border-white/5 rounded-2xl">
                <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mb-3">Mission Briefing</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap italic">
                   "{activeProject.description}"
                </p>
             </div>
          )}

          <div className="space-y-6">
             <div className="bg-inner-box border border-white/10 p-2 rounded-2xl flex gap-2 shadow-inner">
                {['Ongoing', 'On-Hold', 'Completed'].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => handleStatusUpdate(stat)}
                    className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      activeProject.status === stat 
                        ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_30px_rgba(180,83,9,0.2)] scale-[1.02]' 
                        : 'bg-transparent border-transparent text-slate-500 hover:text-heading hover:bg-white/5'
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
                      <p className="text-[10px] font-black uppercase tracking-widest">Delay Explanation Required</p>
                   </div>
                   <form onSubmit={handleDelaySubmit} className="space-y-4">
                      <textarea 
                        placeholder="EXPLAIN DELAY..." 
                        value={delayReasonText}
                        onChange={(e) => setDelayReasonText(e.target.value)}
                        required
                        className="input-luxury !bg-inner-box text-xs h-24"
                      />
                      <button type="submit" className="w-full py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
                        Submit Explanation
                      </button>
                   </form>
                </div>
             )}

             {/* Team Submission Status */}
             {teamStatus.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5 space-y-6 animate-fadeIn">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Team Submission Status</h3>
                      <span className="text-[8px] font-bold text-slate-500 tabular-nums uppercase">Today's Updates</span>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {teamStatus.map((member, i) => (
                         <div key={i} className="flex items-center gap-3 bg-inner-box border border-white/10 p-3 rounded-2xl group transition-all hover:border-brand-primary/20">
                            <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_12px_currentColor] ${member.submitted ? 'text-emerald-500 bg-emerald-500' : 'text-red-500 bg-red-500'}`}></div>
                            <div className="min-w-0">
                               <p className="text-[10px] font-bold text-heading truncate uppercase tracking-tighter">{member.name}</p>
                               <p className={`text-[8px] font-black uppercase tracking-[0.1em] mt-0.5 ${member.submitted ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                  {member.submitted ? 'Submitted' : 'Pending'}
                                </p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default ProjectBrief;
