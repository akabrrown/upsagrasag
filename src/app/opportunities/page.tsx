import React from 'react';
import { getOpportunities } from '@/lib/services/opportunities';
import OpportunitiesClient from './OpportunitiesClient';
import type { Opportunity } from '@/types/admin';

export const dynamic = 'force-dynamic';

const mockOpportunities: Opportunity[] = [
  {
    id: "mock-1",
    title: "Youth Leadership Programme",
    company: "United Nations",
    type: "Full-time",
    category: "Fellowships",
    location: "Accra",
    deadline: "2026-07-25",
    description: "The Youth Leadership Programme (YLP) aims to support young change-makers from across the region to design and implement innovative, impactful, and sustainable development solutions. This cohort will focus on green technology, agribusiness innovation, and civic governance.",
    apply_url: "https://un.org/opportunities",
    image_url: ""
  },
  {
    id: "mock-2",
    title: "Graduate Business Development Internship",
    company: "Standard Chartered Bank",
    type: "Internship",
    category: "Jobs",
    location: "Accra",
    deadline: "2026-08-15",
    description: "An intensive 10-week summer internship program designed to provide high-performing postgraduate students with direct exposure to retail banking, corporate finance, and risk management portfolios.",
    apply_url: "https://sc.com/careers",
    image_url: ""
  },
  {
    id: "mock-3",
    title: "Postgraduate Research Grant 2026",
    company: "Ghana Education Trust Fund (GETFund)",
    type: "Contract",
    category: "Research",
    location: "Accra",
    deadline: "2026-08-30",
    description: "GETFund invites research proposals from registered MPhil and PhD candidates at UPSA. Grants are awarded to projects contributing directly to local industry growth, digital policy development, and digital transformation.",
    apply_url: "https://getfund.gov.gh",
    image_url: ""
  },
  {
    id: "mock-4",
    title: "Mastercard Foundation Scholars Program",
    company: "Mastercard Foundation",
    type: "Full-time",
    category: "Scholarships",
    location: "Accra",
    deadline: "2026-07-20",
    description: "A fully funded scholarship program for talented African students pursuing postgraduate degrees. Covers full tuition, accommodation, learning materials, stipend, and leadership development workshops.",
    apply_url: "https://mastercardfdn.org",
    image_url: ""
  }
];

export default async function OpportunitiesPage() {
  let opportunities: Opportunity[] = [];
  try {
    opportunities = await getOpportunities();
  } catch (error) {
    console.error("Failed to load opportunities from database, falling back to mocks:", error);
  }

  // Combine DB opportunities with mocks if database returns empty or fails
  const allOpportunities = opportunities && opportunities.length > 0 
    ? [...opportunities, ...mockOpportunities] 
    : mockOpportunities;

  return (
    <OpportunitiesClient initialOpportunities={allOpportunities} />
  );
}
