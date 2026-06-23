import React from 'react';

import { Info, Target, Calendar, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function AgendaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Our Agenda
        </span>
          <h1 className="text-4xl font-extrabold text-accent sm:text-5xl">
            Strategic Priorities
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Explore our core focus areas designed to empower graduate students.
          </p>
      </div>

      {/* Priorities */}
      <section className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
        <div className="site-card-light bg-white p-6 space-y-4 w-full">
          <h1 className="text-4xl font-extrabold text-accent sm:text-5xl text-center">
            Strategic Priorities
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed text-center">
            Explore our core focus areas designed to empower graduate students.
          </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
             <div className="flex flex-col items-center text-center">
               <Image src="/Academic advocacy and curriculum improvement.png" alt="Academic" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
               <h3 className="text-lg font-bold text-accent">Academic</h3>
               <p className="text-sm text-neutral-600">Academic Advocacy & Curriculum Improvement</p>
               <p className="text-sm text-neutral-500">
                 We champion policies and initiatives that enhance academic excellence, ensuring graduate students have a voice in curriculum development, teaching quality, and the overall learning experience.
               </p>
             </div>
             <div className="flex flex-col items-center text-center">
               <Image src="/Professional development and career services.png" alt="Career" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
               <h3 className="text-lg font-bold text-accent">Career</h3>
               <p className="text-sm text-neutral-600">Professional Development & Career Services</p>
               <p className="text-sm text-neutral-500">
                 We equip graduate students with the skills, networks, and opportunities needed to excel in their careers through training programs, mentorship, industry engagement, and career support services.
               </p>
             </div>
             <div className="flex flex-col items-center text-center">
               <Image src="/Research funding and collaboration.png" alt="Research" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
               <h3 className="text-lg font-bold text-accent">Research</h3>
               <p className="text-sm text-neutral-600">Research Funding & Collaboration</p>
               <p className="text-sm text-neutral-500">
                 We promote a vibrant research culture by facilitating access to funding opportunities, fostering interdisciplinary partnerships, and encouraging collaborations with academia, industry, and development organizations.
               </p>
             </div>
             <div className="flex flex-col items-center text-center">
               <Image src="/Student welfare and mental health support.png" alt="Welfare" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
               <h3 className="text-lg font-bold text-accent">Welfare</h3>
               <p className="text-sm text-neutral-600">Student Welfare & Mental Health Support</p>
               <p className="text-sm text-neutral-500">
                 We are committed to the holistic well‑being of graduate students by advocating for welfare initiatives, providing support systems, and promoting mental health awareness and resilience.
               </p>
             </div>
           </div>
          </div>
      </section>
    </div>
  );
}
