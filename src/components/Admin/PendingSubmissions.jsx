import React, { useState } from 'react';
import { UserX, AlertCircle, Calendar } from 'lucide-react';

const PendingSubmissions = ({ employees, subProjects }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    // Format as YYYY-MM-DD for the html date input
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Calculate the target local date string that matches the submission date format
  const getTargetDateStr = () => {
    if (!selectedDate) return new Date().toLocaleDateString();
    const [year, month, day] = selectedDate.split('-');
    // Create Date object at local noon to avoid any day boundary shifts
    const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
    return localDate.toLocaleDateString();
  };

  const targetDateStr = getTargetDateStr();

  // Filter employees who have not submitted a report for the target date
  const missingEmployees = employees.filter(emp => {
    const hasSubmitted = subProjects.some(sub => 
      sub.date === targetDateStr && 
      (sub.employeeId?.toLowerCase() === emp.email?.toLowerCase() || 
       sub.employeeId === emp.uid ||
       sub.userId === emp.uid ||
       sub.employeeName?.toLowerCase() === emp.name?.toLowerCase())
    );
    return !hasSubmitted;
  });

  return (
    <div className="glass-card p-6 lg:p-8 relative overflow-hidden h-fit flex flex-col">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-pulse">
                <UserX className="text-red-500" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Missing Reports</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending submissions</p>
             </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:border-brand-primary/50 transition-all w-full sm:w-auto">
                <Calendar size={14} className="text-slate-400 mr-2 shrink-0" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-white text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer w-full sm:w-auto [color-scheme:dark]"
                />
             </div>
          </div>
       </div>

       <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1 max-h-[500px]">
          {missingEmployees.length === 0 ? (
             <div className="py-12 text-center opacity-60 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <AlertCircle className="text-emerald-400" size={20} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">All reports submitted on this date!</p>
             </div>
          ) : (
             missingEmployees.map((emp, idx) => (
                <div 
                  key={idx} 
                  className="glass-card-sm p-4 flex items-center justify-between gap-6 group animate-fadeIn border-red-500/10 hover:border-red-500/20 hover:bg-red-500/[0.02] transition-all"
                >
                   <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-red-500 shrink-0">
                         {emp.name?.charAt(0) || 'E'}
                      </div>
                      <div className="min-w-0">
                         <p className="font-bold text-base text-red-500 tracking-tight truncate">{emp.name}</p>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 truncate">
                            {emp.email}
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-wider text-red-500 animate-pulse">
                         No Submission
                      </span>
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );
};

export default PendingSubmissions;
