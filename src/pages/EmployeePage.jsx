import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, getProjectsByEmployee, submitWork, 
  updateProjectStatus, saveFinalSubmission, logoutUser, markAttendance,
  getTeamSubmissionStatus, requestProjectExtension, requestSubmissionPermission, getSubmissions,
  submitDelayReason, getAdminNameMap
} from '../services/mockDb';
import { uploadToCloudinary } from '../services/cloudinary';
import { compressImage } from '../utils/imageResizer';
import ThemeToggle from '../components/ThemeToggle';
import { Rocket, Shield, Clock, Terminal, ArrowRight, ChevronDown, ChevronUp, Menu, Key, Database, Radio, FileText, CheckCircle2, Bell, AlertTriangle } from 'lucide-react';

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
  const [workingDays, setWorkingDays] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [zipFile, setZipFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('employeeActiveTab') || 'dashboard';
  });
  const [delayReasonText, setDelayReasonText] = useState('');

  const getAlerts = () => {
    const list = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    projects.forEach(proj => {
      if (proj.status === 'Completed') return;

      const deadlineDate = new Date(proj.deadline);
      const isPassed = deadlineDate < today;
      
      const timeDiff = deadlineDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // 1. Approved Extension Notification
      if (proj.extensionApproved && proj.extensionDays) {
         list.push({
            id: 'ext-' + proj.id,
            type: 'success',
            title: 'Extension Approved',
            message: '+' + proj.extensionDays + ' Days granted for "' + proj.projectName + '"',
            date: proj.deadline
         });
      }

      // 2. Approved Late Submission Notification
      if (proj.submissionPermissionApproved) {
         list.push({
            id: 'sub-' + proj.id,
            type: 'success',
            title: 'Late Submission Approved',
            message: 'Upload permissions unlocked for "' + proj.projectName + '"',
            date: proj.deadline
         });
      }

      // 3. Deadline alerts
      if (isPassed) {
         list.push({
            id: 'overdue-' + proj.id,
            type: 'danger',
            title: 'Deadline Overdue',
            message: '"' + proj.projectName + '" has passed its submission deadline!',
            date: proj.deadline
         });
      } else if (daysDiff <= 2 && daysDiff >= 0) {
         list.push({
            id: 'near-' + proj.id,
            type: 'warning',
            title: 'Approaching Deadline',
            message: '"' + proj.projectName + '" is due in ' + (daysDiff === 0 ? 'today' : daysDiff === 1 ? '1 day' : daysDiff + ' days') + '!',
            date: proj.deadline
         });
      }

      // 4. New Mission Assigned
      const hasReport = submissions.some(s => s.projectId === proj.id);
      if (!hasReport && proj.status === 'Ongoing') {
         list.push({
            id: 'new-' + proj.id,
            type: 'info',
            title: 'New Mission Assigned',
            message: '"' + proj.projectName + '" is active. Please start daily logs.',
            date: proj.assignedDate || 'Recent'
         });
      }

      // 5. Daily report overdue alert for 4+ days
      const projectSubmissions = submissions.filter(s => s.projectId === proj.id);
      let lastActivityTimestamp = 0;
      if (projectSubmissions.length > 0) {
         lastActivityTimestamp = Math.max(...projectSubmissions.map(s => s.timestamp || 0));
      } else {
         if (proj.startDate) {
            lastActivityTimestamp = new Date(proj.startDate).getTime();
         } else {
            lastActivityTimestamp = parseInt(proj.id) || Date.now();
         }
      }
      const diffTimeAlert = Date.now() - lastActivityTimestamp;
      const diffDaysAlert = Math.floor(diffTimeAlert / (1000 * 60 * 60 * 24));
      
      if (diffDaysAlert >= 4 && !proj.delayReason) {
         list.push({
            id: 'overdue-reports-' + proj.id,
            type: 'warning',
            title: 'Daily Report Overdue (4+ Days)',
            message: `No updates submitted for "${proj.projectName}" in ${diffDaysAlert} days. Please upload a report or submit a delay explanation.`,
            date: proj.startDate || 'N/A',
            projectId: proj.id
         });
      }
    });

    return list;
  };

  useEffect(() => {
    localStorage.setItem('employeeActiveTab', activeTab);
  }, [activeTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [teamStatus, setTeamStatus] = useState([]);
  const [isIndividualOpen, setIsIndividualOpen] = useState(true);
  const [isGroupOpen, setIsGroupOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const fetchProjects = async () => {
    if (!currentUser) return;
    try {
      const [projData, subData] = await Promise.all([
        getProjectsByEmployee(currentUser.email),
        getSubmissions(currentUser)
      ]);
      setProjects(projData);
      const sortedSubs = [...subData].sort((a, b) => b.timestamp - a.timestamp);
      setSubmissions(sortedSubs);
      const uniqueDays = new Set(subData.map(s => s.date)).size;
      setWorkingDays(uniqueDays);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
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

  useEffect(() => {
    if (activeProject) {
      setFinalDescription(activeProject.finalSubmission?.description || '');
      setFinalScreenshots([]);
      setFinalZip(null);
    } else {
      setFinalDescription('');
      setFinalScreenshots([]);
      setFinalZip(null);
    }
  }, [activeProject]);

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.filter(f => f.type.startsWith('image/'));
    const zips = files.filter(f => f.type === 'application/zip' || f.name.toLowerCase().endsWith('.zip'));
    
    if (images.length > 0) setImageFiles(prev => [...prev, ...images].slice(0, 5));
    if (zips.length > 0) setZipFile(zips[0]);
  };

  const handleFinalScreenshotsChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setFinalScreenshots(prev => [...prev, ...files].slice(0, 10));
  };

  const handleFinalZipChange = (e) => {
    const files = Array.from(e.target.files);
    const zip = files.find(f => f.type === 'application/zip' || f.name.toLowerCase().endsWith('.zip'));
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
        currentUser.uid || currentUser.email,
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
    setIsLoading(true);
    
    if (status === 'Completed') {
      setIsUploading(true);
      setUploadProgress('Preparing Files...');
      try {
        // Validation checks
        for (let i = 0; i < finalScreenshots.length; i++) {
          if (!finalScreenshots[i] || finalScreenshots[i].size === 0) {
            throw new Error(`Screenshot "${finalScreenshots[i]?.name || i}" is empty (0 bytes). Please select a valid image.`);
          }
        }

        if (finalZip) {
          if (finalZip.size === 0) {
            throw new Error(`ZIP file "${finalZip.name}" is empty (0 bytes). Please select a valid ZIP archive.`);
          }
          if (finalZip.size > 10 * 1024 * 1024) { // 10 MB limit for raw files on free preset
            throw new Error(`ZIP file "${finalZip.name}" is too large (${(finalZip.size / (1024 * 1024)).toFixed(2)} MB). Cloudinary limit is 10 MB. Please reduce the size or upload a smaller ZIP archive.`);
          }
        }

        const finalImages = [];
        for (let i = 0; i < finalScreenshots.length; i++) {
          setUploadProgress(`Uploading screenshot ${i + 1}/${finalScreenshots.length}...`);
          // Compress the image before uploading to Cloudinary to prevent Bad Request errors due to payload size
          const compressed = await compressImage(finalScreenshots[i]);
          const url = await uploadToCloudinary(compressed);
          if (url) finalImages.push(url);
        }

        let finalZipUrl = activeProject.finalSubmission?.finalZipUrl || '';
        if (finalZip) {
          setUploadProgress('Uploading ZIP archive...');
          const url = await uploadToCloudinary(finalZip);
          if (url) finalZipUrl = url;
        }

        setUploadProgress('Saving final work details...');
        const finalData = {
          description: finalDescription,
          finalImages: finalImages.length > 0 ? finalImages : (activeProject.finalSubmission?.finalImages || []),
          finalZipUrl: finalZipUrl || null,
          submittedAt: new Date().toLocaleDateString('en-GB') // formats as DD/MM/YYYY
        };

        await saveFinalSubmission(activeProject.id, finalData);
        await updateProjectStatus(activeProject.id, status);
        setUploadProgress('Submission successful!');
        alert('Files have submitted successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to submit final work: ' + error.message);
        setUploadProgress('Submission failed.');
      } finally {
        setIsUploading(false);
        setUploadProgress('');
      }
    } else {
      try {
        await updateProjectStatus(activeProject.id, status);
      } catch (error) {
        console.error(error);
        alert('Failed to update status: ' + error.message);
      }
    }
    
    try {
      const data = await getProjectsByEmployee(currentUser.email);
      setProjects(data);
      const updated = data.find(p => p.id === activeProject.id);
      setActiveProject(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelaySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!activeProject || !delayReasonText.trim()) return;
    setIsLoading(true);
    try {
      await submitDelayReason(activeProject.id, delayReasonText.trim());
      const data = await getProjectsByEmployee(currentUser.email);
      setProjects(data);
      const updated = data.find(p => p.id === activeProject.id);
      setActiveProject(updated);
      setDelayReasonText('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtensionSubmit = async (projectId, extensionDate, extensionReason) => {
    if (!activeProject) return;
    setIsLoading(true);
    try {
      const deadline = new Date(activeProject.deadline);
      const extension = new Date(extensionDate);
      const diffTime = extension - deadline;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const originalDeadline = activeProject.originalDeadline || activeProject.deadline;
      
      await requestProjectExtension(projectId, diffDays, extensionDate, extensionReason, originalDeadline);
      
      const data = await getProjectsByEmployee(currentUser.email);
      setProjects(data);
      const updated = data.find(p => p.id === activeProject.id);
      setActiveProject(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmissionPermissionSubmit = async (projectId, extensionDate, extensionReason) => {
    if (!activeProject) return;
    setIsLoading(true);
    try {
      const deadline = new Date(activeProject.deadline);
      const extension = new Date(extensionDate);
      const diffTime = extension - deadline;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const originalDeadline = activeProject.originalDeadline || activeProject.deadline;

      await requestSubmissionPermission(projectId, diffDays, extensionDate, extensionReason, originalDeadline);
      const data = await getProjectsByEmployee(currentUser.email);
      setProjects(data);
      const updated = data.find(p => p.id === activeProject.id);
      setActiveProject(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
                       <EmployeeStats projects={projects} workingDays={workingDays} setActiveTab={setActiveTab} setActiveProject={setActiveProject} />
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                           <div className="glass-card p-10 space-y-6">
                              <div className="flex items-center gap-4 mb-4">
                                 <Clock className="text-brand-primary" size={20} />
                                 <h3 className="text-lg font-bold text-heading uppercase tracking-tight">Recent Activity</h3>
                              </div>
                              {submissions.length > 0 ? (
                                 <div className="space-y-4 max-h-[17rem] overflow-y-auto custom-scrollbar pr-2">
                                    {submissions.slice(0, 3).map((sub, idx) => (
                                       <div key={sub.id || idx} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group/sub">
                                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 text-brand-primary group-hover/sub:scale-110 transition-transform">
                                             <FileText size={18} />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-xs font-bold text-heading truncate">{sub.projectName}</h4>
                                                <span className="text-[9px] font-medium text-slate-500 shrink-0">{sub.date}</span>
                                             </div>
                                             <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{sub.description || 'Daily update report submitted'}</p>
                                             {sub.files && sub.files.length > 0 && (
                                                <span className="inline-flex items-center gap-1 text-[8px] font-black text-brand-primary uppercase tracking-wider mt-1.5 bg-brand-primary/10 px-2 py-0.5 rounded-md border border-brand-primary/20">
                                                   +{sub.files.length} Attachments
                                                </span>
                                             )}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <div className="flex flex-col items-center justify-center text-center py-10 space-y-3 opacity-60">
                                    <Clock className="text-slate-500 animate-pulse" size={28} />
                                    <p className="text-xs text-slate-400 font-medium">No recent logs submitted yet.</p>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Select a project in My Tasks to start.</p>
                                 </div>
                              )}
                           </div>
                           <div className="glass-card p-10 space-y-6">
                              <div className="flex items-center justify-between gap-4 mb-4">
                                 <div className="flex items-center gap-4">
                                    <Bell className="text-brand-primary" size={20} />
                                    <h3 className="text-lg font-bold text-heading uppercase tracking-tight">Alerts & Notifications</h3>
                                 </div>
                                 {getAlerts().length > 0 && (
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-black text-white bg-brand-primary rounded-full animate-pulse">
                                       {getAlerts().length} Active
                                    </span>
                                 )}
                              </div>
                              
                              {getAlerts().length > 0 ? (
                                 <div className="space-y-4 max-h-[17rem] overflow-y-auto custom-scrollbar pr-2">
                                    {getAlerts().map((alert) => (
                                        <div 
                                           key={alert.id} 
                                           onClick={() => {
                                              if (alert.projectId) {
                                                 const p = projects.find(proj => proj.id === alert.projectId);
                                                 if (p) {
                                                    setActiveProject(p);
                                                    setActiveTab('projects');
                                                 }
                                              }
                                           }}
                                           className={`flex gap-3 p-4 rounded-2xl border transition-all ${alert.projectId ? 'cursor-pointer hover:border-white/20 hover:bg-white/[0.04]' : ''} ${
                                              alert.type === 'danger'
                                                 ? 'bg-rose-950/15 border-rose-500/20 text-rose-200'
                                                 : alert.type === 'warning'
                                                 ? 'bg-amber-950/15 border-amber-500/20 text-amber-200'
                                                 : alert.type === 'success'
                                                 ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-200'
                                                 : 'bg-blue-950/15 border-blue-500/20 text-blue-200'
                                           }`}
                                       >
                                          <div className={`mt-0.5 shrink-0 ${
                                             alert.type === 'danger'
                                                ? 'text-rose-400'
                                                : alert.type === 'warning'
                                                ? 'text-amber-400'
                                                : alert.type === 'success'
                                                ? 'text-emerald-400'
                                                : 'text-blue-400'
                                          }`}>
                                             {alert.type === 'danger' && <AlertTriangle size={16} />}
                                             {alert.type === 'warning' && <AlertTriangle size={16} />}
                                             {alert.type === 'success' && <CheckCircle2 size={16} />}
                                             {alert.type === 'info' && <Bell size={16} />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold uppercase tracking-tight">{alert.title}</p>
                                                <span className="text-[8px] opacity-65 font-medium shrink-0">{alert.date}</span>
                                             </div>
                                             <p className="text-[11px] mt-1 font-medium leading-relaxed opacity-85">{alert.message}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <div className="flex flex-col items-center justify-center text-center py-10 space-y-3 opacity-60">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                                       <CheckCircle2 size={20} />
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">All systems nominal</p>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">No pending alerts or notifications</p>
                                 </div>
                              )}
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
                                 handleExtensionSubmit={handleExtensionSubmit}
                                 handleSubmissionPermissionSubmit={handleSubmissionPermissionSubmit}
                                 submissions={submissions}
                                 delayReasonText={delayReasonText}
                                 setDelayReasonText={setDelayReasonText}
                                 handleDelaySubmit={handleDelaySubmit}
                              />
                             <DailyReportForm 
                                handleStatusUpdate={handleStatusUpdate}
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
                  fetchData={fetchProjects}
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
