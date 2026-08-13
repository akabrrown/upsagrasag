'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Plus, Search, Filter, ArrowLeft, Image as ImageIcon, Calendar } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

type GalleryImage = {
  url: string;
  title: string;
  description?: string;
  uploaded_at: string;
};

type ViewState = 'list' | 'add';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Images');
  const [uploading, setUploading] = useState(false);

  // Form state for single or multiple upload
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to fetch images');
      const data = await res.json();
      setImages(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOpenAdd = () => {
    setUploadedUrls([]);
    setTitle('');
    setDescription('');
    setError('');
    setView('add');
  };

  const handleUploadImage = (url: string) => {
    setUploadedUrls(prev => [...prev, url]);
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setUploadedUrls(prev => prev.filter(u => u !== urlToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (uploadedUrls.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      // API expects { images: [{ url, title, description }] }
      const payload = uploadedUrls.map((url) => ({
        url,
        title: title || 'Untitled',
        description: description || null,
      }));

      const apiRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: payload }),
      });

      if (!apiRes.ok) throw new Error('Database insert failed');

      await fetchImages();
      setView('list');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const tabs = ['All Images', 'Recent'];

  const filteredImages = images.filter((img) => {
    if (activeTab === 'Recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(img.uploaded_at) >= thirtyDaysAgo;
    }
    return true;
  });

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your platform's visual assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search images..." 
              className="pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-md text-sm focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-0 w-64 transition-all"
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#001a54] text-white rounded-md text-sm font-medium hover:bg-[#001a54]/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-[#001a54] text-[#001a54]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
              <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-medium">Your library is empty</p>
              <p className="text-gray-500 text-sm mt-1">Upload images to start building your gallery.</p>
              <button 
                onClick={handleOpenAdd}
                className="mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Upload first image
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filteredImages.map((img, idx) => {
                const hasTitle = img.title && img.title.trim().toLowerCase() !== 'untitled';
                
                return (
                  <div 
                    key={img.url + idx} 
                    className="group relative rounded-lg overflow-hidden bg-gray-100 break-inside-avoid shadow-sm border border-black/5"
                  >
                    <Image 
                      src={img.url} 
                      alt={hasTitle ? img.title : 'Library image'} 
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                      unoptimized
                    />
                    
                    {/* Minimalist Hover State */}
                    {hasTitle && (
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-medium line-clamp-1">{img.title}</p>
                        {img.description && (
                          <p className="text-white/80 text-xs line-clamp-1 mt-0.5">{img.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AddView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload to Media Library</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Gallery &gt; Add</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={uploading}
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50"
          >
            {uploading ? 'Saving...' : 'Save Images'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Metadata</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                <input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a default title for uploaded images"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
                />
                <p className="text-xs text-gray-400 mt-1">Applied to all images in this upload batch if multiple are selected.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief description..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] resize-y" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Files</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
              <CloudinaryUpload onUpload={handleUploadImage} />
              <div className="mt-4 text-xs text-gray-500 pb-2">
                <p>Click to upload or drag and drop</p>
                <p className="mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
              </div>
            </div>

            {uploadedUrls.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Staged for Upload ({uploadedUrls.length})</h3>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedUrls.map((url, idx) => (
                    <div key={idx} className="relative group rounded-md overflow-hidden border border-gray-200 aspect-square">
                      <Image src={url} alt="Staged upload" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => handleRemoveUrl(url)}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {view === 'list' ? <ListView /> : <AddView />}
    </div>
  );
}
