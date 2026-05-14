import React from 'react';
import { Briefcase, CheckCircle, Paperclip } from 'lucide-react';

const GlobalProjectLedger = ({
  allProjects,
  expandedProject,
  setExpandedProject,
  handleTogglePayment,
  setSelectedImage
}) => {
  return (
    <section className="glass-card p-10 animate-fadeIn">
       <div className="flex items-center gap-5 mb-12">
          <div className="p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl">
             <Briefcase className="text-emerald-400" size={28} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Project Oversight</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Cross-Sector Financial & Operational Status</p>
          </div>
       </div>

       <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-slate-900/60 shadow-inner">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Project Name</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Assigned Personnel</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Operational Status</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Budget Allocation</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Financial Status</th>
                </tr>
             </thead>
             <tbody>
                 {allProjects.map((proj) => (
                   <React.Fragment key={proj.id}>
                   <tr
                     className={`border-b border-white/5 transition-colors cursor-pointer ${
                       proj.status === 'Completed' ? 'hover:bg-emerald-500/5 bg-emerald-500/[0.02]' : 'hover:bg-white/[0.02]'
                     }`}
                     onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}
                   >
                      <td className="py-8 px-10">
                         <p className="font-bold text-base text-white">{proj.projectName}</p>
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1">{proj.id.substring(0, 8)}</p>
                      </td>
                      <td className="py-8 px-10">
                         <p className="font-bold text-sm text-slate-200">{Array.isArray(proj.employeeId) ? proj.employeeId.join(', ') : proj.employeeId}</p>
                      </td>
                      <td className="py-8 px-10">
                         <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                           proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                         }`}>
                            {proj.status}
                         </span>
                      </td>
                      <td className="py-8 px-10 font-bold text-sm text-white tabular-nums">
                         ${parseFloat(proj.budget).toLocaleString()}
                      </td>
                      <td className="py-8 px-10">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleTogglePayment(proj.id, proj.paymentStatus); }}
                           className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                             proj.paymentStatus === 'Paid' 
                               ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                               : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                           }`}
                         >
                            {proj.paymentStatus || 'Unpaid'}
                         </button>
                      </td>
                   </tr>
                   {/* Expanded Final Submission Panel */}
                   {expandedProject === proj.id && proj.finalSubmission && (
                     <tr className="border-b border-emerald-500/10">
                       <td colSpan="5" className="px-10 py-6 bg-emerald-500/[0.03]">
                         <div className="space-y-6 animate-fadeIn">
                           <div className="flex items-center gap-3">
                             <CheckCircle className="text-emerald-400" size={16} />
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Final Delivery — {proj.finalSubmission.completedAt}</p>
                           </div>
                           {proj.finalSubmission.description && (
                             <p className="text-sm text-slate-300 italic leading-relaxed border-l-2 border-emerald-500/30 pl-4">"{proj.finalSubmission.description}"</p>
                           )}
                           {proj.finalSubmission.finalImages?.length > 0 && (
                             <div className="flex flex-wrap gap-4">
                               {proj.finalSubmission.finalImages.map((url, i) => (
                                 <img
                                   key={i}
                                   src={url}
                                   alt={`delivery-${i}`}
                                   className="w-24 h-24 object-cover rounded-2xl border border-emerald-500/20 hover:scale-105 transition-transform cursor-pointer shadow-lg"
                                   onClick={(e) => { e.stopPropagation(); setSelectedImage(url); }}
                                 />
                               ))}
                             </div>
                           )}
                           {proj.finalSubmission.finalZipUrl && (
                             <a
                               href={proj.finalSubmission.finalZipUrl}
                               target="_blank"
                               rel="noreferrer"
                               onClick={(e) => e.stopPropagation()}
                               className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                             >
                               <Paperclip size={14} /> Download Final Project ZIP
                             </a>
                           )}
                         </div>
                       </td>
                     </tr>
                   )}
                   </React.Fragment>
                 ))}
             </tbody>
          </table>
       </div>
    </section>
  );
};

export default GlobalProjectLedger;
