import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Flame } from 'lucide-react';
import { getLeaderboard } from '../services/mockDb';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Polling or fetching on mount. For a real app, this might use websockets or context.
    setLeaders(getLeaderboard());
    
    // Optional: set an interval to refresh if needed, but since it's local,
    // we assume it refreshes on page load or when the parent component re-renders.
  }, []);

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" size={24} />;
      case 1:
        return <Medal className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" size={24} />;
      case 2:
        return <Award className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" size={24} />;
      default:
        return <span className="text-slate-500 font-bold text-lg w-6 text-center">{index + 1}</span>;
    }
  };

  const getRowStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20';
      case 1:
        return 'bg-gradient-to-r from-slate-300/10 to-transparent border-slate-300/20';
      case 2:
        return 'bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/20';
      default:
        return 'bg-slate-900/40 border-white/5';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col h-full max-h-[500px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-xl font-semibold flex items-center gap-3">
          <Flame className="text-orange-500" size={24} />
          Top Performers
        </h2>
        <span className="text-xs font-medium px-2.5 py-1 bg-white/5 text-slate-300 rounded-lg border border-white/10">
          Completed Projects
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {leaders.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No completed projects yet.</p>
        ) : (
          leaders.map((employee, index) => (
            <div 
              key={employee.id} 
              className={`p-4 border rounded-xl flex items-center justify-between transition-all hover:-translate-y-0.5 ${getRowStyle(index)}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5 shadow-inner">
                  {getRankBadge(index)}
                </div>
                <div>
                  <h4 className={`font-semibold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-200' : index === 2 ? 'text-amber-500' : 'text-white'}`}>
                    {employee.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{employee.id}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">{employee.completed}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Projects</span>
              </div>
            </div>
          ))
        )}
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

export default Leaderboard;
