import { opportunityService } from '@/lib/supabase/admin';
import type { Opportunity } from '@/types/admin';

export async function getOpportunities(): Promise<Opportunity[]> {
  // Directly use the admin service to fetch all opportunities.
  // This works on the server side (force-dynamic) for up-to-date data.
  return await opportunityService.list();
}
