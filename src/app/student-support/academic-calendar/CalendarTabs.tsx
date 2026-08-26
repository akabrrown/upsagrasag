'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';

export default function CalendarTabs({ events }: { events: any[] }) {
  const [programTab, setProgramTab] = useState("Master's Degree");
  const [studentType, setStudentType] = useState("Continuing Students");

  const filteredEvents = events.filter(e => 
    e.program_type === programTab && e.student_type === studentType
  );

  const semesters = ["First Semester", "Second Semester", "Public Holidays"];

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
      </div>

      {/* Calendar Content */}
      <div className="space-y-12">
        {semesters.map(semester => {
          const semesterEvents = filteredEvents.filter(e => e.semester === semester);
          if (semesterEvents.length === 0) return null;

          return (
            <div key={semester} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </span>
                {semester}
              </h2>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white overflow-hidden ring-1 ring-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4 w-1/3">Activity</th>
                        <th className="px-6 py-4 w-1/6">Duration</th>
                        <th className="px-6 py-4 w-1/2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {semesterEvents.map((ev) => (
                        <tr key={ev.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="font-semibold text-gray-900">{ev.activity}</div>
                          </td>
                          <td className="px-6 py-5">
                            {ev.duration_weeks ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                {ev.duration_weeks} week{ev.duration_weeks !== '1' ? 's' : ''}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                              <ChevronRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {ev.date_description}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
