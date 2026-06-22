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

      {/* Overview & History */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
          <Landmark className="h-6 w-6 text-accent" /> Overview & History
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The Graduate Students’ Association of Ghana – University of Professional Studies, Accra Chapter (GRASAG-UPSA) is the official representative body and voice of all postgraduate students of the University of Professional Studies, Accra (UPSA). As a recognized chapter of the Graduate Students’ Association of Ghana (GRASAG), the association serves students enrolled in postgraduate programmes, including MBA, MSc, MA, MPhil, LLM, and PhD studies.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          GRASAG-UPSA is committed to promoting academic excellence, professional growth, research development, and student welfare. The Association works closely with the School of Graduate Studies (SOGS), university management, and other stakeholders to ensure that the interests and concerns of graduate students are effectively represented and addressed. Through advocacy, engagement, and collaboration, GRASAG-UPSA contributes to creating a supportive environment that enables students to excel academically and professionally.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Beyond representation, the Association organizes seminars, workshops, research conferences, networking events, leadership development programmes, and community engagement initiatives that enrich the postgraduate experience. Over the years, GRASAG-UPSA has demonstrated its commitment to student welfare through various projects and contributions aimed at enhancing teaching, learning, and student support services within the University.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          As the collective voice of graduate students, GRASAG-UPSA remains dedicated to fostering a vibrant community of scholars, researchers, professionals, and future leaders who contribute meaningfully to national development and global progress. Guided by the values of excellence, integrity, service, and innovation, the Association continues to champion the interests of postgraduate students while supporting the vision and mission of UPSA.
        </p>
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
