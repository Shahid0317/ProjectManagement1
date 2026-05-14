import React from 'react';
import { Users, PlusCircle, Shield } from 'lucide-react';

const PersonnelManager = ({ 
  employees, 
  newEmpEmail, 
  setNewEmpEmail, 
  newEmpName, 
  setNewEmpName, 
  empMsg, 
  handleAddEmployee, 
  handleRemoveEmployee 
}) => {
  return (
    <div className="animate-fadeIn">
       <div className="glass-card p-10 lg:p-12 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div className="flex items-center gap-5">
                <Users className="text-brand-secondary" size={32} />
                <div>
                   <h2 className="text-3xl font-bold text-white tracking-tight">Employee Manifest</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Authorized Sector Personnel</p>
                </div>
             </div>
             
             <form className="flex gap-4 w-full md:w-auto" onSubmit={handleAddEmployee}>
                <div className="flex flex-col md:flex-row gap-3 flex-1">
                   <input 
                     type="email" 
                     placeholder="NEW ID@LUX.COM" 
                     value={newEmpEmail}
                     onChange={(e) => setNewEmpEmail(e.target.value)}
                     required
                     className="input-luxury !py-3 !px-5 text-[10px] w-full md:w-64 font-black uppercase tracking-widest"
                   />
                   <input 
                     type="text" 
                     placeholder="NAME" 
                     value={newEmpName}
                     onChange={(e) => setNewEmpName(e.target.value)}
                     required
                     className="input-luxury !py-3 !px-5 text-[10px] w-full md:w-40 font-black uppercase tracking-widest"
                   />
                </div>
                <button type="submit" className="p-3.5 bg-brand-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-3">
                   <PlusCircle size={24} />
                   <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Register</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2 max-h-[65vh]">
             {employees.map((emp) => (
               <div key={emp.id} className="glass-card-sm p-6 flex flex-col items-center text-center group hover:border-brand-primary/30 transition-all duration-500">
                  <div className="relative mb-6">
                     <div className="w-20 h-20 rounded-[2rem] bg-slate-800 flex items-center justify-center font-bold text-brand-primary text-3xl shadow-inner border border-white/5">
                        {emp.name.charAt(0)}
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary rounded-xl border-4 border-slate-900 flex items-center justify-center text-white">
                        <Shield size={14} />
                     </div>
                  </div>
                  <h4 className="font-bold text-lg text-white mb-1">{emp.name}</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6">{emp.email}</p>
                  <button 
                    onClick={() => handleRemoveEmployee(emp.id)}
                    className="w-full py-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    Revoke Access
                  </button>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default PersonnelManager;
