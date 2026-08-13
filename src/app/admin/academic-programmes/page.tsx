'use client';

import { useState } from 'react';
import useSWR from 'swr';
import AdminPageTemplate from '@/components/admin/ui/AdminPageTemplate';
import Table from '@/components/admin/ui/Table';
import Button from '@/components/admin/ui/Button';
import Modal from '@/components/admin/ui/Modal';
import Input from '@/components/admin/ui/Input';
import Select from '@/components/admin/ui/Select';
import { AcademicProgramme } from '@/types/admin';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AcademicProgrammesAdmin() {
  const { data: programmes, mutate, isLoading } = useSWR<AcademicProgramme[]>('/api/admin/academic-programmes', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [category, setCategory] = useState<'LLM' | 'MA' | 'MSc' | 'MBA' | 'MPhil'>('MSc');
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (programme: AcademicProgramme) => {
    setEditingId(programme.id!);
    setCategory(programme.category);
    setName(programme.name);
    setDisplayOrder(programme.display_order || 0);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setCategory('MSc');
    setName('');
    setDisplayOrder(0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/admin/academic-programmes/${editingId}` : '/api/admin/academic-programmes';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, name, display_order: displayOrder }),
      });
      
      if (!res.ok) throw new Error('Failed to save');
      await mutate();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme?')) return;
    try {
      const res = await fetch(`/api/admin/academic-programmes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await mutate();
    } catch (err) {
      console.error(err);
      alert('Error deleting record');
    }
  };

  const columns = [
    { header: 'Category', accessor: 'category' },
    { header: 'Programme Name', accessor: 'name' },
    { header: 'Display Order', accessor: 'display_order' },
  ];

  return (
    <AdminPageTemplate
      title="Academic Programmes"
      description="Manage the academic programmes listed on the Our Community page."
      actions={<Button onClick={handleAdd}>Add New Programme</Button>}
    >
      <Table
        columns={columns}
        data={programmes || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(row) => handleDelete(row.id!)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Programme' : 'Add Programme'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            options={[
              { value: 'LLM', label: 'LLM Programmes' },
              { value: 'MA', label: 'MA Programmes' },
              { value: 'MSc', label: 'MSc Programmes' },
              { value: 'MBA', label: 'MBA Programmes' },
              { value: 'MPhil', label: 'MPhil Programmes' },
            ]}
          />
          <Input
            label="Programme Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Master of Science in Insurance Risk Management"
          />
          <Input
            label="Display Order (Optional)"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Save</Button>
          </div>
        </form>
      </Modal>
    </AdminPageTemplate>
  );
}
