import React from 'react';
import { PlusCircle, User, Users, X, ArrowRight } from 'lucide-react';

const ProjectAssignmentForm = ({ 
  projectData, 
  setProjectData, 
  employees, 
  selectedEmails, 
  setSelectedEmails, 
  assignMsg, 
  isAssigning, 
  handleAssignProject,
  handleProjectChange
}) => {
  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
       <div className="glass-card p-10 lg:p-14 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-shimmer"></div>
          
          <div className="flex items-center gap-5 mb-12">
             <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl">
                <PlusCircle className="text-brand-primary" size={32} />
             </div>
             <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Project Control</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Deploy New Operational Project</p>
             </div>
          </div>

          {assignMsg.text && (
            <div className={`mb-10 p-5 rounded-2xl text-[11px] font-black text-center uppercase tracking-widest border ${
              assignMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {assignMsg.text}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleAssignProject}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project Type Toggle */}
                <div className="md:col-span-2 p-1 bg-white/5 rounded-2xl flex gap-1 border border-white/5">
                   {[
                     { id: false, label: 'Single Person', icon: User },
                     { id: true, label: 'Group Project', icon: Users }
                   ].map((type) => (
                     <button
                       key={type.label}
                       type="button"
                       onClick={() => setProjectData({ ...projectData, isGroup: type.id })}
                       className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                         projectData.isGroup === type.id 
                           ? 'bg-brand-primary text-white shadow-lg' 
                           : 'text-slate-500 hover:text-white hover:bg-white/5'
                       }`}
                     >
                       <type.icon size={14} /> {type.label}
                     </button>
                   ))}
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                     {projectData.isGroup ? 'Assigned Team' : 'Select Personnel'}
                   </label>
                   {projectData.isGroup ? (
                     <div className="space-y-4">
                       <div className="flex flex-wrap gap-2 min-h-[56px] p-3 bg-white/5 border border-white/10 rounded-2xl">
                         {selectedEmails.length === 0 ? (
                           <p className="text-[10px] text-slate-600 font-bold p-1">No Persons Selected</p>
                         ) : (
                           selectedEmails.map(email => (
                             <div key={email} className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/30 rounded-lg flex items-center gap-2 group">
                               <span className="text-[9px] font-bold text-white">{email}</span>
                               <button 
                                 type="button" 
                                 onClick={() => setSelectedEmails(selectedEmails.filter(e => e !== email))}
                                 className="text-brand-primary hover:text-white"
                               >
                                 <X size={10} />
                               </button>
                             </div>
                           ))
                         )}
                       </div>
                       <select 
                         className="input-luxury !py-4"
                         onChange={(e) => {
                           if (e.target.value && !selectedEmails.includes(e.target.value)) {
                             setSelectedEmails([...selectedEmails, e.target.value]);
                           }
                           e.target.value = "";
                         }}
                       >
                         <option value="">Add Team Member...</option>
                         {employees.map(emp => (
                           <option key={emp.id} value={emp.email} disabled={selectedEmails.includes(emp.email)}>
                             {emp.name} ({emp.email})
                           </option>
                         ))}
                       </select>
                     </div>
                   ) : (
                     <select 
                       name="employeeEmail"
                       value={projectData.employeeEmail}
                       onChange={handleProjectChange}
                       required={!projectData.isGroup}
                       className="input-luxury !py-4"
                     >
                       <option value="">Awaiting Selection...</option>
                       {employees.map(emp => (
                         <option key={emp.id} value={emp.email}>{emp.name} ({emp.email})</option>
                       ))}
                     </select>
                   )}
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Identifier</label>
                   <input 
                     type="text" 
                     name="projectName"
                     placeholder="ENTER PROJECT NAME" 
                     value={projectData.projectName}
                     onChange={handleProjectChange}
                     required
                     className="input-luxury !py-4 uppercase tracking-widest font-black"
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Commencement Date</label>
                   <input 
                     type="date" 
                     name="startDate"
                     value={projectData.startDate}
                     onChange={handleProjectChange}
                     required
                     className="input-luxury !py-4"
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Deadline</label>
                   <input 
                     type="date" 
                     name="deadline"
                     value={projectData.deadline}
                     onChange={handleProjectChange}
                     required
                     className="input-luxury !py-4"
                   />
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Capital Allocation (USD)</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary font-bold">$</span>
                   <input 
                     type="number" 
                     name="budget"
                     placeholder="0.00" 
                     value={projectData.budget}
                     onChange={handleProjectChange}
                     required
                     className="input-luxury !py-4 !pl-12 font-bold text-lg tabular-nums"
                   />
                </div>
             </div>

             <button 
               type="submit" 
               disabled={isAssigning}
               className={`w-full py-6 text-white rounded-3xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group ${
                 isAssigning 
                   ? 'bg-slate-700 cursor-not-allowed' 
                   : 'bg-brand-primary hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_rgba(99,102,241,0.2)]'
               }`}
             >
                {isAssigning ? 'Processing Deployment...' : 'Initialize Deployment'}
                <ArrowRight size={20} className={`${isAssigning ? 'hidden' : 'group-hover:translate-x-2 transition-transform'}`} />
             </button>
          </form>
       </div>
    </div>
  );
};

export default ProjectAssignmentForm;
