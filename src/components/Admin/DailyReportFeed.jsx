import React, { useState } from 'react';
import { FileCheck, Image as ImageIcon, Paperclip, Users, User, X, Calendar, Shield, ExternalLink, Download } from 'lucide-react';

const DailyReportFeed = ({ subProjects, handleFileAction }) => {
  const [viewMode, setViewMode] = useState('individual'); // 'individual' or 'grouped'
  const [selectedReport, setSelectedReport] = useState(null);

  // Group submissions by projectId
  const groupedSubmissions = subProjects.reduce((acc, sub) => {
    const pid = sub.projectId || sub.projectName; // Fallback if no projectId
    if (!acc[pid]) {
      acc[pid] = {
        projectId: pid,
        projectName: sub.projectName,
        reports: []
      };
    }
    acc[pid].reports.push(sub);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedSubmissions);

  return (
    <div className="glass-card p-6 lg:p-8 relative overflow-hidden h-fit flex flex-col">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-400/10 border border-emerald-400/20 rounded-xl">
                <FileCheck className="text-emerald-400" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Daily Reports</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent updates</p>
             </div>
          </div>

          <div className="flex bg-inner-box p-1.5 rounded-2xl border border-white/5 gap-1 w-full sm:w-auto">
             <button 
               onClick={() => setViewMode('individual')}
               className={`flex-1 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                 viewMode === 'individual' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:text-white'
               }`}
             >
                <User size={14} /> Individual
             </button>
             <button 
               onClick={() => setViewMode('grouped')}
               className={`flex-1 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                 viewMode === 'grouped' ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20' : 'text-slate-500 hover:text-white'
               }`}
             >
                <Users size={14} /> Grouped
             </button>
          </div>
       </div>
       
       <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1 max-h-[500px]">
          {viewMode === 'individual' ? (
             subProjects.length === 0 ? (
               <div className="py-12 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">No reports recorded</p>
               </div>
             ) : (
               subProjects.slice(0, 15).map((sub, idx) => (
                 <IndividualReportCard 
                    key={idx} 
                    sub={sub} 
                    handleFileAction={handleFileAction} 
                    onView={() => setSelectedReport(sub)}
                 />
               ))
             )
          ) : (
            groupedArray.length === 0 ? (
               <div className="py-12 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">No grouped reports</p>
               </div>
            ) : (
               groupedArray.map((group, idx) => (
                 <GroupedReportCard 
                    key={idx} 
                    group={group} 
                    handleFileAction={handleFileAction} 
                    onViewReport={(sub) => setSelectedReport(sub)}
                 />
               ))
            )
          )}
       </div>

       {/* Report Details Modal */}
       {selectedReport && (
          <ReportViewerModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
            handleFileAction={handleFileAction}
          />
       )}
    </div>
  );
};

const IndividualReportCard = ({ sub, handleFileAction, onView }) => (
  <div className="glass-card-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 group animate-fadeIn">
     <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white shrink-0">
           {sub.employeeName?.charAt(0) || 'E'}
        </div>
        <div className="min-w-0">
           <p className="font-bold text-base text-white tracking-tight truncate">{sub.projectName}</p>
           <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 truncate">
              {sub.employeeName} • {sub.date}
           </p>
           <p className="text-[13px] text-slate-400 italic mt-2 line-clamp-1 leading-relaxed">"{sub.description}"</p>
        </div>
     </div>
     
     <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
        <div className="flex -space-x-2 overflow-hidden">
           {sub.files?.slice(0, 4).map((f, i) => (
              <FileIcon key={i} file={f} handleFileAction={handleFileAction} />
           ))}
           {sub.files?.length > 4 && (
             <div className="w-8 h-8 rounded-full bg-inner-box border-2 border-transparent flex items-center justify-center text-[9px] font-bold text-slate-400 z-10 relative">
                +{sub.files.length - 4}
             </div>
           )}
        </div>
        <button 
          onClick={onView}
          className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white transition-all whitespace-nowrap"
        >
          View Report
        </button>
     </div>
  </div>
);

const GroupedReportCard = ({ group, handleFileAction, onViewReport }) => (
  <div className="glass-card-sm p-5 space-y-4 animate-fadeIn border-brand-secondary/10">
     <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center gap-4">
           <div className="p-2.5 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl text-brand-secondary">
              <Users size={18} />
           </div>
           <div>
              <h3 className="font-bold text-base text-white uppercase tracking-tight">{group.projectName}</h3>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{group.reports.length} Reports</p>
           </div>
        </div>
     </div>

     <div className="space-y-3">
        {group.reports.slice(0, 5).map((sub, i) => (
           <div key={i} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-2xl group/sub">
              <div className="flex items-center gap-3 min-w-0">
                 <div className="w-8 h-8 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-[10px] font-bold text-brand-secondary">
                    {sub.employeeName?.charAt(0)}
                 </div>
                 <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-200 truncate">{sub.employeeName}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{sub.date}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => onViewReport(sub)}
                   className="p-2 text-slate-500 hover:text-brand-secondary transition-colors"
                   title="View Full Report"
                 >
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>
        ))}
     </div>
  </div>
);

const ReportViewerModal = ({ report, onClose, handleFileAction }) => {
  const imageFiles = report.files?.filter(f => f.type === 'image') || [];
  const zipFiles = report.files?.filter(f => f.type === 'zip') || [];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 lg:p-12 animate-fadeIn">
       <div className="absolute inset-0 bg-backdrop/80 backdrop-blur-md" onClick={onClose}></div>
       
       <div className="relative modal-solid w-full max-w-3xl overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
             <div className="flex items-center gap-6">
                <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-brand-primary">
                   <FileCheck size={28} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-heading tracking-tighter uppercase">{report.projectName}</h2>
                   <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{report.employeeName}</p>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                         <Calendar size={12} /> {report.date}
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
             {/* Mission Description */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <Shield size={14} className="text-brand-primary" />
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Briefing</h4>
                </div>
                <div className="p-6 bg-inner-box border border-white/5 rounded-3xl">
                   <p className="text-sm text-slate-300 leading-relaxed font-medium italic whitespace-pre-wrap">
                      "{report.description}"
                   </p>
                </div>
             </div>

             {/* Evidence Gallery */}
             {imageFiles.length > 0 && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <ImageIcon size={14} className="text-brand-secondary" />
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Visual Evidence</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{imageFiles.length} Images Attached</span>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {imageFiles.map((file, i) => (
                         <div 
                           key={i} 
                           onClick={(e) => handleFileAction(e, file)}
                           className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-brand-primary/50 transition-all"
                         >
                            <img src={file.url} alt="report" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <ExternalLink size={20} className="text-white" />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {/* Documentation / ZIP */}
             {zipFiles.length > 0 && (
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Paperclip size={14} className="text-emerald-400" />
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Project Archive</h4>
                   </div>
                   {zipFiles.map((file, i) => (
                      <button 
                        key={i}
                        onClick={(e) => handleFileAction(e, file)}
                        className="w-full p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between group hover:bg-emerald-500/10 transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                               <Download size={18} />
                            </div>
                            <div className="text-left">
                               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Download Mission Data</p>
                               <p className="text-[11px] font-bold text-slate-500 mt-0.5">{file.name || 'Archive.zip'}</p>
                            </div>
                         </div>
                         <ExternalLink size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </button>
                   ))}
                </div>
             )}
          </div>

          {/* Footer */}
          <div className="p-10 border-t border-white/5 bg-white/[0.01]">
             <button onClick={onClose} className="w-full btn-primary py-4">Close Report Viewer</button>
          </div>
       </div>
    </div>
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
        isZip ? 'text-brand-secondary' : 'text-brand-primary'
      }`}
    >
       {isZip ? <Paperclip size={iconSize} /> : <ImageIcon size={iconSize} />}
    </div>
  );
};

export default DailyReportFeed;
