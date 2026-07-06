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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Gallery</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search images..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] w-64"
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" /> Add New Image
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 px-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-[#2563eb] text-[#2563eb]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
              Loading images...
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No images found in the gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredImages.map((img) => (
                <div key={img.url} className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image 
                      src={img.url} 
                      alt={img.title || 'Gallery image'} 
                      fill 
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1" title={img.title}>{img.title || 'Untitled'}</h3>
                      {img.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={img.description}>{img.description}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(img.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
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
