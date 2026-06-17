// src/components/admin/FormModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface FormModalProps {
  /** Button label that opens the modal */
  triggerLabel: string;
  /** Modal title */
  title: string;
  /** Form content – usually a component with its own state */
  children: ReactNode;
}

export default function FormModal({ triggerLabel, title, children }: FormModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
