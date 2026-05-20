import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Image as ImageIcon, Paperclip, X, Calendar, Shield, ExternalLink, Download, Search } from 'lucide-react';

const FinalSubmissionsFeed = ({ projects, handleFileAction }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter projects that have final submissions
  const completedProjects = projects.filter(p => {
    // Show projects with status 'Completed' or having final submission data
    const hasFinalData = p.finalSubmission && 
      (p.finalSubmission.description || 
       (p.finalSubmission.finalImages && p.finalSubmission.finalImages.length > 0) || 
       p.finalSubmission.finalZipUrl);
    return hasFinalData;
  });

  const filteredSubmissions = completedProjects.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchesProject = (p.projectName || '').toLowerCase().includes(query);
    
    // Check if employee name or email matches search
    let matchesEmployee = false;
    if (Array.isArray(p.employeeId)) {
      matchesEmployee = p.employeeId.some(email => email.toLowerCase().includes(query));
    } else if (p.employeeId) {
      matchesEmployee = p.employeeId.toLowerCase().includes(query);
    }
    
    let matchesMonth = true;
    if (selectedMonth !== 'all' && p.finalSubmission?.submittedAt) {
      // Parse DD/MM/YYYY
      const parts = p.finalSubmission.submittedAt.split('/');
      if (parts.length === 3) {
        const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
        const subMonth = dateObj.toLocaleString('default', { month: 'long' });
        matchesMonth = subMonth.toLowerCase() === selectedMonth.toLowerCase();
      }
    }

    return (matchesProject || matchesEmployee) && matchesMonth;
  });

  return (
    <div className="glass-card p-6 lg:p-8 relative overflow-hidden h-fit flex flex-col border-emerald-500/20">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent opacity-60"></div>
       
       {/* Header & Filters */}
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-400/10 border border-emerald-400/20 rounded-xl">
                <Award className="text-emerald-400" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Final Submissions</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Completed Deliverables & ZIP Archives</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
             {/* Search Filter */}
             <div className="relative flex-1 sm:min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text"
                  placeholder="SEARCH PROJECT OR EMPLOYEE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-luxury pl-11 py-2 text-[10px] font-black tracking-wider uppercase w-full placeholder:text-slate-600"
                />
             </div>

             {/* Month Filter */}
             <div className="relative sm:min-w-[160px]">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="input-luxury py-2 px-4 pr-10 text-[10px] font-black tracking-wider uppercase appearance-none cursor-pointer w-full bg-slate-950"
                >
                  <option value="all">ALL MONTHS</option>
                  {monthsList.map(m => (
                    <option key={m} value={m}>{m.toUpperCase()}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[8px] font-black">
                  ▼
                </div>
             </div>
          </div>
       </div>
       
       {/* Table Feed */}
       <div className="flex-1 overflow-x-auto custom-scrollbar pr-1 max-h-[500px]">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-white/5">
                   <th className="pb-4 pl-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Project</th>
                   <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Assigned To</th>
                   <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Submission Date</th>
                   <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Final Description</th>
                   <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Final Deliverables</th>
                   <th className="pb-4 pr-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {filteredSubmissions.length === 0 ? (
                   <tr>
                      <td colSpan="6" className="py-16 text-center opacity-30">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">No final submissions found</p>
                      </td>
                   </tr>
                ) : (
                   filteredSubmissions.map((project, idx) => {
                      const employeesList = Array.isArray(project.employeeId) 
                        ? project.employeeId.join(', ') 
                        : (project.employeeId || 'Unknown');
                      
                      const submittedDate = project.finalSubmission?.submittedAt || project.deadline || 'N/A';
                      const desc = project.finalSubmission?.description || 'No description provided';
                      
                      // Build file list for the row preview
                      const rowFiles = [];
                      if (project.finalSubmission?.finalImages) {
                        project.finalSubmission.finalImages.forEach(url => {
                          rowFiles.push({ type: 'image', url, name: 'Screenshot' });
                        });
                      }
                      if (project.finalSubmission?.finalZipUrl) {
                        rowFiles.push({ type: 'zip', url: project.finalSubmission.finalZipUrl, name: 'Archive.zip' });
                      }

                      return (
                         <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                            {/* Project Name */}
                            <td className="py-5 pl-4">
                               <p className="font-bold text-sm text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                                  {project.projectName}
                               </p>
                            </td>
                            {/* Assigned To */}
                            <td className="py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                                     {employeesList.charAt(0).toUpperCase()}
                                  </div>
                                  <p className="text-xs font-semibold text-slate-300 truncate max-w-[180px]" title={employeesList}>
                                     {employeesList}
                                  </p>
                               </div>
                            </td>
                            {/* Submission Date */}
                            <td className="py-5">
                               <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <Calendar size={13} className="text-slate-500" />
                                  <span>{submittedDate}</span>
                               </div>
                            </td>
                            {/* Description preview */}
                            <td className="py-5 max-w-xs">
                               <p className="text-xs text-slate-400 italic truncate pr-4" title={desc}>
                                  "{desc}"
                               </p>
                            </td>
                            {/* Attachments */}
                            <td className="py-5">
                               <div className="flex -space-x-1.5 overflow-hidden">
                                  {rowFiles.slice(0, 3).map((f, i) => (
                                     <FileIcon key={i} file={f} handleFileAction={handleFileAction} small={true} />
                                  ))}
                                  {rowFiles.length > 3 && (
                                     <div className="w-6 h-6 rounded-full bg-inner-box border border-white/10 flex items-center justify-center text-[8px] font-black text-slate-400 z-10">
                                        +{rowFiles.length - 3}
                                     </div>
                                  )}
                                  {rowFiles.length === 0 && (
                                     <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">None</span>
                                  )}
                               </div>
                            </td>
                            {/* Action */}
                            <td className="py-5 pr-4 text-right">
                               <button 
                                 onClick={() => setSelectedSubmission(project)}
                                 className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all whitespace-nowrap"
                               >
                                  Check Files
                               </button>
                            </td>
                         </tr>
                      );
                   })
                )}
             </tbody>
          </table>
       </div>

       {/* Modal Viewer */}
       {selectedSubmission && (
          <SubmissionViewerModal 
            project={selectedSubmission} 
            onClose={() => setSelectedSubmission(null)} 
            handleFileAction={handleFileAction}
          />
       )}
    </div>
  );
};

