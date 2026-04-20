'use client';

import { useState, useEffect } from 'react';
import { Equal, X, Clock, Play, Coffee, History as HistoryIcon, Trash2, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  start: string;
  end: string;
  break: string;
  breakUnit: string;
  result: string;
  timestamp: number;
}

export default function Home() {
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:18');
  const [breakTime, setBreakTime] = useState('0');
  const [breakUnit, setBreakUnit] = useState('minutes');
  const [result, setResult] = useState<{ timeFormatted: string; totalMinutes: number } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  const setCurrentTime = (setter: (val: string) => void) => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setter(`${h}:${m}`);
  };

  const formatTimeStr = (val: string) => {
    if (!val) return '';
    let h = 0;
    let m = 0;

    if (val.includes(':')) {
      const parts = val.split(':');
      h = parseInt(parts[0], 10) || 0;
      m = parseInt(parts[1].slice(0, 2), 10) || 0;
    } else {
      const clean = val.replace(/[^0-9]/g, '');
      if (clean.length === 0) return '';
      if (clean.length <= 2) {
        h = parseInt(clean, 10);
      } else if (clean.length === 3) {
        h = parseInt(clean.slice(0, 1), 10);
        m = parseInt(clean.slice(1, 3), 10);
      } else {
        h = parseInt(clean.slice(0, 2), 10);
        m = parseInt(clean.slice(2, 4), 10);
      }
    }

    if (h > 23) h = 23;
    if (m > 59) m = 59;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const parseTimeToMinutes = (val: string) => {
    const formatted = formatTimeStr(val);
    if (!formatted) return 0;
    const [h, m] = formatted.split(':').map(Number);
    return h * 60 + m;
  };

  const calculate = () => {
    if (!startTime || !endTime) return;

    const startTotalMins = parseTimeToMinutes(startTime);
    let endTotalMins = parseTimeToMinutes(endTime);

    // Cross-day shift logic (08:00 to 07:00 next day)
    if (endTotalMins < startTotalMins) {
      endTotalMins += 24 * 60;
    }

    let breakMins = parseFloat(breakTime) || 0;
    if (breakUnit === 'hours') {
      breakMins *= 60;
    }

    let totalMins = endTotalMins - startTotalMins - breakMins;
    if (totalMins < 0) totalMins = 0;

    const hours = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);

    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    
    setResult({
      timeFormatted,
      totalMinutes: Math.round(totalMins),
    });

    // Add to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      start: formatTimeStr(startTime),
      end: formatTimeStr(endTime),
      break: breakTime,
      breakUnit,
      result: timeFormatted,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]);

    setStartTime(formatTimeStr(startTime));
    setEndTime(formatTimeStr(endTime));
  };

  const clear = () => {
    setStartTime('');
    setEndTime('');
    setBreakTime('0');
    setResult(null);
  };

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Czy na pewno chcesz wyczyścić całą historię?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] p-4 md:p-8 font-sans selection:bg-blue-100 pb-24">
      <div className="max-w-[700px] mx-auto pt-4 md:pt-8">

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 mb-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
            {/* Start Time */}
            <div>
              <label className="flex items-center text-xs font-bold mb-2.5 text-slate-500 uppercase tracking-widest">
                <Play className="w-4 h-4 mr-2 text-blue-500 fill-blue-500" /> Rozpoczęcie
              </label>
              <div className="relative group">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="08:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value.replace(/[^0-9:]/g, ''))}
                  onBlur={() => setStartTime(formatTimeStr(startTime))}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-lg font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all pr-20"
                />
                <button
                  onClick={() => setCurrentTime(setStartTime)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg active:scale-95 transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  TERAZ
                </button>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="flex items-center text-xs font-bold mb-2.5 text-slate-500 uppercase tracking-widest">
                <HistoryIcon className="w-4 h-4 mr-2 text-indigo-500" /> Zakończenie
              </label>
              <div className="relative group">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="16:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value.replace(/[^0-9:]/g, ''))}
                  onBlur={() => setEndTime(formatTimeStr(endTime))}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-lg font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all pr-20"
                />
                <button
                  onClick={() => setCurrentTime(setEndTime)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg active:scale-95 transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  TERAZ
                </button>
              </div>
            </div>
          </div>

          {/* Break Time */}
          <div className="mb-10 bg-slate-50/50 p-5 md:p-6 rounded-2xl border border-slate-100">
            <label className="flex items-center text-xs font-bold mb-4 text-slate-500 uppercase tracking-widest">
              <Coffee className="w-4 h-4 mr-2 text-orange-500" /> Czas przerwy
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min="0"
                value={breakTime}
                onChange={(e) => setBreakTime(e.target.value)}
                className="flex-1 h-14 bg-white border border-slate-200 rounded-xl px-4 text-lg font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
              <select
                value={breakUnit}
                onChange={(e) => setBreakUnit(e.target.value)}
                className="sm:w-36 h-14 bg-white border border-slate-200 rounded-xl px-4 text-base font-semibold focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="minutes">Minuty</option>
                <option value="hours">Godziny</option>
              </select>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={calculate}
              className="flex-[2] min-h-[4rem] bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl flex items-center justify-center text-lg font-bold transition-all shadow-lg shadow-blue-200"
            >
              <Equal className="w-5 h-5 mr-2 stroke-[3]" /> Oblicz czas
            </button>
            <button
              onClick={clear}
              className="flex-1 min-h-[4rem] bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 rounded-2xl flex items-center justify-center text-lg font-bold transition-all"
            >
              <X className="w-5 h-5 mr-2 stroke-[3]" /> Wyczyść
            </button>
          </div>

          {/* Active Result */}
          {result && (
            <div className="mt-12 p-8 bg-blue-600 rounded-3xl text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Clock className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-80">
                  Aktualny Wynik
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center sm:text-left">
                  <div>
                    <div className="text-blue-100 text-xs font-semibold mb-1 uppercase">Format czasu</div>
                    <div className="text-5xl font-black tabular-nums">
                      {result.timeFormatted} <span className="text-2xl font-light">h</span>
                    </div>
                  </div>
                  <div className="sm:border-l sm:border-white/20 sm:pl-8">
                    <div className="text-blue-100 text-xs font-semibold mb-1 uppercase">Łącznie minut</div>
                    <div className="text-5xl font-black tabular-nums">
                      {result.totalMinutes} <span className="text-2xl font-light">min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center mr-3">
                  <HistoryIcon className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Ostatnie wyniki</h2>
              </div>
              <button 
                onClick={clearHistory}
                className="text-sm font-semibold text-slate-400 hover:text-red-500 flex items-center transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Wyczyść
              </button>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-blue-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-bold text-slate-400 w-12 hidden sm:block">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <span>{item.start}</span>
                        <X className="w-3 h-3 mx-2 rotate-45 text-slate-300" />
                        <span>{item.end}</span>
                        {parseFloat(item.break) > 0 && (
                          <span className="ml-2 text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full font-bold">
                            -{item.break}{item.breakUnit === 'minutes' ? 'min' : 'h'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-blue-600">
                      {item.result}
                    </div>
                    <button 
                      onClick={() => removeHistoryItem(item.id)}
                      className="text-slate-300 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
