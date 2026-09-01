'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, Search } from 'lucide-react';

export default function AcademicTimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSession, setActiveSession] = useState('Evening Session');
  const [activeProgram, setActiveProgram] = useState('All');

  useEffect(() => {
    const fetchTimetables = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/academic-timetables');
        const data = await res.json();
        setTimetables(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load timetables', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetables();
  }, []);

  const sessions = ['Evening Session', 'Weekend Session', 'Distance Session'];
  
  const relevantTimetables = activeSession === 'All' ? timetables : timetables.filter(t => t.session_type === activeSession);
  const programs = ['All', ...Array.from(new Set(relevantTimetables.map(t => t.program)))];
  
  const filteredRecords = relevantTimetables.filter(r => {
    if (activeProgram !== 'All' && r.program !== activeProgram) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001a54] via-[#002880] to-[#001a54] py-24 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm shadow-sm">
            <Calendar className="w-4 h-4 mr-1.5" /> Official Timetable
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-sm">
            Class <span className="text-[#B8860B]">Schedules</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-blue-100">
            Stay organized with your up-to-date lecture timetables, venues, and instructor details.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-12 w-full">
        {/* Filters */}
        <div className="space-y-6 mb-10">
          {/* Session Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50 backdrop-blur-sm overflow-x-auto w-full md:w-auto">
              {sessions.map(session => (
                <button
                  key={session}
                  onClick={() => {
                    setActiveSession(session);
                    setActiveProgram('All'); // Reset program when changing session
                  }}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeSession === session 
                      ? 'bg-white text-[#001a54] shadow-sm ring-1 ring-black/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  {session}
                </button>
              ))}
            </div>
          </div>

          {/* Program Tabs */}
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x">
              {programs.map(p => (
                <button
                  key={p as string}
                  onClick={() => setActiveProgram(p as string)}
                  className={`flex-none snap-start px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeProgram === (p as string)
                      ? 'bg-[#001a54] text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  {p as string}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timetable View */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#001a54] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Timetables Found</h3>
            <p className="text-gray-500">There are currently no uploaded timetables for this session and program.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Day & Time</th>
                    <th className="px-6 py-4">Program & Group</th>
                    <th className="px-6 py-4">Subject & Lecturer</th>
                    <th className="px-6 py-4">Venue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRecords.map((record, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#001a54]">{record.day}</div>
                        <div className="text-sm flex items-center gap-1.5 text-gray-500 mt-1">
                          <Clock className="w-3.5 h-3.5" /> {record.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{record.program}</div>
                        <div className="text-xs text-[#B8860B] font-semibold mt-0.5">{record.level_semester_group}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{record.subject_lecturer.split(' - ')[0]}</div>
                        <div className="text-xs flex items-center gap-1.5 text-gray-500 mt-1">
                          <User className="w-3.5 h-3.5" /> {record.subject_lecturer.split(' - ')[1] || 'TBA'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          <MapPin className="w-3.5 h-3.5" /> {record.venue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredRecords.map((record, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#001a54]" />
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-[#001a54] text-lg">{record.day}</h4>
                      <p className="text-xs text-[#B8860B] font-semibold mt-0.5">{record.program}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                      <Clock className="w-3 h-3" /> {record.time}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{record.subject_lecturer.split(' - ')[0]}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <User className="w-3.5 h-3.5" /> {record.subject_lecturer.split(' - ')[1] || 'TBA'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{record.level_semester_group}</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        <MapPin className="w-3.5 h-3.5" /> {record.venue}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
