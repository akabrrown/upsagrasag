"use client";

import React, { useState } from "react";
import { Card, ModalOverlay } from "./ui";

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
      <Card className="flex flex-col h-full justify-between p-4">
        <div className="flex flex-col items-center">
          {/* Image with glass‑morphism and face‑preserving crop */}
          <div className="relative w-48 h-48 rounded-full overflow-hidden border border-white/20 bg-white/10 mb-4">
            <img src={image} alt={name} className="object-cover w-full h-full object-top" />
          </div>
          <h3 className="font-semibold text-lg text-neutral-900">{name}</h3>
          <p className="text-sm text-accent uppercase tracking-wider mb-2">{role}</p>
          <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-accent transition-colors">
            <svg className="h-4 w-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {email}
          </a>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="mt-3 bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
            See Info
          </button>
        </div>
      </Card>

      {showInfo && (
        <ModalOverlay onClose={() => setShowInfo(false)}>
          <div className="flex flex-col md:flex-row w-full h-full bg-white backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-auto">
            {/* Left side */}
            <Card className="flex flex-col justify-between p-6 border-r border-neutral-100">
              <img src={image} alt={name} className="object-cover w-48 h-48 rounded-md mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 mb-1">{name}</h3>
              <p className="text-sm text-accent uppercase tracking-wide">{role}</p>
            </Card>
            {/* Right side */}
            <div className="w-full md:w-2/3 p-6 overflow-y-auto">
              <h4 className="text-md font-semibold mb-3">About {name}</h4>
              <p className="text-neutral-600">
                {bio || `Add a detailed biography, achievements, or any additional information about ${name} here.`}
              </p>
            </div>
          </div>
        </ModalOverlay>
      )}
    </>
  );
};
