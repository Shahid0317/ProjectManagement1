import React from 'react';
import { Activity } from 'lucide-react';

const AttendanceLog = ({ dailyLogs, logDate, setLogDate }) => {
  return (
    <section className="glass-card p-10 lg:p-12 animate-fadeIn">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12">
          <div className="flex items-center gap-5">
             <div className="p-4 bg-brand-secondary/10 border border-brand-secondary/20 rounded-2xl">
                <Activity className="text-brand-secondary" size={32} />
             </div>
             <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Master Surveillance Log</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Cross-Sector Operational History</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-4 p-1.5 bg-slate-950/60 border border-white/5 rounded-[2rem] shadow-inner">
             <select 
               value={logDate.month} 
               onChange={(e) => setLogDate({...logDate, month: e.target.value})}
               className="bg-transparent border-none py-3 px-6 text-[10px] font-black uppercase tracking-widest outline-none text-slate-300"
             >
               {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                 <option key={m} value={m} className="bg-slate-900">{m}</option>
               ))}
             </select>
             <input 
               type="number" 
               value={logDate.day} 
               onChange={(e) => setLogDate({...logDate, day: parseInt(e.target.value)})}
               className="bg-white/5 border-none py-3 px-4 text-[10px] font-black uppercase tracking-widest outline-none text-slate-300 w-20 text-center rounded-2xl"
               min="1" max="31"
             />
             <input 
               type="number" 
               value={logDate.year} 
               onChange={(e) => setLogDate({...logDate, year: parseInt(e.target.value)})}
               className="bg-white/5 border-none py-3 px-6 text-[10px] font-black uppercase tracking-widest outline-none text-slate-300 w-28 text-center rounded-2xl"
             />
          </div>
       </div>

       <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-slate-900/60 shadow-inner">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Personnel</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Mission Context</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Assets</th>
                   <th className="py-6 px-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Sync</th>
                </tr>
             </thead>
             <tbody>
                {dailyLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-32 text-center text-slate-500 text-sm font-black uppercase tracking-[0.4em] opacity-40">
                      Archive Terminal Offline: No Records
                    </td>
                  </tr>
                ) : (
                  dailyLogs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                       <td className="py-8 px-10">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm shadow-inner">
                                {(log.employeeName || 'S').charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold text-base text-white">{log.employeeName || 'System Node'}</p>
                                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">{log.employeeId || 'INTERNAL'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-8 px-10">
                          <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                            log.status === 'Worked' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                             {log.status}
                          </span>
                       </td>
                       <td className="py-8 px-10 max-w-sm">
                          <p className="font-black text-[11px] text-brand-secondary uppercase tracking-widest mb-2">{log.projectName || 'STANDBY'}</p>
                          <p className="text-[11px] text-slate-400 italic leading-relaxed line-clamp-2">"{log.workInfo}"</p>
                       </td>
                       <td className="py-8 px-10">
                          <div className="flex items-center gap-3 text-slate-500">
                             <Activity size={14} className="text-brand-secondary" />
                             <span className="text-[11px] font-black uppercase tracking-[0.2em]">{log.filesCount || 0} Assets</span>
                          </div>
                       </td>
                       <td className="py-8 px-10 text-[11px] font-bold text-slate-500 tabular-nums">
                          {log.lastUpdate || new Date(log.timestamp).toLocaleTimeString()}
                       </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
       </div>
    </section>
  );
};

export default AttendanceLog;
