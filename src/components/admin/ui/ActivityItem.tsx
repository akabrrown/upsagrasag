"use client";
import React from 'react';

interface Activity {
  user: string;
  action: string;
  target: string;
  time: string;
}

type ActivityItemProps = {
  activity: Activity;
  isLast: boolean;
};

export default function ActivityItem({ activity, isLast }: ActivityItemProps) {
  return (
    <div className="activity-item flex gap-4 relative">
      {!isLast && (
        <div className="absolute top-8 left-[11px] bottom-[-24px] w-px bg-gray-100" />
      )}
      <div className="w-6 h-6 rounded-full bg-[#004080]/10 border-2 border-white flex-shrink-0 z-10 flex items-center justify-center mt-1">
        <div className="w-2 h-2 rounded-full bg-[#004080]" />
      </div>
      <div>
        <p className="text-sm text-gray-800 font-medium">
          <span className="font-bold">{activity.user}</span> {activity.action}{' '}
          <span className="font-semibold text-[#004080]">{activity.target}</span>
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-1">{activity.time}</p>
      </div>
    </div>
  );
}
