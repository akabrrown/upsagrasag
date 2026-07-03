/* src/app/leadership/ui.tsx */
"use client";
import React, { ReactNode } from "react";

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`group rounded-xl bg-white border border-neutral-200 p-6 shadow-md transition-transform transform hover:scale-[1.02] duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export const ModalOverlay: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}> = ({ isOpen = true, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-black/10 text-neutral-800 hover:bg-black/20 hover:text-primary transition-colors focus:outline-none"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
};
