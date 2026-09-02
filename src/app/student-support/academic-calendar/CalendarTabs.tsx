'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight, Download } from 'lucide-react';

export default function CalendarTabs({ events }: { events: any[] }) {
  const [programTab, setProgramTab] = useState("Master's Degree");
  const [studentType, setStudentType] = useState("Continuing Students");

  const filteredEvents = events.filter(e => 
    e.program_type === programTab && (e.student_type === studentType || e.student_type === 'All Students')
  );

  const semesters = ["First Semester", "Second Semester", "Public Holidays"];

  const handlePrint = () => {
    const originalTitle = document.title;
    // Set a clean, descriptive title for the PDF filename
    document.title = `GRASAG_UPSA_${programTab.replace(/[^a-zA-Z0-9]/g, '')}_Academic_Calendar`;
    window.print();
    // Restore the original title after the print dialog opens
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Filter Controls */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Program Tabs */}
        <div className="flex bg-gray-100/50 p-1 rounded-xl w-full md:w-auto">
          {["Master's Degree", "PhD"].map(prog => (
            <button
              key={prog}
              onClick={() => setProgramTab(prog)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                programTab === prog 
                  ? 'bg-white text-[#2563eb] shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {prog}
            </button>
          ))}
        </div>

        {/* Student Type Selector */}
        <div className="flex bg-gray-100/50 p-1 rounded-xl w-full md:w-auto">
          {["Continuing Students", "Freshmen"].map(type => (
            <button
              key={type}
              onClick={() => setStudentType(type)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                studentType === type 
                  ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Download PDF Button */}
        <div className="w-full md:w-auto">
          <button
            onClick={handlePrint}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#2563eb] hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 print:hidden"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center mb-10 pt-4">
        <h1 className="text-4xl font-black uppercase text-[#003366]">GRASAG-UPSA</h1>
        <h2 className="text-2xl font-bold text-[#B8860B] mt-2">{programTab} Academic Calendar</h2>
        <p className="text-[#003366] font-semibold mt-1 text-lg">{studentType} - 2026/2027 Academic Year</p>
        <div className="h-1 w-full bg-gradient-to-r from-[#003366] via-[#B8860B] to-[#003366] mt-4 opacity-80"></div>
      </div>

      {/* Calendar Content */}
      <div className="space-y-12">
        {semesters.map(semester => {
          const semesterEvents = filteredEvents.filter(e => e.semester === semester);
          if (semesterEvents.length === 0) return null;

          return (
            <div key={semester} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 print:text-[#003366] print:border-b-2 print:border-[#B8860B] print:pb-2 print:mb-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center print:bg-transparent print:text-[#B8860B]">
                  <CalendarIcon className="w-4 h-4 print:w-6 print:h-6" />
                </span>
                {semester}
              </h2>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white overflow-hidden ring-1 ring-gray-100 print:shadow-none print:ring-0 print:border-none print:rounded-none">
                <div className="overflow-x-auto print:overflow-visible">
                  <table className="hidden md:table print:table w-full text-left border-collapse min-w-[600px] print:min-w-full">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider print:bg-[#003366] print:text-white print:border print:border-[#003366]">
                        <th className="px-6 py-4 w-1/3 print:py-3 print:font-bold">Activity</th>
                        <th className="px-6 py-4 w-1/6 print:py-3 print:font-bold">Duration</th>
                        <th className="px-6 py-4 w-1/2 print:py-3 print:font-bold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 hidden md:table-row-group print:table-row-group print:divide-y-0">
                      {semesterEvents.map((ev, index) => (
                        <tr key={ev.id} className={`hover:bg-blue-50/30 transition-colors group print:border print:border-gray-200 ${index % 2 === 0 ? 'print:bg-gray-50/50' : 'print:bg-white'}`}>
                          <td className="px-6 py-5 print:py-3 print:border-r print:border-gray-200">
                            <div className="font-semibold text-gray-900 print:text-[#003366] print:text-sm">{ev.activity}</div>
                          </td>
                          <td className="px-6 py-5 print:py-3 print:border-r print:border-gray-200">
                            {ev.duration_weeks ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium print:bg-transparent print:px-0 print:text-gray-800">
                                <Clock className="w-3.5 h-3.5 print:hidden" />
                                {ev.duration_weeks} week{ev.duration_weeks !== '1' ? 's' : ''}
                              </div>
                            ) : (
                              <span className="text-gray-400 print:text-gray-800">-</span>
                            )}
                          </td>
                          <td className="px-6 py-5 print:py-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium print:text-gray-900">
                              <ChevronRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity print:hidden" />
                              {ev.date_description}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Mobile layout (Cards) */}
                  <div className="md:hidden print:hidden divide-y divide-gray-100">
                    {semesterEvents.map((ev) => (
                      <div key={ev.id} className="p-5 hover:bg-blue-50/30 transition-colors">
                        <div className="font-semibold text-gray-900 text-base mb-3 leading-snug">{ev.activity}</div>
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-start gap-2 text-sm text-gray-600 font-medium leading-tight">
                            <CalendarIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <span>{ev.date_description}</span>
                          </div>
                          {ev.duration_weeks && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium w-fit border border-gray-200/60">
                              <Clock className="w-3.5 h-3.5" />
                              {ev.duration_weeks} week{ev.duration_weeks !== '1' ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 border-dashed">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No events found</h3>
            <p className="text-gray-500 mt-1">There is no academic calendar published for this category yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}
