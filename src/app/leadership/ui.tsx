/* src/app/leadership/ui.tsx */
"use client";
import React, { ReactNode } from "react";

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`group rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
};

export const ModalOverlay: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
}> = ({ isOpen = true, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
      style={{ backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-xl shadow-2xl p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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
      className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
};
