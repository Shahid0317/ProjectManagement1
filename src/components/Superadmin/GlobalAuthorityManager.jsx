import React from 'react';
import { ShieldAlert, PlusCircle, Users, Trash2 } from 'lucide-react';

const GlobalAuthorityManager = ({
  admins,
  newAdminEmail,
  setNewAdminEmail,
  handleAddAdmin,
  handleRemoveAdmin,
  msg,
  employees,
  newEmpEmail,
  setNewEmpEmail,
  handleAddEmployee,
  handleRemoveEmployee,
  empMsg
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-fadeIn">
       {/* Admin Authority Management */}
       <div className="glass-card p-10 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="flex items-center gap-5">
                <ShieldAlert className="text-brand-secondary" size={28} />
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Admin Authorities</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Authorized Command Units</p>
                </div>
             </div>
             <form className="flex gap-3 w-full md:w-auto" onSubmit={handleAddAdmin}>
                <input 
                  type="email" 
                  placeholder="EMAIL" 
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                  className="input-luxury !py-3 !px-5 text-[10px] w-full md:w-48 font-black uppercase tracking-widest"
                />
                <button type="submit" className="p-3 bg-brand-secondary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-secondary/20">
                  <PlusCircle size={24} />
                </button>
             </form>
          </div>

          {msg.text && (
            <div className={`p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest border ${
              msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {msg.text}
            </div>
          )}

          <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
             {admins.map(admin => (
               <div key={admin.id} className="glass-card-sm p-6 flex items-center justify-between group hover:bg-brand-secondary/5 transition-all duration-500">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-brand-secondary text-sm border border-white/5">
                        {admin.name.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-base text-white tracking-tight">{admin.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">{admin.email}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className="p-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
             ))}
          </div>
       </div>

       {/* Employee Registry */}
       <div className="glass-card p-10 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div className="flex items-center gap-5">
                <Users className="text-brand-primary" size={28} />
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Employee Registry</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Field Report Personnel</p>
                </div>
             </div>
             <form className="flex gap-3 w-full md:w-auto" onSubmit={handleAddEmployee}>
                <input 
                  type="email" 
                  placeholder="EMAIL" 
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  required
                  className="input-luxury !py-3 !px-5 text-[10px] w-full md:w-48 font-black uppercase tracking-widest"
                />
                <button type="submit" className="p-3 bg-brand-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20">
                  <PlusCircle size={24} />
                </button>
             </form>
          </div>

          {empMsg.text && (
            <div className={`p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest border ${
              empMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {empMsg.text}
            </div>
          )}

          <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
             {employees.map(emp => (
               <div key={emp.id} className="glass-card-sm p-6 flex items-center justify-between group hover:bg-brand-primary/5 transition-all duration-500">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-brand-primary text-sm border border-white/5">
                        {emp.name.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-base text-white tracking-tight">{emp.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">{emp.email}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveEmployee(emp.id)}
                    className="p-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default GlobalAuthorityManager;
