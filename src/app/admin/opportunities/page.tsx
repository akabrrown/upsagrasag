// app/admin/opportunities/page.tsx
import React from 'react';
import { CrudTable } from '@/components/admin/CrudTable';
import { opportunityService } from '@/lib/supabase/admin';
import type { Opportunity, ColumnConfig } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const opportunities = await opportunityService.list();

  const columns: ColumnConfig<Opportunity>[] = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
  ];

  if (!opportunities) return <p className="text-center text-gray-500">Loading…</p>;
  if (opportunities.length === 0) return <p className="text-center text-gray-500">No opportunities found.</p>;

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">Opportunities</h2>
      <CrudTable<Opportunity & { id: string }> 
        data={opportunities as (Opportunity & { id: string })[]} 
        columns={columns as any} 
        entity="opportunities" 
      />
    </section>
  );
}
