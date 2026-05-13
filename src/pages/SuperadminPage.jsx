import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Activity, Server, PlusCircle, Trash2, Briefcase, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { addPreAuthorizedUser, getPreAuthorizedUsersByRole, removePreAuthorizedUser, getProjects, getProjectStatusDynamic, updateProjectPayment, logoutUser } from '../services/mockDb';
import Leaderboard from '../components/Leaderboard';

const SuperadminPage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  
  // Admin Form state
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminId, setNewAdminId] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Employee Form state
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [empMsg, setEmpMsg] = useState({ text: '', type: '' });

  const fetchData = () => {
    setAdmins(getPreAuthorizedUsersByRole('admin'));
    setEmployees(getPreAuthorizedUsersByRole('employee'));
    setAllProjects(getProjects());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const result = addPreAuthorizedUser(newAdminId, newAdminName, 'admin');
    
    setMsg({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });

    if (result.success) {
      setNewAdminName('');
      setNewAdminId('');
      fetchData();
    }
    
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleRemoveAdmin = (id) => {
    removePreAuthorizedUser(id);
    fetchData();
  };

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
      fetchData();
    }
    
    setTimeout(() => setEmpMsg({ text: '', type: '' }), 3000);
  };

  const handleRemoveEmployee = (id) => {
    removePreAuthorizedUser(id);
    fetchData();
  };

  const handleTogglePayment = (projectId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Received' : 'Pending';
    updateProjectPayment(projectId, newStatus);
    fetchData(); // refresh the table
  };

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 sm:p-10 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-red-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <ShieldAlert size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Super Admin Console</h1>
              <p className="text-red-400 font-medium text-sm mt-1">System-wide Overview & Management</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="mt-4 md:mt-0 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 bg-slate-800 rounded-lg border border-white/5 hover:border-white/10">
            Sign Out
          </button>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
              <ShieldAlert className="text-red-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Admins</p>
              <h3 className="text-xl font-bold text-white">{admins.length}</h3>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <Users className="text-indigo-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Employees</p>
              <h3 className="text-xl font-bold text-white">{employees.length}</h3>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Activity className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">System Status</p>
              <h3 className="text-xl font-bold text-white">Healthy</h3>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Server className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Server Load</p>
              <h3 className="text-xl font-bold text-white">24%</h3>
            </div>
          </div>
        </div>

        {/* Global Projects Tracking Table - Moved Above Management */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-purple-400" size={24} />
            <h2 className="text-xl font-semibold">Global Project Tracking</h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="pb-3 px-4 font-medium">Project Name</th>
                  <th className="pb-3 px-4 font-medium">Employee</th>
                  <th className="pb-3 px-4 font-medium">Assigned By</th>
                  <th className="pb-3 px-4 font-medium">Timeline</th>
                  <th className="pb-3 px-4 font-medium">Budget</th>
                  <th className="pb-3 px-4 font-medium">Payment Status</th>
                  <th className="pb-3 px-4 font-medium">Project Status</th>
                </tr>
              </thead>
              <tbody>
                {allProjects.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500 text-sm">
                      No projects have been assigned yet.
                    </td>
                  </tr>
                ) : (
                  allProjects.map((project) => {
                    const status = getProjectStatusDynamic(project);
                    return (
                      <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4">
                          <p className="font-medium text-white">{project.projectName}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-white">{project.employeeName}</p>
                          <p className="text-xs text-slate-500">{project.employeeId}</p>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {project.adminId}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar size={12} />
                            <span>{project.startDate} to {project.deadline}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-emerald-400">
                          ${Number(project.budget || 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                              project.paymentStatus === 'Received' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            }`}>
                              {project.paymentStatus || 'Pending'}
                            </span>
                            <button
                              onClick={() => handleTogglePayment(project.id, project.paymentStatus || 'Pending')}
                              className="text-xs text-indigo-400 hover:text-indigo-300 underline transition-colors"
                            >
                              {project.paymentStatus === 'Received' ? 'Mark Pending' : 'Mark Paid'}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            status === 'Closed' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                            status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            status === 'Delayed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Admin Management */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col h-[500px]">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 shrink-0">
              <ShieldAlert className="text-red-400" size={24} />
              Manage Administrators
            </h2>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {admins.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No admins pre-authorized yet.</p>
              ) : (
                admins.map((admin) => (
                  <div key={admin.id} className="p-4 bg-slate-900/40 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{admin.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">ID: {admin.id}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                      title="Remove Admin"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 shrink-0">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Pre-authorize New Admin</h3>
              
              {msg.text && (
                <div className={`mb-4 p-2 rounded-lg text-xs text-center border ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleAddAdmin} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  required
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
                <input 
                  type="text" 
                  placeholder="Admin ID (e.g. ADM-001)" 
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  required
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle size={16} />
                  Authorize Admin
                </button>
              </form>
            </div>
          </div>

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

          {/* Leaderboard */}
          <Leaderboard />

        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
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

export default SuperadminPage;
