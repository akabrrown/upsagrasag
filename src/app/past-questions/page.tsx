'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, Loader2 } from 'lucide-react';

interface Course {
  id: number;
  name: string;
}

interface Question {
  id: string;
  course_id: number;
  title: string;
  description: string;
  file_url: string;
  file_type: 'pdf' | 'docx';
  created_at: string;
  mba_courses: { name: string } | null;
}

export default function PastQuestionsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchQuestions();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url = selectedCourse !== 'all'
        ? `/api/questions?course_id=${selectedCourse}`
        : '/api/questions';
      const res = await fetch(url);
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCourse]);

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10 bg-background text-foreground">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="badge-accent">
            Academic Resources
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl leading-tight">
            Past Question Bank
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Search, filter, and download MBA and graduate exam papers to aid your study preparation.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 site-card-dark p-4">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search papers by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>

        {/* Course Filter */}
        <div className="md:col-span-6">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="form-input"
          >
            <option value="all">All Programmes</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List Body */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-accent animate-spin" />
          <p className="text-sm font-semibold text-neutral-500">Loading Past Questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-2xl border border-dashed border-neutral-300 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-neutral-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">No papers found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mt-1">
              There are currently no past questions matching your search filters in the repository.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="group site-card-light bg-white flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 border border-neutral-200 px-2.5 py-1 text-[10px] font-bold text-neutral-600 uppercase tracking-wide">
                    {question.file_type}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-primary leading-tight">
                    {question.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-accent">
                    {question.mba_courses?.name || 'General Programme'}
                  </p>
                  {question.description && (
                    <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
                      {question.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
                <span className="text-[10px] text-neutral-400 font-medium">
                  Uploaded {new Date(question.created_at).toLocaleDateString()}
                </span>
                <a
                  href={question.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-accent hover:text-white px-3 py-2 text-xs font-bold text-neutral-700 transition-all duration-200"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
