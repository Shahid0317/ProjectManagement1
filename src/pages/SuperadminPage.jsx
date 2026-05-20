import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  addPreAuthorizedUser, getPreAuthorizedUsersByRole, removePreAuthorizedUser, 
  getProjects, logoutUser, getSubmissions, getCurrentUser, markAttendance, getDailyTracking,
  updateProjectPaymentStatus
} from '../services/mockDb';
import ThemeToggle from '../components/ThemeToggle';
import { Menu, X, Users, Shield, User, Mail, Phone, Briefcase, Globe, MapPin, FileText } from 'lucide-react';

// Component Imports
import SuperadminSidebar from '../components/Superadmin/SuperadminSidebar';
import SuperadminStats from '../components/Superadmin/SuperadminStats';
import GlobalAuthorityManager from '../components/Superadmin/GlobalAuthorityManager';
import GlobalProjectLedger from '../components/Superadmin/GlobalProjectLedger';
import AdminActivityFeed from '../components/Superadmin/AdminActivityFeed';
import DailyReportFeed from '../components/Admin/DailyReportFeed';
import FinalSubmissionsFeed from '../components/Admin/FinalSubmissionsFeed';
import PendingSubmissions from '../components/Admin/PendingSubmissions';
import ImagePreviewOverlay from '../components/Admin/ImagePreviewOverlay';
import AttendanceLog from '../components/Admin/AttendanceLog';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingOverlay from '../components/LoadingOverlay';

