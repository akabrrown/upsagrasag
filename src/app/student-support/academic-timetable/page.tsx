'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, User, Download, Layers } from 'lucide-react';

const ORDERED_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// Helper to extract clean group label (e.g., "Group 1", "Group 2", or "General")
function extractGroupLabel(levelGroupStr: string): string {
  if (!levelGroupStr) return '';
  const match = levelGroupStr.match(/GROUP\s+([A-Za-z0-9\(\)\s]+)/i);
  if (match) {
    const val = match[1].trim();
    const numMatch = val.match(/\d+/);
    if (numMatch) return `Group ${numMatch[0]}`;
    return `Group ${val}`;
  }
  return levelGroupStr;
}

// Helper to extract clean semester label from a record
function extractSemester(record: any): string {
  // If record has an explicit semester column
  if (record.semester) {
    if (/second|sem\s*2|2nd/i.test(record.semester)) return 'Second Semester';
    if (/first|sem\s*1|1st/i.test(record.semester)) return 'First Semester';
    return record.semester;
  }
  // Check level_semester_group (e.g., "YEAR TWO (2) - SEMESTER ONE-GROUP ONE (1)")
  const str = record.level_semester_group || '';
  if (/semester\s*(two|2|second)/i.test(str)) return 'Second Semester';
  if (/semester\s*(one|1|first)/i.test(str)) return 'First Semester';
  
  // Default to First Semester for current academic year records
  return 'First Semester';
}

