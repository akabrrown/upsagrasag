"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Landmark, Scale, HeartHandshake, GraduationCap, Globe, Users, Briefcase } from 'lucide-react';

const focusAreas = [
  {
    title: 'Good Governance, Representation and Accountability',
    description: 'GRASAG-UPSA promotes transparent, accountable and responsive leadership through effective representation, timely communication, responsible resource management and constitutional governance.',
    image: '/president-speech.png',
    icon: Scale,
  },
  {
    title: 'Student Welfare, Support and Wellbeing',
    description: 'GRASAG-UPSA prioritises the welfare and wellbeing of graduate students, including mental health, psychosocial support, student-parent support, campus services and emergency support systems.',
    image: '/dsdsee.jpg',
    icon: HeartHandshake,
  },
  {
    title: 'Research, Academic Excellence and Innovation',
    description: 'GRASAG-UPSA supports research, academic excellence and innovation through thesis support, research capacity-building, academic publishing, peer learning and scholarly engagement.',
    image: '/researchhh.png',
    icon: GraduationCap,
  },
  {
    title: 'Access, Equity, Inclusion and Digital Transformation',
    description: 'GRASAG-UPSA promotes equal access, inclusion and non-discrimination for all graduate students, regardless of gender, religion, ethnicity, disability, nationality or social background.',
    image: '/inclusive.png',
    icon: Globe,
  },
  {
    title: 'Graduate Community, Identity and Engagement',
    description: 'GRASAG-UPSA builds a united and active graduate community through student engagement, social interaction, leadership development, recognition programmes, sports, culture and volunteerism.',
    image: '/communittty.jpg',
    icon: Users,
  },
  {
    title: 'Advancement, Employability, Entrepreneurship and Partnerships',
    description: 'GRASAG-UPSA connects graduate education to career growth, entrepreneurship and national development through employability initiatives, mentorship, alumni engagement and strategic partnerships.',
    image: '/WhatsApp Image 2026-06-20 at 3.52.26 AM.jpeg',
    icon: Briefcase,
  },
];

const objectives = [
  "To promote the academic, social and general welfare of all postgraduate students of the University of Professional Studies, Accra.",
  "To serve as the mouthpiece of the entire graduate student body and represent the views, concerns and aspirations of postgraduate students.",
  "To provide effective channels of communication between graduate students and University authorities on matters affecting the graduate student body as a whole or any section of it.",
  "To liaise with the Office of the Dean of the School of Graduate Studies and other relevant offices on issues affecting the welfare, academic progress and overall experience of graduate students.",
  "To coordinate and collaborate with other student associations, unions and relevant bodies within and outside UPSA on matters of mutual interest.",
  "To organise lectures, symposia, debates, meetings, seminars, professional engagements and other activities considered beneficial to graduate students.",
  "To create opportunities for graduate students to participate in governance, policy dialogue, research, leadership development, professional growth and community building.",
  "To foster unity, solidarity and active participation among postgraduate students across all programmes, schools, centres and study modes."
];

