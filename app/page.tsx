'use client';

import { useState } from 'react';
import { Equal, X } from 'lucide-react';

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
    <div className="min-h-screen bg-white text-[#212529] p-4 md:p-8 font-sans pb-20">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-6">
          <h1 className="text-[2rem] font-bold mb-3 text-[#212529]">Kalkulator Godzin</h1>
          <p className="text-[#212529] text-[1.1rem]">
            Oblicz ilość czasu między dwoma określonymi godzinami.
          </p>
        </div>

        <div className="bg-[#f8f9fa] border border-[#dee2e6] rounded-[0.375rem] p-5 sm:p-6 mb-8">
          {/* Start Time */}
          <div className="mb-5">
            <label className="block text-[1.1rem] mb-2 text-[#212529]">Czas rozpoczęcia:</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="np. 08:00"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value.replace(/[^0-9:]/g, ''))}
              onBlur={() => setStartTime(formatTimeStr(startTime))}
              className="w-full h-[3.25rem] bg-white border border-[#ced4da] rounded-[0.375rem] px-3 md:px-4 text-[1.1rem] shadow-sm focus:border-[#86b7fe] focus:ring-[0.25rem] focus:ring-[#0d6efd]/25 outline-none transition-all"
            />
            <button
              onClick={() => setCurrentTime(setStartTime)}
              className="text-[#212529] hover:text-black underline mt-2 inline-block text-[1.1rem]"
            >
              [Aktualny czas]
            </button>
          </div>

          {/* End Time */}
          <div className="mb-5">
            <label className="block text-[1.1rem] mb-2 text-[#212529]">Czas zakończenia:</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="np. 16:00"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value.replace(/[^0-9:]/g, ''))}
              onBlur={() => setEndTime(formatTimeStr(endTime))}
              className="w-full h-[3.25rem] bg-white border border-[#ced4da] rounded-[0.375rem] px-3 md:px-4 text-[1.1rem] shadow-sm focus:border-[#86b7fe] focus:ring-[0.25rem] focus:ring-[#0d6efd]/25 outline-none transition-all"
            />
            <button
              onClick={() => setCurrentTime(setEndTime)}
              className="text-[#212529] hover:text-black underline mt-2 inline-block text-[1.1rem]"
            >
              [Aktualny czas]
            </button>
          </div>

          {/* Break Time */}
          <div className="mb-6">
            <label className="block text-[1.1rem] mb-2 text-[#212529]">Czas przerwy (opcjonalnie):</label>
            <input
              type="number"
              min="0"
              value={breakTime}
              onChange={(e) => setBreakTime(e.target.value)}
              className="w-full h-[3.25rem] bg-white border border-[#ced4da] rounded-[0.375rem] px-3 md:px-4 text-[1.1rem] shadow-sm focus:border-[#86b7fe] focus:ring-[0.25rem] focus:ring-[#0d6efd]/25 outline-none transition-all mb-4"
            />
            <div className="relative">
              <select
                value={breakUnit}
                onChange={(e) => setBreakUnit(e.target.value)}
                className="w-full h-[3.25rem] bg-[#e9ecef] border border-[#ced4da] rounded-[0.375rem] px-3 md:px-4 text-[1.1rem] appearance-none focus:border-[#86b7fe] focus:ring-[0.25rem] focus:ring-[#0d6efd]/25 outline-none transition-all"
              >
                <option value="minutes">Minuty</option>
                <option value="hours">Godziny</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={calculate}
              className="w-full h-[3.5rem] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded-[0.375rem] flex items-center justify-center text-[1.1rem] font-bold transition-colors"
            >
              <Equal className="w-5 h-5 mr-2 stroke-[3]" /> Oblicz
            </button>
            <button
              onClick={clear}
              className="w-full h-[3.5rem] bg-[#e9ecef] hover:bg-[#dde0e3] text-[#212529] rounded-[0.375rem] flex items-center justify-center text-[1.1rem] font-bold transition-colors"
            >
              <X className="w-5 h-5 mr-2 stroke-[3]" /> Wyczyść
            </button>
          </div>

          {/* Result Section */}
          {result && (
            <div className="mt-8 pt-8 border-t border-[#dee2e6]">
              <div className="inline-flex items-center bg-[#e9ecef] border border-[#dee2e6] rounded-[0.375rem] px-3 py-2 mb-6">
                <span className="w-3 h-3 bg-[#0d6efd] rounded-full mr-2"></span>
                <span className="font-bold text-[1.1rem] text-[#212529]">Wynik:</span>
              </div>

              <div className="mb-4">
                <label className="block text-[1.1rem] mb-2 text-[#212529]">Czas:</label>
                <input
                  type="text"
                  readOnly
                  value={result.timeFormatted}
                  className="w-full h-[3.25rem] bg-white border border-[#ced4da] rounded-[0.375rem] px-4 text-[1.1rem] text-[#212529] outline-none"
                />
              </div>

              <div>
                <label className="block text-[1.1rem] mb-2 text-[#212529]">Czas w minutach:</label>
                <input
                  type="text"
                  readOnly
                  value={result.totalMinutes.toString()}
                  className="w-full h-[3.25rem] bg-white border border-[#ced4da] rounded-[0.375rem] px-4 text-[1.1rem] text-[#212529] outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-[1.75rem] font-bold mb-4 text-[#212529]">Kalkulator godzin pomiędzy dwoma datami</h2>
          <p className="text-[1.1rem] text-[#212529]">
            Oblicz ilość czasu między dwoma datami i godzinami.
          </p>
        </div>
      </div>
    </div>
  );
}
