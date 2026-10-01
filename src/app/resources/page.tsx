import React from 'react';
import ResourcesClient from './ResourcesClient';
import { resourceService } from '@/lib/supabase/admin';
import type { Resource } from '@/types/admin';
import supabaseAdmin from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  let dbResources: Resource[] = [];
  let dbQuickLinks: any[] = [];
  try {
    dbResources = await resourceService.list();
    
    const { data: qlData } = await supabaseAdmin
      .from('quick_links')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (qlData) {
      dbQuickLinks = qlData;
    }
  } catch (error) {
    console.error("Failed to load resources from DB:", error);
  }

  return <ResourcesClient initialResources={dbResources} initialQuickLinks={dbQuickLinks} />;
}
