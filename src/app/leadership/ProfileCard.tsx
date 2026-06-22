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
    <Card className="flex flex-col h-full justify-between p-4">
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 rounded-md overflow-hidden border border-neutral-200 mb-4">
          <img src={image} alt={name} className="object-cover w-full h-full" />
        </div>
        <h3 className="font-semibold text-lg text-neutral-900">{name}</h3>
        <p className="text-sm text-accent uppercase tracking-wider mb-2">{role}</p>
        <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-accent transition-colors">
          <svg className="h-4 w-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l3-3m-3 3l3 3" />
          </svg>
          {email}
        </a>
        <button
          type="button"
          onClick={() => setShowInfo(true)}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          See Info
        </button>
      </div>

      {showInfo && (
        <ModalOverlay onClose={() => setShowInfo(false)}>
          <div className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-xl overflow-hidden">
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
    </Card>
  );
};
