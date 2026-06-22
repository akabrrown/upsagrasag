'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Download, FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProgramPastQuestionsPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [program, setProgram] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setLoading(true);
      // Fetch program
      const { data: progData } = await supabaseClient
        .from('programs')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (progData) {
        setProgram(progData);
        // Fetch past questions
        const { data: qData } = await supabaseClient
          .from('past_questions')
          .select('*')
          .eq('program_id', progData.id)
          .order('uploaded_at', { ascending: false });
          
        if (qData) setQuestions(qData);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading past questions...</div>
      </div>
    );
  }
  
  if (!program) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col px-4 text-center">
        <FileText className="h-16 w-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Program not found</h1>
        <p className="mt-2 text-slate-500">The program you are looking for does not exist or has been removed.</p>
        <Link href="/" className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <ChevronLeft className="w-4 h-4 mr-1" /> Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">{program.name}</h1>
          <p className="mt-2 text-lg text-slate-600">Past Examination Questions</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-slate-200" />
            <h3 className="mt-6 text-xl font-semibold text-slate-900">No past questions found</h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto">
              There are currently no past questions uploaded for this program. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-slate-200 p-6 flex flex-col h-full group">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    {q.year && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {q.year}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 line-clamp-2" title={q.title || q.course_title}>
                    {q.course_code ? `${q.course_code}: ${q.course_title || q.title}` : (q.title || q.course_title)}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 font-medium">
                    Uploaded: {new Date(q.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <a
                    href={`/${q.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 border border-transparent rounded-xl hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
