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
  stats?: {
    executivesCount: number;
    eventsCount: number;
  };
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

export const LeadershipClient: React.FC<LeadershipClientProps> = ({ executives, pastExecutives = [], patrons = [], stats }) => {


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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-8">
          <div className="space-y-2">
            <div className="flex items-center justify-center text-primary mb-2">
              <Users className="w-8 h-8" />
            </div>
            <AnimatedCounter target={stats?.executivesCount || 12} />
            <p className="text-xs uppercase tracking-widest text-neutral-600 font-bold">Executive Members</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center text-primary mb-2">
              <Calendar className="w-8 h-8" />
            </div>
            <AnimatedCounter target={stats?.eventsCount || 25} />
            <p className="text-xs uppercase tracking-widest text-neutral-600 font-bold">Events Organised</p>
          </div>
        </div>
      </section>



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
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{leader.bio}</p>
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
