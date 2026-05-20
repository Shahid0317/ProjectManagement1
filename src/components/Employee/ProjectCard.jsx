import React from 'react';
import { CheckCircle, AlertTriangle, ArrowRight, Paperclip } from 'lucide-react';

const ProjectCard = ({ 
  project, 
  isNearDeadline, 
  handleStatusChange, 
  setActiveProject, 
  setActiveTab 
}) => {
  const nearDeadline = project.status === 'Ongoing' && typeof isNearDeadline === 'function' && isNearDeadline(project.deadline);
  
  return (
    <div 
      onClick={() => { setActiveProject(project); setActiveTab('work'); }}
      className={`glass-card group transition-all duration-500 overflow-hidden flex flex-col relative cursor-pointer ${
        project.status === 'Completed'
          ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
          : nearDeadline
            ? 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.12)]'
            : 'hover:border-brand-primary/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
      }`}
    >
      {project.status === 'Completed' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-80"></div>
      )}
      {nearDeadline && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600 opacity-80 animate-pulse"></div>
      )}
      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
         <div>
            <div className="flex justify-between items-start mb-4">
               <span className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
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
               <p className="text-[9px] font-bold text-slate-500 tabular-nums">ID: {String(project.id).substring(0, 8)}</p>
            </div>
            
            <div className="flex justify-between items-center gap-4">
               <h3 className={`text-base font-bold tracking-tight uppercase leading-tight transition-colors ${
                  project.status === 'Completed' ? 'text-emerald-400' : nearDeadline ? 'text-red-400' : 'text-white group-hover:text-brand-primary'
               }`}>{project.projectName}</h3>
               
               <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                 project.status === 'Completed'
                   ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                   : 'bg-white/5 border-white/5 text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary'
               }`}>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
               </div>
            </div>
         </div>

         {/* Final Submission Preview */}
         {project.status === 'Completed' && project.finalSubmission && (
            <div className="mt-2 pt-4 border-t border-emerald-500/10 space-y-4 animate-fadeIn">
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
                        className="w-12 h-12 object-cover rounded-xl border border-emerald-500/20 hover:scale-110 transition-transform cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); window.open(url, '_blank'); }}
                      />
                    ))}
                 </div>
               )}
               {project.finalSubmission.finalZipUrl && (
                 <a 
                   href={project.finalSubmission.finalZipUrl} 
                   target="_blank" 
                   rel="noreferrer" 
                   onClick={(e) => e.stopPropagation()}
                   className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase hover:text-emerald-300"
                 >
                   <Paperclip size={12} /> Download Final ZIP
                 </a>
               )}
            </div>
         )}
      </div>
    </div>
  );
};

export default ProjectCard;
