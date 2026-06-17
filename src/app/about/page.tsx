import React from 'react';
import { Landmark, FileText, Download, Target, Info } from 'lucide-react';

export const dynamic = 'force-dynamic'; // ensure fresh data

export default async function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Who We Are
        </span>
        <h1 className="text-4xl font-extrabold text-accent sm:text-5xl">About GRASAG-UPSA</h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          The official mouthpiece and leadership body for all graduate students at the University of Professional Studies, Accra.
        </p>
      </div>

      {/* Overview & History / Constitution */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
            <Landmark className="h-6 w-6 text-accent" /> Overview & History
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Established as the local chapter of the Graduate Students&apos; Association of Ghana, GRASAG-UPSA represents all postgraduates pursuing MBA, MSc, MPhil, LLM, and PhD courses at UPSA.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Our mission coordinates directly with the School of Graduate Studies (SOGS) to align academic work, thesis formatting, and supervisor allocations with national standards, helping students build research and executive capacity.
          </p>
        </div>

        <div className="md:col-span-5 rounded-2xl bg-[#003366] p-6 border border-[#003366] text-white shadow-lg space-y-4">
          <h3 className="font-bold text-sm text-accent flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" /> Association Constitution
          </h3>
          <p className="text-xs text-white leading-relaxed">
            Download the official GRASAG-UPSA Constitution containing the electoral regulations, senate guidelines, and welfare directives.
          </p>
          <a href="#" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent/90 text-white px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer w-full text-center">
            <Download className="h-4 w-4" /> Download PDF (2.4 MB)
          </a>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="site-card-light bg-white p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-accent">Our Mission</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            To champion the academic, professional, and welfare interests of all graduate students at UPSA through advocacy, representation, and service delivery, while contributing to Ghana&apos;s development.
          </p>
        </div>

        <div className="site-card-light bg-white p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Info className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-accent">Our Vision</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            To be the leading graduate students' association in Ghana, recognized for academic and research excellence, professional development, and transformative student leadership.
          </p>
        </div>
      </section>

      {/* Aims and Objectives */}
      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-accent">Aims and objectives</h2>
        <p className="text-sm text-neutral-600">
          The GRASAG‑UPSA shall seek the academic, social and general welfare of all students pursuing post‑Graduate programmes in the University of Professional Studies, Accra.
        </p>
        <div className="text-sm text-neutral-600">
          The GRASAG‑UPSA shall serve as the mouthpiece of the entire Graduate Student body of this University and shall engage in activities including but not limited to the following:
          <ul className="list-disc list-inside ml-5 mt-2 space-y-1 text-sm text-neutral-600">
            <li>To provide means of communication between Graduate Students and the University Authorities in all matters affecting the body of the Graduate Students as a whole or affecting any part thereof.</li>
            <li>To coordinate with other Student Associations and Unions of the University of Professional Studies, Accra and elsewhere in matters of mutual interest.</li>
            <li>To liaise between the members of the GRASAG‑UPSA and the office of the Dean of the School of Graduate Studies (SOGS) on matters affecting the welfare of Graduate Students.</li>
            <li>To organize lectures, symposia, debate, meetings and other activity which shall be deemed by members of the GRASAG‑UPSA to be in the interest of its members.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
