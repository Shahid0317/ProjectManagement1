import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, User, Calendar, Briefcase, Image as ImageIcon, AlertTriangle, Send } from 'lucide-react';
import { getCurrentUser, getProjectsByEmployee, updateProjectStatus, getProjectStatusDynamic, submitWork, submitDelayReason, logoutUser } from '../services/mockDb';
import Leaderboard from '../components/Leaderboard';

const EmployeePage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeProject, setActiveProject] = useState(null);
  
  // Submission State
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Delay Reason State
  const [delayReasonText, setDelayReasonText] = useState('');
  const [isDelaySubmitted, setIsDelaySubmitted] = useState(false);

  const fetchProjectData = () => {
    if (currentUser) {
      const projects = getProjectsByEmployee(currentUser.id);
      // Find the first project that is not completed, or just the latest one
      const active = projects.find(p => p.status !== 'Completed');
      setActiveProject(active || null);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [currentUser]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeProject || !currentUser) return;
    
    submitWork(
      currentUser.id, 
      currentUser.name, 
      activeProject.id, 
      activeProject.projectName, 
      description, 
      file ? file.name : null
    );

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setDescription('');
    setFile(null);
  };

  const handleDelayReasonSubmit = (e) => {
    e.preventDefault();
    if (activeProject && delayReasonText.trim()) {
      submitDelayReason(activeProject.id, delayReasonText);
      setIsDelaySubmitted(true);
      setTimeout(() => {
        setIsDelaySubmitted(false);
        fetchProjectData();
      }, 1500);
    }
  };

  const handleCompleteProject = () => {
    if (activeProject) {
      updateProjectStatus(activeProject.id, 'Completed');
      fetchProjectData();
      window.location.reload(); 
    }
  };

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 sm:p-10 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{currentUser.name}</h1>
              <p className="text-indigo-400 font-medium text-sm mt-1">Employee • {currentUser.id}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="mt-4 md:mt-0 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 bg-slate-800 rounded-lg border border-white/5 hover:border-white/10">
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Current Project Details */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <Briefcase className="text-indigo-400" size={24} />
                <h2 className="text-xl font-semibold">Active Project</h2>
              </div>
              
              {activeProject ? (
                <div className="space-y-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">{activeProject.projectName}</h3>
                    <p className="text-xs text-slate-400 mt-1">Assigned by: {activeProject.adminId}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 shrink-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 flex items-center gap-2"><Calendar size={14}/> Start</span>
                      <span className="text-sm font-medium text-white">{activeProject.startDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 flex items-center gap-2"><Calendar size={14}/> Deadline</span>
                      <span className="text-sm font-medium text-white">{activeProject.deadline}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 mb-4">
                      <span className="text-sm text-slate-400">Status</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        getProjectStatusDynamic(activeProject) === 'Delayed' 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                          : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                      }`}>
                        {getProjectStatusDynamic(activeProject)}
                      </span>
                    </div>

                    {/* Delay Reason Alert UI */}
                    {activeProject.delayReasonRequested && !activeProject.delayReason && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-2">
                        <div className="flex items-center gap-2 text-red-400 font-medium mb-3">
                          <AlertTriangle size={18} />
                          <span className="text-sm">Action Required: Explain Delay</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">
                          Your Admin has requested a reason for why this project is delayed past its deadline.
                        </p>
                        <form onSubmit={handleDelayReasonSubmit} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Type reason here..."
                            value={delayReasonText}
                            onChange={(e) => setDelayReasonText(e.target.value)}
                            required
                            className="w-full bg-slate-900/60 border border-white/10 rounded-lg py-2 px-3 text-sm text-slate-50 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                          />
                          <button 
                            type="submit"
                            disabled={isDelaySubmitted}
                            className={`p-2 rounded-lg text-white transition-colors flex items-center justify-center shrink-0 ${
                              isDelaySubmitted ? 'bg-emerald-500' : 'bg-red-500 hover:bg-red-600'
                            }`}
                          >
                            {isDelaySubmitted ? <CheckCircle size={16} /> : <Send size={16} />}
                          </button>
                        </form>
                      </div>
                    )}

                    {activeProject.delayReason && (
                      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 mt-2">
                        <span className="text-xs text-emerald-400 font-medium block mb-1">You submitted a delay reason:</span>
                        <p className="text-sm text-slate-300 italic">"{activeProject.delayReason}"</p>
                      </div>
                    )}

                    <button 
                      onClick={handleCompleteProject}
                      className="w-full mt-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2"
                    >
                      <CheckCircle size={16} /> Mark as Completed
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                  <Briefcase size={48} className="text-slate-600 mb-4" />
                  <p className="text-slate-400 font-medium">No active projects right now.</p>
                  <p className="text-xs text-slate-500 mt-2">Check back later or contact your admin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Work Submission Form */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col h-[500px]">
            <h2 className="text-xl font-semibold mb-2 shrink-0">Submit Work Update</h2>
            <p className="text-sm text-slate-400 mb-6 shrink-0">Log your completed tasks and upload screenshots for the project manager to review.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 flex flex-col">
              
              {/* Description */}
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-sm font-medium text-slate-300">Work Description</label>
                <textarea 
                  placeholder="Describe what you accomplished today..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full flex-1 min-h-[100px] bg-slate-900/60 border border-white/10 rounded-xl p-4 text-[15px] text-slate-50 transition-all duration-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                ></textarea>
              </div>

              {/* File Upload */}
              <div className="space-y-2 shrink-0">
                <label className="text-sm font-medium text-slate-300">Attach Screenshot</label>
                <div className="relative border-2 border-dashed border-white/20 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 hover:border-indigo-500/50 transition-all group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                      {file ? <ImageIcon className="text-indigo-400" size={20} /> : <Upload className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={20} />}
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      {file ? file.name : "Click to upload"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 shrink-0">
                <button 
                  type="submit" 
                  disabled={isSubmitted || !activeProject}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white flex justify-center items-center gap-2 transition-all duration-300 
                    ${(!activeProject) ? 'bg-slate-700 opacity-50 cursor-not-allowed' 
                    : isSubmitted ? 'bg-emerald-500 shadow-emerald-500/30' 
                    : 'bg-indigo-500 hover:bg-indigo-600 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:-translate-y-0.5'}`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle size={20} />
                      <span>Successfully Submitted</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Submit Work</span>
                    </>
                  )}
                </button>
              </div>
              
            </form>
          </div>

          {/* Leaderboard Component */}
          <Leaderboard />

        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
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

export default EmployeePage;
