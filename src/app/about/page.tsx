import React from 'react';
import Image from 'next/image';
import { Landmark, Target } from 'lucide-react';

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
          The Nation&apos;s Premium
        </p>
      </div>

      {/* Overview & History */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
          <Landmark className="h-6 w-6 text-accent" /> Overview & History
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          GRASAG-UPSA is the official representative body of postgraduate students at the University of Professional Studies, Accra, and a strategic platform for leadership, research, enterprise, professional development and social impact. As the voice of UPSA’s postgraduate community, the Association represents emerging leaders, researchers, entrepreneurs, public servants, corporate professionals, academics, consultants and innovators who are being prepared to contribute meaningfully to national and continental development.
          Guided by its motto, “The Nation’s Premium,” GRASAG-UPSA serves as a bridge between postgraduate students, the University, industry, government, development partners, alumni, professional bodies and society. It provides partners with direct access to a high-value graduate community active in business, governance, academia, civil society and the world of work.
          The Association’s work goes beyond student representation. GRASAG-UPSA designs and implements initiatives that respond to the academic, professional and welfare needs of graduate students while creating value for the University and society. Key initiatives include the Ghana Agribusiness Future Forum, which convenes students, industry actors, policymakers and entrepreneurs around agribusiness, food systems and youth enterprise; The Business Lounge, a networking and enterprise platform for conversations on business, leadership, innovation and career growth; and the Research Support Initiative, which supports postgraduate students through thesis clinics, publication guidance, seminars and research capacity-building.
          Through its focus on good governance, research, inclusion, student welfare, employability, entrepreneurship and graduate community engagement, GRASAG-UPSA offers partners a credible platform to support talent development, thought leadership, innovation, policy dialogue and professional excellence.
          Partnering with GRASAG-UPSA is an opportunity to invest in a purposeful and influential postgraduate community capable of generating ideas, leading conversations, building enterprises, conducting research and shaping the future of work, business, governance and leadership in Ghana and beyond.
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
            To serve as the official voice and representative body of postgraduate students at UPSA by promoting their academic, social, professional and general welfare through effective advocacy, responsive leadership, inclusive engagement, accountable governance and constructive collaboration with University authorities and relevant stakeholders.
          </p>
        </div>

        <div className="site-card-light bg-white p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-accent">Our Vision</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            To build a vibrant, inclusive, research-driven and student-centred graduate community where every postgraduate student at UPSA is empowered to excel academically, grow professionally, participate meaningfully in student life, and contribute to national development through research and practice.
          </p>
        </div>
      </section>

      {/* Our Focus Areas */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
          <Landmark className="h-6 w-6 text-accent" /> Our Focus Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* G – Good Governance */}
          <div className="flex flex-col items-center text-center">
            <Image src="/aassest/letter_g_stylish_1782309960852.png" alt="Good Governance" width={64} height={64} className="mb-2" />
            <h3 className="text-lg font-bold text-accent">Good Governance, Representation and Accountability</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src="/aassest/letter_r_stylish_1782310071931.png" alt="Research" width={64} height={64} className="mb-2" />
            <h3 className="text-lg font-bold text-accent">Research, Academic Excellence and Innovation</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src="/aassest/letter_a_stylish_1782310150000_1782310122240.png" alt="Access" width={64} height={64} className="mb-2" />
            <h3 className="text-lg font-bold text-accent">Access, Equity, Inclusion and Digital Transformation</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src="/aassest/letter_s_stylish_1782310200000_1782310253075.png" alt="Welfare" width={64} height={64} className="mb-2" />
            <h3 className="text-lg font-bold text-accent">Student Welfare, Support and Wellbeing</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src="/aassest/letter_a_stylish_1782310150000_1782310122240.png" alt="Advancement" width={64} height={64} className="mb-2" />
            <h3 className="text-lg font-bold text-accent">Advancement, Employability, Entrepreneurship and Partnerships</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image src="/aassest/letter_g_stylish_1782309960852.png" alt="Graduate Community" width={64} height={64} className="mb-2" />
            <h3 className="text-lg font-bold text-accent">Graduate Community, Identity and Engagement</h3>
          </div>
        </div>
      </section>

      {/* Our Objectives */}
      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-accent">Our Objectives</h2>
        <p className="text-sm text-neutral-600">
          GRASAG‑UPSA exists to advance the interests and welfare of graduate students through the following objectives:
        </p>
        <div className="text-sm text-neutral-600">
          <ul className="list-disc list-inside ml-5 mt-2 space-y-1 text-sm text-neutral-600">
            <li>To promote the academic, social and general welfare of all postgraduate students of the University of Professional Studies, Accra.</li>
            <li>To serve as the mouthpiece of the entire graduate student body and represent the views, concerns and aspirations of postgraduate students.</li>
            <li>To provide effective channels of communication between graduate students and University authorities on matters affecting the graduate student body as a whole or any section of it.</li>
            <li>To liaise with the Office of the Dean of the School of Graduate Studies and other relevant offices on issues affecting the welfare, academic progress and overall experience of graduate students.</li>
            <li>To coordinate and collaborate with other student associations, unions and relevant bodies within and outside UPSA on matters of mutual interest.</li>
            <li>To organise lectures, symposia, debates, meetings, seminars, professional engagements and other activities considered beneficial to graduate students.</li>
            <li>To create opportunities for graduate students to participate in governance, policy dialogue, research, leadership development, professional growth and community building.</li>
            <li>To foster unity, solidarity and active participation among postgraduate students across all programmes, schools, centres and study modes.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
