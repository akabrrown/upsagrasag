import React from 'react';
import ResourcesClient from './ResourcesClient';
import { resourceService } from '@/lib/supabase/admin';
import type { Resource } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  let dbResources: Resource[] = [];
  try {
    dbResources = await resourceService.list();
  } catch (error) {
    console.error("Failed to load resources from DB:", error);
  }

  return <ResourcesClient initialResources={dbResources} />;
}
