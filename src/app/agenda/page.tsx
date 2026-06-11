import React from 'react';

import { Info, Target, Calendar, CheckCircle } from 'lucide-react';

export default function AgendaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Our Agenda
        </span>
        <h1 className="text-4xl font-extrabold text-accent sm:text-5xl">
          Strategic Vision & Initiatives
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          The agenda outlines our key priorities, projects, and upcoming events to strengthen graduate student life at UPSA.
        </p>
      </div>

      {/* Priorities */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="site-card-light bg-white p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <CheckCircle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-accent">Strategic Priorities</h3>
          <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
            <li>Academic advocacy and curriculum improvement</li>
            <li>Professional development and career services</li>
            <li>Research funding and collaboration</li>
            <li>Student welfare and mental health support</li>
          </ul>
        </div>

        <div className="site-card-light bg-white p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-accent">Upcoming Events</h3>
          <p className="text-sm text-neutral-600">
            Check the <a href="/events" className="text-accent underline">Events</a> page for workshops, seminars, and networking sessions scheduled for the semester.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
          <Target className="h-6 w-6" /> Ongoing Projects
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Our members are actively driving initiatives such as the Graduate Research Grant program, mentorship circles, and the Digital Library expansion. Detailed descriptions can be edited via the admin panel.
        </p>
      </section>
    </div>
  );
}
