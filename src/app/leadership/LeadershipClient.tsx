"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProfileCard } from "./ProfileCard";
import { ModalOverlay } from "./ui";
import Image from "next/image";
import { ArrowRight, Award, GraduationCap, Calendar, Users, Mail } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/lib/optimizeImage";

interface Leader {
  id: string;
  name: string;
  role: string;
  image_url?: string | null;
  bio?: string | null;
  type?: string | null;
  display_order?: number | null;
  email?: string | null;
  phone?: string | null;
}

interface PastExecutive {
  id: string;
  name: string;
  role: string;
  term: string;
  bio?: string | null;
  image_url?: string | null;
  display_order?: number;
}

interface LeadershipClientProps {
  executives: Leader[];
  pastExecutives?: PastExecutive[];
  patrons?: Leader[];
}

// Custom Counter Component for animated statistics
const AnimatedCounter: React.FC<{ target: number; suffix?: string }> = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * target);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-extrabold text-5xl text-accent">
      {count}
      {suffix}
    </span>
  );
};

export const LeadershipClient: React.FC<LeadershipClientProps> = ({ executives, pastExecutives = [], patrons = [] }) => {
  const [showPresidentModal, setShowPresidentModal] = useState(false);

  // Find President
  const president = executives.find(
    (l) => l.role.toLowerCase().includes("president") && !l.role.toLowerCase().includes("vice")
  ) || executives[0];

  // Generate timeline leaders dynamically from past executives
  const timelineLeaders = [...pastExecutives].sort((a, b) => {
    if (a.term !== b.term) return b.term.localeCompare(a.term);
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  return (
    <div className="space-y-32">
      {/* 1. Statistics Section (Moved Above President's Card) */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-50 border border-neutral-200 p-8 sm:p-12 shadow-xl text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-64 w-full max-w-2xl rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center justify-center text-primary mb-2">
              <Users className="w-8 h-8" />
            </div>
            <AnimatedCounter target={12} />
            <p className="text-xs uppercase tracking-widest text-neutral-600 font-bold">Executive Members</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center text-primary mb-2">
              <Award className="w-8 h-8" />
            </div>
            <AnimatedCounter target={10} suffix="+" />
            <p className="text-xs uppercase tracking-widest text-neutral-600 font-bold">Committees</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center text-primary mb-2">
              <GraduationCap className="w-8 h-8" />
            </div>
            <AnimatedCounter target={300} suffix="+" />
            <p className="text-xs uppercase tracking-widest text-neutral-600 font-bold">Graduate Members</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center text-primary mb-2">
              <Calendar className="w-8 h-8" />
            </div>
            <AnimatedCounter target={25} />
            <p className="text-xs uppercase tracking-widest text-neutral-600 font-bold">Events Organised</p>
          </div>
        </div>
      </section>

      {/* 2. Featured President Section */}
      {president && (
        <section 
          onClick={() => setShowPresidentModal(true)}
          className="relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-neutral-200 shadow-xl flex flex-col md:flex-row min-h-[420px] transition-all duration-300 hover:shadow-2xl hover:border-primary/20"
        >
          {/* Left: Grayscale Portrait with exact bleed fit */}
          <div className="relative w-full md:w-[35%] min-h-[300px] md:min-h-full overflow-hidden bg-neutral-100">
            <Image 
              src={optimizeCloudinaryUrl(president.image_url) ?? "/default-avatar.png"} 
              alt={president.name} 
              fill
              className="absolute inset-0 w-full h-full object-cover object-top grayscale transition-transform duration-750 hover:scale-[1.03]"
            />
          </div>

          {/* Right: Message Content */}
          <div className="w-full md:w-[65%] p-8 sm:p-12 flex flex-col justify-center space-y-6 text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Featured Leader
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                {president.name}
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {president.role}
              </p>
            </div>

            <p className="text-neutral-600 leading-relaxed text-base whitespace-pre-wrap">
              {president.bio || `Samuel Sasu Adonteng is a youth development practitioner, policy advocate, and emerging academic with experience in project management, public policy, entrepreneurship, education, and students’ rights. He is currently affiliated with the University of Professional Studies, Accra, supporting work across the Media and Website Unit and the UPSA Enterprise and Innovation Centre, where he contributes to programme design, research, communications, innovation, and student enterprise development.`}
            </p>

            {/* Badges / Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-250/50 rounded-full">
                Organizational Leadership
              </span>
              <span className="px-3 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-250/50 rounded-full">
                Youth Development
              </span>
              <span className="px-3 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-250/50 rounded-full">
                Strategic Partnerships
              </span>
              <span className="px-3 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-250/50 rounded-full">
                Student Advocacy
              </span>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                <span>View Profile</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </section>
      )}

      {/* President message modal */}
      {showPresidentModal && president && (
        <ModalOverlay onClose={() => setShowPresidentModal(false)}>
          <div className="flex flex-col md:flex-row w-full h-full max-w-4xl bg-white text-neutral-800">
            <div className="relative w-full md:w-2/5 min-h-[300px] md:min-h-full">
              <Image src={optimizeCloudinaryUrl(president.image_url) ?? "/default-avatar.png"} alt={president.name} fill className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
                  Executive President
                </span>
                <h3 className="text-3xl font-extrabold text-white leading-none">{president.name}</h3>
              </div>
            </div>

            <div className="w-full md:w-3/5 p-8 flex flex-col justify-between bg-white overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">President's Biography</h4>
                  <p className="text-neutral-350 leading-relaxed text-sm md:text-base mb-6 max-w-xl whitespace-pre-wrap">
                    {president.bio || `Samuel Sasu Adonteng is a youth development practitioner, policy advocate, and emerging academic with experience in project management, public policy, entrepreneurship, education, and students’ rights.`}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-250 flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col gap-2">
                  {president.email && (
                    <a href={`mailto:${president.email}`} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors duration-200">
                      <Mail className="w-5 h-5 text-primary" />
                      <span>{president.email}</span>
                    </a>
                  )}
                  {president.phone && (
                    <a href={`tel:${president.phone}`} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors duration-200">
                      <span className="flex items-center justify-center w-5 h-5 text-primary">📞</span>
                      <span>{president.phone}</span>
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setShowPresidentModal(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-sm font-semibold rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 3. Leadership Timeline (Past Leaders — Scroll animation) */}
      {timelineLeaders.length > 0 && (
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <span className="text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">Legacy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Leadership Timeline</h2>
          <p className="text-neutral-550 max-w-xl mx-auto text-sm sm:text-base">
            Honoring the leaders who built the foundation of our association across successive terms.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          {/* Vertical central line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-neutral-200 -translate-x-1/2" />

          <div className="space-y-12">
            {timelineLeaders.map((leader, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between w-full ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline point indicator */}
                  <div className="absolute left-6 sm:left-1/2 w-4 h-4 rounded-full bg-accent border-4 border-white -translate-x-1/2 z-10 shadow-lg shadow-accent/50" />

                  {/* Empty spacer for desktop layout */}
                  <div className="hidden sm:block w-5/12" />

                  {/* Card wrapper */}
                  <div className="w-full sm:w-5/12 pl-12 sm:pl-0">
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-neutral-200 p-5 shadow-md transition-all duration-300 hover:border-primary/30">
                      <div className="flex items-center gap-4">
                        <Image 
                          src={optimizeCloudinaryUrl(leader.image_url, { width: 400 }) ?? "/default-avatar.png"} 
                          alt={leader.name} 
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover object-top border-2 border-accent/20"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                            {leader.role}
                          </span>
                          <h4 className="text-lg font-bold text-neutral-900 leading-tight">{leader.name}</h4>
                          {leader.term && (
                            <p className="text-[11px] font-semibold text-primary/70 mt-0.5">{leader.term}</p>
                          )}
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{leader.bio || "Former executive member"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* 4. Patron Leaders Section */}
      {patrons.length > 0 && (
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <span className="text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">Patrons</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Patron Leaders</h2>
            <p className="text-neutral-550 max-w-xl mx-auto text-sm sm:text-base">
              Distinguished patrons whose guidance and counsel shape the direction of our association.
            </p>
          </div>

          {/* First patron centered, rest in 2-col grid */}
          <div className="space-y-8">
            {/* First patron — standalone, centered */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <ProfileCard
                  name={patrons[0].name}
                  role={patrons[0].role}
                  image={patrons[0].image_url ?? "/default-avatar.png"}
                  email={patrons[0].email ?? undefined}
                  phone={patrons[0].phone ?? undefined}
                  bio={patrons[0].bio ?? ""}
                />
              </div>
            </div>

            {/* Remaining patrons — 2-column grid */}
            {patrons.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {patrons.slice(1).map((patron) => (
                  <ProfileCard
                    key={patron.id}
                    name={patron.name}
                    role={patron.role}
                    image={patron.image_url ?? "/default-avatar.png"}
                    email={patron.email ?? undefined}
                    phone={patron.phone ?? undefined}
                    bio={patron.bio ?? ""}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Executive Cards (Magazine Style) */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <span className="text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">Portraits</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Executive Officers</h2>
          <p className="text-neutral-550 max-w-xl mx-auto text-sm sm:text-base">
            Hover over the magazine cover profiles to view names, quotes, and expand full profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {executives.map((leader) => (
            <ProfileCard
              key={leader.id}
              name={leader.name}
              role={leader.role}
              image={leader.image_url ?? "/default-avatar.png"}
              email={leader.email ?? undefined}
              phone={leader.phone ?? undefined}
              bio={leader.bio ?? ""}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
