import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, getProjectsByEmployee, submitWork, 
  updateProjectStatus, saveFinalSubmission, logoutUser, markAttendance,
  getTeamSubmissionStatus
} from '../services/mockDb';
import { uploadToCloudinary } from '../services/cloudinary';
import { compressImage } from '../utils/imageResizer';
import ThemeToggle from '../components/ThemeToggle';
import { Rocket, Shield, Clock, Terminal, ArrowRight, ChevronDown, ChevronUp, Menu } from 'lucide-react';

// Component Imports
import EmployeeSidebar from '../components/Employee/EmployeeSidebar';
import EmployeeStats from '../components/Employee/EmployeeStats';
import ProjectCard from '../components/Employee/ProjectCard';
import ProjectBrief from '../components/Employee/ProjectBrief';
import DailyReportForm from '../components/Employee/DailyReportForm';
import EmployeeProjectLedger from '../components/Employee/EmployeeProjectLedger';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingOverlay from '../components/LoadingOverlay';

const EmployeePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [zipFile, setZipFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [teamStatus, setTeamStatus] = useState([]);
  const [isIndividualOpen, setIsIndividualOpen] = useState(true);
  const [isGroupOpen, setIsGroupOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const isNearDeadline = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const filteredProjects = projects.filter(p => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.id).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const [finalDescription, setFinalDescription] = useState('');
  const [finalScreenshots, setFinalScreenshots] = useState([]);
  const [finalZip, setFinalZip] = useState(null);

  const currentUser = React.useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await getProjectsByEmployee(currentUser.email);
      setProjects(data);
      setIsLoading(false);
    };
    fetchProjects();
    markAttendance();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (activeProject && Array.isArray(activeProject.employeeId) && activeProject.employeeId.length > 1) {
      const fetchStatus = async () => {
        const status = await getTeamSubmissionStatus(activeProject.id, activeProject.employeeId);
        setTeamStatus(status);
      };
      fetchStatus();
    } else {
      setTeamStatus([]);
    }
  }, [activeProject]);

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.filter(f => f.type.startsWith('image/'));
    const zips = files.filter(f => f.type === 'application/zip' || f.name.endsWith('.zip'));
    
    if (images.length > 0) setImageFiles(prev => [...prev, ...images].slice(0, 5));
    if (zips.length > 0) setZipFile(zips[0]);
  };

  const handleFinalScreenshotsChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setFinalScreenshots(prev => [...prev, ...files].slice(0, 10));
  };

  const handleFinalZipChange = (e) => {
    const files = Array.from(e.target.files);
    const zip = files.find(f => f.type === 'application/zip' || f.name.endsWith('.zip'));
    if (zip) setFinalZip(zip);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeProject) return;

    setIsUploading(true);
    setUploadProgress('Analyzing Assets...');
    
    try {
      const imageUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadProgress(`Compressing & Uploading Image ${i + 1}/${imageFiles.length}...`);
        const compressedFile = await compressImage(imageFiles[i]);
        const url = await uploadToCloudinary(compressedFile);
        if (url) imageUrls.push(url);
      }

      let zipUrl = '';
      if (zipFile) {
        setUploadProgress('Uploading Archive...');
        zipUrl = await uploadToCloudinary(zipFile);
      }

      const files = imageUrls.map(url => ({ name: 'Screenshot', url, type: 'image' }));
      if (zipUrl) files.push({ name: 'Project Archive', url: zipUrl, type: 'zip' });

      await submitWork(
        currentUser.email,
        currentUser.name,
        activeProject.id,
        activeProject.projectName,
        description,
        files
      );
      
      if (Array.isArray(activeProject.employeeId) && activeProject.employeeId.length > 1) {
        const status = await getTeamSubmissionStatus(activeProject.id, activeProject.employeeId);
        setTeamStatus(status);
      }
      
      setIsSubmitted(true);
      setDescription('');
      setImageFiles([]);
      setZipFile(null);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!activeProject) return;
    if (status === 'Completed') {
      setIsUploading(true);
      try {
        const finalImages = [];
        for (let i = 0; i < finalScreenshots.length; i++) {
          const url = await uploadToCloudinary(finalScreenshots[i]);
          if (url) finalImages.push(url);
        }

        let finalZipUrl = '';
        if (finalZip) {
          finalZipUrl = await uploadToCloudinary(finalZip);
        }

        const finalData = {
          description: finalDescription,
          finalImages,
          finalZipUrl,
        };

        await saveFinalSubmission(activeProject.id, finalData);
        await updateProjectStatus(activeProject.id, status);
      } catch (error) {
        console.error(error);
      }
    } else {
      await updateProjectStatus(activeProject.id, status);
    }
    
    const data = await getProjectsByEmployee(currentUser.email);
    setProjects(data);
    const updated = data.find(p => p.id === activeProject.id);
    setActiveProject(updated);
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen flex font-body selection:bg-brand-primary/30 selection:text-white overflow-hidden bg-main">
      
      <EmployeeSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        handleSignOut={handleSignOut} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      {isLoading && <LoadingOverlay message="Synchronizing Personnel Data..." />}

      <main className="flex-1 relative z-10 custom-scrollbar overflow-y-auto h-screen bg-surface-main backdrop-blur-3xl">
         
         <header className="sticky top-0 z-30 px-6 py-6 lg:px-12 flex justify-between items-center bg-header backdrop-blur-2xl border-b border-white/5 shadow-sm">
            <div className="flex-1 lg:hidden">
               <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white transition-colors">
                  <Menu size={24} />
               </button>
            </div>
            
            <div className="flex items-center gap-6 flex-1">
                <h1 className="text-2xl font-display font-bold text-heading tracking-tighter capitalize whitespace-nowrap">
                  {activeTab} <span className="text-brand-primary">Portal</span>
                </h1>
            </div>

            <div className="flex items-center justify-end gap-6 flex-1">
               <ThemeToggle />
               <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-heading tabular-nums">{new Date().toLocaleDateString()}</p>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Personnel Secure</p>
               </div>
            </div>
         </header>

         <div className="p-4 sm:p-8 lg:p-16 max-w-7xl mx-auto space-y-12">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-16 animate-fadeIn">
                 {projects.length > 0 ? (
                    <>
                       <EmployeeStats projects={projects} />
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div className="glass-card p-10 space-y-6">
                             <div className="flex items-center gap-4 mb-4">
                                <Clock className="text-brand-primary" size={20} />
                                <h3 className="text-lg font-bold text-heading uppercase tracking-tight">Recent Activity</h3>
                             </div>
                             <div className="space-y-4 opacity-50">
                                <p className="text-xs text-slate-500">System is ready for new logs. Select a project in the Work Console to begin.</p>
                             </div>
                          </div>
                          <div className="glass-card p-10 space-y-6">
                             <div className="flex items-center gap-4 mb-4">
                                <Shield className="text-emerald-400" size={20} />
                                <h3 className="text-lg font-bold text-heading uppercase tracking-tight">Security Status</h3>
                             </div>
                             <p className="text-xs text-emerald-500 font-black uppercase tracking-widest">End-to-End Encryption Enabled</p>
                          </div>
                       </div>
                    </>
                 ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-12 animate-zoomIn">
                       <div className="relative">
                          <div className="w-32 h-32 rounded-[3rem] bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center animate-pulse">
                             <Rocket className="text-brand-primary" size={48} />
                          </div>
                          <div className="absolute -top-4 -right-4 w-12 h-12 bg-inner-box border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                             <Terminal className="text-heading" size={20} />
                          </div>
                       </div>
                       
                       <div className="space-y-4 max-w-lg">
                            <h2 className="text-4xl font-display font-bold text-heading tracking-tighter">
                               Welcome to the <span className="text-brand-primary">Employee Portal</span>, {currentUser.name}
                            </h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                               Your account is now active. Your dashboard is currently empty as no projects have been assigned to you yet.
                            </p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                          <div className="glass-card-sm p-8 text-left space-y-4">
                             <div className="w-10 h-10 rounded-xl bg-inner-box flex items-center justify-center">
                                <Shield className="text-slate-400" size={18} />
                             </div>
                             <h4 className="text-xs font-bold text-heading uppercase tracking-widest">Step 1</h4>
                             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Wait for an Admin to authorize your first project assignment.</p>
                          </div>
                          <div className="glass-card-sm p-8 text-left space-y-4 border-brand-primary/20 bg-brand-primary/5">
                             <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                                <Terminal className="text-brand-primary" size={18} />
                             </div>
                             <h4 className="text-xs font-bold text-heading uppercase tracking-widest">Step 2</h4>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Access "My Tasks" once an assignment is active.</p>
                          </div>
                          <div className="glass-card-sm p-8 text-left space-y-4">
                             <div className="w-10 h-10 rounded-xl bg-inner-box flex items-center justify-center">
                                <Clock className="text-slate-400" size={18} />
                             </div>
                             <h4 className="text-xs font-bold text-heading uppercase tracking-widest">Step 3</h4>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Submit daily updates and final files for review.</p>
                          </div>
                       </div>
                       
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] pt-8">
                           Waiting for assigned projects...
                       </p>
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'work' && (
              <div className="space-y-16 animate-fadeIn">
                 <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                    <div className="xl:col-span-2 space-y-8">
                        <div className="space-y-4">
                           <button 
                             onClick={() => setIsIndividualOpen(!isIndividualOpen)}
                             className="w-full flex items-center justify-between px-6 py-4 glass-card-sm border-white/5 hover:bg-white/[0.03] transition-all group"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                                 <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] group-hover:text-heading transition-colors">Individual Missions</h2>
                              </div>
                              {isIndividualOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                           </button>
                           
                           {isIndividualOpen && (
                             <div className="space-y-6 animate-fadeIn">
                                {projects.filter(p => p.status !== 'Completed' && (!Array.isArray(p.employeeId) || p.employeeId.length <= 1)).length === 0 ? (
                                  <div className="glass-card p-8 text-center opacity-30 border-dashed">
                                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">None Active</p>
                                  </div>
                                ) : (
                                  projects.filter(p => p.status !== 'Completed' && (!Array.isArray(p.employeeId) || p.employeeId.length <= 1)).map(p => (
                                    <ErrorBoundary key={p.id}>
                                      <ProjectCard 
                                        project={p} 
                                        isNearDeadline={isNearDeadline}
                                        handleStatusChange={handleStatusUpdate}
                                        setActiveProject={setActiveProject}
                                        setActiveTab={setActiveTab}
                                      />
                                    </ErrorBoundary>
                                  ))
                                )}
                             </div>
                           )}
                        </div>

                        <div className="space-y-4">
                           <button 
                             onClick={() => setIsGroupOpen(!isGroupOpen)}
                             className="w-full flex items-center justify-between px-6 py-4 glass-card-sm border-white/5 hover:bg-white/[0.03] transition-all group"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full"></div>
                                 <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] group-hover:text-heading transition-colors">Group Delegations</h2>
                              </div>
                              {isGroupOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                           </button>

                           {isGroupOpen && (
                             <div className="space-y-6 animate-fadeIn">
                                {projects.filter(p => p.status !== 'Completed' && Array.isArray(p.employeeId) && p.employeeId.length > 1).length === 0 ? (
                                  <div className="glass-card p-8 text-center opacity-30 border-dashed">
                                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">None Active</p>
                                  </div>
                                ) : (
                                  projects.filter(p => p.status !== 'Completed' && Array.isArray(p.employeeId) && p.employeeId.length > 1).map(p => (
                                    <ErrorBoundary key={p.id}>
                                      <ProjectCard 
                                        project={p} 
                                        isNearDeadline={isNearDeadline}
                                        handleStatusChange={handleStatusUpdate}
                                        setActiveProject={setActiveProject}
                                        setActiveTab={setActiveTab}
                                      />
                                    </ErrorBoundary>
                                  ))
                                )}
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="xl:col-span-3">
                        {activeProject ? (
                          <div className="space-y-10 animate-fadeIn">
                             <ProjectBrief 
                                activeProject={activeProject} 
                                handleStatusUpdate={handleStatusUpdate} 
                                teamStatus={teamStatus}
                              />
                             <DailyReportForm 
                               description={description}
                               setDescription={setDescription}
                               imageFiles={imageFiles}
                               handleFileChange={handleFileChange}
                               removeImage={(idx) => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                               zipFile={zipFile}
                               removeZip={() => setZipFile(null)}
                               finalDescription={finalDescription}
                               setFinalDescription={setFinalDescription}
                               finalScreenshots={finalScreenshots}
                               handleFinalScreenshotsChange={handleFinalScreenshotsChange}
                               removeFinalScreenshot={(idx) => setFinalScreenshots(prev => prev.filter((_, i) => i !== idx))}
                               finalZip={finalZip}
                               handleFinalZipChange={handleFinalZipChange}
                               removeFinalZip={() => setFinalZip(null)}
                               isUploading={isUploading}
                               uploadProgress={uploadProgress}
                               isSubmitted={isSubmitted}
                               handleSubmit={handleSubmit}
                               activeProject={activeProject}
                             />
                          </div>
                        ) : (
                          <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-12 border-dashed border-white/5 opacity-40">
                             <div className="w-20 h-20 rounded-[2rem] bg-inner-box border border-white/10 flex items-center justify-center mb-8">
                                <span className="text-heading font-black text-4xl">?</span>
                             </div>
                             <h3 className="text-xl font-bold text-heading mb-3">Initialize Mission Interface</h3>
                             <p className="text-[10px] font-black uppercase tracking-widest leading-loose max-w-xs text-slate-500">Select a project from the left panel to begin operational logging and resource submission.</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'archive' && (
              <ErrorBoundary>
                <EmployeeProjectLedger 
                  filteredProjects={filteredProjects}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setActiveProject={setActiveProject}
                  setActiveTab={setActiveTab}
                />
              </ErrorBoundary>
            )}

            <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 pb-16 text-center md:text-left">
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-heading">Personnel Link established • Secure Sync Active</p>
               <div className="flex gap-12">
                  <span className="text-[10px] font-black uppercase tracking-widest text-heading">Protocol v4.2.0</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-heading">Encrypted Session</span>
               </div>
            </footer>
         </div>
      </main>
    </div>
  );
};

export default EmployeePage;
