import React, { useState } from 'react';
import { History, Search, Calendar, FolderOpen, Send, X } from 'lucide-react';
import { requestProjectReopen } from '../../services/mockDb';

const EmployeeProjectLedger = ({ 
  filteredProjects, 
  searchTerm, 
  setSearchTerm, 
  setActiveProject, 
  setActiveTab,
  fetchData
}) => {
  const [reopenProject, setReopenProject] = useState(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim() || !reopenProject) return;

    setIsSubmitting(true);
    const success = await requestProjectReopen(reopenProject.id, reason);
    if (success) {
      setReason('');
      setReopenProject(null);
      if (typeof fetchData === 'function') {
        await fetchData();
      }
    }
    setIsSubmitting(false);
  };

  return (
    <section className="glass-card p-10 lg:p-12 animate-fadeIn relative">
      {/* Reopen Reason Entry Modal */}
      {reopenProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-main border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl space-y-6 animate-zoomIn relative">
            <button 
              onClick={() => { setReopenProject(null); setReason(''); }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FolderOpen className="text-brand-primary" size={22} />
                Re-Open Project Approval
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Request authorization to reactivate: <span className="text-white font-black">{reopenProject.projectName}</span>
              </p>
            </div>

            <form onSubmit={handleReopenSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Reason for Re-opening
                </label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a detailed explanation of why this project needs to be reactivated..."
                  className="input-luxury w-full h-32 resize-none text-xs font-semibold leading-relaxed"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setReopenProject(null); setReason(''); }}
                  className="flex-1 py-4 bg-inner-box border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reason.trim()}
                  className="flex-1 py-4 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-30 text-[10px] font-black uppercase tracking-widest text-white rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-primary/15"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send size={12} /> Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl">
            <History className="text-brand-secondary" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-heading tracking-tight">Project Archive</h2>
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

      <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-inner-box shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-inner-box/50">
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
                  <p className="font-bold text-base text-heading uppercase">{proj.projectName}</p>
                  <p className="text-[10px] text-brand-primary font-bold mt-1 tabular-nums">HEX: {proj.id.substring(0, 12)}</p>
                </td>
                <td className="py-8 px-10">
                  <div className="flex items-center gap-3 text-slate-500">
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
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setActiveProject(proj); setActiveTab('work'); }}
                      className="px-6 py-2.5 bg-inner-box border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-heading hover:bg-brand-primary/20 hover:border-brand-primary/30 transition-all cursor-pointer"
                    >
                      Re-Open Node
                    </button>
                    {proj.status === 'Completed' ? (
                      <>
                        {proj.reopenRequested ? (
                          <span className="px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-amber-400 animate-pulse">
                            Pending Reopen Approval
                          </span>
                        ) : (
                          <button
                            onClick={() => setReopenProject(proj)}
                            className="px-6 py-2.5 bg-brand-primary text-white border border-brand-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all cursor-pointer shadow-md shadow-brand-primary/10"
                          >
                            Re-Open Project
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {proj.reopenApproved && (
                          <span className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-emerald-400">
                            Re-Opened
                          </span>
                        )}
                      </>
                    )}
                  </div>
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
