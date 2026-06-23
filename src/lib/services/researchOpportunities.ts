import { researchOpportunityService } from '@/lib/supabase/admin';
import type { ResearchOpportunity } from '@/types/admin';

export const getResearchOpportunities = async (): Promise<ResearchOpportunity[]> => {
  // Fetch all research opportunities using the admin service.
  // This function is used by the public Research Opportunities page.
  return await researchOpportunityService.list();
};
