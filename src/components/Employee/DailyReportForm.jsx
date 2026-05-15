import React from 'react';
import { Send, Upload, X, Paperclip, Zap } from 'lucide-react';

const DailyReportForm = ({
  description,
  setDescription,
  imageFiles,
  handleFileChange,
  removeImage,
  zipFile,
  removeZip,
  finalDescription,
  setFinalDescription,
  finalScreenshots,
  handleFinalScreenshotsChange,
  removeFinalScreenshot,
  finalZip,
  handleFinalZipChange,
  removeFinalZip,
  isUploading,
  uploadProgress,
  isSubmitted,
  handleSubmit,
  activeProject
}) => {
  return (
    <div className="xl:col-span-3 space-y-8">
       {/* ── PANEL 1: DAILY UPDATE ── */}
       <div className="glass-card p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-indigo-400 to-transparent opacity-60"></div>
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-5">
                <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-xl">
                   <Send className="text-brand-primary" size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Daily Update</h2>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-0.5">What did you do today?</p>
                </div>
             </div>
             {isSubmitted && (
               <span className="px-5 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-brand-primary text-[10px] font-black uppercase tracking-widest animate-zoomIn">
                 Sent
               </span>
             )}
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Report</label>
                <textarea 
                  placeholder="WRITE YOUR UPDATE HERE..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="input-luxury h-48 py-6 leading-relaxed"
                />
             </div>

             <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                   <span>Upload Files (Screenshots/ZIP)</span>
                   <span className="text-slate-600">Max: 5/1</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="relative group h-40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02] hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all">
                      <input type="file" multiple accept="image/*,application/zip" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <Upload className="text-slate-500 group-hover:text-brand-primary mb-3" size={32} />
                      <p className="text-[10px] font-black text-slate-500 uppercase">Click to upload</p>
                   </div>
                   <div className="flex flex-wrap gap-3 overflow-y-auto max-h-40 p-2">
                      {imageFiles.map((file, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden group border border-white/10">
                           <img src={URL.createObjectURL(file)} alt="asset" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><X size={16} className="text-white" /></button>
                        </div>
                      ))}
                      {zipFile && (
                        <div className="relative w-16 h-16 rounded-xl bg-slate-800 flex flex-col items-center justify-center border border-brand-primary/30 group">
                           <Paperclip className="text-brand-primary mb-1" size={16} />
                           <p className="text-[8px] font-bold text-brand-primary">ZIP</p>
                           <button type="button" onClick={removeZip} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-xl"><X size={16} className="text-white" /></button>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <button type="submit" disabled={isUploading} className={`w-full py-6 bg-brand-primary text-white rounded-3xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(99,102,241,0.2)] ${isUploading ? 'opacity-50' : ''}`}>
                {isUploading ? uploadProgress : 'Submit Daily Update'}
             </button>
          </form>
       </div>

       {/* ── PANEL 2: FINAL SUBMISSION ── */}
       <div className="glass-card p-10 lg:p-12 relative overflow-hidden border-emerald-500/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent opacity-60"></div>
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-5">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                   <Zap className="text-emerald-400" size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Final Submission</h2>
                   <p className="text-[9px] font-black text-emerald-500/70 uppercase tracking-[0.3em] mt-0.5">Finish project and submit work</p>
                </div>
             </div>
             {activeProject.status === 'Completed' && (
               <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[9px] font-black uppercase tracking-widest">Submitted</span>
             )}
          </div>
          <div className="space-y-6">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Final Work Description</label>
                <textarea
                   placeholder="EXPLAIN WHAT YOU ARE SUBMITTING..."
                   value={finalDescription}
                   onChange={(e) => setFinalDescription(e.target.value)}
                   className="input-luxury h-24 text-xs leading-relaxed"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Final Screenshots <span className="text-slate-600">(Max 10)</span></label>
                <div className="relative group h-28 border-2 border-dashed border-emerald-500/15 rounded-3xl flex flex-col items-center justify-center bg-emerald-500/[0.02] hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all">
                   <input type="file" multiple accept="image/*" onChange={handleFinalScreenshotsChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                   <Upload className="text-slate-600 group-hover:text-emerald-400 mb-2" size={22} />
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Upload Final Screenshots</p>
                </div>
                {finalScreenshots.length > 0 && (
                   <div className="flex flex-wrap gap-2 pt-1">
                      {finalScreenshots.map((file, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden group border border-emerald-500/20">
                           <img src={URL.createObjectURL(file)} alt="final" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => removeFinalScreenshot(idx)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><X size={14} className="text-white" /></button>
                        </div>
                      ))}
                   </div>
                )}
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Final Project ZIP File <span className="text-slate-600">(ZIP)</span></label>
                <div className="relative group h-24 border-2 border-dashed border-emerald-500/15 rounded-3xl flex flex-col items-center justify-center bg-emerald-500/[0.02] hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all">
                   <input type="file" accept="application/zip" onChange={handleFinalZipChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                   {finalZip ? (
                     <div className="flex flex-col items-center animate-zoomIn">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 mb-1">
                           <Paperclip className="text-emerald-400" size={16} />
                        </div>
                        <p className="text-[9px] font-bold text-white uppercase truncate max-w-[180px]">{finalZip.name}</p>
                        <button type="button" onClick={removeFinalZip} className="text-[8px] font-black text-red-400 uppercase mt-1 hover:text-red-300">Remove</button>
                     </div>
                   ) : (
                     <>
                        <Upload className="text-slate-600 group-hover:text-emerald-400 mb-1" size={22} />
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Upload Final Project ZIP</p>
                     </>
                   )}
                </div>
             </div>
             <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                   Click <span className="text-emerald-400 font-black">Completed</span> in the project details section to submit your final work
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default DailyReportForm;
