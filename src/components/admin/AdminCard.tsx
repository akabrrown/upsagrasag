// src/components/admin/AdminCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AdminCardProps {
  title: string;
  children: ReactNode;
  /** Optional toolbar actions placed on the right side of the header */
  toolbar?: ReactNode;
}

export default function AdminCard({ title, children, toolbar }: AdminCardProps) {
  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {toolbar && <div className="flex items-center space-x-2">{toolbar}</div>}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
