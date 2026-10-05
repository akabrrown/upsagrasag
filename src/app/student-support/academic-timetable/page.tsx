import React from 'react';
import AcademicTimetableClient from './AcademicTimetableClient';
import { resourceService } from '@/lib/supabase/admin';
import type { Resource } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function AcademicTimetablePage() {
  return <AcademicTimetableClient />;
}
