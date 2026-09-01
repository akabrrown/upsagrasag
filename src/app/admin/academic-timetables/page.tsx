'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Upload, Search, Trash2, ArrowLeft, Download, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';
import Papa from 'papaparse';

type ViewState = 'list' | 'upload';

export default function AdminAcademicTimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('list');
  const [activeSession, setActiveSession] = useState('All');
  const [activeProgram, setActiveProgram] = useState('All');
  
  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/academic-timetables');
      const data = await res.json();
      setTimetables(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load timetables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Validate required columns
        const data = results.data as any[];
        const requiredKeys = ['session_type', 'program', 'level_semester_group', 'day', 'time', 'subject_lecturer', 'venue'];
        const hasAllKeys = data.length > 0 && requiredKeys.every(key => Object.keys(data[0]).includes(key));
        
        if (!hasAllKeys) {
          alert('Invalid CSV format. Please use the provided template.');
          setFile(null);
          setPreviewData([]);
          return;
        }
        
        setPreviewData(data);
      },
      error: (error: any) => {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file.');
      }
    });
  };

  const handleBulkSubmit = async () => {
    if (previewData.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // Option to clear old data for the same program/session being uploaded
      // This ensures we don't duplicate when replacing a timetable
      const uniqueProgramSessions = new Set(previewData.map(d => `${d.session_type}|${d.program}`));
      
      for (const key of uniqueProgramSessions) {
        const [session, program] = key.split('|');
        await fetch(`/api/admin/academic-timetables?session=${encodeURIComponent(session)}&program=${encodeURIComponent(program)}`, {
          method: 'DELETE'
        });
      }

      // We need to add the push notification flag to trigger the notification
      const payloadWithNotification = previewData.map((d, index) => {
          if(index === 0) {
              return { ...d, _send_notification: true, title: `${d.program} Timetable` }
          }
          return d;
      });

      const res = await fetch('/api/admin/academic-timetables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithNotification)
      });
      
      if (!res.ok) throw new Error('Failed to upload');
      
      alert('Timetable uploaded successfully!');
      fetchTimetables();
      setView('list');
      setFile(null);
      setPreviewData([]);
    } catch (e) {
      console.error(e);
      alert('Failed to upload timetable');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if(!confirm('Are you sure you want to delete this specific entry?')) return;
    try {
      const res = await fetch(`/api/admin/academic-timetables/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchTimetables();
    } catch (e) {
      alert('Failed to delete entry');
    }
  };

  const downloadTemplate = () => {
    const csvContent = "session_type,program,level_semester_group,day,time,subject_lecturer,venue\nEvening Session,MBA ACCOUNTING AND FINANCE,YEAR TWO (2) - SEMESTER ONE,MONDAY,5:30pm - 8:30pm,MBAF605 Corporate Finance - Dr. James Ntiamoah Doku,ATB309\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'timetable_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sessions = ['All', 'Evening Session', 'Weekend Session', 'Distance Session'];
  const programs = ['All', ...Array.from(new Set(timetables.map(t => t.program)))];
  
  const filteredRecords = timetables.filter(r => {
    if (activeSession !== 'All' && r.session_type !== activeSession) return false;
    if (activeProgram !== 'All' && r.program !== activeProgram) return false;
    return true;
  });

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Timetable</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Academic Timetable</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('upload')}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Upload className="w-4 h-4" /> Bulk Upload CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Session:</span>
            <select 
              value={activeSession}
              onChange={(e) => setActiveSession(e.target.value)}
              className="text-sm border-gray-200 rounded-lg focus:ring-[#2563eb] focus:border-[#2563eb]"
            >
              {sessions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Program:</span>
            <select 
              value={activeProgram}
              onChange={(e) => setActiveProgram(e.target.value)}
              className="text-sm border-gray-200 rounded-lg focus:ring-[#2563eb] focus:border-[#2563eb] max-w-[200px]"
            >
              {programs.map(p => <option key={p as string} value={p as string}>{p as string}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white">
                <th className="px-6 py-4 font-medium">Program / Group</th>
                <th className="px-6 py-4 font-medium">Day / Time</th>
                <th className="px-6 py-4 font-medium">Subject / Lecturer</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <AdminTableSkeleton columns={5} />
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No timetable entries found. Upload a CSV to get started.</td></tr>
              ) : (
                filteredRecords.map((record, idx) => (
                  <tr key={record.id || idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.program}</div>
                      <div className="text-sm text-[#2563eb]">{record.session_type}</div>
                      <div className="text-xs text-gray-500">{record.level_semester_group}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{record.day}</div>
                      <div className="text-xs text-gray-500">{record.time}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[300px] truncate" title={record.subject_lecturer}>
                      {record.subject_lecturer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.venue}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteRecord(record.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Delete Entry">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const UploadView = () => (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => { setView('list'); setFile(null); setPreviewData([]); }} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Timetable CSV</h1>
            <p className="text-sm text-gray-500 mt-1">Upload a CSV file containing timetable data</p>
          </div>
        </div>
        <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          <Download className="w-4 h-4" /> Download Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {!file ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Click to upload CSV</h3>
            <p className="text-sm text-gray-500">Must follow the template structure.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#2563eb]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB • {previewData.length} records found</p>
                </div>
              </div>
              <button onClick={() => { setFile(null); setPreviewData([]); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
            </div>

            {previewData.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Data Preview (First 5 Rows)
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-xs min-w-[800px]">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-2">Session</th>
                        <th className="px-4 py-2">Program</th>
                        <th className="px-4 py-2">Day/Time</th>
                        <th className="px-4 py-2">Subject/Lecturer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {previewData.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2">{row.session_type}</td>
                          <td className="px-4 py-2">{row.program} <span className="text-gray-400 block">{row.level_semester_group}</span></td>
                          <td className="px-4 py-2">{row.day} <span className="text-gray-400 block">{row.time}</span></td>
                          <td className="px-4 py-2 truncate max-w-[200px]">{row.subject_lecturer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length > 5 && (
                  <p className="text-xs text-gray-500 mt-2 italic">And {previewData.length - 5} more rows...</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                disabled={isSubmitting}
                onClick={handleBulkSubmit}
                className="flex items-center gap-2 px-6 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-500/30"
              >
                {isSubmitting ? 'Importing...' : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Import {previewData.length} Records
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto">
      {view === 'list' ? <ListView /> : <UploadView />}
    </div>
  );
}
