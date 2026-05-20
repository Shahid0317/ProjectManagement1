import React, { useState } from 'react';
import { Users, PlusCircle, Shield, Link as LinkIcon, Check, X, UserCheck, Eye, Phone, Briefcase, Globe, MapPin, FileText, ArrowRight, Mail } from 'lucide-react';

const PersonnelManager = ({ 
  employees = [], 
  pendingRegs = [],
  newEmpEmail, 
  setNewEmpEmail, 
  newEmpName, 
  setNewEmpName, 
  empMsg, 
  handleAddEmployee, 
  handleRemoveEmployee,
  handleApproveReg,
  handleDeclineReg,
  registrationLink,
  adminNameMap = {}
}) => {
  const [selectedReg, setSelectedReg] = useState(null);

  const getInitial = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
  };

  const getAdminName = (emp) => {
    const email = (emp.adminEmail || emp.approvedBy || '').toLowerCase();
    return adminNameMap[email] || (email ? email.split('@')[0] : 'System/Unknown');
  };

  return (
    <div className="animate-fadeIn space-y-12 pb-20">
       {/* ── Pending Requests Section ── */}
       {pendingRegs && pendingRegs.length > 0 && (
          <div className="glass-card p-8 lg:p-10 border-brand-secondary/20 shadow-xl shadow-brand-secondary/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <UserCheck size={120} />
             </div>
             
             <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/20 rounded-2xl text-brand-secondary">
                   <UserCheck size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">New Sign-up Requests</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Pending Approval Queue</p>
                </div>
             </div>

              <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar relative z-10">
                 {pendingRegs.map((reg) => (
                   <div 
                     key={reg.id} 
                     className="glass-card-sm !p-3 flex items-center justify-between gap-4 border-brand-secondary/10 hover:border-brand-secondary/30 hover:bg-brand-secondary/[0.02] transition-all duration-300 group"
                   >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                         <div className="w-9 h-9 rounded-xl bg-brand-secondary/10 flex items-center justify-center font-bold text-brand-secondary text-sm border border-brand-secondary/20 shrink-0">
                            {getInitial(reg.name)}
                         </div>
                         <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-6">
                            <p className="font-bold text-sm text-white truncate sm:w-40">{reg.name || 'Anonymous'}</p>
                            <p className="text-[10px] text-slate-500 font-medium truncate flex-1">{reg.email || 'No Email'}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                         <button 
                           onClick={() => setSelectedReg(reg)}
                           className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-brand-secondary hover:border-brand-secondary transition-all"
                           title="View Details"
                         >
                            <Eye size={14} />
                         </button>
                         <button 
                           onClick={() => handleApproveReg(reg.name || '', reg.email || '')}
                           className="py-2 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5"
                         >
                            <Check size={12} /> <span className="hidden sm:inline">Approve</span>
                         </button>
                         <button 
                           onClick={() => handleDeclineReg(reg.email || '')}
                           className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"
                           title="Decline"
                         >
                            <X size={12} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
          </div>
       )}

       {/* ── Employee List Section ── */}
       <div className="glass-card p-8 lg:p-12 space-y-10 relative overflow-hidden">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
             <div className="flex items-center gap-5">
                <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-brand-primary">
                   <Users size={24} />
                </div>
                <div>
                   <h2 className="text-3xl font-bold text-white tracking-tight">Active Personnel</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Employee Manifest</p>
                </div>
             </div>
             
             <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 w-full xl:w-auto">
                <div 
                  onClick={() => {
                    if (!registrationLink) return;
                    navigator.clipboard.writeText(registrationLink);
                    alert("Registration link copied to clipboard!");
                  }}
                  className="hidden xl:flex items-center gap-3 px-5 py-3 bg-inner-box border border-white/5 rounded-2xl cursor-pointer hover:border-brand-primary/40 transition-all group"
                >
                   <LinkIcon className="text-slate-500 group-hover:text-brand-primary transition-colors" size={14} />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sign-up Link</p>
                </div>

                <form className="flex gap-4" onSubmit={handleAddEmployee}>
                   <div className="flex flex-col sm:flex-row gap-3 flex-1">
                      <input 
                        type="email" 
                        placeholder="EMAIL" 
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                        required
                        className="input-luxury !py-3 !px-6 text-[10px] w-full sm:w-56 font-black uppercase tracking-widest"
                      />
                      <input 
                        type="text" 
                        placeholder="NAME" 
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        required
                        className="input-luxury !py-3 !px-6 text-[10px] w-full sm:w-40 font-black uppercase tracking-widest"
                      />
                   </div>
                   <button type="submit" className="p-3 bg-brand-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center min-w-[50px]">
                      <PlusCircle size={24} />
                   </button>
                </form>
             </div>
          </div>

          {empMsg && empMsg.text && (
            <div className={`p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest border animate-fadeIn ${
              empMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {empMsg.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-2 max-h-[60vh]">
             {employees.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-20">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">System manifest empty</p>
                </div>
             ) : (
               employees.map((emp) => (
                 <div key={emp.id} className="glass-card-sm p-6 flex flex-col items-center text-center group hover:border-brand-primary/30 transition-all duration-500">
                    <div className="relative mb-6">
                       <div className="w-20 h-20 rounded-[2.5rem] bg-inner-box flex items-center justify-center font-bold text-brand-primary text-3xl shadow-inner border border-white/5">
                          {getInitial(emp.name)}
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-primary rounded-xl border-4 border-slate-900 flex items-center justify-center text-white shadow-lg">
                          <Shield size={14} />
                       </div>
                    </div>
                    <h4 className="font-bold text-base text-white mb-1 truncate w-full">{emp.name || 'Unknown'}</h4>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3 truncate w-full">{emp.email}</p>
                    <div className="mb-6 w-full py-1.5 px-3 bg-inner-box border border-white/5 rounded-xl">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Under Admin</p>
                       <p className="text-[11px] font-bold text-brand-primary truncate mt-0.5" title={emp.adminEmail || emp.approvedBy || ''}>
                           {getAdminName(emp)}
                        </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveEmployee(emp.email)}
                      className="w-full py-2.5 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      Revoke Access
                    </button>
                 </div>
               ))
             )}
          </div>
       </div>

       {/* ── Details Modal ── */}
       {selectedReg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
             <div className="absolute inset-0 bg-backdrop" onClick={() => setSelectedReg(null)}></div>
             
             <div className="relative modal-solid w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                {/* Modal Header */}
                <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center relative overflow-hidden bg-white/[0.02]">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                      <UserCheck size={160} />
                   </div>
                   
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center font-bold text-brand-secondary text-4xl shadow-xl">
                         {getInitial(selectedReg.name)}
                      </div>
                      <div>
                         <h3 className="text-3xl font-bold text-white tracking-tight">{selectedReg.name || 'Applicant'}</h3>
                         <p className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.4em] mt-1">Pending Application</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedReg(null)} 
                     className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                   >
                      <X size={20} />
                   </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10 space-y-12">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                      <DetailItem icon={Mail} label="Email Address" value={selectedReg.email} color="brand-primary" />
                      <DetailItem icon={Globe} label="Professional Domain" value={selectedReg.domain} color="indigo-400" />
                      <DetailItem icon={Phone} label="Contact Number" value={selectedReg.phone} color="emerald-400" />
                      <DetailItem icon={Users} label="Identity / Gender" value={selectedReg.gender} color="pink-400" />
                      <DetailItem icon={Briefcase} label="Proposed Job Role" value={selectedReg.jobRole} color="brand-secondary" />
                      <DetailItem icon={MapPin} label="Residential Address" value={selectedReg.address} color="orange-400" />
                   </div>

                   <div className="pt-8 border-t border-white/5">
                      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-4">
                         <div className="flex items-center gap-3">
                            <FileText size={16} className="text-brand-primary" />
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Personal Statement & Background</span>
                         </div>
                         <p className="text-sm text-slate-300 italic leading-relaxed font-medium">
                            "{selectedReg.bio || 'No additional information provided by the applicant.'}"
                         </p>
                      </div>
                   </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 lg:p-10 border-t border-white/5 flex flex-col sm:flex-row gap-4 relative z-10 bg-white/[0.02]">
                   <button 
                      onClick={() => {
                        handleApproveReg(selectedReg.name || '', selectedReg.email || '');
                        setSelectedReg(null);
                      }}
                      className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                   >
                      <Check size={18} /> Authorize & Approve
                   </button>
                   <button 
                      onClick={() => {
                        handleDeclineReg(selectedReg.email || '');
                        setSelectedReg(null);
                      }}
                      className="flex-1 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                   >
                      Decline Request
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, color }) => (
  <div className="space-y-2 group">
     <div className="flex items-center gap-2.5">
        <div className={`w-1.5 h-1.5 rounded-full bg-${color}`}></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
           <Icon size={12} className={`text-${color}`} /> {label}
        </p>
     </div>
     <p className="text-sm font-bold text-white pl-4 border-l border-white/5 group-hover:border-brand-primary/30 transition-all">
        {value || 'Not Provided'}
     </p>
  </div>
);

export default PersonnelManager;
