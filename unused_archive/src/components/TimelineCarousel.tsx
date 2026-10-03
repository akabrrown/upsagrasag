import React from 'react';

interface SubEvent {
  id?: string;
  title: string;
  start_at: string; // ISO string
  end_at?: string;
  description?: string;
}

interface TimelineCarouselProps {
  subEvents: SubEvent[];
}

export const TimelineCarousel: React.FC<TimelineCarouselProps> = ({ subEvents }) => {
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex gap-4 snap-x snap-mandatory">
        {subEvents.map((se, idx) => (
          <div
            key={se.id || idx}
            className="min-w-[250px] bg-white rounded-lg p-4 shadow-md snap-center flex-shrink-0"
          >
            <h4 className="font-semibold text-primary mb-2">{se.title}</h4>
            <p className="text-sm text-neutral-600 mb-1">
              {new Date(se.start_at).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {se.end_at && (
                <> – {new Date(se.end_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</>
              )}
            </p>
            {se.description && (
              <p className="text-xs text-neutral-700">{se.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
