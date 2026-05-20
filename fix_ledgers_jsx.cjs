const fs = require('fs');
const path = require('path');

// 1. Fix GlobalProjectLedger.jsx
const globalPath = path.join(__dirname, 'src', 'components', 'Superadmin', 'GlobalProjectLedger.jsx');
let globalContent = fs.readFileSync(globalPath, 'utf8');

// We appended it outside the section, let's fix it by bringing the modal inside the </section>
const globalWrongPattern = `     </section>

     {/* Reopen Reason Modal */}
     {activeReopenReason && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setActiveReopenReason(null)}>
           <div className="glass-card max-w-md w-full p-8 space-y-6 relative border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tight">Reopen Reason</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeReopenReason.projectName}</p>
              </div>
              <div className="p-6 bg-inner-box/50 border border-white/5 rounded-2xl">
                 <p className="text-xs text-emerald-400 font-medium leading-relaxed italic">
                    "{activeReopenReason.reason}"
                 </p>
              </div>
              <button 
                 onClick={() => setActiveReopenReason(null)}
                 className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
              >
                 Close
              </button>
           </div>
        </div>
     )}
  ;`;

const globalCorrectPattern = `
     {/* Reopen Reason Modal */}
     {activeReopenReason && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setActiveReopenReason(null)}>
           <div className="glass-card max-w-md w-full p-8 space-y-6 relative border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tight">Reopen Reason</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeReopenReason.projectName}</p>
              </div>
              <div className="p-6 bg-inner-box/50 border border-white/5 rounded-2xl">
                 <p className="text-xs text-emerald-400 font-medium leading-relaxed italic">
                    "{activeReopenReason.reason}"
                 </p>
              </div>
              <button 
                 onClick={() => setActiveReopenReason(null)}
                 className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
              >
                 Close
              </button>
           </div>
        </div>
     )}
     </section>
  );`;

if (globalContent.includes(globalWrongPattern)) {
  globalContent = globalContent.replace(globalWrongPattern, globalCorrectPattern);
  fs.writeFileSync(globalPath, globalContent, 'utf8');
  console.log('SUCCESS: GlobalProjectLedger.jsx JSX nesting fixed.');
} else {
  console.log('ERROR: Could not find wrong pattern in GlobalProjectLedger.jsx');
}

// 2. Fix ProjectLedger.jsx
const adminPath = path.join(__dirname, 'src', 'components', 'Admin', 'ProjectLedger.jsx');
let adminContent = fs.readFileSync(adminPath, 'utf8');

const adminWrongPattern = `     </section>

     {/* Reopen Reason Modal */}
     {activeReopenReason && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setActiveReopenReason(null)}>
           <div className="glass-card max-w-md w-full p-8 space-y-6 relative border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tight">Reopen Reason</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeReopenReason.projectName}</p>
              </div>
              <div className="p-6 bg-inner-box/50 border border-white/5 rounded-2xl">
                 <p className="text-xs text-emerald-400 font-medium leading-relaxed italic">
                    "{activeReopenReason.reason}"
                 </p>
              </div>
              <button 
                 onClick={() => setActiveReopenReason(null)}
                 className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
              >
                 Close
              </button>
           </div>
        </div>
     )}
  ;`;

const adminCorrectPattern = `
     {/* Reopen Reason Modal */}
     {activeReopenReason && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setActiveReopenReason(null)}>
           <div className="glass-card max-w-md w-full p-8 space-y-6 relative border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tight">Reopen Reason</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeReopenReason.projectName}</p>
              </div>
              <div className="p-6 bg-inner-box/50 border border-white/5 rounded-2xl">
                 <p className="text-xs text-emerald-400 font-medium leading-relaxed italic">
                    "{activeReopenReason.reason}"
                 </p>
              </div>
              <button 
                 onClick={() => setActiveReopenReason(null)}
                 className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-primary/10"
              >
                 Close
              </button>
           </div>
        </div>
     )}
     </section>
  );`;

if (adminContent.includes(adminWrongPattern)) {
  adminContent = adminContent.replace(adminWrongPattern, adminCorrectPattern);
  fs.writeFileSync(adminPath, adminContent, 'utf8');
  console.log('SUCCESS: ProjectLedger.jsx JSX nesting fixed.');
} else {
  console.log('ERROR: Could not find wrong pattern in ProjectLedger.jsx');
}
