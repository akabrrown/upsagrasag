import React from 'react';
import TutorialsClient from './TutorialsClient';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default async function TutorialsPage() {
  let dbTutorials: any[] = [];
  try {
    const { data } = await supabase
      .from('tutorials')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) dbTutorials = data;
  } catch (error) {
    console.error("Failed to load tutorials from DB:", error);
  }

  return <TutorialsClient dbTutorials={dbTutorials} />;
}
