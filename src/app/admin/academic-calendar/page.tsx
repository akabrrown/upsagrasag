"use client";

import React, { useEffect, useState } from 'react';

export default function AdminAcademicCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/academic-calendar');
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      setError('Failed to load events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/academic-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, description })
      });
      if (!res.ok) throw new Error('Create failed');
      setTitle('');
      setDate('');
      setDescription('');
      fetchEvents();
    } catch (e) {
      setError('Failed to create event');
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      const res = await fetch('/api/academic-calendar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchEvents();
    } catch (e) {
      setError('Failed to delete event');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Academic Calendar</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleCreate} className="space-y-4 mb-8 border p-4 rounded-md">
        <h2 className="text-xl font-semibold">Add New Event</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button type="submit" className="bg-[#B8860B] text-white px-4 py-2 rounded">
          Create Event
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Events</h2>
      {events.length === 0 ? (
        <p>No events.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((ev) => (
            <li key={ev.id} className="border p-3 rounded-md flex justify-between items-center">
              <div>
                <strong>{ev.title}</strong> - {new Date(ev.date).toLocaleDateString()}
                <p className="text-sm text-gray-600">{ev.description}</p>
              </div>
              <button
                onClick={() => handleDelete(ev.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
