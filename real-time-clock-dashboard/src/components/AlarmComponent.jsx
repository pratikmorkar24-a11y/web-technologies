import React, { useState, useEffect } from 'react';
import { AlarmClock, Plus, Trash2, BellRing, X } from 'lucide-react';

export default function AlarmComponent({ currentTime, darkMode }) {
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem('chrono_alarms');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [alarmInput, setAlarmInput] = useState('');
  const [ringingAlarm, setRingingAlarm] = useState(null);
  const [dismissedKey, setDismissedKey] = useState(null); // Prevents instant re-triggering

  useEffect(() => {
    localStorage.setItem('chrono_alarms', JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = (e) => {
    e.preventDefault();
    if (!alarmInput) return;

    if (alarms.some(a => a.time === alarmInput)) {
      alert("An alarm for this time already exists!");
      return;
    }

    const newAlarm = { id: Date.now(), time: alarmInput, active: true };
    setAlarms([...alarms, newAlarm]);
    setAlarmInput('');
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const dismissAlarm = () => {
    if (ringingAlarm) {
      // Create a unique key for this specific alarm at this specific minute so it doesn't re-ring immediately
      const currentString = currentTime.toTimeString().slice(0, 5);
      setDismissedKey(`${ringingAlarm.id}-${currentString}`);
      setRingingAlarm(null);
    }
  };

  // Time-matching check loop
  useEffect(() => {
    if (!currentTime) return;

    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const currentString = `${hours}:${minutes}`;

    alarms.forEach(alarm => {
      const matchKey = `${alarm.id}-${currentString}`;
      
      // Trigger only if active, matches time, not currently ringing, and hasn't been dismissed for this minute
      if (
        alarm.active && 
        alarm.time === currentString && 
        !ringingAlarm && 
        dismissedKey !== matchKey
      ) {
        setRingingAlarm(alarm);
      }
    });

    // Reset dismissed key once the minute changes so future alarms can ring normally
    if (dismissedKey && !dismissedKey.endsWith(currentString)) {
      setDismissedKey(null);
    }
  }, [currentTime, alarms, ringingAlarm, dismissedKey]);

  return (
    <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      
      {/* FULL SCREEN POP-UP MODAL WHEN ALARM GOES OFF */}
      {ringingAlarm && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-full text-rose-400 mb-4 animate-bounce">
            <BellRing className="w-12 h-12" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-rose-400 mb-1">Alarm Triggered</span>
          <h3 className="text-4xl font-mono font-extrabold mb-2 text-white">{ringingAlarm.time}</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-xs">Your scheduled chronometer trigger has been reached.</p>
          
          <button 
            type="button"
            onClick={dismissAlarm}
            className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/30 transition-all cursor-pointer flex items-center gap-2 z-50"
          >
            <X className="w-5 h-5" /> Dismiss Alarm
          </button>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
          <AlarmClock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Visual Alarm Matrix</h2>
          <p className="text-xs text-slate-400">Silent pop-up notifications for desktop environments</p>
        </div>
      </div>

      <form onSubmit={addAlarm} className="flex gap-3 mb-6">
        <input 
          type="time" 
          value={alarmInput}
          onChange={(e) => setAlarmInput(e.target.value)}
          className={`flex-1 px-4 py-3 rounded-xl border font-mono text-lg outline-none focus:border-cyan-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
        />
        <button 
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Set Alarm
        </button>
      </form>

      <div className="space-y-3">
        {alarms.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-6">No alarms configured yet.</p>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xl font-bold text-cyan-400">{alarm.time}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Armed</span>
              </div>
              <button 
                type="button"
                onClick={() => deleteAlarm(alarm.id)}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete Alarm"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
