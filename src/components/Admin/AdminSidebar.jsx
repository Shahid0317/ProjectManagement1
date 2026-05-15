import React from 'react';
import { 
  Shield, Layout, Users, PlusCircle, Briefcase, Activity, LogOut, X 
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, currentUser, handleSignOut, isOpen, setIsOpen }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'employees', label: 'User Management', icon: Users },
    { id: 'project_assignment', label: 'Assign Projects', icon: PlusCircle },
    { id: 'ledger', label: 'Project List', icon: Briefcase },
    { id: 'attendance', label: 'Attendance Logs', icon: Activity },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`fixed lg:relative top-0 left-0 w-80 h-screen glass-card !rounded-none !border-y-0 !border-l-0 flex flex-col z-[70] transition-transform duration-500 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shrink-0`}>
         <div className="p-10 flex items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center shadow-lg">
                 <Shield className="text-brand-primary" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-tighter">Admin Panel</h2>
                 <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em]">System Administration</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-white">
               <X size={20} />
            </button>
         </div>

         <nav className="flex-1 px-6 space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all duration-500 group relative ${
                  activeTab === tab.id 
                    ? 'bg-brand-primary/10 text-white border border-brand-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                 <tab.icon size={20} className={`transition-colors ${activeTab === tab.id ? 'text-brand-primary' : 'group-hover:text-white'}`} />
                 <span className="text-[13px] font-black uppercase tracking-[0.1em] leading-tight">{tab.label}</span>
                 {activeTab === tab.id && (
                   <div className="absolute right-6 w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                 )}
              </button>
            ))}
         </nav>

         <div className="p-8 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-4 px-4 py-4 bg-white/5 border border-white/10 rounded-3xl">
               <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center font-bold text-brand-secondary text-xs border border-brand-secondary/30">
                  {currentUser?.name?.charAt(0) || 'A'}
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase truncate">Administrator</p>
               </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all group"
            >
               <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
               <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
            </button>
         </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
