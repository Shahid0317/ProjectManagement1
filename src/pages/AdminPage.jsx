import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getProjectsByAdmin, 
  getPreAuthorizedUsersByRole, 
  addPreAuthorizedUser, 
  removePreAuthorizedUser,
  logoutUser,
  assignProject,
  deleteProject,
  updateProjectStatus,
  requestDelayReason,
  getSubmissions,
  getCurrentUser,
  markAttendance,
  getDailyTracking,
  getPendingRegistrations,
  approveRegistrationRequest,
  declineRegistrationRequest,
  getProjects,
  getAdminNameMap
} from '../services/mockDb';
import ThemeToggle from '../components/ThemeToggle';
import { Menu } from 'lucide-react';

// Component Imports
import AdminSidebar from '../components/Admin/AdminSidebar';
import PersonnelManager from '../components/Admin/PersonnelManager';
import ProjectAssignmentForm from '../components/Admin/ProjectAssignmentForm';
import ProjectLedger from '../components/Admin/ProjectLedger';
import AttendanceLog from '../components/Admin/AttendanceLog';
import ImagePreviewOverlay from '../components/Admin/ImagePreviewOverlay';
import StatCards from '../components/Admin/StatCards';
import DailyReportFeed from '../components/Admin/DailyReportFeed';
import FinalSubmissionsFeed from '../components/Admin/FinalSubmissionsFeed';
import PendingSubmissions from '../components/Admin/PendingSubmissions';
import ExtensionRequestsList from '../components/Admin/ExtensionRequestsList';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingOverlay from '../components/LoadingOverlay';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [subProjects, setSubProjects] = useState([]);
  const [pendingRegs, setPendingRegs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Personnel Management State
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [empMsg, setEmpMsg] = useState({ text: '', type: '' });
  const [adminNameMap, setAdminNameMap] = useState({});

  // Project Assignment State
  const [assignForm, setAssignForm] = useState({ 
    projectName: '', 
    description: '',
    employeeEmail: '', // for individual
    employeeEmails: [], // for group
    teamLead: '', // team lead for group project
    startDate: '', 
    deadline: '',
    budget: '',
    isGroup: false
  });
  const [assignMsg, setAssignMsg] = useState({ text: '', type: '' });

  // Ledger/Daily Log State
  const [expandedProject, setExpandedProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [logDate, setLogDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().toLocaleString('default', { month: 'long' }),
    day: new Date().getDate()
  });
  const [dailyLogs, setDailyLogs] = useState([]);

  const currentUser = React.useMemo(() => getCurrentUser(), []);

  const fetchData = async () => {
    if (!currentUser) return;
    const [adminProjects, allProjects, employeeData, submissions, regs, nameMap] = await Promise.all([
      getProjectsByAdmin(currentUser.id),
      getProjects(),
      getPreAuthorizedUsersByRole('employee'),
      getSubmissions(currentUser),
      getPendingRegistrations(),
      getAdminNameMap()
    ]);

    const enrichedEmployees = employeeData.map(emp => {
      const activeCount = allProjects.filter(p => 
        (Array.isArray(p.employeeId) ? p.employeeId.includes(emp.email) : p.employeeId === emp.email) && 
        p.status !== 'Completed'
      ).length;
      return { ...emp, activeProjectCount: activeCount };
    });

    setProjects(adminProjects);
    setEmployees(enrichedEmployees);
    setSubProjects(submissions.reverse());
    setPendingRegs(regs);
    setAdminNameMap(nameMap);
  };

  const fetchDailyLogs = async () => {
    const logs = await getDailyTracking(logDate.year, logDate.month, logDate.day);
    setDailyLogs(logs);
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
    markAttendance();
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchDailyLogs();
  }, [logDate]);

  // Personnel Handlers
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const result = await addPreAuthorizedUser(newEmpEmail, newEmpName, 'employee');
    setEmpMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setNewEmpEmail('');
      setNewEmpName('');
      fetchData();
    }
  };

  const handleRemoveEmployee = async (email) => {
    if (window.confirm("Are you sure you want to revoke access for this employee?")) {
      await removePreAuthorizedUser(email);
      fetchData();
    }
  };

  const handleApproveReg = async (name, email) => {
    const res = await approveRegistrationRequest(name, email, currentUser.email);
    if (res.success) fetchData();
    else alert(res.message);
  };

  const handleDeclineReg = async (email) => {
    const res = await declineRegistrationRequest(email);
    if (res.success) fetchData();
  };

  // Project Handlers
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setAssignForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignProject = async (e) => {
    e.preventDefault();
    setIsAssigning(true);
    
    const finalEmails = assignForm.isGroup ? assignForm.employeeEmails : [assignForm.employeeEmail];
    
    const result = await assignProject(
      currentUser.id, 
      finalEmails, 
      assignForm.projectName, 
      assignForm.description,
      assignForm.startDate, 
      assignForm.deadline,
      assignForm.budget,
      assignForm.isGroup ? assignForm.teamLead : ""
    );
    
    setAssignMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    setIsAssigning(false);
    
    if (result.success) {
      setAssignForm({ 
        projectName: '', 
        description: '',
        employeeEmail: '', 
        employeeEmails: [], 
        teamLead: '',
        startDate: '', 
        deadline: '', 
        budget: '',
        isGroup: false 
      });
      fetchData();
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Permanently delete this project?")) {
      await deleteProject(id);
      fetchData();
    }
  };

  const handleUpdateStatus = async (id, status) => {
    await updateProjectStatus(id, status);
    fetchData();
  };

  const handleRequestDelay = async (id) => {
    await requestDelayReason(id);
    fetchData();
  };

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  const handleFileAction = async (e, file) => {
    if (e) e.preventDefault();
    if (!file || !file.url) return;

    const type = file.type || (file.url.toLowerCase().endsWith('.zip') ? 'zip' : 'image');
    
    if (type === 'zip') {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.name || 'project_archive.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        window.location.href = file.url;
      }
    } else {
      setSelectedImage(file.url);
    }
  };

  return (
    <div className="min-h-screen flex font-body selection:bg-brand-primary/30 selection:text-white overflow-hidden bg-main">
      
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        handleSignOut={handleSignOut}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      {isLoading && <LoadingOverlay message="Synchronizing Administration Terminal..." />}

      <main className="flex-1 relative z-10 custom-scrollbar overflow-y-auto h-screen bg-surface-main backdrop-blur-3xl">
         
         <header className="sticky top-0 z-50 px-6 py-6 lg:px-12 flex justify-between items-center bg-header backdrop-blur-3xl border-b border-white/5 shadow-sm">
            <div className="flex-1 lg:hidden">
               <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white transition-colors">
                  <Menu size={24} />
               </button>
            </div>
            <div className="hidden lg:block flex-1"></div>
            
            <div className="flex items-center justify-center flex-1">
               <h1 className="text-2xl lg:text-3xl font-display font-bold text-heading tracking-tighter capitalize whitespace-nowrap">
                  Admin <span className="text-brand-primary">Dashboard</span>
               </h1>
            </div>

            <div className="flex items-center justify-end gap-4 lg:gap-6 flex-1">
               <ThemeToggle />
               <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
               <div className="hidden sm:flex flex-col items-end">
                  <p className="text-[10px] font-bold text-heading tabular-nums">{new Date().toLocaleDateString()}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Session</p>
               </div>
            </div>
         </header>

         <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
            
            {activeTab === 'overview' && (
               <div className="animate-fadeIn space-y-10">
                  <StatCards 
                     projects={projects}
                     employees={employees}
                     onTabChange={setActiveTab}
                  />
                  <div className="grid grid-cols-1 gap-10">
                     <ErrorBoundary>
                        <PendingSubmissions 
                           employees={employees}
                           subProjects={subProjects}
                        />
                     </ErrorBoundary>
                     <ErrorBoundary>
                        <ExtensionRequestsList 
                           projects={projects}
                           fetchData={fetchData}
                        />
                     </ErrorBoundary>
                  </div>
               </div>
             )}

             {activeTab === 'reports' && (
               <div className="animate-fadeIn">
                  <ErrorBoundary>
                     <DailyReportFeed 
                        subProjects={subProjects} 
                        handleFileAction={handleFileAction}
                     />
                  </ErrorBoundary>
               </div>
             )}

             {activeTab === 'final_submissions' && (
               <div className="animate-fadeIn">
                  <ErrorBoundary>
                     <FinalSubmissionsFeed 
                        projects={projects} 
                        handleFileAction={handleFileAction}
                     />
                  </ErrorBoundary>
               </div>
             )}

            {activeTab === 'employees' && (
              <ErrorBoundary>
                <PersonnelManager 
                   employees={employees}
                   pendingRegs={pendingRegs}
                   newEmpEmail={newEmpEmail}
                   setNewEmpEmail={setNewEmpEmail}
                   newEmpName={newEmpName}
                   setNewEmpName={setNewEmpName}
                   empMsg={empMsg}
                   handleAddEmployee={handleAddEmployee}
                   handleRemoveEmployee={handleRemoveEmployee}
                   handleApproveReg={handleApproveReg}
                   handleDeclineReg={handleDeclineReg}
                   registrationLink={`${window.location.origin}/register-employee`}
                   adminNameMap={adminNameMap}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'project_assignment' && (
               <ProjectAssignmentForm 
                  employees={employees}
                  projects={projects}
                  projectData={assignForm}
                  setProjectData={setAssignForm}
                  selectedEmails={assignForm.employeeEmails}
                  setSelectedEmails={(emails) => setAssignForm(prev => ({ ...prev, employeeEmails: emails }))}
                  assignMsg={assignMsg}
                  isAssigning={isAssigning}
                  handleAssignProject={handleAssignProject}
                  handleProjectChange={handleProjectChange}
                  fetchData={fetchData}
               />
            )}

            {activeTab === 'ledger' && (
               <ProjectLedger 
                  adminProjects={projects}
                  expandedProject={expandedProject}
                  setExpandedProject={setExpandedProject}
                  handleDeleteProject={handleDeleteProject}
                  handleUpdateStatus={handleUpdateStatus}
                  handleRequestDelay={handleRequestDelay}
                  handleFileAction={handleFileAction}
                  setSelectedImage={setSelectedImage}
               />
            )}

            {activeTab === 'attendance' && (
               <AttendanceLog 
                  logDate={logDate}
                  setLogDate={setLogDate}
                  dailyLogs={dailyLogs}
               />
            )}

            <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 pb-12 text-center">
               <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-heading">Secure Admin Terminal v2.0.4</p>
               </div>
            </footer>
         </div>
      </main>

      <ImagePreviewOverlay 
        selectedImage={selectedImage} 
        setSelectedImage={setSelectedImage} 
      />

    </div>
  );
};

export default AdminPage;
