import React from 'react';
import { CheckCircle, AlertTriangle, ArrowRight, Paperclip } from 'lucide-react';

const ProjectCard = ({ 
  project, 
  isNearDeadline, 
  handleStatusChange, 
  setActiveProject, 
  setActiveTab 
}) => {
  const nearDeadline = project.status === 'Ongoing' && isNearDeadline(project.deadline);
  
  return (
    <div className={`glass-card group transition-all duration-500 overflow-hidden flex flex-col relative ${
        project.status === 'Completed'
          ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
          : nearDeadline
            ? 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.12)]'
            : 'hover:border-brand-primary/40'
      }`}>
      {project.status === 'Completed' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-80"></div>
      )}
      {nearDeadline && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600 opacity-80 animate-pulse"></div>
      )}
      <div className="p-8 flex-1">
         <div className="flex justify-between items-start mb-6">
            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
              project.status === 'Completed'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : nearDeadline
                  ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                  : project.status === 'Ongoing' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-400 border-white/5'
            }`}>
               {project.status === 'Completed' && <CheckCircle size={8} />}
               {nearDeadline && <AlertTriangle size={8} className="animate-pulse" />}
               {project.status}
            </span>
            <p className="text-[10px] font-bold text-slate-500 tabular-nums">ID: {project.id.substring(0, 8)}</p>
         </div>
         <h3 className={`text-xl font-bold tracking-tight mb-4 uppercase leading-tight transition-colors ${
            project.status === 'Completed' ? 'text-emerald-400' : nearDeadline ? 'text-red-400' : 'text-white group-hover:text-brand-primary'
          }`}>{project.projectName}</h3>
         
         <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Commenced:</span>
               <span className="text-[10px] font-bold text-slate-300 tabular-nums">{project.startDate}</span>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deadline:</span>
               <span className={`text-[10px] font-bold tabular-nums ${new Date(project.deadline) < new Date() && project.status !== 'Completed' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {project.deadline}
               </span>
            </div>
         </div>

         {/* Status Control */}
         <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-2">
            {['Ongoing', 'On-Hold', 'Completed'].map((stat) => (
              <button
                key={stat}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(stat, project.id);
                }}
                className={`py-2 rounded-lg text-[7px] font-black uppercase tracking-tighter border transition-all ${
                  project.status === stat 
                    ? stat === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg' : 'bg-brand-primary/20 text-white border-brand-primary/40 shadow-lg' 
                    : 'bg-white/5 border-white/5 text-slate-600 hover:text-white hover:bg-white/10'
                }`}
              >
                {stat}
              </button>
            ))}
         </div>

         {/* Final Submission Preview */}
         {project.status === 'Completed' && project.finalSubmission && (
           <div className="mt-6 pt-6 border-t border-emerald-500/10 space-y-4 animate-fadeIn">
              {project.finalSubmission.description && (
                <p className="text-[10px] text-slate-400 italic leading-relaxed">"{project.finalSubmission.description}"</p>
              )}
              {project.finalSubmission.finalImages?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                   {project.finalSubmission.finalImages.map((url, i) => (
                     <img
                       key={i}
                       src={url}
                       alt={`final-${i}`}
                       className="w-16 h-16 object-cover rounded-xl border border-emerald-500/20 hover:scale-110 transition-transform cursor-pointer"
                       onClick={() => window.open(url, '_blank')}
                     />
                   ))}
                </div>
              )}
              {project.finalSubmission.finalZipUrl && (
                <a href={project.finalSubmission.finalZipUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase hover:text-emerald-300">
                  <Paperclip size={12} /> Download Final ZIP
                </a>
              )}
           </div>
         )}
      </div>
      <button 
        onClick={() => { setActiveProject(project); setActiveTab('work'); }}
        className={`w-full py-5 border-t border-white/5 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 ${
          project.status === 'Completed'
            ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400'
            : 'bg-brand-primary/5 hover:bg-brand-primary text-slate-400 hover:text-white'
        }`}
      >
        {project.status === 'Completed' ? 'View Details' : 'Initialize Terminal'} <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default ProjectCard;
