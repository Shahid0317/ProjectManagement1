import React, { useState } from 'react';
import { Shield, ExternalLink, Calendar, User, DollarSign, Clock, CheckCircle, UserCheck, X } from 'lucide-react';

const AdminActivityFeed = ({ allProjects, employees = [] }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Combine project assignments and employee approvals into one feed
  const projectActions = allProjects.map(p => ({
    ...p,
    type: 'project_assignment',
    date: p.startDate,
    adminEmail: p.adminEmail,
    timestamp: p.id // using id as a rough sort proxy
  }));

  const approvalActions = employees
    .filter(e => e.approvedBy)
    .map(e => ({
      id: `approval-${e.email}`,
      type: 'personnel_approval',
      name: e.name,
      email: e.email,
      adminEmail: e.approvedBy,
      date: e.approvedAt,
      timestamp: e.approvedAt || '0',
      details: e
    }));

  const recentActions = [...projectActions, ...approvalActions]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 8);

  return (
    <div className="glass-card p-8 animate-fadeIn h-fit">
       <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl text-brand-secondary">
             <Shield size={24} />
          </div>
          <div>
             <h2 className="text-xl font-bold text-heading tracking-tight">Admin Activity Feed</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Operations Audit</p>
          </div>
       </div>

       <div className="space-y-4">
          {recentActions.length === 0 ? (
            <div className="py-8 text-center opacity-30">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">No recent activity logged</p>
            </div>
          ) : (
            recentActions.map((action, i) => (
              <div key={action.id || i} className="glass-card-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-brand-secondary/30 transition-all duration-500">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base border border-white/5 ${
                      action.type === 'personnel_approval' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-inner-box text-brand-secondary'
                    }`}>
                       {action.adminEmail?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                       <p className="text-[14px] font-bold text-heading group-hover:text-brand-secondary transition-colors">
                          <span className="text-slate-400 font-medium italic mr-1">Admin</span> 
                          {action.adminEmail?.split('@')[0]} 
                          {action.type === 'personnel_approval' ? (
                            <>
                              <span className="text-slate-500 font-medium mx-2 text-[12px]">approved</span> 
                              <span className="text-emerald-400">{action.name}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-slate-500 font-medium mx-2 text-[12px]">assigned</span> 
                              <span className="text-heading font-black">{action.projectName}</span>
                            </>
                          )}
                       </p>
                       <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                             <Calendar size={10} />
                             {action.date || 'Recent'}
                          </div>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <div className={`text-[9px] font-black uppercase tracking-widest ${
                            action.type === 'personnel_approval' ? 'text-emerald-400' : 'text-brand-primary'
                          }`}>
                             {action.type === 'personnel_approval' ? 'Personnel Entry' : 'Project Launch'}
                          </div>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setSelectedActivity(action)}
                   className="flex items-center gap-3 px-4 py-2 bg-inner-box rounded-xl border border-white/5 group-hover:border-brand-secondary/20 transition-all"
                 >
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-brand-secondary" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-heading">Audit</span>
                 </button>
              </div>
            ))
          )}
       </div>

       {/* Detailed Activity Modal */}
       {selectedActivity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 animate-fadeIn">
             <div className="absolute inset-0 bg-backdrop" onClick={() => setSelectedActivity(null)}></div>
             <div className="relative modal-solid w-full max-w-2xl p-8 lg:p-12 overflow-hidden rounded-[2.5rem] shadow-2xl">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[100px]"></div>
                
                <div className="flex justify-between items-start mb-10">
                   <div className="flex items-center gap-5">
                      <div className="p-4 bg-brand-secondary/10 border border-brand-secondary/20 rounded-2xl text-brand-secondary">
                         {selectedActivity.type === 'personnel_approval' ? <UserCheck size={28} /> : <Shield size={28} />}
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold text-heading tracking-tighter">Audit Log Details</h2>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Operation Type: {selectedActivity.type.replace('_', ' ')}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedActivity(null)} className="text-slate-500 hover:text-heading transition-colors">
                      <X size={24} />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Shield size={12} className="text-brand-secondary" /> Performing Admin
                         </p>
                         <p className="text-base font-bold text-heading">{selectedActivity.adminEmail}</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={12} className="text-emerald-400" /> Action Date
                         </p>
                         <p className="text-base font-bold text-heading">{selectedActivity.date}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      {selectedActivity.type === 'personnel_approval' ? (
                        <>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} className="text-indigo-400" /> Employee Name
                             </p>
                             <p className="text-base font-bold text-heading">{selectedActivity.name}</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={12} className="text-emerald-400" /> Status
                             </p>
                             <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Authorized for Access</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={12} className="text-brand-secondary" /> Project Name
                             </p>
                             <p className="text-base font-bold text-heading">{selectedActivity.projectName}</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign size={12} className="text-emerald-400" /> Budget
                             </p>
                             <p className="text-base font-bold text-emerald-400 font-display">${parseFloat(selectedActivity.budget).toLocaleString()}</p>
                          </div>
                        </>
                      )}
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                   <button 
                     onClick={() => setSelectedActivity(null)}
                     className="w-full btn-primary py-4"
                   >
                      Close Audit Log
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default AdminActivityFeed;
