import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'lucide-react';
import { 
  addPreAuthorizedUser, getPreAuthorizedUsersByRole, removePreAuthorizedUser, 
  assignProject, getCurrentUser, getProjects, getSubmissions, 
  getProjectsByAdmin, logoutUser, markAttendance, getDailyTracking, deleteProject
} from '../services/mockDb';

// Components
import ThemeToggle from '../components/ThemeToggle';
import AdminSidebar from '../components/Admin/AdminSidebar';
import StatCards from '../components/Admin/StatCards';
import DailyReportFeed from '../components/Admin/DailyReportFeed';
import PersonnelManager from '../components/Admin/PersonnelManager';
import ProjectAssignmentForm from '../components/Admin/ProjectAssignmentForm';
import ProjectLedger from '../components/Admin/ProjectLedger';
import AttendanceLog from '../components/Admin/AttendanceLog';
import ImagePreviewOverlay from '../components/Admin/ImagePreviewOverlay';

const AdminPage = () => {
  const navigate = useNavigate();
  const currentUser = React.useMemo(() => getCurrentUser(), []);
  
  // State
  const [employees, setEmployees] = useState([]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [empMsg, setEmpMsg] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const [projectData, setProjectData] = useState({
    employeeEmail: '',
    projectName: '',
    startDate: '',
    deadline: '',
    budget: '',
    isGroup: false
  });
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [assignMsg, setAssignMsg] = useState({ text: '', type: '' });
  const [isAssigning, setIsAssigning] = useState(false);

  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [subProjects, setSubProjects] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [logDate, setLogDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().toLocaleString('default', { month: 'long' }),
    day: new Date().getDate()
  });
  const [dailyLogs, setDailyLogs] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);

  const fetchDashboardData = async () => {
    setEmployees(await getPreAuthorizedUsersByRole('employee'));
    const allProjects = await getProjects();
    const active = allProjects.filter(p => p.status !== 'Completed').length;
    setActiveProjectsCount(active);
    
    if (currentUser) {
      const allSubProjects = await getSubmissions(currentUser);
      setSubProjects(allSubProjects.reverse());
      const myProjects = await getProjectsByAdmin(currentUser.id);
      setAdminProjects(myProjects.reverse());
    }
  };

  const fetchDailyLogs = async () => {
    const logs = await getDailyTracking(logDate.year, logDate.month, logDate.day);
    setDailyLogs(logs);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    fetchDashboardData();
    markAttendance();
  }, []);

  useEffect(() => {
    fetchDailyLogs();
  }, [logDate]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const result = await addPreAuthorizedUser(newEmpEmail, newEmpName, 'employee');
    setEmpMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setNewEmpName('');
      setNewEmpEmail('');
      fetchDashboardData();
    }
    setTimeout(() => setEmpMsg({ text: '', type: '' }), 3000);
  };

  const handleRemoveEmployee = async (id) => {
    await removePreAuthorizedUser(id);
    fetchDashboardData();
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently delete this project record?")) {
      await deleteProject(id);
      fetchDashboardData();
    }
  };

  const handleAssignProject = async (e) => {
    e.preventDefault();
    if (!currentUser || isAssigning) return;

    setIsAssigning(true);
    try {
      const result = await assignProject(
        currentUser.email,
        projectData.isGroup ? selectedEmails : [projectData.employeeEmail], 
        projectData.projectName, 
        projectData.startDate, 
        projectData.deadline, 
        projectData.budget
      );
      if (result.success) {
        setAssignMsg({ text: 'Project Assigned Successfully', type: 'success' });
        setProjectData({ employeeEmail: '', projectName: '', startDate: '', deadline: '', budget: '', isGroup: false });
        setSelectedEmails([]);
        fetchDashboardData();
        setTimeout(() => setAssignMsg({ text: '', type: '' }), 3000);
      } else {
        setAssignMsg({ text: result.message, type: 'error' });
        setTimeout(() => setAssignMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setAssignMsg({ text: 'Deployment Error', type: 'error' });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleProjectChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleFileAction = async (e, file) => {
    e.preventDefault();
    if (file.type === 'zip') {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', file.name || 'download.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        window.open(file.url, '_blank');
      }
    } else {
      setSelectedImage(file.url);
    }
  };

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-mesh flex font-body selection:bg-brand-secondary/30 selection:text-white overflow-hidden">
      
      {/* Absolute Background Master Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
         <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-brand-secondary/15 rounded-full blur-[160px] animate-float"></div>
         <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-brand-primary/15 rounded-full blur-[140px] animate-float" style={{ animationDelay: '-5s' }}></div>
      </div>

      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        handleSignOut={handleSignOut} 
      />

      {/* Main Core */}
      <main className="flex-1 relative z-10 custom-scrollbar overflow-y-auto h-screen bg-slate-950/20 backdrop-blur-3xl">
         
         {/* Top Header */}
         <header className="sticky top-0 z-30 p-8 lg:p-12 flex justify-between items-center bg-slate-950/40 backdrop-blur-2xl border-b border-white/5">
            <div className="flex items-center gap-8">
               <h1 className="text-2xl font-display font-bold text-white tracking-tighter capitalize">
                  {activeTab} <span className="text-brand-primary">Terminal</span>
               </h1>
            </div>

            <div className="flex items-center gap-6">
               <ThemeToggle />
               <div className="h-10 w-px bg-white/10"></div>
               <div className="flex flex-col items-end">
                  <p className="text-xs font-bold text-white tabular-nums">{new Date().toLocaleDateString()}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Command Ops Sync</p>
               </div>
            </div>
         </header>

         <div className="p-8 lg:p-16 max-w-7xl mx-auto">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-16 animate-fadeIn">
                 <StatCards 
                    activeProjectsCount={activeProjectsCount}
                    subProjectsCount={subProjects.length}
                    adminProjectsCount={adminProjects.length}
                    employeesCount={employees.length}
                 />

                 <DailyReportFeed 
                    subProjects={subProjects}
                    handleFileAction={handleFileAction}
                 />
              </div>
            )}

            {/* TAB: PERSONNEL */}
            {activeTab === 'employees' && (
              <PersonnelManager 
                employees={employees}
                newEmpEmail={newEmpEmail}
                setNewEmpEmail={setNewEmpEmail}
                newEmpName={newEmpName}
                setNewEmpName={setNewEmpName}
                empMsg={empMsg}
                handleAddEmployee={handleAddEmployee}
                handleRemoveEmployee={handleRemoveEmployee}
              />
            )}

            {/* TAB: PROJECT CONTROL */}
            {activeTab === 'project_assignment' && (
              <ProjectAssignmentForm 
                projectData={projectData}
                setProjectData={setProjectData}
                employees={employees}
                selectedEmails={selectedEmails}
                setSelectedEmails={setSelectedEmails}
                assignMsg={assignMsg}
                isAssigning={isAssigning}
                handleAssignProject={handleAssignProject}
                handleProjectChange={handleProjectChange}
              />
            )}

            {/* TAB: LEDGER */}
            {activeTab === 'ledger' && (
              <ProjectLedger 
                adminProjects={adminProjects}
                expandedProject={expandedProject}
                setExpandedProject={setExpandedProject}
                handleDeleteProject={handleDeleteProject}
                handleFileAction={handleFileAction}
                setSelectedImage={setSelectedImage}
              />
            )}

            {/* TAB: ATTENDANCE */}
            {activeTab === 'attendance' && (
              <AttendanceLog 
                dailyLogs={dailyLogs}
                logDate={logDate}
                setLogDate={setLogDate}
              />
            )}

            {/* Footer */}
            <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 pb-16">
               <div className="flex items-center gap-4">
                  <Layout size={20} />
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Sector Control Protocol v8.2.1</p>
               </div>
               <div className="flex gap-12">
                  <span className="text-[10px] font-black uppercase tracking-widest">Secure Link: Established</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Asset Sync: Active</span>
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
