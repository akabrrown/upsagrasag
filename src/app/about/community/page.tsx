"use client";

export const runtime = 'nodejs';
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { supabaseClient } from '@/lib/supabaseClient';
import { 
  GraduationCap, 
  Briefcase, 
  HeartHandshake, 
  Globe, 
  PartyPopper,
  Quote,
  Star,
  Users,
  Award,
  Sparkles
} from 'lucide-react';

type GalleryImage = {
  url: string;
  title: string;
  uploaded_at: string;
};

export default function CommunityPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState('mba');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data }) => {
      if (data?.user) setIsAdmin(true);
    });
  }, []);

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

  const handleScrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full bg-background text-foreground">
      {/* Speech-bubble Hero Section */}
      <section 
        className="relative w-full min-h-[500px] md:min-h-[580px] bg-no-repeat bg-bottom bg-white flex flex-col justify-start items-center pt-20 px-4 md:px-8 border-b border-neutral-100"
        style={{ 
          backgroundImage: "url('/community-imag.png')",
          backgroundSize: "100% auto",
        }}
      >
        {/* Centered Speech Bubble */}
        <div className="relative max-w-xl w-full bg-white border border-neutral-100 shadow-xl rounded-[40px] px-8 py-8 md:py-10 text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
              Find Your Community
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001a54] tracking-tight leading-tight">
              FIND YOUR PLACE IN THE<br />
              <span className="text-[#B8860B]">GRASAG COMMUNITY</span>
            </h1>
          </div>

          <p className="text-sm font-semibold text-neutral-600">
            Every postgraduate student belongs somewhere.
          </p>

          {/* Selector Dropdown & Explore Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <select 
                value={selectedProgramme}
                onChange={(e) => setSelectedProgramme(e.target.value)}
                className="w-full appearance-none bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-200 rounded-full px-6 py-3 text-sm text-neutral-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#001a54] cursor-pointer"
              >
                <option value="mba">What are you studying? (MBA) ▼</option>
                <option value="mphil">What are you studying? (MPhil) ▼</option>
                <option value="msc">What are you studying? (MSc) ▼</option>
                <option value="ma">What are you studying? (MA) ▼</option>
                <option value="phd">What are you studying? (PhD) ▼</option>
              </select>
            </div>
            <button 
              onClick={() => handleScrollToSection(`${selectedProgramme}-section`)}
              className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-8 py-3 rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
            >
              Explore <span className="text-base">→</span>
            </button>
          </div>

          {/* Quick Links Tags */}
          <div className="flex justify-center items-center gap-2 text-xs font-bold text-neutral-400 pt-2 border-t border-neutral-100">
            <button onClick={() => { setSelectedProgramme('mba'); handleScrollToSection('mba-section'); }} className="hover:text-[#B8860B] transition-colors">MBA</button>
            <span>•</span>
            <button onClick={() => { setSelectedProgramme('mphil'); handleScrollToSection('mphil-section'); }} className="hover:text-[#B8860B] transition-colors">MPhil</button>
            <span>•</span>
            <button onClick={() => { setSelectedProgramme('msc'); handleScrollToSection('msc-section'); }} className="hover:text-[#B8860B] transition-colors">MSc</button>
            <span>•</span>
            <button onClick={() => { setSelectedProgramme('ma'); handleScrollToSection('ma-section'); }} className="hover:text-[#B8860B] transition-colors">MA</button>
            <span>•</span>
            <button onClick={() => { setSelectedProgramme('phd'); handleScrollToSection('phd-section'); }} className="hover:text-[#B8860B] transition-colors">PhD</button>
          </div>

          {/* Speech bubble tail pointer */}
          <div className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px] border-t-white filter drop-shadow-[0_4px_3px_rgba(0,0,0,0.04)]" />
        </div>
      </section>

      {/* Main container for standard layout sections */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-28">
        
        {/* Section 1: Unity in Diversity */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2 className="text-3xl font-extrabold text-[#001a54] tracking-tight">
              Unity in Diversity
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-medium">
              At GRASAG-UPSA, we represent a vibrant tapestry of scholars from diverse academic backgrounds and professional spheres. Our community is more than just a student body; it is a collaborative ecosystem where researchers, practitioners, and leaders converge to push the boundaries of knowledge. Whether you are navigating a complex thesis or expanding your professional horizon, you are part of a family that prioritizes your holistic welfare and academic success.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white border-t-4 border-[#B8860B] border border-neutral-100 p-5 rounded-xl shadow-sm space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#001a54] block">2,500+</span>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider block">Active Members</span>
            </div>
            <div className="bg-white border border-neutral-100 p-5 rounded-xl shadow-sm space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#001a54] block">15+</span>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider block">Chapters</span>
            </div>
            <div className="bg-white border border-neutral-100 p-5 rounded-xl shadow-sm space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#001a54] block">50+</span>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider block">Annual Events</span>
            </div>
            <div className="bg-white border border-neutral-100 p-5 rounded-xl shadow-sm space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#001a54] block">100%</span>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider block">Dedication</span>
            </div>
          </div>
        </section>

        {/* Section 2: Student Chapters */}
        <section className="space-y-8">
          <h2 className="text-3xl font-extrabold text-[#001a54] text-center tracking-tight">
            Student Chapters
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col items-start text-left gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800 leading-snug">Academic & Research Groups</span>
            </div>
            <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col items-start text-left gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800 leading-snug">Professional Networks</span>
            </div>
            <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col items-start text-left gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800 leading-snug">Welfare & Support Circles</span>
            </div>
            <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col items-start text-left gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800 leading-snug">Volunteer & Outreach Teams</span>
            </div>
            <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col items-start text-left gap-4 hover:shadow-md transition-shadow col-span-2 md:col-span-1">
              <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
                <PartyPopper className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800 leading-snug">Events & Social Community</span>
            </div>
          </div>
        </section>

        {/* Section 3: Programme Communities */}
        <section className="space-y-12 max-w-4xl mx-auto border-t border-neutral-100 pt-16">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001a54] tracking-tight">
              Explore Our Program Communities
            </h2>
            <p className="text-sm text-neutral-500 max-w-lg mx-auto font-medium">
              Select your academic cohort to discover tailored events, resources, networking avenues and academic collaborations.
            </p>
          </div>

          <div className="space-y-8">
            {/* MBA Card */}
            <div id="mba-section" className="bg-[#FAF6EC] border border-[#F5EAD2] p-8 rounded-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">MBA Students</h3>
              <p className="text-neutral-600 mb-6 font-medium text-sm">
                Designed for professional career advancement, executive leadership, and business administration.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-[#B8860B] text-base sm:text-lg block mb-1">Networking</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Connect with industry leaders, corporate peers, and alumni.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-[#B8860B] text-base sm:text-lg block mb-1">Industry Events</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Seminars, enterprise showcases, and strategic workshops.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-[#B8860B] text-base sm:text-lg block mb-1">Leadership</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Executive opportunities to coordinate forums and lead projects.</p>
                </div>
              </div>
            </div>

            {/* MPhil Card */}
            <div id="mphil-section" className="bg-[#f0f3fa] border border-[#d2def5] p-8 rounded-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">MPhil Students</h3>
              <p className="text-neutral-600 mb-6 font-medium text-sm">
                Tailored for academic research excellence, conceptual frameworks, and methodology training.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-[#001a54] text-base sm:text-lg block mb-1">Research Support</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Access data repositories, research methodologies, and thesis guidelines.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-[#001a54] text-base sm:text-lg block mb-1">Publishing</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Publishing assistance, peer clinics, and journal review cycles.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-[#001a54] text-base sm:text-lg block mb-1">Conferences</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Participate in national and international research presentations.</p>
                </div>
              </div>
            </div>

            {/* MSc Card */}
            <div id="msc-section" className="bg-[#eefcf5] border border-[#d2f5e3] p-8 rounded-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">MSc Students</h3>
              <p className="text-neutral-600 mb-6 font-medium text-sm">
                Focused on specialized scientific methodology, technical skills, and practical problem-solving.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-emerald-700 text-base sm:text-lg block mb-1">Technical Skills</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Access tools, technical workshops, and software programs.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-emerald-700 text-base sm:text-lg block mb-1">Professional Dev</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Skill certifications, case study groups, and business consulting projects.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-emerald-700 text-base sm:text-lg block mb-1">Industry Links</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Bridge with tech hubs, finance houses, and corporate agencies.</p>
                </div>
              </div>
            </div>

            {/* MA Card */}
            <div id="ma-section" className="bg-[#FAF5FF] border border-[#F3E8FF] p-8 rounded-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">MA Students</h3>
              <p className="text-neutral-600 mb-6 font-medium text-sm">
                Supporting communication, liberal arts, media, and humanities postgraduate students.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-purple-700 text-base sm:text-lg block mb-1">Student Community</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Interactive group dialogues, cultural panels, and public speaking forums.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-purple-700 text-base sm:text-lg block mb-1">Professional Dev</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Mentorship access, portfolio showcases, and career fairs.</p>
                </div>
              </div>
            </div>

            {/* PhD Card */}
            <div id="phd-section" className="bg-[#FFF7ED] border border-[#FFEDD5] p-8 rounded-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">PhD Students</h3>
              <p className="text-neutral-600 mb-6 font-medium text-sm">
                The pinnacle of research excellence, thought leadership, and academic contributions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-orange-700 text-base sm:text-lg block mb-1">Scholarly Research</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Doctoral research circles, data analysis clinics, and publications.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-orange-700 text-base sm:text-lg block mb-1">Thesis Support</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Direct academic mentoring, cohort peer review, and defense guides.</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                  <span className="font-bold text-orange-700 text-base sm:text-lg block mb-1">Fellowships</span>
                  <p className="text-xs text-neutral-500 leading-relaxed">Opportunities for lecturing, research grants, and university projects.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Section 4: Why Join the GRASAG-UPSA Family? (Full-width Dark Blue band) */}
      <section className="w-full bg-[#000830] text-white py-16 text-center space-y-10 my-16">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Why Join the GRASAG-UPSA Family?
        </h2>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B8860B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-semibold leading-snug">Build meaningful connections</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B8860B]">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-semibold leading-snug">Access support and opportunities</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B8860B]">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-semibold leading-snug">Participate in leadership</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B8860B]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-semibold leading-snug">Contribute to impact projects</span>
          </div>
        </div>
      </section>

      {/* Main container for remaining sections */}
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8 space-y-28">

        {/* Section 5: Community Life */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-extrabold text-[#001a54] tracking-tight">
              Community Life
            </h2>
            <button 
              onClick={() => handleScrollToSection('gallery-section')}
              className="text-sm font-bold text-[#B8860B] hover:text-[#001a54] transition-colors"
            >
              View Gallery
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group shadow-sm">
              <Image 
                src="/president-speech.png" 
                alt="Networking & Mentorship" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-left text-white space-y-1">
                <span className="font-bold text-sm block">Networking & Mentorship</span>
                <span className="text-[10px] text-neutral-300 block">Connecting leaders across industries.</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group shadow-sm">
              <Image 
                src="/researchhh.png" 
                alt="Capacity Building" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-left text-white space-y-1">
                <span className="font-bold text-sm block">Capacity Building</span>
                <span className="text-[10px] text-neutral-300 block">Empowering scholars through seminars.</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group shadow-sm">
              <Image 
                src="/bkg-grasag.jpg" 
                alt="Social Events" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-left text-white space-y-1">
                <span className="font-bold text-sm block">Social Events</span>
                <span className="text-[10px] text-neutral-300 block">Celebrating shared successes in style.</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group shadow-sm">
              <Image 
                src="/communittty.jpg" 
                alt="Community Impact" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-left text-white space-y-1">
                <span className="font-bold text-sm block">Community Impact</span>
                <span className="text-[10px] text-neutral-300 block">Giving back to society, together.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Voices from Our Community */}
        <section className="space-y-8">
          <h2 className="text-3xl font-extrabold text-[#001a54] text-center tracking-tight">
            Voices from Our Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white border border-neutral-100 p-8 rounded-2xl shadow-sm space-y-6 text-left relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start text-neutral-200">
                  <Quote className="w-8 h-8 rotate-180" />
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  "The professional networks I built through GRASAG-UPSA directly led to my current research fellowship. The support system here is truly unparalleled."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-50">
                <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden relative">
                  <Image src="/Norbet.jpeg" alt="Abena Mensah" fill className="object-cover" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#001a54] block">Abena Mensah</span>
                  <span className="text-neutral-400 block font-medium">PhD Candidate, Business Admin</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-neutral-100 p-8 rounded-2xl shadow-sm space-y-6 text-left relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start text-neutral-200">
                  <Quote className="w-8 h-8 rotate-180" />
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  "From social galas to community outreach, being part of this family has given me a holistic postgraduate experience beyond the lecture halls."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-50">
                <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden relative">
                  <Image src="/VP.jpeg" alt="Kwame Boateng" fill className="object-cover" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#001a54] block">Kwame Boateng</span>
                  <span className="text-neutral-400 block font-medium">MSc. Information Technology</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border-t-4 border-[#B8860B] border border-neutral-100 p-8 rounded-2xl shadow-sm space-y-6 text-left relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start text-neutral-200">
                  <Quote className="w-8 h-8 rotate-180" />
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  "The welfare services provided by GRASAG-UPSA were a lifeline during my final year. I'm proud to be an active member of this great association."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-50">
                <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden relative">
                  <Image src="/becca.jpg" alt="Esi Arthur" fill className="object-cover" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#001a54] block">Esi Arthur</span>
                  <span className="text-neutral-400 block font-medium">MBA Accounting</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Footer CTA Banner */}
        <section className="bg-[#000830] text-white p-12 rounded-3xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Be part of the GRASAG-UPSA community
          </h2>
          <p className="text-neutral-300 text-sm max-w-md mx-auto font-medium">
            Take the next step in your postgraduate journey. Join a chapter, meet your peers, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-8 py-3 rounded-full text-sm transition-colors shadow-sm">
              Join a Group
            </button>
            <button className="border border-white/20 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors">
              Contact Student Support
            </button>
          </div>
        </section>

        {/* Section 8: Photo Gallery (Original intact with upload styles) */}
        <section id="gallery-section" className="pt-8 border-t border-neutral-100">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-[#001a54]">Photo Gallery</h2>
          
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          
          {isAdmin && (
            <form onSubmit={handleUpload} className="mb-8 space-y-4 border border-neutral-200 p-6 rounded-2xl bg-white shadow-sm max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-[#001a54]">Upload New Image</h3>
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
                <input type="file" name="image" accept="image/*" required className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#001a54]/10 file:text-[#001a54] hover:file:bg-[#001a54]/20 cursor-pointer" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold py-3 px-4 rounded-lg transition-colors">
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          )}

          {loading && images.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B]"></div>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img) => (
                <div key={img.url} className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="relative h-64 w-full bg-neutral-100 overflow-hidden">
                    <Image src={img.url} alt={img.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#001a54] truncate">{img.title}</h3>
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
    </div>
  );
}
