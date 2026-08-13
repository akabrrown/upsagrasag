"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProfileCard } from "./ProfileCard";
import { ModalOverlay } from "./ui";
import { ArrowRight, Award, GraduationCap, Calendar, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface Leader {
  id: string;
  name: string;
  role: string;
  image_url?: string | null;
  bio?: string | null;
  type?: string | null;
  display_order?: number | null;
  email?: string | null;
}

interface LeadershipClientProps {
  executives: Leader[];
}

// Custom Counter Component for animated statistics
const AnimatedCounter: React.FC<{ target: number; suffix?: string }> = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
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

export const LeadershipClient: React.FC<LeadershipClientProps> = ({ executives }) => {
  const [showPresidentModal, setShowPresidentModal] = useState(false);

  // Find President
  const president = executives.find(
    (l) => l.role.toLowerCase().includes("president") && !l.role.toLowerCase().includes("vice")
  ) || executives[0];

  // Generate timeline leaders dynamically from all executives sorted by order
  const timelineLeaders = [...executives].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

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
            <img 
              src={president.image_url ?? "/default-avatar.png"} 
              alt={president.name} 
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

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
              Leading graduate student advocacy, academic excellence, and community impact initiatives to build a stronger student body.
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
              <img src={president.image_url ?? "/default-avatar.png"} alt={president.name} className="absolute inset-0 w-full h-full object-cover object-top" />
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
                  <div className="text-neutral-600 space-y-4 leading-relaxed text-sm sm:text-base">
                    <p>
                      {president.bio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-xs text-neutral-500">{president.email || "president@grasagupsa.org"}</span>
                <button
                  onClick={() => setShowPresidentModal(false)}
                  className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-sm font-semibold rounded-lg text-neutral-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 3. Leadership Timeline (Scroll animation) */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <span className="text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">Hierarchy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Leadership Timeline</h2>
          <p className="text-neutral-550 max-w-xl mx-auto text-sm sm:text-base">
            Chronological workflow and leadership flow representing the core structure of the executive body.
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
                        <img 
                          src={leader.image_url ?? "/default-avatar.png"} 
                          alt={leader.name} 
                          className="w-16 h-16 rounded-full object-cover object-top border-2 border-accent/20"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                            {leader.role}
                          </span>
                          <h4 className="text-lg font-bold text-neutral-900 leading-tight">{leader.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{leader.bio || "Executive member"}</p>
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

      {/* 4. Executive Cards (Magazine Style) */}
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
              email={leader.email ?? ""}
              bio={leader.bio ?? ""}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