const SuperadminPage = () => {
  const navigate = useNavigate();
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
  const currentUser = React.useMemo(() => getCurrentUser(), []);
  
  // UI State
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('superadminActiveTab') || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('superadminActiveTab', activeTab);
  }, [activeTab]);

  const [expandedProject, setExpandedProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Authority Management State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminJobRole, setNewAdminJobRole] = useState('');
  const [newAdminDomain, setNewAdminDomain] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [adminData, empData, projects, submissions] = await Promise.all([
        getPreAuthorizedUsersByRole('admin'),
        getPreAuthorizedUsersByRole('employee'),
        getProjects(),
        currentUser ? getSubmissions(currentUser) : Promise.resolve([])
      ]);

      setAdmins(adminData);
      setEmployees(empData);
      setAllProjects(projects);
      setSubProjects(submissions.reverse());
    } catch (error) {
      console.error("Error fetching system data:", error);
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
    fetchData();
    markAttendance();
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchDailyLogs();
  }, [logDate]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const result = await addPreAuthorizedUser(
      newAdminEmail, 
      newAdminName, 
      'admin',
      newAdminPhone,
      newAdminJobRole,
      newAdminDomain
    );
    setMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPhone('');
      setNewAdminJobRole('');
      setNewAdminDomain('');
      fetchData();
    }
  };

  const handleRemoveAdmin = async (id) => {
    if (window.confirm("Permanently revoke Admin authority?")) {
      await removePreAuthorizedUser(id);
      fetchData();
    }
  };

  const handleUpdatePaymentStatus = async (projectId, status) => {
    const result = await updateProjectPaymentStatus(projectId, status);
    if (result.success) {
      fetchData();
    } else {
      alert(result.message);
    }
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
      
      <SuperadminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        handleSignOut={handleSignOut} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      {isLoading && <LoadingOverlay message="Synchronizing System Data..." />}

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
                  Superadmin <span className="text-brand-primary">Terminal</span>
               </h1>
            </div>

            <div className="flex items-center justify-end gap-4 lg:gap-6 flex-1">
               <ThemeToggle />
               <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
               <div className="hidden sm:flex flex-col items-end">
                  <p className="text-[10px] font-bold text-heading tabular-nums">{new Date().toLocaleDateString()}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Master Active</p>
               </div>
            </div>
         </header>

         <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
            
            {activeTab === 'overview' && (
              <>
                 <div className="animate-fadeIn">
                    <ErrorBoundary>
                       <SuperadminStats 
                          allProjectsCount={allProjects.length}
                          totalBudget={allProjects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0)}
                          subProjectsCount={subProjects.length}
                          nodeCount={admins.length + employees.length}
                          onTabChange={setActiveTab}
                          onShowStaff={() => setShowStaffModal(true)}
                       />
                    </ErrorBoundary>
                 </div>

                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <div id="daily-reports-feed" className="space-y-6">
                       <ErrorBoundary>
                          <PendingSubmissions 
                             employees={employees}
                             subProjects={subProjects}
                          />
                       </ErrorBoundary>

                    </div>

                    <div className="space-y-6">
                       <ErrorBoundary>
                          <AdminActivityFeed 
                             allProjects={allProjects}
                             employees={employees}
                          />
                       </ErrorBoundary>
                    </div>
                 </div>
              </>
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
                        projects={allProjects} 
                        handleFileAction={handleFileAction}
                     />
                  </ErrorBoundary>
               </div>
            )}

            {activeTab === 'users' && (
               <GlobalAuthorityManager 
                  admins={admins}
                  newAdminEmail={newAdminEmail}
                  setNewAdminEmail={setNewAdminEmail}
                  newAdminName={newAdminName}
                  setNewAdminName={setNewAdminName}
                  newAdminPhone={newAdminPhone}
                  setNewAdminPhone={setNewAdminPhone}
                  newAdminJobRole={newAdminJobRole}
                  setNewAdminJobRole={setNewAdminJobRole}
                  newAdminDomain={newAdminDomain}
                  setNewAdminDomain={setNewAdminDomain}
                  handleAddAdmin={handleAddAdmin}
                  handleRemoveAdmin={handleRemoveAdmin}
                  msg={msg}
               />
            )}

            {activeTab === 'projects' && (
              <ErrorBoundary>
                <GlobalProjectLedger 
                  allProjects={allProjects}
                  expandedProject={expandedProject}
                  setExpandedProject={setExpandedProject}
                  setSelectedImage={setSelectedImage}
                  handleFileAction={handleFileAction}
                  handleUpdatePaymentStatus={handleUpdatePaymentStatus}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'logs' && (
              <AttendanceLog 
                logDate={logDate}
                setLogDate={setLogDate}
                dailyLogs={dailyLogs}
              />
            )}

            <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 pb-12 text-center">
               <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-heading">System Authority v1.0.4</p>
               </div>
            </footer>
         </div>
      </main>

      {/* Staff Registry Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fadeIn">
           <div className="absolute inset-0 bg-backdrop" onClick={() => setShowStaffModal(false)}></div>
           <div className="relative modal-solid w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] rounded-[2.5rem] shadow-2xl">
              <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                 <div className="flex items-center gap-5">
                    <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-brand-primary">
                       <Users size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-heading tracking-tight">System Personnel</h2>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Staff Registry</p>
                    </div>
                 </div>
                 <button onClick={() => setShowStaffModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-500 hover:text-white transition-all">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10 space-y-10">
                 {/* Admins */}
                 <div className="space-y-5">
                    <div className="flex items-center gap-3">
                       <div className="h-px flex-1 bg-brand-secondary/20"></div>
                       <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.4em] whitespace-nowrap flex items-center gap-2">
                          <Shield size={12} /> Administrators ({admins.length})
                       </p>
                       <div className="h-px flex-1 bg-brand-secondary/20"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {admins.map((admin, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedStaff(admin)}
                            className="glass-card-sm p-5 flex items-center gap-4 cursor-pointer hover:border-brand-secondary/40 hover:bg-brand-secondary/5 transition-all group"
                          >
                             <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center font-bold text-brand-secondary text-base border border-brand-secondary/20">
                                {admin.name?.charAt(0)}
                             </div>
                             <div className="min-w-0">
                                <p className="text-sm font-bold text-heading group-hover:text-brand-secondary transition-colors truncate">{admin.name}</p>
                                <p className="text-[9px] text-slate-500 font-medium truncate">{admin.email}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Employees */}
                 <div className="space-y-5">
                    <div className="flex items-center gap-3">
                       <div className="h-px flex-1 bg-brand-primary/20"></div>
                       <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] whitespace-nowrap flex items-center gap-2">
                          <User size={12} /> Registered Employees ({employees.length})
                       </p>
                       <div className="h-px flex-1 bg-brand-primary/20"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {employees.map((emp, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedStaff(emp)}
                            className="glass-card-sm p-5 flex items-center gap-4 cursor-pointer hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all group"
                          >
                             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-base border border-brand-primary/20">
                                {emp.name?.charAt(0)}
                             </div>
                             <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start gap-2">
                                   <p className="text-sm font-bold text-heading group-hover:text-brand-primary transition-colors truncate">{emp.name}</p>
                                   {emp.approvedBy && (
                                     <span className="text-[7px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-500/20 uppercase font-black shrink-0">Verified</span>
                                   )}
                                </div>
                                <p className="text-[9px] text-slate-500 font-medium truncate">{emp.email}</p>
                                {emp.approvedBy && (
                                  <p className="text-[7px] text-slate-600 uppercase font-black mt-1">Approved By: {emp.approvedBy.split('@')[0]}</p>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 lg:p-10 border-t border-white/5 bg-white/[0.01]">
                 <button onClick={() => setShowStaffModal(false)} className="w-full btn-primary py-4">Close Registry</button>
              </div>
           </div>
        </div>
      )}

      {/* Individual Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fadeIn">
           <div className="absolute inset-0 bg-backdrop" onClick={() => setSelectedStaff(null)}></div>
           <div className="relative modal-solid w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-[2.5rem] shadow-2xl border-brand-primary/20">
              <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                 <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center font-bold text-2xl border ${
                      selectedStaff.role === 'admin' ? 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                    }`}>
                       {selectedStaff.name?.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-heading tracking-tight">{selectedStaff.name}</h3>
                       <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-1 ${
                         selectedStaff.role === 'admin' ? 'text-brand-secondary' : 'text-brand-primary'
                       }`}>{selectedStaff.role || 'Personnel'} Profile</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedStaff(null)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <DetailItem icon={Mail} label="Email" value={selectedStaff.email} color="brand-primary" />
                    <DetailItem icon={Phone} label="Phone" value={selectedStaff.phone} color="emerald-400" />
                    <DetailItem icon={Briefcase} label="Role" value={selectedStaff.jobRole || (selectedStaff.role === 'admin' ? 'System Administrator' : 'N/A')} color="brand-secondary" />
                    <DetailItem icon={Globe} label="Domain" value={selectedStaff.domain} color="indigo-400" />
                    <DetailItem icon={MapPin} label="Address" value={selectedStaff.address} color="orange-400" />
                 </div>

                 {selectedStaff.bio && (
                   <div className="pt-8 border-t border-white/5">
                      <div className="bg-inner-box border border-white/5 rounded-2xl p-6 space-y-3">
                         <div className="flex items-center gap-3">
                            <FileText size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">About / Background</span>
                         </div>
                         <p className="text-sm text-slate-300 italic leading-relaxed">"{selectedStaff.bio}"</p>
                      </div>
                   </div>
                 )}
                 
                 {selectedStaff.approvedBy && (
                   <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Status</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Approved by {selectedStaff.approvedBy}</span>
                         <Shield size={12} className="text-emerald-400" />
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-10 border-t border-white/5 bg-white/[0.01]">
                 <button onClick={() => setSelectedStaff(null)} className="w-full btn-primary py-4">Close Profile</button>
              </div>
           </div>
        </div>
      )}

      <ImagePreviewOverlay 
        selectedImage={selectedImage} 
        setSelectedImage={setSelectedImage} 
      />

    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, color }) => (
  <div className="space-y-1.5">
     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
        <Icon size={12} className={`text-${color}`} /> {label}
     </p>
     <p className="text-sm font-bold text-heading pl-5">{value || 'Not Provided'}</p>
  </div>
);

export default SuperadminPage;
