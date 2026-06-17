import React from "react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-indigo-600" />
    </div>
  );
}
