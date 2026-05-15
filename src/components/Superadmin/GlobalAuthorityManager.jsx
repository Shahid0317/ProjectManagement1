import React from 'react';
import { ShieldAlert, PlusCircle, Trash2, Mail, User, Phone, Briefcase, Globe } from 'lucide-react';

const GlobalAuthorityManager = ({
  admins,
  newAdminEmail,
  setNewAdminEmail,
  newAdminName,
  setNewAdminName,
  newAdminPhone,
  setNewAdminPhone,
  newAdminJobRole,
  setNewAdminJobRole,
  newAdminDomain,
  setNewAdminDomain,
  handleAddAdmin,
  handleRemoveAdmin,
  msg
}) => {
  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
       {/* Admin Authority Management */}
       <div className="glass-card p-8 lg:p-12 space-y-12">
          <div className="flex flex-col gap-10">
             <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-brand-primary shadow-lg shadow-brand-primary/5">
                   <ShieldAlert size={32} />
                </div>
                <div>
                   <h2 className="text-3xl font-bold text-heading tracking-tight">Admin Authorities</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Authorized Command Units</p>
                </div>
             </div>

             <form className="space-y-8" onSubmit={handleAddAdmin}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                         <Mail size={12} className="text-brand-primary" /> Email Address
                      </label>
                      <input 
                        type="email" 
                        placeholder="admin@company.com" 
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        required
                        className="input-luxury !py-4"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                         <User size={12} className="text-emerald-400" /> Full Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        required
                        className="input-luxury !py-4"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                         <Phone size={12} className="text-indigo-400" /> Contact Phone
                      </label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        value={newAdminPhone}
                        onChange={(e) => setNewAdminPhone(e.target.value)}
                        className="input-luxury !py-4"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                         <Briefcase size={12} className="text-orange-400" /> Job Role
                      </label>
                      <input 
                        type="text" 
                        placeholder="Senior Manager" 
                        value={newAdminJobRole}
                        onChange={(e) => setNewAdminJobRole(e.target.value)}
                        className="input-luxury !py-4"
                      />
                   </div>
                   <div className="space-y-2 lg:col-span-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                         <Globe size={12} className="text-sky-400" /> Professional Domain
                      </label>
                      <input 
                        type="text" 
                        placeholder="Operations / Tech" 
                        value={newAdminDomain}
                        onChange={(e) => setNewAdminDomain(e.target.value)}
                        className="input-luxury !py-4"
                      />
                   </div>
                   <div className="flex items-end">
                      <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-3 group">
                         <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                         <span>Authorize Admin</span>
                      </button>
                   </div>
                </div>
             </form>
          </div>

          {msg.text && (
            <div className={`p-5 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest border animate-slideDown ${
              msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {msg.text}
            </div>
          )}

          <div className="space-y-5">
             <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Authorities ({admins.length})</p>
                <div className="h-px flex-1 bg-white/5"></div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {admins.length === 0 ? (
                   <div className="col-span-full py-20 text-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Admins Authorized</p>
                   </div>
                ) : (
                  admins.map(admin => (
                    <div key={admin.id} className="glass-card-sm p-6 flex items-center justify-between group hover:border-brand-primary/30 transition-all duration-500 bg-inner-box/40">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center font-black text-brand-primary text-xl border border-brand-primary/20 shadow-inner">
                             {admin.name?.charAt(0) || 'A'}
                          </div>
                          <div className="min-w-0">
                             <p className="font-bold text-base text-heading tracking-tight truncate">{admin.name}</p>
                             <p className="text-[11px] text-slate-500 font-medium truncate">{admin.email}</p>
                             {admin.jobRole && (
                               <p className="text-[8px] font-black text-brand-primary/60 uppercase tracking-widest mt-1">{admin.jobRole}</p>
                             )}
                          </div>
                       </div>
                       <button 
                         onClick={() => handleRemoveAdmin(admin.id)}
                         className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                         title="Revoke Authority"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  ))
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default GlobalAuthorityManager;