const SubmissionViewerModal = ({ project, onClose, handleFileAction }) => {
  const images = project.finalSubmission?.finalImages || [];
  const zipUrl = project.finalSubmission?.finalZipUrl;
  
  const employeesList = Array.isArray(project.employeeId) 
    ? project.employeeId.join(', ') 
    : (project.employeeId || 'Unknown');

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 lg:p-12 animate-fadeIn">
       <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose}></div>
       
       <div className="relative modal-solid w-full max-w-3xl overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
             <div className="flex items-center gap-6">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                   <Award size={28} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-heading tracking-tighter uppercase">{project.projectName}</h2>
                   <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{employeesList}</p>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                         <Calendar size={12} /> {project.finalSubmission?.submittedAt || project.deadline || 'N/A'}
                      </div>
                   </div>
                </div>
             </div>
             <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-slate-500 hover:text-white transition-all">
                <X size={24} />
             </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 space-y-10">
             {/* Final Description */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <Shield size={14} className="text-emerald-400" />
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Final Report & Overview</h4>
                </div>
                <div className="p-6 bg-inner-box border border-white/5 rounded-3xl">
                   <p className="text-sm text-slate-300 leading-relaxed font-medium italic whitespace-pre-wrap">
                      "{project.finalSubmission?.description || 'No description provided.'}"
                   </p>
                </div>
             </div>

             {/* Screenshot Evidence Gallery */}
             {images.length > 0 && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <ImageIcon size={14} className="text-emerald-400" />
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Final Screenshots</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{images.length} Images Attached</span>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((url, i) => (
                         <div 
                           key={i} 
                           onClick={(e) => handleFileAction(e, { url, type: 'image', name: 'screenshot.jpg' })}
                           className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-emerald-500/50 transition-all"
                         >
                            <img src={url} alt="final-evidence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <ExternalLink size={20} className="text-white" />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {/* Final ZIP Archive */}
             {zipUrl && (
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Paperclip size={14} className="text-emerald-400" />
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Project Source ZIP Archive</h4>
                   </div>
                   <button 
                     onClick={(e) => handleFileAction(e, { url: zipUrl, type: 'zip', name: `${project.projectName}_source.zip` })}
                     className="w-full p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between group hover:bg-emerald-500/10 transition-all"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                            <Download size={18} />
                         </div>
                         <div className="text-left">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Download ZIP Archive</p>
                            <p className="text-[11px] font-bold text-slate-500 mt-0.5">{project.projectName}_source.zip</p>
                         </div>
                      </div>
                      <ExternalLink size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                   </button>
                </div>
             )}
          </div>

          {/* Footer */}
          <div className="p-10 border-t border-white/5 bg-white/[0.01]">
             <button onClick={onClose} className="w-full btn-primary py-4">Close Deliverables Viewer</button>
          </div>
       </div>
    </div>,
    document.body
  );
};

const FileIcon = ({ file, handleFileAction, small = false }) => {
  const isZip = file.type === 'zip' || file.url?.toLowerCase().endsWith('.zip');
  const size = small ? 'w-6 h-6' : 'w-8 h-8';
  const iconSize = small ? 10 : 12;

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); handleFileAction(e, file); }}
      className={`${size} rounded-full border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 hover:z-20 relative bg-inner-box border-white/10 ${
        isZip ? 'text-emerald-400' : 'text-brand-primary'
      }`}
    >
       {isZip ? <Paperclip size={iconSize} /> : <ImageIcon size={iconSize} />}
    </div>
  );
};

export default FinalSubmissionsFeed;
