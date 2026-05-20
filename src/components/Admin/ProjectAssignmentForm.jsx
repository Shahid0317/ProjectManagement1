import React, { useState, useEffect } from 'react';
import { PlusCircle, User, Users, X, ArrowRight, UserPlus, Calendar, Shield } from 'lucide-react';
import { addEmployeeToProject } from '../../services/mockDb';

const ProjectAssignmentForm = ({ 
  projectData, 
  setProjectData, 
  employees = [], 
  projects = [],
  selectedEmails = [], 
  setSelectedEmails, 
  assignMsg, 
  isAssigning, 
  handleAssignProject,
  handleProjectChange,
  fetchData
}) => {
  const [tab, setTab] = useState('individual'); // 'individual' | 'group' | 'add_existing'
  
  // State for Add to Existing Project Mode
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [addMsg, setAddMsg] = useState({ text: '', type: '' });

  // Sync tab with parent isGroup
  useEffect(() => {
    if (tab === 'individual') {
      setProjectData(prev => ({ ...prev, isGroup: false }));
    } else if (tab === 'group') {
      setProjectData(prev => ({ ...prev, isGroup: true }));
    }
  }, [tab, setProjectData]);

  // Clean teamLead if it's no longer in selected emails
  useEffect(() => {
    if (projectData.teamLead && !selectedEmails.includes(projectData.teamLead)) {
      setProjectData(prev => ({ ...prev, teamLead: '' }));
    }
  }, [selectedEmails, projectData.teamLead, setProjectData]);

  // Find active projects (ongoing/in progress)
  const activeProjects = projects.filter(p => p.status !== 'Completed');

  // Find currently selected project details for Add to Existing mode
  const currentSelectedProject = projects.find(p => p.id === selectedProjectId);

  // Helper to extract assignments list with fallback for legacy data
  const getEmployeeAssignments = (project) => {
    if (!project) return [];
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

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedEmployeeEmail) return;

    setIsSubmittingAdd(true);
    setAddMsg({ text: '', type: '' });

    const result = await addEmployeeToProject(selectedProjectId, selectedEmployeeEmail);
    
    setAddMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    setIsSubmittingAdd(false);

    if (result.success) {
      setSelectedEmployeeEmail('');
      if (typeof fetchData === 'function') {
        await fetchData();
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="glass-card p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-shimmer"></div>
        
        <div className="flex items-center gap-5 mb-12">
          <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl">
            <PlusCircle className="text-brand-primary" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Assign Project</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              {tab === 'add_existing' ? 'Re-staff an active deployment' : 'Create and assign a new project'}
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mb-10 p-1 bg-white/5 rounded-2xl flex gap-1 border border-white/5">
          {[
            { id: 'individual', label: 'Individual', icon: User },
            { id: 'group', label: 'Group Project', icon: Users },
            { id: 'add_existing', label: 'Add To Existing', icon: UserPlus }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setAddMsg({ text: '', type: '' });
              }}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer ${
                tab === t.id 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/15' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* 1. Add Employee to Existing Project Form */}
        {tab === 'add_existing' ? (
          <div className="space-y-8">
            {addMsg.text && (
              <div className={`p-5 rounded-2xl text-[11px] font-black text-center uppercase tracking-widest border ${
                addMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {addMsg.text}
              </div>
            )}

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Select Project */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Select Active Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                      setSelectedEmployeeEmail('');
                      setAddMsg({ text: '', type: '' });
                    }}
                    required
                    className="input-luxury !py-4"
                  >
                    <option value="">Choose a project...</option>
                    {activeProjects.map(proj => (
                      <option key={proj.id} value={proj.id}>
                        {proj.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Employee */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Select Employee to Add
                  </label>
                  <select
                    value={selectedEmployeeEmail}
                    onChange={(e) => setSelectedEmployeeEmail(e.target.value)}
                    required
                    disabled={!selectedProjectId}
                    className="input-luxury !py-4 disabled:opacity-35"
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map(emp => {
                      // Check if already in project
                      const isAssigned = currentSelectedProject && 
                        (Array.isArray(currentSelectedProject.employeeId)
                          ? currentSelectedProject.employeeId.includes(emp.email)
                          : currentSelectedProject.employeeId === emp.email);
                      
                      return (
                        <option
                          key={emp.id}
                          value={emp.email}
                          disabled={isAssigned || emp.activeProjectCount >= 5}
                        >
                          {emp.name} ({emp.email}) {isAssigned ? '— ALREADY ASSIGNED' : `— ${emp.activeProjectCount || 0}/5 Active`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Show Selected Project Info & Team Roster with Join Dates */}
              {currentSelectedProject && (
                <div className="p-6 bg-inner-box border border-white/5 rounded-3xl space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      {currentSelectedProject.projectName}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">
                      Budget: <span className="text-white">${parseInt(currentSelectedProject.budget || 0).toLocaleString()}</span> | Commenced: <span className="text-white">{currentSelectedProject.startDate}</span> | Deadline: <span className="text-white">{currentSelectedProject.deadline}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                      Current Team Roster & Join Dates
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getEmployeeAssignments(currentSelectedProject).map((assign) => (
                        <div key={assign.email} className="p-4 bg-inner-box/50 border border-white/5 rounded-2xl flex flex-col gap-1 relative">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-white">{assign.name}</span>
                            {currentSelectedProject.teamLead === assign.email && (
                              <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1 shrink-0">
                                <Shield size={8} /> Team Lead
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-500 truncate">{assign.email}</span>
                          <span className="text-[9px] text-brand-primary font-bold mt-2 tabular-nums">
                            Joined: {assign.joinedDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingAdd || !selectedProjectId || !selectedEmployeeEmail}
                className={`w-full py-6 text-white rounded-3xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group cursor-pointer ${
                  isSubmittingAdd || !selectedProjectId || !selectedEmployeeEmail
                    ? 'bg-slate-700 cursor-not-allowed opacity-40'
                    : 'bg-brand-primary hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_rgba(99,102,241,0.2)]'
                }`}
              >
                {isSubmittingAdd ? 'Adding...' : 'Add Employee to Project'}
                <ArrowRight size={20} className={`${isSubmittingAdd ? 'hidden' : 'group-hover:translate-x-2 transition-transform'}`} />
              </button>
            </form>
          </div>
        ) : (
          /* 2. Assign New Project Form (Individual or Group) */
          <div className="space-y-8">
            {assignMsg.text && (
              <div className={`p-5 rounded-2xl text-[11px] font-black text-center uppercase tracking-widest border ${
                assignMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {assignMsg.text}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleAssignProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Employee Selection Area */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    {tab === 'group' ? 'Assigned Team' : 'Select Employee'}
                  </label>
                  {tab === 'group' ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 min-h-[56px] p-3 bg-white/5 border border-white/10 rounded-2xl">
                        {selectedEmails.length === 0 ? (
                          <p className="text-[10px] text-slate-600 font-bold p-1">No one selected</p>
                        ) : (
                          selectedEmails.map(email => (
                            <div key={email} className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/30 rounded-lg flex items-center gap-2 group">
                              <span className="text-[9px] font-bold text-white">{email}</span>
                              <button 
                                type="button" 
                                onClick={() => setSelectedEmails(selectedEmails.filter(e => e !== email))}
                                className="text-brand-primary hover:text-white cursor-pointer"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      <select 
                        className="input-luxury !py-4"
                        onChange={(e) => {
                          if (e.target.value && !selectedEmails.includes(e.target.value)) {
                            setSelectedEmails([...selectedEmails, e.target.value]);
                          }
                          e.target.value = "";
                        }}
                      >
                        <option value="">Add member...</option>
                        {employees.map(emp => (
                          <option 
                            key={emp.id} 
                            value={emp.email} 
                            disabled={selectedEmails.includes(emp.email) || emp.activeProjectCount >= 5}
                          >
                            {emp.name} ({emp.email}) — {emp.activeProjectCount || 0}/5 {emp.activeProjectCount >= 5 ? '(!) FULL' : 'Active'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <select 
                      name="employeeEmail"
                      value={projectData.employeeEmail}
                      onChange={handleProjectChange}
                      required={tab === 'individual'}
                      className="input-luxury !py-4"
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map(emp => (
                        <option 
                          key={emp.id} 
                          value={emp.email}
                          disabled={emp.activeProjectCount >= 5}
                        >
                          {emp.name} ({emp.email}) — {emp.activeProjectCount || 0}/5 {emp.activeProjectCount >= 5 ? '(!) FULL' : 'Active'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Team Lead Selection (Visible only for Group projects) */}
                {tab === 'group' ? (
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Select Team Lead
                    </label>
                    <select
                      name="teamLead"
                      value={projectData.teamLead || ''}
                      onChange={(e) => setProjectData(prev => ({ ...prev, teamLead: e.target.value }))}
                      required={selectedEmails.length > 0}
                      disabled={selectedEmails.length === 0}
                      className="input-luxury !py-4 disabled:opacity-35"
                    >
                      <option value="">Choose a team lead...</option>
                      {selectedEmails.map(email => {
                        const empObj = employees.find(e => e.email === email);
                        return (
                          <option key={email} value={email}>
                            {empObj ? empObj.name : email.split('@')[0]} ({email})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Name</label>
                    <input 
                      type="text" 
                      name="projectName"
                      placeholder="Enter project name" 
                      value={projectData.projectName}
                      onChange={handleProjectChange}
                      required
                      className="input-luxury !py-4 uppercase tracking-widest font-black"
                    />
                  </div>
                )}

                {/* Shift project name if group */}
                {tab === 'group' && (
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Name</label>
                    <input 
                      type="text" 
                      name="projectName"
                      placeholder="Enter project name" 
                      value={projectData.projectName}
                      onChange={handleProjectChange}
                      required
                      className="input-luxury !py-4 uppercase tracking-widest font-black"
                    />
                  </div>
                )}

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Brief / Description</label>
                  <textarea 
                    name="description"
                    placeholder="DESCRIBE THE MISSION OBJECTIVES, DELIVERABLES, AND SPECIFICATIONS..." 
                    value={projectData.description}
                    onChange={handleProjectChange}
                    required
                    className="input-luxury !py-4 h-32 uppercase tracking-widest font-black text-[10px] custom-scrollbar"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={projectData.startDate}
                    onChange={handleProjectChange}
                    required
                    className="input-luxury !py-4"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Deadline</label>
                  <input 
                    type="date" 
                    name="deadline"
                    value={projectData.deadline}
                    onChange={handleProjectChange}
                    required
                    className="input-luxury !py-4"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Budget (USD)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary font-bold">$</span>
                  <input 
                    type="number" 
                    name="budget"
                    placeholder="0.00" 
                    value={projectData.budget}
                    onChange={handleProjectChange}
                    required
                    className="input-luxury !py-4 !pl-12 font-bold text-lg tabular-nums"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isAssigning}
                className={`w-full py-6 text-white rounded-3xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group cursor-pointer ${
                  isAssigning 
                    ? 'bg-slate-700 cursor-not-allowed opacity-40' 
                    : 'bg-brand-primary hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_rgba(99,102,241,0.2)]'
                }`}
              >
                {isAssigning ? 'Assigning...' : 'Assign Project'}
                <ArrowRight size={20} className={`${isAssigning ? 'hidden' : 'group-hover:translate-x-2 transition-transform'}`} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectAssignmentForm;
