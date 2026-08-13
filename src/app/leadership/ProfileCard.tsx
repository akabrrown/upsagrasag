"use client";

import React, { useState } from "react";
import { ModalOverlay } from "./ui";
import { ArrowRight, Mail } from "lucide-react";

interface ProfileProps {
  name: string;
  role: string;
  image: string;
  email: string;
  bio?: string;
}

export const ProfileCard: React.FC<ProfileProps> = ({ name, role, image, email, bio }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowInfo(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-200/60 shadow-lg transition-all duration-500 hover:border-primary/40 hover:shadow-xl flex flex-col justify-end aspect-[3/4]"
      >
        {/* Large Portrait Image */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
          />
          {/* Magazine overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Card Contents */}
        <div className="relative z-10 p-6 flex flex-col justify-end h-full">
          {/* Role Badge */}
          <div className="mb-2 self-start">
            <span className="inline-block rounded-full bg-accent/20 border border-accent/35 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-neutral-950">
              {role}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-2xl font-bold text-white tracking-tight leading-none mb-2 group-hover:text-accent transition-colors duration-300">
            {name}
          </h3>

          {/* Bio / Message (Short excerpt) */}
          <p className="text-sm text-neutral-350 line-clamp-2 mb-4 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            {bio || `Dedicated to advancing the academic, professional, and social interests of all graduate students.`}
          </p>

          {/* Button (Slides in / fades in) */}
          <div className="transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex items-center gap-2 text-accent font-semibold text-sm">
            <span>View Profile</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {showInfo && (
        <ModalOverlay onClose={() => setShowInfo(false)}>
          <div className="flex flex-col md:flex-row w-full h-full max-w-4xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden">
            {/* Left Side: Large Portrait & Basic Info */}
            <div className="relative w-full md:w-2/5 min-h-[350px] md:min-h-full">
              <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">
                  {role}
                </span>
                <h3 className="text-3xl font-extrabold text-white leading-none">{name}</h3>
              </div>
            </div>

            {/* Right Side: Detailed Bio & Email */}
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-between bg-white text-neutral-900 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Biography</h4>
                  <p className="text-neutral-600 leading-relaxed text-base">
                    {bio || `${name} is an active executive member of the GRASAG-UPSA team, working tirelessly to execute initiatives that support academic excellence, career development, and graduate student welfare.`}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-250 flex items-center justify-between">
                <a 
                  href={`mailto:${email}`} 
                  className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors duration-200"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{email}</span>
                </a>
                <button
                  onClick={() => setShowInfo(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-sm font-semibold rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
    </>
  );
};
