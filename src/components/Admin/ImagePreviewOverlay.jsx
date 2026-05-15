import React from 'react';
import { X } from 'lucide-react';

const ImagePreviewOverlay = ({ selectedImage, setSelectedImage }) => {
  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
        onClick={() => setSelectedImage(null)}
      ></div>
      <div className="relative glass-card bg-surface-main p-3 max-w-6xl w-full animate-zoomIn border-white/20 shadow-glow">
        <button 
          onClick={() => setSelectedImage(null)}
          className="absolute -top-6 -right-6 p-5 bg-brand-primary text-white rounded-[2rem] shadow-2xl hover:bg-white hover:text-brand-primary transition-all duration-500 hover:scale-110 z-10"
        >
          <X size={24} />
        </button>
        <div className="overflow-hidden rounded-[2.5rem] bg-slate-950">
           <img 
             src={selectedImage} 
             alt="Report Visual" 
             className="max-w-full max-h-[80vh] object-contain mx-auto"
           />
        </div>
        <div className="mt-8 pb-4 px-10 w-full flex justify-between items-center">
           <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Operational Asset Verification</p>
              <p className="text-[11px] font-bold text-brand-primary mt-1 uppercase tracking-widest">Decrypted Sector Data</p>
           </div>
           <a 
             href={selectedImage} 
             target="_blank" 
             rel="noopener noreferrer"
             className="btn-secondary !py-4 !px-12 !text-[10px] !bg-none !border !border-white/20 hover:!bg-white/5"
           >
             Original Archive
           </a>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewOverlay;
