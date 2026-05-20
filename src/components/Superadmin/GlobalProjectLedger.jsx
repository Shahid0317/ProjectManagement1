import React, { useState } from 'react';
import { Briefcase, CheckCircle, Paperclip, User, Users } from 'lucide-react';

const GlobalProjectLedger = ({
  allProjects,
  expandedProject,
  setExpandedProject,
  handleUpdatePaymentStatus,
  setSelectedImage,
  handleFileAction
}) => {
  const [filter, setFilter] = useState('all');
  const [activeReopenReason, setActiveReopenReason] = useState(null); // all, individual, group

  const filteredProjects = allProjects.filter(proj => {
    const isGroup = Array.isArray(proj.employeeId) && proj.employeeId.length > 1;
    if (filter === 'individual') return !isGroup;
    if (filter === 'group') return isGroup;
    return true;
  });

  const paymentOptions = ['Pending', 'Paid', 'Unpaid'];

  return (
    <section className="animate-fadeIn space-y-8">
       {/* Filter Tabs */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 glass-card p-6 lg:p-8">
          <div className="flex items-center gap-5">
             <div className="p-3 bg-emerald-400/10 border border-emerald-400/20 rounded-xl text-emerald-400">
                <Briefcase size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-heading tracking-tight">Project Ledger</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Manage project payments and deliveries</p>
             </div>
          </div>

          <div className="flex p-1.5 bg-inner-box border border-white/5 rounded-2xl">
             {[
               { id: 'all', label: 'All', icon: Briefcase },
               { id: 'individual', label: 'Individual', icon: User },
               { id: 'group', label: 'Group', icon: Users }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setFilter(tab.id)}
                 className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   filter === tab.id 
                     ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                     : 'text-slate-500 hover:text-heading hover:bg-white/5'
                 }`}
               >
                 <tab.icon size={14} />
                 {tab.label}
               </button>
             ))}
          </div>
       </div>

       <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-white/5 bg-inner-box/50">
                      <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Project Details</th>
                      <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Personnel</th>
                      <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Budget</th>
                      <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Payment Status</th>
                   </tr>
                </thead>
                <tbody>
                     {filteredProjects.length === 0 ? (
                       <tr>
                         <td colSpan="5" className="py-32 text-center opacity-30">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">No projects found in this category</p>
                         </td>
                       </tr>
                     ) : (
                       filteredProjects.map((proj) => (
                         <React.Fragment key={proj.id}>
                         <tr
                           className={`border-b border-white/5 transition-colors cursor-pointer ${
                             proj.status === 'Completed' ? 'hover:bg-emerald-500/5 bg-emerald-500/[0.02]' : 'hover:bg-white/[0.02]'
                           }`}
                           onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}
                         >
                            <td className="py-8 px-10">
                               <p className="font-bold text-base text-heading">{proj.projectName}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{proj.id.substring(0, 8)}</p>
                                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                  <p className="text-[9px] font-black text-brand-secondary uppercase tracking-widest">
                                    {Array.isArray(proj.employeeId) && proj.employeeId.length > 1 ? 'Group' : 'Individual'}
                                  </p>
                               </div>
                            </td>
                            <td className="py-8 px-10 max-w-xs">
                               <p className="font-bold text-sm text-slate-500 truncate">
                                 {Array.isArray(proj.employeeId) ? proj.employeeId.join(', ') : proj.employeeId}
                               </p>
                            </td>
                            <td className="py-8 px-10">
                               <div className="flex items-center gap-2">
                                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                                    proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                  }`}>
                                     {proj.status}
                                  </span>
                                  {proj.reopenApproved && (
                                     <span 
                                        onClick={(e) => {
                                           e.stopPropagation();
                                           setActiveReopenReason({
                                              projectName: proj.projectName,
                                              reason: proj.reopenReason || 'No reason provided.'
                                           });
                                        }}
                                        className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-emerald-500/20 hover:scale-105 transition-all"
                                        title="Click to view reactivation reason"
                                     >
                                        Re-Opened
                                     </span>
                                  )}
                               </div>
                            </td>
                            <td className="py-8 px-10 font-bold text-sm text-heading tabular-nums">
                               ${parseFloat(proj.budget).toLocaleString()}
                            </td>
                            <td className="py-8 px-10">
                               <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                                  {paymentOptions.map(opt => (
                                    <button 
                                      key={opt}
                                      onClick={() => handleUpdatePaymentStatus(proj.id, opt)}
                                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                        proj.paymentStatus === opt 
                                          ? opt === 'Paid' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                            opt === 'Unpaid' ? 'bg-red-500 border-red-500 text-white' :
                                            'bg-amber-500 border-amber-500 text-white'
                                          : 'bg-inner-box border-white/10 text-slate-500 hover:border-white/20'
                                      }`}
                                    >
                                       {opt}
                                    </button>
                                  ))}
                                </div>
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
                                   <p className="text-sm text-slate-500 italic leading-relaxed border-l-2 border-emerald-500/30 pl-4">"{proj.finalSubmission.description}"</p>
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
                                   <button
                                     onClick={(e) => { 
                                       e.stopPropagation(); 
                                       handleFileAction(e, { url: proj.finalSubmission.finalZipUrl, type: 'zip', name: `${proj.projectName}_final.zip` }); 
                                     }}
                                     className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-all cursor-pointer"
                                   >
                                     <Paperclip size={14} /> Download Final ZIP
                                   </button>
                                 )}
                               </div>
                             </td>
                           </tr>
                         )}
                         </React.Fragment>
                       ))
                     )}
                </tbody>
             </table>
          </div>
       </div>
    

{/* Reopen Reason Modal */}
     {activeReopenReason && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setActiveReopenReason(null)}>
           <div className="glass-card max-w-md w-full p-8 space-y-6 relative border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tight">Reopen Reason</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeReopenReason.projectName}</p>
              </div>
              <div className="p-6 bg-inner-box/50 border border-white/5 rounded-2xl">
                 <p className="text-xs text-emerald-400 font-medium leading-relaxed italic">
                    "{activeReopenReason.reason}"
                 </p>
              </div>
              <button 
                 onClick={() => setActiveReopenReason(null)}
                 className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
              >
                 Close
              </button>
           </div>
        </div>
     )}
     </section>

     
  );
};

export default GlobalProjectLedger;
