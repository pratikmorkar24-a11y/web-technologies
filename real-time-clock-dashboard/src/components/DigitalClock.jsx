import React from 'react';
import { Clock } from 'lucide-react';

export default function DigitalClock({ time, darkMode, timeZone }) {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className={`p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-between h-full shadow-2xl transition-all ${darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Precision Digital Readout
        </span>
        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-mono font-semibold truncate max-w-[180px]">
          {timeZone}
        </span>
      </div>

      <div className="my-auto text-center py-4">
        <div className="text-6xl md:text-8xl font-mono font-extrabold tracking-tight flex justify-center items-center space-x-1">
          <span>{hours}</span>
          <span className="animate-pulse text-cyan-500">:</span>
          <span>{minutes}</span>
          <span className="animate-pulse text-cyan-500">:</span>
          <span className="text-cyan-400">{seconds}</span>
          <span className="text-2xl md:text-3xl ml-3 text-slate-400 font-sans font-bold self-end pb-2">{ampm}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/40 flex justify-between text-xs text-slate-400 font-medium">
        <span>Global Matrix Conversion Active</span>
        <span className="font-mono text-cyan-400">Synced</span>
      </div>
    </div>
  );
}