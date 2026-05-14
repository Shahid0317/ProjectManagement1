import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Briefcase } from 'lucide-react';
import { 
  getCurrentUser, getProjectsByEmployee, updateProjectStatus, 
  submitWork, submitDelayReason, logoutUser, markAttendance, saveFinalSubmission
} from '../services/mockDb';
import { uploadToCloudinary } from '../services/cloudinary';

// Components
import ThemeToggle from '../components/ThemeToggle';
import EmployeeSidebar from '../components/Employee/EmployeeSidebar';
import EmployeeStats from '../components/Employee/EmployeeStats';
import ProjectCard from '../components/Employee/ProjectCard';
import ProjectBrief from '../components/Employee/ProjectBrief';
import DailyReportForm from '../components/Employee/DailyReportForm';
import EmployeeProjectLedger from '../components/Employee/EmployeeProjectLedger';

const isNearDeadline = (deadline) => {
  if (!deadline) return false;
  const diff = new Date(deadline) - new Date();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 3;
};

const EmployeePage = () => {
  const navigate = useNavigate();
  const currentUser = React.useMemo(() => getCurrentUser(), []);

  // State
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [zipFile, setZipFile] = useState(null);
  const [finalZip, setFinalZip] = useState(null);
  const [finalScreenshots, setFinalScreenshots] = useState([]);
  const [finalDescription, setFinalDescription] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const [delayReasonText, setDelayReasonText] = useState('');
  const [isDelaySubmitted, setIsDelaySubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchProjectData = async () => {
    if (currentUser) {
      const allProjects = await getProjectsByEmployee(currentUser.email);
      setProjects(allProjects.reverse());
      if (!activeProject && allProjects.length > 0) {
        const firstActive = allProjects.find(p => p.status !== 'Completed') || allProjects[0];
        setActiveProject(firstActive);
      }
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? (p.startDate === dateFilter || p.deadline === dateFilter) : true;
    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    fetchProjectData();
    markAttendance();
  }, []);

  // File Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.filter(f => f.type.startsWith('image/'));
    const zips = files.filter(f => f.type.includes('zip'));
    if (imageFiles.length + images.length > 5) return alert("Max 5 images.");
    if (zips.length > 1 || (zipFile && zips.length > 0)) return alert("Max 1 zip.");
    if (images.length > 0) setImageFiles(prev => [...prev, ...images]);
    if (zips.length > 0) setZipFile(zips[0]);
  };

  const removeImage = (index) => setImageFiles(prev => prev.filter((_, i) => i !== index));
  const removeZip = () => setZipFile(null);
  const removeFinalZip = () => setFinalZip(null);

  const handleFinalZipChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('zip')) setFinalZip(file);
    else alert("Invalid ZIP.");
  };

  const handleFinalScreenshotsChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (finalScreenshots.length + files.length > 10) return alert('Max 10 images.');
    setFinalScreenshots(prev => [...prev, ...files]);
  };

  const removeFinalScreenshot = (idx) => setFinalScreenshots(prev => prev.filter((_, i) => i !== idx));

  // Submission Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeProject || !currentUser) return;
    setIsUploading(true);
    const uploadedFiles = [];
    try {
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadProgress(`UPLOADING ${i+1}/${imageFiles.length}...`);
        const url = await uploadToCloudinary(imageFiles[i]);
        uploadedFiles.push({ name: imageFiles[i].name, url, type: 'image' });
      }
      if (zipFile) {
        setUploadProgress(`UPLOADING ARCHIVE...`);
        const url = await uploadToCloudinary(zipFile);
        uploadedFiles.push({ name: zipFile.name, url, type: 'zip' });
      }
      setUploadProgress('SYNCING...');
      await submitWork(currentUser.email, currentUser.name, activeProject.id, activeProject.projectName, description, uploadedFiles);
      setIsSubmitted(true);
      setDescription(''); setImageFiles([]); setZipFile(null);
      fetchProjectData();
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) { alert("Sync Error"); }
    finally { setIsUploading(false); setUploadProgress(''); }
  };

  const handleStatusChange = async (newStatus, projectId = null) => {
    const targetId = projectId || activeProject?.id;
    if (!targetId) return;
    if (!projectId && activeProject) setActiveProject(prev => ({ ...prev, status: newStatus }));
    await updateProjectStatus(targetId, newStatus);
    if (newStatus === 'Completed') {
      const finalImageUrls = [];
      for (const img of finalScreenshots) {
        const url = await uploadToCloudinary(img);
        finalImageUrls.push(url);
      }
      let finalZipUrl = finalZip ? await uploadToCloudinary(finalZip) : null;
      await saveFinalSubmission(targetId, { description: finalDescription, finalImages: finalImageUrls, finalZipUrl });
    }
    fetchProjectData();
  };

  const handleDelaySubmit = async (e) => {
    e.preventDefault();
    if (!activeProject) return;
    await submitDelayReason(activeProject.id, delayReasonText);
    setIsDelaySubmitted(true);
    setDelayReasonText('');
    fetchProjectData();
    setTimeout(() => setIsDelaySubmitted(false), 3000);
  };

  const handleSignOut = () => { logoutUser(); navigate('/'); };

  return (
    <div className="min-h-screen gradient-mesh flex font-body selection:bg-brand-primary/30 selection:text-white overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
         <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-brand-primary/15 rounded-full blur-[160px] animate-float"></div>
         <div className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] bg-brand-secondary/15 rounded-full blur-[140px] animate-float" style={{ animationDelay: '-5s' }}></div>
      </div>

      <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} handleSignOut={handleSignOut} />

      <main className="flex-1 relative z-10 custom-scrollbar overflow-y-auto h-screen bg-slate-950/20 backdrop-blur-3xl">
         
         <header className="sticky top-0 z-30 p-8 lg:p-12 flex justify-between items-center bg-slate-950/40 backdrop-blur-2xl border-b border-white/5">
            <h1 className="text-2xl font-display font-bold text-white tracking-tighter uppercase">
               {activeTab.replace('_', ' ')} <span className="text-brand-primary">Terminal</span>
            </h1>
            <div className="flex items-center gap-6">
               <ThemeToggle />
               <div className="h-10 w-px bg-white/10"></div>
               <div className="flex flex-col items-end text-white">
                  <p className="text-xs font-bold tabular-nums">{new Date().toLocaleDateString()}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Operational Sync: 1:1</p>
               </div>
            </div>
         </header>

         <div className="p-8 lg:p-16 max-w-7xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-16 animate-fadeIn">
                 <EmployeeStats 
                   activeCount={projects.filter(p => p.status !== 'Completed').length} 
                   pendingCount={projects.filter(p => p.delayRequest && !p.delayReason).length} 
                 />
                 <section className="space-y-8">
                    <h2 className="text-xl font-bold text-white tracking-tight">Active Project Sector</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {projects.length === 0 ? (
                         <div className="col-span-full py-20 glass-card flex flex-col items-center justify-center opacity-30">
                            <Briefcase size={48} className="mb-4 text-white" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">No Projects Assigned</p>
                         </div>
                       ) : (
                         projects.map((p) => (
                           <ProjectCard 
                             key={p.id} project={p} isNearDeadline={isNearDeadline} 
                             handleStatusChange={handleStatusChange} 
                             setActiveProject={setActiveProject} setActiveTab={setActiveTab} 
                           />
                         ))
                       )}
                    </div>
                 </section>
              </div>
            )}

            {activeTab === 'work' && (
              <div className="animate-fadeIn">
                 {activeProject ? (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                       <ProjectBrief 
                         activeProject={activeProject} handleStatusChange={handleStatusChange} 
                         delayReasonText={delayReasonText} setDelayReasonText={setDelayReasonText} 
                         handleDelaySubmit={handleDelaySubmit} 
                       />
                       <DailyReportForm 
                         description={description} setDescription={setDescription} 
                         imageFiles={imageFiles} handleFileChange={handleFileChange} removeImage={removeImage} 
                         zipFile={zipFile} removeZip={removeZip} 
                         finalDescription={finalDescription} setFinalDescription={setFinalDescription} 
                         finalScreenshots={finalScreenshots} handleFinalScreenshotsChange={handleFinalScreenshotsChange} removeFinalScreenshot={removeFinalScreenshot} 
                         finalZip={finalZip} handleFinalZipChange={handleFinalZipChange} removeFinalZip={removeFinalZip} 
                         isUploading={isUploading} uploadProgress={uploadProgress} isSubmitted={isSubmitted} 
                         handleSubmit={handleSubmit} activeProject={activeProject} 
                       />
                    </div>
                 ) : (
                    <div className="glass-card p-32 text-center opacity-30 flex flex-col items-center space-y-6">
                       <Layout size={64} className="text-white" />
                       <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Terminal Offline</h3>
                       <button onClick={() => setActiveTab('dashboard')} className="px-10 py-4 bg-brand-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Go to Project Sector</button>
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'archive' && (
              <EmployeeProjectLedger 
                filteredProjects={filteredProjects} searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
                setActiveProject={setActiveProject} setActiveTab={setActiveTab} 
              />
            )}

            <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 pb-16 text-white">
               <p className="text-[11px] font-black uppercase tracking-[0.5em]">Employee Nexus Terminal v9.0.4</p>
               <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest">
                  <span>Connection: Secure</span>
                  <span>Encryption: RSA-4096</span>
               </div>
            </footer>
         </div>
      </main>
    </div>
  );
};

export default EmployeePage;
