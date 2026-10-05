import React from 'react';
import { getOpportunities } from '@/lib/services/opportunities';
import OpportunitiesClient from './OpportunitiesClient';
import type { Opportunity } from '@/types/admin';

export const dynamic = 'force-dynamic';

// Removed hardcoded mock opportunities

export default async function OpportunitiesPage() {
  let dbOpportunities: Opportunity[] = [];
  try {
    dbOpportunities = await getOpportunities();
  } catch (error) {
    console.error("Failed to load opportunities from database:", error);
  }

  return <OpportunitiesClient initialOpportunities={dbOpportunities || []} />;
}
