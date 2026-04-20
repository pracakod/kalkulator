'use client';

import { useState } from 'react';
import { Equal, X, Clock, Play, GraduationCap as Finish, Coffee, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:18');
  const [breakTime, setBreakTime] = useState('0');
  const [breakUnit, setBreakUnit] = useState('minutes');
  const [result, setResult] = useState<{ timeFormatted: string; totalMinutes: number } | null>(null);

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

    setResult({
      timeFormatted: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`,
      totalMinutes: Math.round(totalMins),
    });

    setStartTime(formatTimeStr(startTime));
    setEndTime(formatTimeStr(endTime));
  };

  const clear = () => {
    setStartTime('');
    setEndTime('');
    setBreakTime('0');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] p-4 md:p-8 font-sans selection:bg-blue-100">
      <div className="max-w-[700px] mx-auto pt-10 md:pt-20">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-[#111]">Kalkulator Godzin</h1>
          <p className="text-slate-500 text-lg max-w-md">
            Szybkie i precyzyjne obliczanie czasu pracy. Wystarczy podać godziny i ewentualną przerwę.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 mb-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Start Time */}
            <div>
              <label className="flex items-center text-sm font-semibold mb-2.5 text-slate-700 uppercase tracking-wider">
                <Play className="w-4 h-4 mr-2 text-blue-500 fill-blue-500" /> Czas rozpoczęcia
              </label>
              <div className="relative group">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="08:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value.replace(/[^0-9:]/g, ''))}
                  onBlur={() => setStartTime(formatTimeStr(startTime))}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-lg font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
                <button
                  onClick={() => setCurrentTime(setStartTime)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  TERAZ
                </button>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="flex items-center text-sm font-semibold mb-2.5 text-slate-700 uppercase tracking-wider">
                <History className="w-4 h-4 mr-2 text-indigo-500" /> Czas zakończenia
              </label>
              <div className="relative group">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="16:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value.replace(/[^0-9:]/g, ''))}
                  onBlur={() => setEndTime(formatTimeStr(endTime))}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-lg font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
                <button
                  onClick={() => setCurrentTime(setEndTime)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  TERAZ
                </button>
              </div>
            </div>
          </div>

          {/* Break Time */}
          <div className="mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <label className="flex items-center text-sm font-semibold mb-4 text-slate-700 uppercase tracking-wider">
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

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={calculate}
              className="flex-[2] h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center text-lg font-bold transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-200"
            >
              <Equal className="w-5 h-5 mr-2 stroke-[3]" /> Oblicz czas
            </button>
            <button
              onClick={clear}
              className="flex-1 h-16 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex items-center justify-center text-lg font-bold transition-all"
            >
              <X className="w-5 h-5 mr-2 stroke-[3]" /> Wyczyść
            </button>
          </div>

          {/* Result Section */}
          {result && (
            <div className="mt-12 p-8 bg-blue-50/50 rounded-3xl border border-blue-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-20 h-20 text-blue-600" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-6">
                  Wynik obliczeń
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <div className="text-slate-500 text-sm font-medium mb-1">Format czasu</div>
                    <div className="text-4xl font-black text-slate-900 tabular-nums">
                      {result.timeFormatted} <span className="text-xl font-medium text-slate-400">h</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm font-medium mb-1">Łącznie minut</div>
                    <div className="text-4xl font-black text-slate-900 tabular-nums">
                      {result.totalMinutes} <span className="text-xl font-medium text-slate-400">min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-slate-400 text-sm mt-12 pb-10">
          <p>© 2024 Kalkulator Godzin • Precyzyjne narzędzie do planowania czasu</p>
        </div>
      </div>
    </div>
  );
}
