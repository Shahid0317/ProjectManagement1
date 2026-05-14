import React from 'react';
import { FileCheck } from 'lucide-react';

const DailyReportFeed = ({ subProjects, handleFileAction }) => {
  return (
    <section className="glass-card p-10 lg:p-12 relative overflow-hidden">
       <div className="flex items-center gap-5 mb-10">
          <div className="p-3 bg-emerald-400/10 border border-emerald-400/20 rounded-xl">
             <FileCheck className="text-emerald-400" size={24} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Daily Report</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Sector Submission Flow</p>
          </div>
       </div>
       
       <div className="space-y-6">
          {subProjects.length === 0 ? (
            <div className="py-20 text-center opacity-30">
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Incoming Transmissions</p>
            </div>
          ) : (
            subProjects.slice(0, 10).map((sub, idx) => (
              <div key={idx} className="glass-card-sm p-6 flex items-center justify-between group">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                       {sub.employeeName?.charAt(0) || 'E'}
                    </div>
                    <div className="max-w-md">
                       <p className="font-bold text-white tracking-tight">{sub.projectName}</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                          {sub.employeeName} • {sub.date}
                       </p>
                       <p className="text-xs text-slate-400 italic mt-2 line-clamp-1 leading-relaxed">"{sub.description}"</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                       {sub.files?.map((f, i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                             {f.type.toUpperCase()}
                          </div>
                       ))}
                    </div>
                    <button 
                      onClick={(e) => handleFileAction(e, sub.files?.[0] || { url: '', type: 'image' })}
                      className="px-6 py-2.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-lg shadow-brand-primary/10"
                    >
                      Daily Report
                    </button>
                 </div>
              </div>
            ))
          )}
       </div>
    </section>
  );
};

export default DailyReportFeed;
