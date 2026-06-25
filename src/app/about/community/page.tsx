"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

type GalleryImage = {
  url: string;
  title: string;
  uploaded_at: string;
};

export default function CommunityPage() {
  // Gallery State
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetch('/api/gallery')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch images');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setImages(data);
          setLoading(false);
        }
      })
      .catch(e => {
        if (isMounted) {
          setError((e as Error).message);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[name="image"]') as HTMLInputElement;
    const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement;
    const descInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    if (!fileInput.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('description', descInput.value);
    setLoading(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      
      const fetchRes = await fetch('/api/gallery');
      if (!fetchRes.ok) throw new Error('Failed to refresh images');
      const data = await fetchRes.json();
      setImages(data);
      
      form.reset();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Our Community
        </span>
        <h1 className="text-4xl font-extrabold text-accent sm:text-5xl">
          Focus Areas & Gallery
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Explore our core focus areas designed to empower graduate students and browse through moments captured in our community.
        </p>
      </div>

      {/* Focus Areas Section */}
      <section className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
        <div className="site-card-light bg-white p-6 space-y-4 w-full border border-neutral-100 shadow-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-center text-primary mb-6 border-b pb-4">Our Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex flex-col items-center text-center">
              <Image src="/aassest/letter_g_stylish_1782309960852.png" alt="Good Governance" width={64} height={64} className="mb-2" />
              <h3 className="text-lg font-bold text-accent">Good Governance, Representation and Accountability</h3>
              <p className="text-sm text-neutral-500">
                GRASAG-UPSA promotes transparent, accountable and responsive leadership through effective representation, timely communication, responsible resource management and constitutional governance. We remain committed to leadership that is accessible, answerable and focused on the welfare of all postgraduate students.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src="/aassest/letter_r_stylish_1782310071931.png" alt="Research" width={64} height={64} className="mb-2" />
              <h3 className="text-lg font-bold text-accent">Research, Academic Excellence and Innovation</h3>
              <p className="text-sm text-neutral-500">
                GRASAG-UPSA supports research, academic excellence and innovation through thesis support, research capacity-building, academic publishing, peer learning and scholarly engagement. We encourage solution-driven research that contributes to institutional improvement, industry practice and national development.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src="/aassest/letter_a_stylish_1782310150000_1782310122240.png" alt="Access" width={64} height={64} className="mb-2" />
              <h3 className="text-lg font-bold text-accent">Access, Equity, Inclusion and Digital Transformation</h3>
              <p className="text-sm text-neutral-500">
                GRASAG-UPSA promotes equal access, inclusion and non-discrimination for all graduate students, regardless of gender, religion, ethnicity, disability, nationality or social background. We also support digital transformation, accessible communication, technology-enabled services and improved access to digital learning resources.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src="/aassest/letter_s_stylish_1782310200000_1782310253075.png" alt="Welfare" width={64} height={64} className="mb-2" />
              <h3 className="text-lg font-bold text-accent">Student Welfare, Support and Wellbeing</h3>
              <p className="text-sm text-neutral-500">
                GRASAG-UPSA prioritises the welfare and wellbeing of graduate students, including mental health, psychosocial support, student-parent support, campus services and emergency support systems. We are committed to building a caring graduate community where students feel supported beyond the classroom.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src="/aassest/letter_a_stylish_1782310150000_1782310122240.png" alt="Advancement" width={64} height={64} className="mb-2" />
              <h3 className="text-lg font-bold text-accent">Advancement, Employability, Entrepreneurship and Partnerships</h3>
              <p className="text-sm text-neutral-500">
                GRASAG-UPSA connects graduate education to career growth, entrepreneurship and national development through employability initiatives, mentorship, alumni engagement, industry networking and strategic partnerships. We help students translate knowledge into professional progress, enterprise and social impact.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src="/aassest/letter_g_stylish_1782309960852.png" alt="Graduate Community" width={64} height={64} className="mb-2" />
              <h3 className="text-lg font-bold text-accent">Graduate Community, Identity and Engagement</h3>
              <p className="text-sm text-neutral-500">
               GRASAG-UPSA builds a united and active graduate community through student engagement, social interaction, leadership development, recognition programmes, sports, culture and volunteerism. We seek to strengthen identity, belonging and pride among postgraduate students of UPSA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pt-8 border-t border-neutral-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Photo Gallery</h2>
        
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        
        {isAdmin && (
          <form onSubmit={handleUpload} className="mb-8 space-y-4 border border-neutral-200 p-6 rounded-2xl bg-white shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-primary">Upload New Image</h3>
            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-700">Title</label>
              <input type="text" name="title" required className="w-full border border-neutral-300 rounded-lg p-2.5 focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-700">Description</label>
              <textarea name="description" rows={3} className="w-full border border-neutral-300 rounded-lg p-2.5 focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-700">Image File</label>
              <input type="file" name="image" accept="image/*" required className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              {loading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        )}

        {loading && images.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.url} className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="relative h-64 w-full bg-neutral-100 overflow-hidden">
                  <Image src={img.url} alt={img.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-primary truncate">{img.title}</h3>
                  <p className="text-xs font-medium text-neutral-500 mt-1 uppercase tracking-wide">
                    {new Date(img.uploaded_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-100">
            No images have been uploaded to the gallery yet.
          </div>
        )}
      </section>
    </div>
  );
}
