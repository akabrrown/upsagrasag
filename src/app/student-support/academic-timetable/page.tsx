import React from 'react';
import AcademicTimetableClient from './AcademicTimetableClient';
import { resourceService } from '@/lib/supabase/admin';
import type { Resource } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function AcademicTimetablePage() {
  let dbResources: Resource[] = [];
  try {
    dbResources = await resourceService.list();
  } catch (error) {
    console.error("Failed to load resources from DB:", error);
  }

  // Filter resources to only include ones that look like provisional timetables
  // based on the title containing "Timetable" or "PROVISIONAL"
  const timetableResources = dbResources.filter(r => 
    r.title && (r.title.toLowerCase().includes('timetable') || r.title.toLowerCase().includes('provisional'))
  );

  return <AcademicTimetableClient downloadableTimetables={timetableResources} />;
}
