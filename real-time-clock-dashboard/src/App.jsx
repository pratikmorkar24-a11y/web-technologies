import React, { useState, useEffect } from "react";
import { Clock, Activity, Sun, Moon, Globe } from "lucide-react";
import DigitalClock from "./components/DigitalClock";
import AnalogClock from "./components/AnalogClock";
import AlarmComponent from "./components/AlarmComponent";

export default function App() {
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const studentDetails = [
    { label: "Name", value: "Pratik Morkar" },
    { label: "Class", value: "TY-CS-H" },
    { label: "PRN", value: "12410961" },
    { label: "Roll No.", value: "19" },
  ];

  const timeZones = [
    {
      label: "Local System Time",
      value: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    { label: "UTC / Greenwich", value: "UTC" },
    { label: "New York (EST/EDT)", value: "America/New_York" },
    { label: "London (GMT/BST)", value: "Europe/London" },
    { label: "Tokyo (JST)", value: "Asia/Tokyo" },
    { label: "Sydney (AEST/AEDT)", value: "Australia/Sydney" },
    { label: "Dubai (GST)", value: "Asia/Dubai" },
    { label: "Mumbai (IST)", value: "Asia/Kolkata" },
  ];

  // High-performance ticker updated every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute time based on the selected time zone
  const getZoneTime = (date) => {
    try {
      return new Date(
        date.toLocaleString("en-US", { timeZone: selectedTimeZone }),
      );
    } catch (e) {
      return date; // Fallback
    }
  };

  const activeTime = getZoneTime(time);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <header
        className={`border-b px-6 py-4 flex flex-wrap justify-between items-center gap-4 backdrop-blur-md sticky top-0 z-50 ${darkMode ? "border-slate-800 bg-slate-950/80" : "border-slate-200 bg-white/80"}`}>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20'>
            <Activity className='w-6 h-6 animate-pulse' />
          </div>
          <div>
            <h1 className='text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
              CHRONO-X DASHBOARD
            </h1>
            <p className='text-xs text-slate-400 font-medium'>
              Real-Time Advanced Telemetry & Time Matrix
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-700"}`}>
            <Globe className='w-4 h-4 text-cyan-400' />
            <select
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
              className='bg-transparent text-xs font-semibold outline-none cursor-pointer'>
              {timeZones.map((tz) => (
                <option
                  key={tz.value}
                  value={tz.value}
                  className={
                    darkMode ? "bg-slate-900 text-white" : "bg-white text-black"
                  }>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`flex rounded-xl p-1 border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "overview" ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-white"}`}>
              Overview
            </button>
            <button
              onClick={() => setActiveTab("alarms")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "alarms" ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-white"}`}>
              Alarms & Triggers
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${darkMode ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"}`}
            title='Toggle Theme'>
            {darkMode ? (
              <Sun className='w-5 h-5' />
            ) : (
              <Moon className='w-5 h-5' />
            )}
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className='max-w-7xl mx-auto p-6 md:p-8'>
        <section
          className={`mb-6 p-5 rounded-2xl border ${darkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
          aria-label='Student details'>
          <div className='flex flex-wrap items-center gap-x-6 gap-y-4'>
            <h2 className='text-xs font-bold uppercase tracking-widest text-cyan-400'>
              Student Details
            </h2>
            {studentDetails.map((detail) => (
              <div key={detail.label} className='min-w-[100px]'>
                <span className='block text-xs text-slate-400 font-semibold uppercase tracking-wider'>
                  {detail.label}
                </span>
                <p className='mt-1 text-sm font-bold'>{detail.value}</p>
              </div>
            ))}
          </div>
        </section>

        {activeTab === "overview" ? (
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
            {/* Digital Clock Matrix Widget */}
            <div className='lg:col-span-7 flex flex-col justify-center'>
              <DigitalClock
                time={activeTime}
                darkMode={darkMode}
                timeZone={selectedTimeZone}
              />
            </div>

            {/* Analog Clock Face Widget */}
            <div className='lg:col-span-5 flex justify-center items-center'>
              <AnalogClock
                time={activeTime}
                darkMode={darkMode}
                timeZone={selectedTimeZone}
              />
            </div>

            {/* Quick Live Telemetry Bar */}
            <div
              className={`lg:col-span-12 p-6 rounded-2xl border grid grid-cols-2 md:grid-cols-4 gap-4 ${darkMode ? "bg-slate-900/50 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"}`}>
              <div>
                <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider'>
                  Date Code
                </span>
                <p className='text-lg font-bold mt-1'>
                  {activeTime.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider'>
                  Epoch Seconds
                </span>
                <p className='text-lg font-mono font-bold mt-1 text-cyan-400'>
                  {Math.floor(time.getTime() / 1000)}
                </p>
              </div>
              <div>
                <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider'>
                  Active Timezone
                </span>
                <p
                  className='text-sm font-mono font-bold mt-1 text-cyan-300 truncate'
                  title={selectedTimeZone}>
                  {selectedTimeZone}
                </p>
              </div>
              <div>
                <span className='text-xs text-slate-400 font-semibold uppercase tracking-wider'>
                  System Status
                </span>
                <div className='flex items-center space-x-2 mt-1'>
                  <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping' />
                  <p className='text-sm font-bold text-emerald-400'>
                    Synchronized
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='max-w-xl mx-auto'>
            <AlarmComponent currentTime={activeTime} darkMode={darkMode} />
          </div>
        )}
      </main>
    </div>
  );
}
