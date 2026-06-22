"use client";

import React, { useEffect, useState } from 'react';

export default function StudentSupportAcademicCalendarPage() {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/academic-calendar')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="p-4 text-red-500">Failed to load calendar.</div>;
  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Academic Calendar</h1>
      {data.length === 0 ? (
        <p>No events scheduled.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item: any) => (
            <li key={item.id} className="border p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 text-gray-700">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
