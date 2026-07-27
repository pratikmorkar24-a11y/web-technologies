import React from 'react';

export default function AnalogClock({ time, darkMode, timeZone }) {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  return (
    <div className={`p-8 rounded-3xl border flex flex-col items-center justify-center shadow-2xl relative ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
      <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-6">Analog Chronometer</span>
      
      <div className={`w-64 h-64 rounded-full border-4 relative flex items-center justify-center shadow-inner ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
        <div className="w-3 h-3 bg-cyan-400 rounded-full z-30 shadow-md shadow-cyan-500/50" />

        <div 
          className="absolute w-1.5 h-16 bg-white rounded-full origin-bottom z-20 transition-transform duration-100 shadow-md"
          style={{ bottom: '50%', transform: `rotate(${hourDegrees}deg)` }}
        />
        <div 
          className="absolute w-1 h-24 bg-cyan-400 rounded-full origin-bottom z-20 transition-transform duration-100 shadow-md"
          style={{ bottom: '50%', transform: `rotate(${minuteDegrees}deg)` }}
        />
        <div 
          className="absolute w-0.5 h-28 bg-rose-500 rounded-full origin-bottom z-20 transition-transform duration-75"
          style={{ bottom: '50%', transform: `rotate(${secondDegrees}deg)` }}
        />

        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          return (
            <div 
              key={i} 
              className="absolute text-xs font-bold text-slate-500"
              style={{
                transform: `rotate(${angle}deg) translate(0, -96px) rotate(-${angle}deg)`
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-xs text-slate-400 font-mono tracking-widest text-center truncate max-w-[220px]">
        {timeZone.split('/').pop().replace('_', ' ')}
      </div>
    </div>
  );
}