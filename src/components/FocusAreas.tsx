"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import { X } from 'lucide-react';

const cardList = [
  {
    title: 'Good Governance, Representation and Accountability',
    description: 'GRASAG-UPSA promotes transparent, accountable and responsive leadership through effective representation, timely communication, responsible resource management and constitutional governance. We ensure that every graduate student has a voice in university decision-making processes and that leaders are held to the highest standards of integrity.',
    image: '/president-speech.png',
    icon_name: 'Scale',
  },
  {
    title: 'Student Welfare, Support and Wellbeing',
    description: 'GRASAG-UPSA prioritises the welfare and wellbeing of graduate students, including mental health, psychosocial support, student-parent support, campus services and emergency support systems. We strive to create a holistic environment that supports students not just academically, but personally and emotionally throughout their graduate journey.',
    image: '/dsdsee.jpg',
    icon_name: 'HeartHandshake',
  },
  {
    title: 'Research, Academic Excellence and Innovation',
    description: 'GRASAG-UPSA supports research, academic excellence and innovation through thesis support, research capacity-building, academic publishing, peer learning and scholarly engagement. We provide resources, workshops, and networking opportunities to help students produce impactful, high-quality research that contributes to national development.',
    image: '/researchhh.png',
    icon_name: 'GraduationCap',
  },
  {
    title: 'Access, Equity, Inclusion and Digital Transformation',
    description: 'GRASAG-UPSA promotes equal access, inclusion and non-discrimination for all graduate students, regardless of gender, religion, ethnicity, disability, nationality or social background. We also advocate for the digital transformation of academic processes to ensure that every student has seamless access to the tools they need to succeed.',
    image: '/inclusive.png',
    icon_name: 'Globe',
  },
  {
    title: 'Graduate Community, Identity and Engagement',
    description: 'GRASAG-UPSA builds a united and active graduate community through student engagement, social interaction, leadership development, recognition programmes, sports, culture and volunteerism. We aim to foster a strong sense of identity and belonging among graduate students, creating lifelong networks and friendships.',
    image: '/communittty.jpg',
    icon_name: 'Users',
  },
  {
    title: 'Advancement, Employability, Entrepreneurship and Partnerships',
    description: 'GRASAG-UPSA connects graduate education to career growth, entrepreneurship and national development through employability initiatives, mentorship, alumni engagement and strategic partnerships. We bridge the gap between academia and industry, equipping our members with the skills and networks needed to excel in their professional careers.',
    image: '/WhatsApp Image 2026-06-20 at 3.52.26 AM.jpeg',
    icon_name: 'Briefcase',
  },
];

export const FocusAreas = () => {
  const [selectedCard, setSelectedCard] = useState<typeof cardList[0] | null>(null);

  // Triplicate the cards to guarantee smooth loop even on wide displays
  const triplicatedCards = [...cardList, ...cardList, ...cardList];

  return (
    <>
      <section className="bg-neutral-50 border-y border-neutral-100 py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12">
          <p className="text-sm font-bold text-[#B8860B] uppercase tracking-widest mb-2">Our Agenda</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Our Focus Areas,<br />
            <span className="text-neutral-500">Championing Graduate Excellence</span>
          </h2>
        </div>

        {/* Scrolling marquee container */}
        <div className="relative w-full overflow-hidden py-4 group">
          {/* Fade gradient overlays on the sides */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-neutral-50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-neutral-50 to-transparent z-10" />

          <div className="animate-marquee group-hover:[animation-play-state:paused] flex gap-6">
            {triplicatedCards.map((card, idx) => {
              const IconComponent = (LucideIcons as any)[card.icon_name] || LucideIcons.HelpCircle;
              return (
                <div
                  key={idx}
                  className="flex-shrink-0 flex w-[520px] sm:w-[600px] md:w-[660px] h-[280px] sm:h-[320px] md:h-[350px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]"
                >
                  {/* Left Side: Content */}
                  <div className="w-[55%] p-5 sm:p-6 md:p-8 flex flex-col justify-between text-left">
                    <div>
                      {/* Icon Wrapper */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF6EC] border border-[#F5EAD2] flex items-center justify-center mb-3 sm:mb-4">
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-[#B8860B]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-snug mb-1.5 sm:mb-2.5 line-clamp-2">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed line-clamp-3">
                        {card.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCard(card);
                      }}
                      className="text-sm sm:text-base font-bold text-[#B8860B] hover:text-primary transition-colors flex items-center gap-1 mt-2 w-fit cursor-pointer relative z-20"
                    >
                      Explore More <span className="text-sm font-normal">→</span>
                    </button>
                  </div>
                  {/* Right Side: Image */}
                  <div className="w-[45%] relative h-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 30vw, 20vw"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedCard(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full text-neutral-700 transition-colors shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-48 sm:h-64 relative">
              <Image
                src={selectedCard.image}
                alt={selectedCard.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-[#FAF6EC] border border-[#F5EAD2] flex-shrink-0">
                  {(() => {
                    const ModalIcon = (LucideIcons as any)[selectedCard.icon_name] || LucideIcons.HelpCircle;
                    return <ModalIcon className="w-6 h-6 text-[#B8860B]" strokeWidth={1.5} />;
                  })()}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
                  {selectedCard.title}
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">
                {selectedCard.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
