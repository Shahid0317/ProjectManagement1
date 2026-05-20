import React, { useState } from 'react';
import { Clock, Check, X, Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';
import { 
  approveProjectExtension, 
  declineProjectExtension,
  approveSubmissionPermission,
  declineSubmissionPermission,
  approveProjectReopen,
  declineProjectReopen
} from '../../services/mockDb';

const addDaysToDate = (baseDateStr, days) => {
  if (!baseDateStr) return '';
  const parts = baseDateStr.split('-');
  if (parts.length !== 3) return '';
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-based month
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  date.setDate(date.getDate() + parseInt(days || 0));
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const ExtensionRequestsList = ({ projects = [], fetchData }) => {
  const [processingId, setProcessingId] = useState(null);
  const [grantedDays, setGrantedDays] = useState({});

  // Filter projects with pending extension requests, late submission requests, or project reopen requests
  const pendingRequests = projects.filter(p => p.extensionRequested === true || p.submissionRequested === true || p.reopenRequested === true);

  const handleApproveExtension = async (projectId, proposedDate, approvedDays) => {
    setProcessingId(projectId);
    const success = await approveProjectExtension(projectId, proposedDate, approvedDays);
    if (success && typeof fetchData === 'function') {
      await fetchData();
    }
    setProcessingId(null);
  };

  const handleDeclineExtension = async (projectId) => {
    setProcessingId(projectId);
    const success = await declineProjectExtension(projectId);
    if (success && typeof fetchData === 'function') {
      await fetchData();
    }
    setProcessingId(null);
  };

  const handleApproveSubmission = async (projectId, proposedDate, approvedDays) => {
    setProcessingId(projectId);
    const success = await approveSubmissionPermission(projectId, proposedDate, approvedDays);
    if (success && typeof fetchData === 'function') {
      await fetchData();
    }
    setProcessingId(null);
  };

  const handleDeclineSubmission = async (projectId) => {
    setProcessingId(projectId);
    const success = await declineSubmissionPermission(projectId);
    if (success && typeof fetchData === 'function') {
      await fetchData();
    }
    setProcessingId(null);
  };

  const handleApproveReopen = async (projectId) => {
    setProcessingId(projectId);
    const success = await approveProjectReopen(projectId);
    if (success && typeof fetchData === 'function') {
      await fetchData();
    }
    setProcessingId(null);
  };

  const handleDeclineReopen = async (projectId) => {
    setProcessingId(projectId);
    const success = await declineProjectReopen(projectId);
    if (success && typeof fetchData === 'function') {
      await fetchData();
    }
    setProcessingId(null);
  };

  return (
    <section className="glass-card p-10 relative overflow-hidden" id="extension-requests-section">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-red-500 to-transparent opacity-50"></div>
      
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <Clock className="text-amber-500 animate-pulse" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Project Extension Requests</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Review and manage deadline adjustment logs</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
          {pendingRequests.length} Pending
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Check className="text-emerald-400" size={20} />
          </div>
          <p className="text-xs text-emerald-400 font-black uppercase tracking-[0.2em]">All Deadlines Synchronized</p>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">There are no pending employee extension or submission requests.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingRequests.map((p) => {
            const isSubmissionRequest = p.submissionRequested === true;
            const isReopenRequest = p.reopenRequested === true;

            if (isReopenRequest) {
              return (
                <div 
                  key={p.id} 
                  className="p-6 bg-inner-box border border-indigo-500/15 hover:border-indigo-500/30 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all group"
                >
                  <div className="space-y-4 flex-1 min-w-0">
                    {/* Request Type Header Badge */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 animate-pulse">
                        <AlertCircle size={10} /> Project Re-Open Request
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase truncate tracking-tight">{p.projectName}</h4>
                      <span className="text-[10px] text-slate-500 font-bold tabular-nums opacity-60">ID: {p.id.substring(0, 8)}</span>
                    </div>

                    {/* Info Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <User size={14} className="text-slate-500" />
                        <span className="font-bold text-slate-300 truncate uppercase">
                          {p.employeeName || (Array.isArray(p.employeeId) ? p.employeeId.join(', ') : p.employeeId)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Calendar size={14} className="text-slate-500" />
                        <span className="font-semibold">
                          Current Status: <span className="text-emerald-400 font-bold">Completed</span>
                        </span>
                      </div>
                    </div>

                    {/* Reason Section */}
                    {p.reopenReason && (
                      <div className="p-4 rounded-2xl flex items-start gap-3 border bg-indigo-500/[0.02] border-indigo-500/10">
                        <MessageSquare size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                            Reopen Reason Provided:
                          </p>
                          <p className="text-xs font-semibold italic text-indigo-200">
                            "{p.reopenReason}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                    <button
                      disabled={processingId !== null}
                      onClick={() => handleDeclineReopen(p.id)}
                      className="px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white disabled:opacity-30 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <X size={14} /> Decline Re-Open
                    </button>
                    <button
                      disabled={processingId !== null}
                      onClick={() => handleApproveReopen(p.id)}
                      className="px-4 py-3 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      <Check size={14} /> Approve Re-Open
                    </button>
                  </div>
                </div>
              );
            }
            const requestedDays = p.extensionDays || 0;
            const currentGrantedDays = grantedDays[p.id] !== undefined ? grantedDays[p.id] : requestedDays;
            const baseDeadline = p.originalDeadline || p.deadline;
            const computedApprovedDate = addDaysToDate(baseDeadline, currentGrantedDays);

            return (
              <div 
                key={p.id} 
                className={`p-6 bg-inner-box border rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all group ${
                  isSubmissionRequest 
                    ? 'border-red-500/10 hover:border-red-500/20' 
                    : 'border-white/5 hover:border-amber-500/20'
                }`}
              >
                <div className="space-y-4 flex-1 min-w-0">
                  {/* Request Type Header Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    {isSubmissionRequest ? (
                      <>
                        <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 animate-pulse">
                          <AlertCircle size={10} /> Late Submission Request
                        </span>
                        {requestedDays > 0 && (
                          <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                            +{requestedDays} Days Asked
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                        +{requestedDays} Days Requested
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-white uppercase truncate tracking-tight">{p.projectName}</h4>
                    <span className="text-[10px] text-slate-500 font-bold tabular-nums opacity-60">ID: {p.id.substring(0, 8)}</span>
                  </div>

                  {/* Info Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <User size={14} className="text-slate-500" />
                      <span className="font-bold text-slate-300 truncate uppercase">
                        {p.employeeName || p.employeeId.split('@')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar size={14} className="text-slate-500" />
                      <span className="font-semibold">
                        Deadline: <span className="text-red-400 font-bold">{baseDeadline}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar size={14} className={isSubmissionRequest ? "text-red-400 animate-pulse" : "text-amber-500 animate-pulse"} />
                      <span className="font-semibold">
                        Proposed: <span className={isSubmissionRequest ? "text-red-400 font-bold" : "text-amber-400 font-bold"}>{p.extensionDate || 'N/A'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Description / Reason Section */}
                  {p.extensionReason && (
                    <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
                      isSubmissionRequest 
                        ? 'bg-red-500/[0.02] border-red-500/10' 
                        : 'bg-white/[0.02] border-white/5'
                    }`}>
                      {isSubmissionRequest ? (
                        <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                      ) : (
                        <MessageSquare size={14} className="text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          {isSubmissionRequest ? 'Late Submission Reason:' : 'Reason Provided:'}
                        </p>
                        <p className={`text-xs font-semibold italic ${isSubmissionRequest ? 'text-red-300' : 'text-slate-300'}`}>
                          "{p.extensionReason}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Decision Panel */}
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Admin Decision: Days to Grant</p>
                     <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                           <input 
                              type="number"
                              min="1"
                              value={currentGrantedDays}
                              onChange={(e) => {
                                 const val = Math.max(1, parseInt(e.target.value) || 0);
                                 setGrantedDays(prev => ({ ...prev, [p.id]: val }));
                              }}
                              className="input-luxury !py-2 !px-3 text-xs font-semibold !bg-inner-box/50 border border-white/10 rounded-xl text-white w-20 text-center"
                           />
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Days</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                           Approved Deadline: <span className="text-emerald-400 font-extrabold">{computedApprovedDate}</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                  {isSubmissionRequest ? (
                    <>
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleDeclineSubmission(p.id)}
                        className="px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white disabled:opacity-30 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <X size={14} /> Decline
                      </button>
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleApproveSubmission(p.id, computedApprovedDate, currentGrantedDays)}
                        className="px-4 py-3 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                      >
                        <Check size={14} /> Approve Submission
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleDeclineExtension(p.id)}
                        className="px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white disabled:opacity-30 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <X size={14} /> Decline
                      </button>
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleApproveExtension(p.id, computedApprovedDate, currentGrantedDays)}
                        className="px-4 py-3 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                      >
                        <Check size={14} /> Approve Extension
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ExtensionRequestsList;