export default function AcademicTimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSemester, setActiveSemester] = useState('First Semester');
  const [activeSession, setActiveSession] = useState('Evening Session');
  const [activeProgram, setActiveProgram] = useState('All');
  const [activeGroup, setActiveGroup] = useState('All');

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

  const semesters = ['First Semester', 'Second Semester'];
  const sessions = ['Evening Session', 'Weekend Session', 'Distance Session'];
  
  // Check available semesters in the dataset (or fallback to First Semester)
  const availableSemesters = useMemo(() => {
    const semSet = new Set<string>();
    timetables.forEach(t => semSet.add(extractSemester(t)));
    // Always ensure First Semester is present
    if (semSet.size === 0) semSet.add('First Semester');
    return Array.from(semSet);
  }, [timetables]);

  // Filter by Semester first
  const semesterTimetables = useMemo(() => {
    return timetables.filter(t => extractSemester(t) === activeSemester);
  }, [timetables, activeSemester]);

  // Filter by Session
  const sessionTimetables = useMemo(() => {
    return activeSession === 'All' ? semesterTimetables : semesterTimetables.filter(t => t.session_type === activeSession);
  }, [semesterTimetables, activeSession]);

  // Distinct programs available in this semester and session
  const programs = useMemo(() => {
    return ['All', ...Array.from(new Set(sessionTimetables.map(t => t.program))).filter(Boolean)];
  }, [sessionTimetables]);

  // Distinct groups available for the selected program
  const programGroups = useMemo(() => {
    if (activeProgram === 'All') return [];
    const proRecords = sessionTimetables.filter(t => t.program === activeProgram);
    const groups = Array.from(new Set(proRecords.map(t => t.level_semester_group).filter(Boolean)));
    return groups;
  }, [sessionTimetables, activeProgram]);

  // Filtered records based on semester, session, program, and group
  const filteredRecords = useMemo(() => {
    return sessionTimetables.filter(r => {
      if (activeProgram !== 'All' && r.program !== activeProgram) return false;
      if (activeGroup !== 'All' && r.level_semester_group !== activeGroup) return false;
      return true;
    });
  }, [sessionTimetables, activeProgram, activeGroup]);

  // Group records by Day for the schedule grid
  const recordsByDay = useMemo(() => {
    const map: Record<string, any[]> = {};
    filteredRecords.forEach(rec => {
      const d = (rec.day || 'OTHER').toUpperCase();
      if (!map[d]) map[d] = [];
      map[d].push(rec);
    });
    // Sort items within each day by time
    Object.keys(map).forEach(d => {
      map[d].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    });
    return map;
  }, [filteredRecords]);

  // Ordered list of days present in filtered data
  const presentDays = useMemo(() => {
    return ORDERED_DAYS.filter(d => recordsByDay[d] && recordsByDay[d].length > 0);
  }, [recordsByDay]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const semPart = activeSemester.replace(/\s+/g, '_');
    const progPart = activeProgram === 'All' ? 'All_Programs' : activeProgram.replace(/[^a-zA-Z0-9]/g, '_');
    const groupPart = activeGroup === 'All' ? '' : `_${extractGroupLabel(activeGroup).replace(/\s+/g, '_')}`;
    const sessPart = activeSession.replace(/[^a-zA-Z0-9]/g, '_');
    
    document.title = `GRASAG_UPSA_${progPart}${groupPart}_${sessPart}_${semPart}_2026_2027_Timetable`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 600);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section (Hidden on Print) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001a54] via-[#002880] to-[#001a54] py-20 sm:py-28 print:hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm shadow-sm">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#B8860B]" /> 2026/2027 Academic Year
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-sm">
            Academic <span className="text-[#B8860B]">Timetable</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-blue-100/90 font-normal">
            Browse course schedules, venues, and lecturer details by semester, session, and group for the 2026/2027 academic year.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full">
        
        {/* Controls Bar (Hidden during Print) */}
        <div className="space-y-4 mb-8 print:hidden">
          
          {/* Top Row: Semester Tabs, Session Tabs & Download Button */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-200/80 flex flex-col xl:flex-row gap-4 items-center justify-between">
            
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              {/* Semester Selector Tabs */}
              <div className="flex bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/60 w-full sm:w-auto">
                {semesters.map(sem => (
                  <button
                    key={sem}
                    onClick={() => {
                      setActiveSemester(sem);
                      setActiveProgram('All');
                      setActiveGroup('All');
                    }}
                    className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeSemester === sem 
                        ? 'bg-[#001a54] text-white shadow-sm ring-1 ring-black/5 font-bold' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                  >
                    {sem}
                  </button>
                ))}
              </div>

              {/* Session Tabs */}
              <div className="flex bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/60 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                {sessions.map(session => (
                  <button
                    key={session}
                    onClick={() => {
                      setActiveSession(session);
                      setActiveProgram('All');
                      setActiveGroup('All');
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeSession === session 
                        ? 'bg-white text-[#001a54] shadow-sm ring-1 ring-black/5 font-bold' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                  >
                    {session}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <div className="w-full xl:w-auto flex items-center justify-end">
              <button
                onClick={handlePrint}
                className="w-full xl:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#001a54] hover:bg-[#002880] transition-all duration-200 shadow-sm shadow-blue-950/20 active:scale-95"
              >
                <Download className="w-4 h-4 text-[#B8860B]" />
                Download PDF Timetable
              </button>
            </div>
          </div>

          {/* Program Tabs */}
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-200/80">
            <div className="flex items-center gap-2 mb-2 px-1 text-xs font-bold uppercase tracking-wider text-gray-500">
              <span>Program:</span>
              <span className="text-[#001a54] normal-case font-semibold">{activeProgram}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {programs.map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setActiveProgram(p);
                    setActiveGroup('All');
                  }}
                  className={`flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    activeProgram === p
                      ? 'bg-[#001a54] text-white shadow-sm ring-1 ring-black/5 font-semibold'
                      : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Group Filter (Shown when a program has multiple groups, e.g. MBA Accounting & Finance) */}
          {programGroups.length > 1 && (
            <div className="bg-gradient-to-r from-amber-50/70 via-blue-50/50 to-white p-4 rounded-2xl border border-amber-200/70 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Group Filter Available</h4>
                    <p className="text-xs text-gray-600">This program is divided into {programGroups.length} lecture groups. Select your specific group:</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveGroup('All')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeGroup === 'All'
                        ? 'bg-[#001a54] text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    All Groups ({filteredRecords.length})
                  </button>
                  {programGroups.map(grp => (
                    <button
                      key={grp}
                      onClick={() => setActiveGroup(grp)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeGroup === grp
                          ? 'bg-[#B8860B] text-white shadow-sm'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {extractGroupLabel(grp)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* PRINT-ONLY OFFICIAL DOCUMENT HEADER (Formatted like official UPSA document) */}
        {/* ========================================================================= */}
        <div className="hidden print:block text-center mb-6 pt-2 border-b-2 border-[#001a54] pb-4">
          <div className="flex items-center justify-center gap-3 mb-1">
            <h1 className="text-2xl font-black uppercase tracking-wider text-[#001a54]">
              UNIVERSITY OF PROFESSIONAL STUDIES, ACCRA (UPSA)
            </h1>
          </div>
          <h2 className="text-lg font-bold text-[#B8860B] tracking-wide uppercase">
            SCHOOL OF GRADUATE STUDIES — GRASAG ACADEMIC TIMETABLE
          </h2>
          <p className="text-sm font-black text-[#001a54] uppercase tracking-wider mt-1">
            {activeSemester.toUpperCase()} — 2026/2027 ACADEMIC YEAR
          </p>
          <div className="mt-2.5 inline-flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-gray-800 uppercase bg-gray-100 px-4 py-1.5 rounded border border-gray-300">
            <span>SEMESTER: <strong className="text-[#001a54]">{activeSemester.toUpperCase()}</strong></span>
            <span>•</span>
            <span>SESSION: <strong className="text-[#001a54]">{activeSession}</strong></span>
            <span>•</span>
            <span>PROGRAM: <strong className="text-[#001a54]">{activeProgram === 'All' ? 'ALL PROGRAMS' : activeProgram}</strong></span>
            {activeGroup !== 'All' && (
              <>
                <span>•</span>
                <span>GROUP: <strong className="text-[#B8860B]">{extractGroupLabel(activeGroup)}</strong></span>
              </>
            )}
            <span>•</span>
            <span>YEAR: <strong>2026/2027</strong></span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#001a54] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No Timetable Records for {activeSemester}
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {activeSemester === 'Second Semester' 
                ? 'The Second Semester timetable has not yet been published by the academic board. Check back closer to the start of the semester.'
                : 'There are currently no uploaded timetables matching the selected session, program, and group for this semester.'}
            </p>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* OFFICIAL TIMETABLE SCHEDULE GRID (Desktop View & Clean Printable Document) */}
            {/* ========================================================================= */}
            <div className="space-y-6">
              {presentDays.map(day => {
                const dayRecords = recordsByDay[day] || [];
                if (dayRecords.length === 0) return null;

                return (
                  <div 
                    key={day} 
                    className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden print:border print:border-gray-300 print:shadow-none print:rounded-none print:break-inside-avoid print:mb-4"
                  >
                    {/* Day Banner Header */}
                    <div className="bg-[#001a54] text-white px-5 py-3 flex items-center justify-between print:bg-[#001a54] print:text-white print:py-1.5 print:px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B] print:hidden" />
                        <h3 className="font-extrabold text-sm md:text-base tracking-wider uppercase">{day}</h3>
                      </div>
                      <span className="text-xs font-semibold text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full print:bg-transparent print:text-white print:border print:border-white/30">
                        {dayRecords.length} {dayRecords.length === 1 ? 'Class' : 'Classes'}
                      </span>
                    </div>

                    {/* Day Schedule Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px] print:min-w-full">
                        <thead>
                          <tr className="bg-gray-50/90 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200 print:bg-gray-100 print:text-black">
                            <th className="px-5 py-3 w-44 print:w-36 print:py-2 print:px-3">Time</th>
                            <th className="px-5 py-3 w-64 print:w-56 print:py-2 print:px-3">Course / Subject</th>
                            <th className="px-5 py-3 print:py-2 print:px-3">Lecturer</th>
                            <th className="px-5 py-3 w-56 print:w-48 print:py-2 print:px-3">Program &amp; Group</th>
                            <th className="px-5 py-3 w-40 print:w-32 text-right print:text-right print:py-2 print:px-3">Venue / Link</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/80 text-sm">
                          {dayRecords.map((record, idx) => {
                            const parts = (record.subject_lecturer || '').split(' - ');
                            const courseName = parts[0] || record.subject_lecturer;
                            const lecturerName = parts.slice(1).join(' - ') || 'TBA';
                            const groupLabel = extractGroupLabel(record.level_semester_group);

                            return (
                              <tr 
                                key={record.id || idx} 
                                className={`hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} print:bg-white print:border-b print:border-gray-200`}
                              >
                                {/* Time Column */}
                                <td className="px-5 py-3.5 print:py-2 print:px-3 align-top">
                                  <div className="flex items-center gap-1.5 font-bold text-[#001a54] text-xs sm:text-sm">
                                    <Clock className="w-3.5 h-3.5 text-[#B8860B] shrink-0 print:hidden" />
                                    <span>{record.time}</span>
                                  </div>
                                </td>

                                {/* Subject / Course Title */}
                                <td className="px-5 py-3.5 print:py-2 print:px-3 align-top">
                                  <div className="font-bold text-gray-900 leading-snug">
                                    {courseName}
                                  </div>
                                </td>

                                {/* Lecturer */}
                                <td className="px-5 py-3.5 print:py-2 print:px-3 align-top">
                                  <div className="flex items-center gap-1.5 text-gray-700 text-xs sm:text-sm font-medium">
                                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0 print:hidden" />
                                    <span>{lecturerName}</span>
                                  </div>
                                </td>

                                {/* Program & Group */}
                                <td className="px-5 py-3.5 print:py-2 print:px-3 align-top">
                                  <div className="font-semibold text-gray-900 text-xs leading-tight">
                                    {record.program}
                                  </div>
                                  {groupLabel && (
                                    <div className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[#B8860B] font-bold text-[11px] print:bg-transparent print:border-none print:px-0 print:text-[#B8860B]">
                                      {groupLabel}
                                    </div>
                                  )}
                                </td>

                                {/* Venue */}
                                <td className="px-5 py-3.5 print:py-2 print:px-3 align-top text-right">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                                    (record.venue || '').toLowerCase().includes('virtual')
                                      ? 'bg-purple-50 text-purple-700 border border-purple-200 print:bg-transparent print:border-none print:text-purple-800'
                                      : 'bg-blue-50 text-[#001a54] border border-blue-200 print:bg-transparent print:border-none print:text-[#001a54]'
                                  }`}>
                                    <MapPin className="w-3 h-3 shrink-0 print:hidden" />
                                    <span>{record.venue}</span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Print Official Footer Stamp */}
            <div className="hidden print:flex items-center justify-between text-[10px] text-gray-600 border-t border-gray-300 mt-6 pt-3">
              <span>Official Academic Timetable • {activeSemester}, 2026/2027 Academic Year • University of Professional Studies, Accra (UPSA)</span>
              <span>Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • GRASAG Portal</span>
            </div>
          </>
        )}

      </section>
    </main>
  );
}
