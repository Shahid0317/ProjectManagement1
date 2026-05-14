import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, X } from 'lucide-react';
import { 
  addPreAuthorizedUser, getPreAuthorizedUsersByRole, removePreAuthorizedUser, 
  getProjects, updateProjectPayment, logoutUser, getSubmissions, getCurrentUser, 
  markAttendance, getDailyTracking 
} from '../services/mockDb';

// Components
import ThemeToggle from '../components/ThemeToggle';
import SuperadminSidebar from '../components/Superadmin/SuperadminSidebar';
import SuperadminStats from '../components/Superadmin/SuperadminStats';
import GlobalAuthorityManager from '../components/Superadmin/GlobalAuthorityManager';
import GlobalProjectLedger from '../components/Superadmin/GlobalProjectLedger';
import DailyReportFeed from '../components/Admin/DailyReportFeed'; // Reusing from Admin
import AttendanceLog from '../components/Admin/AttendanceLog'; // Reusing from Admin

const SuperadminPage = () => {
  const navigate = useNavigate();
  const currentUser = React.useMemo(() => getCurrentUser(), []);
  
  // State
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [subProjects, setSubProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [logDate, setLogDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().toLocaleString('default', { month: 'long' }),
    day: new Date().getDate()
  });
  const [dailyLogs, setDailyLogs] = useState([]);
  
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [empMsg, setEmpMsg] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedProject, setExpandedProject] = useState(null);

  const fetchData = async () => {
    setAdmins(await getPreAuthorizedUsersByRole('admin'));
    setEmployees(await getPreAuthorizedUsersByRole('employee'));
    setAllProjects(await getProjects());
    if (currentUser) {
      const allSubProjects = await getSubmissions(currentUser);
      setSubProjects(allSubProjects.reverse());
    }
  };

  const fetchDailyLogs = async () => {
    const logs = await getDailyTracking(logDate.year, logDate.month, logDate.day);
    setDailyLogs(logs);
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      navigate('/');
      return;
    }
    fetchData();
    markAttendance();
  }, []);

  useEffect(() => { fetchDailyLogs(); }, [logDate]);

  // Handlers
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const result = await addPreAuthorizedUser(newAdminEmail, newAdminName, 'admin');
    setMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) { setNewAdminName(''); setNewAdminEmail(''); fetchData(); }
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleRemoveAdmin = async (id) => { await removePreAuthorizedUser(id); fetchData(); };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const result = await addPreAuthorizedUser(newEmpEmail, newEmpName, 'employee');
    setEmpMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) { setNewEmpName(''); setNewEmpEmail(''); fetchData(); }
    setTimeout(() => setEmpMsg({ text: '', type: '' }), 3000);
  };

  const handleTogglePayment = async (projectId, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    await updateProjectPayment(projectId, newStatus);
    fetchData();
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
      } catch (err) { window.open(file.url, '_blank'); }
    } else { setSelectedImage(file.url); }
  };

  const handleSignOut = () => { logoutUser(); navigate('/'); };

  const totalBudget = allProjects.reduce((acc, p) => acc + (parseFloat(p.budget) || 0), 0);

  return (
    <div className="min-h-screen gradient-mesh flex font-body selection:bg-brand-secondary/30 selection:text-white overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
         <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-brand-secondary/15 rounded-full blur-[160px] animate-float"></div>
         <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-brand-primary/15 rounded-full blur-[140px] animate-float" style={{ animationDelay: '-5s' }}></div>
      </div>

      <SuperadminSidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} handleSignOut={handleSignOut} />

      <main className="flex-1 relative z-10 custom-scrollbar overflow-y-auto h-screen bg-slate-950/20 backdrop-blur-3xl">
         
         <header className="sticky top-0 z-30 p-8 lg:p-12 flex justify-between items-center bg-slate-950/40 backdrop-blur-2xl border-b border-white/5">
            <h1 className="text-2xl font-display font-bold text-white tracking-tighter capitalize">
               {activeTab} <span className="text-brand-primary">Terminal</span>
            </h1>
            <div className="flex items-center gap-6">
               <ThemeToggle />
               <div className="h-10 w-px bg-white/10"></div>
               <div className="flex flex-col items-end text-white">
                  <p className="text-xs font-bold tabular-nums">{new Date().toLocaleDateString()}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Realtime Ops Sync</p>
               </div>
            </div>
         </header>

         <div className="p-8 lg:p-16 max-w-7xl mx-auto">
            
            {activeTab === 'overview' && (
              <div className="space-y-16 animate-fadeIn">
                 <SuperadminStats 
                    allProjectsCount={allProjects.length} totalBudget={totalBudget} 
                    subProjectsCount={subProjects.length} nodeCount={admins.length + employees.length} 
                 />
                 <DailyReportFeed subProjects={subProjects} handleFileAction={handleFileAction} />
              </div>
            )}

            {activeTab === 'personnel' && (
              <GlobalAuthorityManager 
                admins={admins} newAdminEmail={newAdminEmail} setNewAdminEmail={setNewAdminEmail} handleAddAdmin={handleAddAdmin} handleRemoveAdmin={handleRemoveAdmin} msg={msg}
                employees={employees} newEmpEmail={newEmpEmail} setNewEmpEmail={setNewEmpEmail} handleAddEmployee={handleAddEmployee} handleRemoveEmployee={(id) => removePreAuthorizedUser(id).then(fetchData)} empMsg={empMsg}
              />
            )}

            {activeTab === 'projects' && (
              <GlobalProjectLedger 
                allProjects={allProjects} expandedProject={expandedProject} setExpandedProject={setExpandedProject} 
                handleTogglePayment={handleTogglePayment} setSelectedImage={setSelectedImage} 
              />
            )}

            {activeTab === 'logs' && (
              <AttendanceLog dailyLogs={dailyLogs} logDate={logDate} setLogDate={setLogDate} />
            )}

            <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 pb-16 text-white">
               <div className="flex items-center gap-4">
                  <ShieldAlert size={20} />
                  <p className="text-[11px] font-black uppercase tracking-[0.5em]">Supreme Authority Protocol v10.4.2</p>
               </div>
               <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest">
                  <span>Global Link: Established</span>
                  <span>System Load: 2.4%</span>
               </div>
            </footer>
         </div>
      </main>

      {selectedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-20 animate-fadeIn">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setSelectedImage(null)}></div>
          <div className="relative glass-card !bg-slate-900/40 p-3 max-w-7xl w-full animate-zoomIn border-white/20 shadow-[0_0_100px_rgba(168,85,247,0.15)]">
            <button onClick={() => setSelectedImage(null)} className="absolute -top-6 -right-6 p-5 bg-brand-secondary text-white rounded-3xl shadow-2xl hover:bg-white hover:text-brand-secondary transition-all duration-500 hover:scale-110 z-10">
              <X size={24} />
            </button>
            <div className="overflow-hidden rounded-[2rem] bg-slate-950">
               <img src={selectedImage} alt="Report Visual" className="max-w-full max-h-[80vh] object-contain mx-auto" />
            </div>
            <div className="mt-8 pb-4 px-10 w-full flex justify-between items-center text-white">
               <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Supreme Report Asset Verification</p>
                  <p className="text-[11px] font-bold text-brand-secondary mt-1 uppercase tracking-widest">Node ID: {currentUser?.id}</p>
               </div>
               <a href={selectedImage} target="_blank" rel="noopener noreferrer" className="btn-primary !py-3.5 !px-10 !text-[10px] !bg-none !border !border-white/20 hover:!bg-white/5">Original Archive</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperadminPage;
