import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, FileCheck, CheckCircle, Shield, PlusCircle, Calendar as CalendarIcon, Trash2, Paperclip, AlertTriangle } from 'lucide-react';
import { addPreAuthorizedUser, getPreAuthorizedUsersByRole, removePreAuthorizedUser, assignProject, getCurrentUser, getProjects, getSubmissions, getProjectsByAdmin, requestDelayReason, getProjectStatusDynamic, logoutUser } from '../services/mockDb';
import Leaderboard from '../components/Leaderboard';

const AdminPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  // Manage Employees State
  const [employees, setEmployees] = useState([]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [empMsg, setEmpMsg] = useState({ text: '', type: '' });

  // Project Assignment State
  const [projectData, setProjectData] = useState({
    employeeId: '',
    projectName: '',
    startDate: '',
    deadline: '',
    budget: ''
  });
  const [assignMsg, setAssignMsg] = useState({ text: '', type: '' });
  const [isAssigned, setIsAssigned] = useState(false);

  // Stats State
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);

  const fetchDashboardData = () => {
    setEmployees(getPreAuthorizedUsersByRole('employee'));
    const allProjects = getProjects();
    const active = allProjects.filter(p => p.status !== 'Completed').length;
    setActiveProjectsCount(active);
    
    // Sort submissions by newest first
    const allSubmissions = getSubmissions().reverse();
    setSubmissions(allSubmissions);

    if (currentUser) {
      setAdminProjects(getProjectsByAdmin(currentUser.id).reverse());
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const result = addPreAuthorizedUser(newEmpId, newEmpName, 'employee');
    
    setEmpMsg({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });

    if (result.success) {
      setNewEmpName('');
      setNewEmpId('');
      fetchDashboardData();
    }
    
    setTimeout(() => setEmpMsg({ text: '', type: '' }), 3000);
  };

  const handleRemoveEmployee = (id) => {
    removePreAuthorizedUser(id);
    fetchDashboardData();
  };

  const handleAssignProject = (e) => {
    e.preventDefault();
    
    if (!currentUser) return;

    const result = assignProject(
      currentUser.id,
      projectData.employeeId,
      projectData.projectName,
      projectData.startDate,
      projectData.deadline,
      projectData.budget
    );

    if (result.success) {
      setIsAssigned(true);
      setAssignMsg({ text: result.message, type: 'success' });
      setProjectData({ employeeId: '', projectName: '', startDate: '', deadline: '', budget: '' });
      fetchDashboardData();
      
      setTimeout(() => {
        setIsAssigned(false);
        setAssignMsg({ text: '', type: '' });
      }, 3000);
    } else {
      setAssignMsg({ text: result.message, type: 'error' });
      setTimeout(() => setAssignMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleProjectChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleRequestReason = (projectId) => {
    requestDelayReason(projectId);
    fetchDashboardData();
  };

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 sm:p-10 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-indigo-400 font-medium text-sm mt-1">Welcome back, {currentUser?.name || 'Admin'}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="mt-4 md:mt-0 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 bg-slate-800 rounded-lg border border-white/5 hover:border-white/10">
            Sign Out
          </button>
        </header>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Widget 1 */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <Users className="text-indigo-400" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Employees</p>
              <h3 className="text-2xl font-bold text-white">{employees.length}</h3>
            </div>
          </div>

          {/* Widget 2 */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <Briefcase className="text-purple-400" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Active Projects</p>
              <h3 className="text-2xl font-bold text-white">{activeProjectsCount}</h3>
            </div>
          </div>

          {/* Widget 3 */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <FileCheck className="text-blue-400" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Submissions</p>
              <h3 className="text-2xl font-bold text-white">{submissions.length}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Employee Management */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col h-[500px]">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 shrink-0">
              <Users className="text-indigo-400" size={24} />
              Manage Employees
            </h2>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {employees.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No employees pre-authorized yet.</p>
              ) : (
                employees.map((emp) => (
                  <div key={emp.id} className="p-4 bg-slate-900/40 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{emp.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">ID: {emp.id}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveEmployee(emp.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                      title="Remove Employee"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 shrink-0">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Pre-authorize New Employee</h3>
              
              {empMsg.text && (
                <div className={`mb-4 p-2 rounded-lg text-xs text-center border ${empMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                  {empMsg.text}
                </div>
              )}

              <form onSubmit={handleAddEmployee} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  required
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
                <input 
                  type="text" 
                  placeholder="Employee ID (e.g. EMP-001)" 
                  value={newEmpId}
                  onChange={(e) => setNewEmpId(e.target.value)}
                  required
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle size={16} />
                  Authorize Employee
                </button>
              </form>
            </div>
          </div>

          {/* Assign Project Form */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <Briefcase className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold">Assign Project</h2>
            </div>
            
            {assignMsg.text && (
              <div className={`mb-4 p-2 rounded-lg text-sm text-center border ${assignMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                {assignMsg.text}
              </div>
            )}

            <form onSubmit={handleAssignProject} className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Employee ID</label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                  <input 
                    type="text" 
                    name="employeeId"
                    placeholder="e.g. EMP-001" 
                    value={projectData.employeeId}
                    onChange={handleProjectChange}
                    required
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-11 pr-3 text-sm text-slate-50 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Project Name</label>
                <div className="relative flex items-center">
                  <Briefcase className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                  <input 
                    type="text" 
                    name="projectName"
                    placeholder="e.g. Website Redesign" 
                    value={projectData.projectName}
                    onChange={handleProjectChange}
                    required
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-11 pr-3 text-sm text-slate-50 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Project Budget ($)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-medium pointer-events-none">$</span>
                  <input 
                    type="number" 
                    name="budget"
                    placeholder="e.g. 5000" 
                    value={projectData.budget}
                    onChange={handleProjectChange}
                    required
                    min="0"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-11 pr-3 text-sm text-slate-50 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Start Date</label>
                  <div className="relative flex items-center">
                    <CalendarIcon className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                    <input 
                      type="date" 
                      name="startDate"
                      value={projectData.startDate}
                      onChange={handleProjectChange}
                      required
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-11 pr-3 text-sm text-slate-50 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Deadline</label>
                  <div className="relative flex items-center">
                    <CalendarIcon className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                    <input 
                      type="date" 
                      name="deadline"
                      value={projectData.deadline}
                      onChange={handleProjectChange}
                      required
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-11 pr-3 text-sm text-slate-50 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isAssigned}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_0_rgba(99,102,241,0.39)] hover:-translate-y-0.5 active:translate-y-0
                    ${isAssigned ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 hover:shadow-emerald-500/40' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                >
                  {isAssigned ? (
                    <>
                      <CheckCircle size={20} />
                      <span>Project Assigned</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} />
                      <span>Assign Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Leaderboard Component */}
          <Leaderboard />

        </div>

        {/* My Assigned Projects Table */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="text-indigo-400" size={24} />
              <h2 className="text-xl font-semibold">My Assigned Projects</h2>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="pb-3 px-4 font-medium">Project Name</th>
                  <th className="pb-3 px-4 font-medium">Employee</th>
                  <th className="pb-3 px-4 font-medium">Timeline</th>
                  <th className="pb-3 px-4 font-medium">Status</th>
                  <th className="pb-3 px-4 font-medium">Delay Alerts</th>
                </tr>
              </thead>
              <tbody>
                {adminProjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">
                      You haven't assigned any projects yet.
                    </td>
                  </tr>
                ) : (
                  adminProjects.map((project) => {
                    const status = getProjectStatusDynamic(project);
                    return (
                      <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4 font-medium text-white">
                          {project.projectName}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-slate-200">{project.employeeName}</p>
                          <p className="text-xs text-slate-500">{project.employeeId}</p>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {project.startDate} - {project.deadline}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            status === 'Closed' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            status === 'Delayed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {status === 'Delayed' && !project.delayReasonRequested && (
                            <button 
                              onClick={() => handleRequestReason(project.id)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                            >
                              <AlertTriangle size={14} /> Request Reason
                            </button>
                          )}
                          {project.delayReasonRequested && !project.delayReason && (
                            <span className="text-xs text-amber-400 italic">Reason Requested...</span>
                          )}
                          {project.delayReason && (
                            <div className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-white/10 max-w-[200px]">
                              <span className="text-emerald-400 font-medium block mb-1">Reason:</span>
                              {project.delayReason}
                            </div>
                          )}
                          {status !== 'Delayed' && !project.delayReasonRequested && (
                            <span className="text-xs text-slate-500 italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Submissions Table */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold">Recent Work Submissions</h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="pb-3 px-4 font-medium w-32">Date</th>
                  <th className="pb-3 px-4 font-medium w-48">Employee</th>
                  <th className="pb-3 px-4 font-medium w-48">Project</th>
                  <th className="pb-3 px-4 font-medium">Work Description</th>
                  <th className="pb-3 px-4 font-medium w-32">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">
                      No work updates have been submitted yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4 text-sm text-slate-300">
                        {sub.date}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-white">{sub.employeeName}</p>
                        <p className="text-xs text-slate-500">{sub.employeeId}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-slate-200">{sub.projectName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-400 line-clamp-2">{sub.description}</p>
                      </td>
                      <td className="py-4 px-4">
                        {sub.fileName ? (
                          <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 max-w-[120px]">
                            <Paperclip size={12} className="shrink-0" />
                            <span className="truncate">{sub.fileName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
