// src/app/admin/executives/create/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { executiveService } from "@/lib/supabase/admin"
import AdminCard from "@/components/admin/AdminCard"
import CloudinaryUpload from "@/components/admin/CloudinaryUpload"

export default function CreateExecutive() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [bio, setBio] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [displayOrder, setDisplayOrder] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await executiveService.create({
        name,
        title,
        bio,
        photo_url: photoUrl,
        display_order: displayOrder,
      })
      router.push("/admin/executives")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminCard title="Create Executive">
      <section className="p-6 bg-white min-h-screen">
        {error && <p className="text-red-600 mb-2">Error: {error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Photo (Import Media)</label>
            <CloudinaryUpload onUpload={setPhotoUrl} placeholder="Upload Photo" />
            {photoUrl && (
              <img src={photoUrl} alt="preview" className="mt-2 h-20 w-20 object-cover rounded" />
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              min={0}
              className="w-24 border rounded p-2"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Saving…" : "Save"}
          </button>
        </form>
      </section>
    </AdminCard>
  )
}
