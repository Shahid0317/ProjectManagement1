import React from 'react';
import { Briefcase, Trash2, CheckCircle, Paperclip } from 'lucide-react';
import { getProjectStatusDynamic } from '../../services/mockDb';

const ProjectLedger = ({ 
  adminProjects = [], 
  expandedProject, 
  setExpandedProject, 
  handleDeleteProject, 
  handleFileAction, 
  setSelectedImage 
}) => {
  // Defensive check for projects
  const projects = Array.isArray(adminProjects) ? adminProjects : [];

  return (
    <section className="glass-card p-10 lg:p-12 animate-fadeIn">
       <div className="flex items-center gap-5 mb-12">
          <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl">
             <Briefcase className="text-brand-primary" size={32} />
          </div>
          <div>
             <h2 className="text-3xl font-bold text-white tracking-tight">Project Ledger</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Track project progress and budget</p>
          </div>
       </div>

       <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-inner-box shadow-inner">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Project Name</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Employees</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Budget</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Payment</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Options</th>
                </tr>
             </thead>
             <tbody>
                {projects.length === 0 ? (
                   <tr>
                     <td colSpan="6" className="py-32 text-center text-slate-500 text-sm font-black uppercase tracking-[0.4em] opacity-40">
                       No projects found in manifest
                     </td>
                   </tr>
                ) : (
                   projects.map((p) => {
                     const status = getProjectStatusDynamic(p);
                     return (
                      <React.Fragment key={p.id}>
                      <tr 
                        className={`border-b border-white/5 transition-colors cursor-pointer ${
                          status === 'Completed' ? 'hover:bg-emerald-500/5 bg-emerald-500/[0.02]' : 'hover:bg-white/[0.02]'
                        }`}
                        onClick={() => setExpandedProject(expandedProject === p.id ? null : p.id)}
                      >
                         <td className="py-8 px-10">
                            <p className="font-bold text-base text-white uppercase">{p.projectName || 'Untitled Project'}</p>
                            <p className="text-[10px] text-brand-primary font-bold mt-1 tabular-nums">ID: {p.id?.substring(0, 8)}</p>
                         </td>
                         <td className="py-8 px-10">
                            <p className="font-bold text-sm text-slate-200">{p.employeeName || 'Assigned Staff'}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                               {Array.isArray(p.employeeId) 
                                 ? p.employeeId.map(id => (
                                     <span key={id} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-500">
                                       {id.split('@')[0]}
                                     </span>
                                   ))
                                 : p.employeeId && (
                                     <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-500">
                                       {p.employeeId.split('@')[0]}
                                     </span>
                                   )
                               }
                            </div>
                         </td>
                         <td className="py-8 px-10">
                            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border whitespace-nowrap ${
                              status === 'Completed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            }`}>
                               {status}
                            </span>
                         </td>
                         <td className="py-8 px-10 font-bold text-sm text-white tabular-nums">
                            ${parseInt(p.budget || 0).toLocaleString()}
                         </td>
                         <td className="py-8 px-10">
                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border w-fit ${
                              p.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-inner-box text-slate-500 border-white/10'
                            }`}>
                               {p.paymentStatus || 'Waiting'}
                            </div>
                         </td>
                         <td className="py-8 px-10 text-center">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(p.id);
                              }}
                              className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg group"
                              title="Delete Project"
                            >
                              <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                         </td>
                      </tr>
                      {/* Expanded Final Submission Panel */}
                      {expandedProject === p.id && p.finalSubmission && (
                        <tr className="border-b border-emerald-500/10">
                          <td colSpan="6" className="px-10 py-6 bg-emerald-500/[0.03]">
                            <div className="space-y-6 animate-fadeIn">
                              <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="text-emerald-400" size={16} />
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Final Submission — {p.finalSubmission.completedAt}</p>
                              </div>
                              {p.finalSubmission.description && (
                                <p className="text-sm text-slate-300 italic leading-relaxed border-l-2 border-emerald-500/30 pl-4">"{p.finalSubmission.description}"</p>
                              )}
                              {p.finalSubmission.finalImages?.length > 0 && (
                                <div className="flex flex-wrap gap-4">
                                  {p.finalSubmission.finalImages.map((url, i) => (
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
                              {p.finalSubmission.finalZipUrl && (
                                <button
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleFileAction(e, { url: p.finalSubmission.finalZipUrl, type: 'zip', name: `${p.projectName}_final.zip` }); 
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
                     );
                   })
                )}
             </tbody>
          </table>
       </div>
    </section>
  );
};

export default ProjectLedger;
