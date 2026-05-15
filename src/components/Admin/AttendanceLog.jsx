import React from 'react';
import { Activity } from 'lucide-react';

const AttendanceLog = ({ dailyLogs, logDate, setLogDate }) => {
  return (
    <section className="glass-card p-8 lg:p-10 animate-fadeIn">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
          <div className="flex items-center gap-5">
             <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl">
                <Activity className="text-brand-secondary" size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Daily Attendance Logs</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Track employee attendance and activity</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-4 p-1 bg-inner-box border border-white/5 rounded-2xl shadow-inner">
             <select 
               value={logDate.month} 
               onChange={(e) => setLogDate({...logDate, month: e.target.value})}
               className="bg-transparent border-none py-2 px-4 text-[10px] font-black uppercase tracking-widest outline-none text-slate-300"
             >
               {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                 <option key={m} value={m} className="bg-slate-900">{m}</option>
               ))}
             </select>
             <input 
               type="number" 
               value={logDate.day} 
               onChange={(e) => setLogDate({...logDate, day: parseInt(e.target.value)})}
               className="bg-white/5 border-none py-2 px-3 text-[10px] font-black uppercase tracking-widest outline-none text-slate-300 w-16 text-center rounded-xl"
               min="1" max="31"
             />
             <input 
               type="number" 
               value={logDate.year} 
               onChange={(e) => setLogDate({...logDate, year: parseInt(e.target.value)})}
               className="bg-white/5 border-none py-2 px-4 text-[10px] font-black uppercase tracking-widest outline-none text-slate-300 w-24 text-center rounded-xl"
             />
          </div>
       </div>

       <div className="overflow-x-auto rounded-3xl border border-white/5 bg-inner-box shadow-inner">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                   <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                   <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                   <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Work Details</th>
                   <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Files</th>
                   <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
             </thead>
             <tbody>
                {dailyLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                       No attendance records found for this day
                    </td>
                  </tr>
                ) : (
                  dailyLogs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                       <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-inner-box flex items-center justify-center font-bold text-slate-400 text-xs shadow-inner">
                                {(log.employeeName || 'S').charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold text-sm text-white">{log.employeeName || 'Employee'}</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{log.employeeId || 'INTERNAL'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-6 px-8">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border ${
                            log.status === 'Worked' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                             {log.status === 'Worked' ? 'Present' : 'Absent'}
                          </span>
                       </td>
                       <td className="py-6 px-8 max-w-sm">
                          <p className="font-black text-[10px] text-brand-secondary uppercase tracking-widest mb-1">{log.projectName || 'STANDBY'}</p>
                          <p className="text-[10px] text-slate-400 italic leading-relaxed line-clamp-2">"{log.workInfo}"</p>
                       </td>
                       <td className="py-6 px-8">
                          <div className="flex items-center gap-2 text-slate-500">
                             <Activity size={12} className="text-brand-secondary" />
                             <span className="text-[10px] font-black uppercase tracking-widest">{log.filesCount || 0} Files</span>
                          </div>
                       </td>
                       <td className="py-6 px-8 text-[10px] font-bold text-slate-500 tabular-nums">
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
