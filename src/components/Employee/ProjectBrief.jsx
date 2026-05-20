import React, { useState } from 'react';
import { Zap, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const ProjectBrief = ({ 
  activeProject, 
  handleStatusUpdate, 
  teamStatus = [],
  delayReasonText, 
  setDelayReasonText, 
  handleDelaySubmit,
  handleExtensionSubmit,
  handleSubmissionPermissionSubmit,
  submissions = []
}) => {
  const [selectedExtDate, setSelectedExtDate] = useState('');
  const [selectedExtReason, setSelectedExtReason] = useState('');

  if (!activeProject) return null;

  // Calculate original deadline and selected extension difference
  const getExtensionDaysDiff = () => {
    if (!selectedExtDate || !activeProject.deadline) return 0;
    const deadline = new Date(activeProject.deadline);
    const extension = new Date(selectedExtDate);
    const diffTime = extension - deadline;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const extensionDaysDiff = getExtensionDaysDiff();

  // Determine if the project deadline has been passed
  const todayStr = new Date().toISOString().split('T')[0];
  const isDeadlinePassed = activeProject.deadline ? activeProject.deadline < todayStr : false;

  const getDaysSinceLastUpdate = () => {
    if (activeProject.status === 'Completed') return 0;
    const projectSubmissions = submissions.filter(s => s.projectId === activeProject.id);
    let lastActivity = 0;
    if (projectSubmissions.length > 0) {
      lastActivity = Math.max(...projectSubmissions.map(s => s.timestamp || 0));
    } else {
      lastActivity = activeProject.startDate ? new Date(activeProject.startDate).getTime() : (parseInt(activeProject.id) || Date.now());
    }
    return Math.floor((Date.now() - lastActivity) / (1000 * 60 * 60 * 24));
  };
  const daysSinceLastUpdate = getDaysSinceLastUpdate();
  const delayRequired = !activeProject.delayReason && (activeProject.delayReasonRequested || activeProject.delayRequest || daysSinceLastUpdate >= 4);

  return (
    <div className="xl:col-span-2 space-y-8">
       <div className="glass-card p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-transparent opacity-50"></div>
          
          {/* Header layout: Name and Dates side-by-side */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/5">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-xl border border-brand-primary/20 shrink-0">
                   <Zap className="text-brand-primary animate-pulse" size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-heading tracking-tight uppercase">{activeProject.projectName}</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Project Details</p>
                </div>
             </div>
             
             {/* Dates beside project name */}
             <div className="flex items-center gap-3 self-start md:self-center shrink-0">
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-center">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Assigned</p>
                   <p className="text-[10px] font-bold text-white mt-0.5">{activeProject.startDate || 'N/A'}</p>
                </div>
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-center">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Deadline</p>
                   <p className={`text-[10px] font-bold mt-0.5 ${
                     isDeadlinePassed && activeProject.status !== 'Completed' 
                       ? 'text-red-400 font-extrabold animate-pulse' 
                       : 'text-emerald-400'
                   }`}>
                     {activeProject.extensionApproved && activeProject.originalDeadline
                       ? `${activeProject.originalDeadline} + ${activeProject.extensionDays} Days Extension`
                       : (activeProject.deadline || 'N/A')}
                   </p>
                </div>
             </div>
          </div>

          {activeProject.description && (
             <div className="mb-8 p-6 bg-inner-box/50 border border-white/5 rounded-2xl">
                <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mb-3">Mission Briefing</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap italic">
                   "{activeProject.description}"
                </p>
             </div>
          )}

          
          {/* Team Manifest & Join Dates */}
          <div className="mb-8 p-6 bg-inner-box/30 border border-white/5 rounded-2xl space-y-4">
             <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] font-bold">Group Team Manifest</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(() => {
                   const getEmployeeAssignments = (project) => {
                      if (project.employeeAssignments && project.employeeAssignments.length > 0) {
                         return project.employeeAssignments;
                      }
                      const emails = Array.isArray(project.employeeId) ? project.employeeId : [project.employeeId].filter(Boolean);
                      const names = project.employeeName ? project.employeeName.split(', ') : [];
                      return emails.map((email, idx) => ({
                         email,
                         name: names[idx] || email.split('@')[0],
                         joinedDate: project.startDate || 'N/A'
                      }));
                   };
                   return getEmployeeAssignments(activeProject).map((assignment) => (
                      <div key={assignment.email} className="p-3 bg-inner-box/50 border border-white/5 rounded-xl flex flex-col gap-0.5 relative">
                         <div className="flex justify-between items-start col-span-2">
                            <span className="font-bold text-xs text-white truncate max-w-[70%]">{assignment.name}</span>
                            {activeProject.teamLead === assignment.email && (
                               <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded shrink-0">
                                  Team Lead
                               </span>
                            )}
                         </div>
                         <span className="text-[9px] text-slate-500 truncate">{assignment.email}</span>
                         <span className="text-[9px] text-brand-primary font-bold mt-1 tabular-nums">Joined: {assignment.joinedDate}</span>
                      </div>
                   ));
                })()}
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-inner-box border border-white/10 p-2 rounded-2xl flex gap-2 shadow-inner">
                {['Ongoing', 'On-Hold', 'Completed'].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => {
                       if (stat === 'Completed' && activeProject.status !== 'Completed') {
                         alert("To complete this project, please use the 'Final Submission' panel below, fill out your description, attach files, and click 'Submit Final Work'.");
                       } else {
                         handleStatusUpdate(stat);
                       }
                     }}
                    disabled={isDeadlinePassed && !activeProject.submissionApproved && stat === 'Completed'}
                    className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      activeProject.status === stat 
                        ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_30px_rgba(180,83,9,0.2)] scale-[1.02]' 
                        : 'bg-transparent border-transparent text-slate-500 hover:text-heading hover:bg-white/5'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {stat}
                  </button>
                ))}
             </div>

             {/* Proposed Extension Date-Picker Section */}
             {activeProject.status !== 'Completed' && (
                <div className="p-6 bg-inner-box/50 border border-white/5 rounded-3xl space-y-4 animate-fadeIn">
                   
                   {/* CASE 1: Deadline has passed */}
                   {isDeadlinePassed ? (
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <Clock size={16} className="text-red-400 animate-pulse" />
                            <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Submission Control - Deadline Passed</h4>
                         </div>

                          {/* Approved Late Submission Banner */}
                          {activeProject.submissionApproved && (
                             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-fadeIn space-y-2">
                                <div className="flex items-center gap-2 text-emerald-400">
                                   <CheckCircle size={14} className="animate-pulse" />
                                   <p className="text-[10px] font-black uppercase tracking-wider">Late Submission Allowed</p>
                                </div>
                                <p className="text-xs text-slate-300 font-semibold">
                                   The Admin has approved your request! You have been granted **{activeProject.extensionDays} days** extension to submit your work.
                                </p>
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                   New Deadline: <span className="text-emerald-400 font-bold">{activeProject.originalDeadline} + {activeProject.extensionDays} Days Extension</span>
                                   <br />
                                   Target Completion Date: <span className="text-white font-bold">{activeProject.deadline}</span>
                                </p>
                             </div>
                          )}

                          {/* Pending Late Submission Request */}
                          {activeProject.submissionRequested && (
                             <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-fadeIn space-y-2">
                                <div className="flex items-center gap-2 text-amber-400">
                                   <Clock size={14} className="animate-pulse" />
                                   <p className="text-[10px] font-black uppercase tracking-wider">Late Submission Request Pending</p>
                                </div>
                                <p className="text-xs text-slate-300 font-semibold">
                                   You have requested late submission authorization. Submissions remain locked until approved by the Admin.
                                </p>
                             </div>
                          )}

                          {/* Request Submission Permission Button */}
                          {!activeProject.submissionApproved && !activeProject.submissionRequested && (
                             <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl animate-fadeIn space-y-4">
                                <div className="flex items-center gap-2 text-red-400">
                                   <AlertTriangle size={14} className="animate-pulse" />
                                   <p className="text-[10px] font-black uppercase tracking-wider">Project Deadline Passed</p>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                                   The project deadline has passed. File uploads are locked. Specify your proposed completion date and reason below to request submission permission from the Admin.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <div className="flex flex-col gap-1.5">
                                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Proposed Completion Date</label>
                                      <input 
                                         type="date"
                                         min={activeProject.deadline ? new Date(new Date(activeProject.deadline).getTime() + 86400000).toISOString().split('T')[0] : ''}
                                         value={selectedExtDate}
                                         onChange={(e) => setSelectedExtDate(e.target.value)}
                                         className="input-luxury !py-3 !px-4 text-xs font-semibold !bg-inner-box/50"
                                      />
                                   </div>
                                   <div className="flex flex-col gap-1.5">
                                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Late Submission Reason</label>
                                      <input 
                                         type="text"
                                         placeholder="EXPLAIN REASON FOR LATE SUBMISSION..."
                                         value={selectedExtReason}
                                         onChange={(e) => setSelectedExtReason(e.target.value)}
                                         className="input-luxury !py-3 !px-4 text-xs font-semibold !bg-inner-box/50"
                                      />
                                   </div>
                                </div>

                                <button 
                                   onClick={() => {
                                      if (selectedExtDate && selectedExtReason && typeof handleSubmissionPermissionSubmit === 'function') {
                                         handleSubmissionPermissionSubmit(activeProject.id, selectedExtDate, selectedExtReason);
                                         setSelectedExtDate('');
                                         setSelectedExtReason('');
                                      }
                                   }}
                                   disabled={!selectedExtDate || !selectedExtReason}
                                   className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg cursor-pointer"
                                >
                                   Request Admin for Submission
                                </button>

                                {selectedExtDate && extensionDaysDiff > 0 && (
                                   <p className="text-[10px] text-amber-400 font-bold animate-fadeIn">
                                      ★ This request represents an extension of {extensionDaysDiff} days after the original deadline.
                                   </p>
                                )}
                             </div>
                          )}
                      </div>
                   ) : (
                      /* CASE 2: Deadline has NOT passed (Standard Proposed Extension date form) */
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <Clock size={16} className="text-amber-400 animate-pulse" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Extension After Deadline</h4>
                         </div>

                         {/* Approved Banner */}
                         {activeProject.extensionApproved && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-fadeIn space-y-2">
                               <div className="flex items-center gap-2 text-emerald-400">
                                  <CheckCircle size={14} className="animate-pulse" />
                                  <p className="text-[10px] font-black uppercase tracking-wider">Extension Approved by Admin</p>
                               </div>
                               <p className="text-xs text-slate-300 font-semibold">
                                  Your deadline extension request has been officially **approved**! The Admin has granted you **{activeProject.extensionDays} days** extension.
                               </p>
                               <p className="text-[10px] text-slate-400 leading-relaxed">
                                  Adjusted Deadline: <span className="text-emerald-400 font-bold">{activeProject.originalDeadline} + {activeProject.extensionDays} Days Extension</span>
                                  <br />
                                  Target Completion Date: <span className="text-white font-bold">{activeProject.deadline}</span>
                               </p>
                            </div>
                         )}
                         
                         {activeProject.extensionRequested && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-fadeIn space-y-2">
                               <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Extension Logged Successfully</p>
                               <p className="text-xs text-slate-300 font-semibold">
                                  Proposed Completion Date: <span className="text-white font-bold">{activeProject.extensionDate}</span>
                               </p>
                               <p className="text-[10px] text-slate-500">
                                  ({activeProject.extensionDays} days extension beyond original deadline of {activeProject.originalDeadline || activeProject.deadline})
                               </p>
                               {activeProject.extensionReason && (
                                  <div className="mt-2 pt-2 border-t border-white/5">
                                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Reason Provided:</p>
                                     <p className="text-xs text-slate-300 italic font-medium">"{activeProject.extensionReason}"</p>
                                  </div>
                               )}
                            </div>
                         )}

                         <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                            If you need additional time to complete this mission, specify your proposed completion date and explain the reason below to alert the administration.
                         </p>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                               <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Proposed Completion Date</label>
                               <input 
                                  type="date"
                                  min={activeProject.deadline ? new Date(new Date(activeProject.deadline).getTime() + 86400000).toISOString().split('T')[0] : ''}
                                  value={selectedExtDate}
                                  onChange={(e) => setSelectedExtDate(e.target.value)}
                                  className="input-luxury !py-3 !px-4 text-xs font-semibold"
                               />
                            </div>
                            <div className="flex flex-col gap-1.5">
                               <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Explain Extension Reason</label>
                               <input 
                                  type="text"
                                  placeholder="EXPLAIN REASON FOR EXTRA TIME..."
                                  value={selectedExtReason}
                                  onChange={(e) => setSelectedExtReason(e.target.value)}
                                  className="input-luxury !py-3 !px-4 text-xs font-semibold"
                               />
                            </div>
                         </div>

                         <button 
                            onClick={() => {
                               if (selectedExtDate && selectedExtReason && typeof handleExtensionSubmit === 'function') {
                                  handleExtensionSubmit(activeProject.id, selectedExtDate, selectedExtReason);
                                  setSelectedExtDate('');
                                  setSelectedExtReason('');
                               }
                            }}
                            disabled={!selectedExtDate || !selectedExtReason}
                            className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-30 disabled:hover:bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                         >
                            Submit Request
                         </button>
                         
                         {selectedExtDate && extensionDaysDiff > 0 && (
                            <p className="text-[10px] text-amber-400 font-bold animate-fadeIn">
                               ★ This request represents an extension of {extensionDaysDiff} days after the original deadline.
                            </p>
                         )}
                      </div>
                   )}
                </div>
             )}

             {delayRequired && (
                 <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4 text-red-400">
                       <AlertTriangle size={18} />
                       <p className="text-[10px] font-black uppercase tracking-widest">
                         {daysSinceLastUpdate >= 4 ? `No Update Submitted for ${daysSinceLastUpdate} Days` : 'Delay Explanation Required'}
                       </p>
                    </div>
                    <form onSubmit={handleDelaySubmit} className="space-y-4">
                       <textarea 
                         placeholder={daysSinceLastUpdate >= 4 ? "Please provide a reason to your Admin for not updating in 4+ days..." : "EXPLAIN DELAY..."} 
                         value={delayReasonText}
                         onChange={(e) => setDelayReasonText(e.target.value)}
                         required
                         className="input-luxury !bg-inner-box text-xs h-24"
                       />
                       <button type="submit" className="w-full py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
                         Submit Explanation
                       </button>
                    </form>
                 </div>
              )}

              {activeProject.delayReason && (
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl animate-fadeIn">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                       <CheckCircle size={18} />
                       <p className="text-[10px] font-black uppercase tracking-widest">Delay Explanation Submitted</p>
                    </div>
                    <p className="text-xs text-slate-300 italic">
                       "${activeProject.delayReason}"
                    </p>
                 </div>
              )}

             {/* Team Submission Status */}
             {teamStatus.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5 space-y-6 animate-fadeIn">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Team Submission Status</h3>
                      <span className="text-[8px] font-bold text-slate-500 tabular-nums uppercase">Today's Updates</span>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {teamStatus.map((member, i) => (
                         <div key={i} className="flex items-center gap-3 bg-inner-box border border-white/10 p-3 rounded-2xl group transition-all hover:border-brand-primary/20">
                            <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_12px_currentColor] ${member.submitted ? 'text-emerald-500 bg-emerald-500' : 'text-red-500 bg-red-500'}`}></div>
                            <div className="min-w-0">
                               <p className="text-[10px] font-bold text-heading truncate uppercase tracking-tighter">{member.name}</p>
                               <p className={`text-[8px] font-black uppercase tracking-[0.1em] mt-0.5 ${member.submitted ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                  {member.submitted ? 'Submitted' : 'Pending'}
                               </p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default ProjectBrief;