export default function AboutPage() {
  const [activeObjective, setActiveObjective] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // 0: GAFF, 1: Business Lounge

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveObjective((prev) => (prev + 1) % objectives.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-background text-foreground">
      {/* Hero Section */}
      <div 
        className="relative w-full bg-no-repeat px-4 sm:px-6 lg:px-8 pt-32 sm:pt-44 md:pt-52 pb-[45%]"
        style={{ 
          backgroundImage: "url('/about-us-bg.png')",
          backgroundPosition: "center bottom -100px",
          backgroundSize: "100% auto"
        }}
      >
        <div className="max-w-5xl mx-auto w-full space-y-4 text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#001a54] tracking-tight">
            About GRASAG-UPSA
          </h1>
          <p className="text-base sm:text-lg font-semibold text-neutral-800 tracking-wide">
            The Nation&apos;s Premium
          </p>
          <p className="text-sm sm:text-base text-neutral-700 max-w-xl leading-relaxed font-medium">
            Representing, empowering and connecting postgraduate students at the University of Professional Studies, Accra through leadership, research, innovation and professional excellence.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        {/* Who We Are */}
        <section className="space-y-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001a54]">
            Who We Are
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-sm sm:text-base text-neutral-600 leading-relaxed text-center">
            <p>
              GRASAG-UPSA is the official representative body of postgraduate students at the University of Professional Studies, Accra, and a strategic platform for leadership, research, enterprise, professional development and social impact. As the voice of UPSA’s postgraduate community, the Association represents emerging leaders, researchers, entrepreneurs, public servants, corporate professionals, academics, consultants and innovators who are being prepared to contribute meaningfully to national and continental development. Guided by its motto, &ldquo;The Nation’s Premium,&rdquo;
            </p>
            <p>
              GRASAG-UPSA serves as a bridge between postgraduate students, the University, industry, government, development partners, alumni, professional bodies and society. It provides partners with direct access to a high-value graduate community active in business, governance, academia, civil society and the world of work.
            </p>
          </div>
        </section>
      </div>

      {/* Full-width Key Initiatives Section */}
      <section className="w-full bg-[#000830] text-white flex flex-col md:flex-row items-stretch min-h-[520px] overflow-hidden my-16">
        {/* Left Side: Text and Selector Tabs */}
        <div className="w-full md:w-1/2 flex justify-end items-center py-16 px-6 md:px-0">
          <div className="w-full max-w-[480px] md:mr-12 space-y-6 text-left">
            <p className="text-sm text-neutral-300 leading-relaxed">
              The Association’s work goes beyond student representation. GRASAG-UPSA designs and implements initiatives that respond to the academic, professional and welfare needs of graduate students while creating value for the University and society.
            </p>
            <p className="text-sm font-semibold text-neutral-400">
              Key initiatives include:
            </p>
            <div className="space-y-4">
              {/* Tab 1: GAFF */}
              <div 
                className="cursor-pointer group" 
                onClick={() => setActiveTab(0)}
              >
                <div className={`flex items-center justify-between py-3 border-b ${activeTab === 0 ? 'border-[#B8860B]' : 'border-neutral-800'}`}>
                  <div className="flex items-center gap-2">
                    {activeTab === 0 ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-neutral-600 transition-colors" />
                    )}
                    <span className={`font-semibold text-base transition-colors ${activeTab === 0 ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                      the Ghana Agribusiness Future Forum
                    </span>
                  </div>
                  {activeTab === 0 ? (
                    <span className="text-[#B8860B] font-bold">↓</span>
                  ) : (
                    <span className="text-neutral-500 group-hover:text-neutral-300 font-bold">→</span>
                  )}
                </div>
                {activeTab === 0 && (
                  <p className="py-3 text-sm text-neutral-400 leading-relaxed pl-4">
                    The GAFF convenes students, industry actors, policymakers and entrepreneurs around agribusiness, food systems and youth enterprise;
                  </p>
                )}
              </div>

              {/* Tab 2: Business Lounge */}
              <div 
                className="cursor-pointer group" 
                onClick={() => setActiveTab(1)}
              >
                <div className={`flex items-center justify-between py-3 border-b ${activeTab === 1 ? 'border-[#B8860B]' : 'border-neutral-800'}`}>
                  <div className="flex items-center gap-2">
                    {activeTab === 1 ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-neutral-600 transition-colors" />
                    )}
                    <span className={`font-semibold text-base transition-colors ${activeTab === 1 ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                      The Business Lounge
                    </span>
                  </div>
                  {activeTab === 1 ? (
                    <span className="text-[#B8860B] font-bold">↓</span>
                  ) : (
                    <span className="text-neutral-500 group-hover:text-neutral-300 font-bold">→</span>
                  )}
                </div>
                {activeTab === 1 && (
                  <p className="py-3 text-sm text-neutral-400 leading-relaxed pl-4">
                    A networking and enterprise platform for conversations on business, leadership, innovation and career growth; and the Research Support Initiative, which supports postgraduate students through thesis clinics, publication guidance, seminars and research capacity-building.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image with overlaid content */}
        <div className="w-full md:w-1/2 relative min-h-[350px] md:min-h-0 flex items-end">
          {/* Image backgrounds */}
          <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeTab === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <Image 
              src="/Rectangle 69.png" 
              alt="Ghana Agribusiness Future Forum" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000830]/90 via-[#000830]/40 to-transparent" />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeTab === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <Image 
              src="/Rectangle 71.png" 
              alt="The Business Lounge" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000830]/90 via-[#000830]/40 to-transparent" />
          </div>

          {/* Overlaid Title and Paragraph, aligned to the right-half alignment boundary */}
          <div className="relative z-20 w-full flex justify-start py-12 px-6 md:px-0">
            <div className="w-full max-w-[480px] md:ml-12 text-left space-y-3">
              {activeTab === 0 ? (
                <>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Ghana Agribusiness Future Forum
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
                    The GAFF convenes students, industry actors, policymakers and entrepreneurs around agribusiness, food systems and youth enterprise;
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    The Business Lounge
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
                    A networking and enterprise platform for conversations on business, leadership, innovation and career growth; and the Research Support Initiative, which supports postgraduate students through thesis clinics, publication guidance, seminars and research capacity-building.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8 space-y-24">
        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left: Image */}
          <div className="relative w-full min-h-[350px] md:min-h-[400px] rounded-sm overflow-hidden">
            <Image 
              src="/mission-vision-img.png" 
              alt="Graduation event" 
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Stacked Cards */}
          <div className="flex flex-col gap-6 justify-between">
            {/* Mission Box */}
            <div className="bg-[#f0f2f5] p-8 rounded-sm flex-1 flex flex-col justify-center space-y-3">
              <h3 className="text-2xl font-bold text-[#001a54]">Our Mission</h3>
              <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
                To serve as the official voice and representative body of postgraduate students at UPSA by promoting their academic, social, professional and general welfare through effective advocacy, responsive leadership, inclusive engagement, accountable governance and constructive collaboration with University authorities and relevant stakeholders.
              </p>
            </div>

            {/* Vision Box */}
            <div className="bg-[#001a54] p-8 rounded-sm flex-1 flex flex-col justify-center space-y-3 text-white">
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                To build a vibrant, inclusive, research-driven and student-centred graduate community where every postgraduate student at UPSA is empowered to excel academically, grow professionally, participate meaningfully in student life, and contribute to national development through research and practice.
              </p>
            </div>
          </div>
        </section>

        {/* Our Focus Areas - Split Card Grid Style from Homepage */}
        <section className="space-y-8">
          <div className="text-left">
            <p className="text-xs sm:text-sm font-bold text-[#B8860B] uppercase tracking-widest mb-1.5">Our Agenda</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001a54] leading-tight">
              Our Focus Areas
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {focusAreas.map((area, idx) => {
              const IconComponent = area.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row w-full min-h-[250px] bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Left Side: Content */}
                  <div className="w-full sm:w-[58%] p-6 flex flex-col justify-between text-left">
                    <div>
                      {/* Icon Wrapper */}
                      <div className="w-11 h-11 rounded-full bg-[#FAF6EC] border border-[#F5EAD2] flex items-center justify-center mb-3">
                        <IconComponent className="w-5 h-5 text-[#B8860B]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base font-extrabold text-neutral-900 leading-snug mb-2">
                        {area.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed line-clamp-4">
                        {area.description}
                      </p>
                    </div>
                  </div>
                  {/* Right Side: Image */}
                  <div className="w-full sm:w-[42%] relative h-48 sm:h-full min-h-[180px]">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Our Objectives - Auto-switching design with photo */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-6">
          {/* Left Column: Objectives content and auto-ticker */}
          <div className="flex flex-col justify-center space-y-8 text-left">
            <h2 className="text-4xl font-extrabold text-[#001a54] tracking-tight">
              Objectives
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              {objectives.map((objective, idx) => {
                const isActive = activeObjective === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveObjective(idx)}
                    className={`cursor-pointer transition-all duration-500 pl-4 py-2 ${
                      isActive 
                        ? 'border-l-4 border-[#B8860B] font-semibold text-neutral-900 opacity-100' 
                        : 'border-l-4 border-transparent text-neutral-400 opacity-40 hover:opacity-70'
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed">
                      {objective}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative w-full min-h-[400px] md:min-h-[500px] rounded-lg overflow-hidden shadow-sm">
            <Image 
              src="/objectives-img.png" 
              alt="Graduates" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Partner with Us Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-12 pb-6 border-t border-neutral-100">
          {/* Left Column: Text and CTA */}
          <div className="space-y-6 text-left">
            <h2 className="text-4xl font-extrabold text-[#001a54] tracking-tight">
              Partner with Us
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
              <p>
                Through its focus on good governance, research, inclusion, student welfare, employability, entrepreneurship and graduate community engagement, GRASAG-UPSA offers partners a credible platform to support talent development, thought leadership, innovation, policy dialogue and professional excellence.
              </p>
              <p>
                Partnering with GRASAG-UPSA is an opportunity to invest in a purposeful and influential postgraduate community capable of generating ideas, leading conversations, building enterprises, conducting research and shaping the future of work, business, governance and leadership in Ghana and beyond.
              </p>
            </div>
            <div>
              <button className="border border-[#001a54] text-[#001a54] hover:bg-[#001a54] hover:text-white transition-all duration-300 rounded-full px-8 py-3 text-sm font-semibold tracking-wide">
                Partner with us
              </button>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center">
            <Image 
              src="/partner-image.png" 
              alt="Two professionals representing partnership" 
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </section>
      </div>
    </div>
  );
}
