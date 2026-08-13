'use client';

import React from 'react';
import Link from 'next/link';
import { iconMap } from '@/lib/icons';
import { 
  HeartPulse, 
  Brain, 
  DollarSign, 
  Home, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight,
  PhoneCall,
  MessageSquare,
  Mail,
  MapPin,
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function WelfarePage() {
  const [services, setServices] = React.useState<any[]>([]);
  const [steps, setSteps] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/admin/welfare-services');
        const data = await res.json();
        setServices(data);
      } catch (e) {
        console.error('Failed to load welfare services', e);
      }
    };
    
    const fetchSteps = async () => {
      try {
        const res = await fetch('/api/admin/welfare-steps');
        const data = await res.json();
        setSteps(data);
      } catch (e) {
        console.error('Failed to load welfare steps', e);
      }
    };
    
    fetchServices();
    fetchSteps();
  }, []);

  return (
    <div className="w-full bg-background text-foreground pb-20">
      
      {/* 1. Simple Hero Section */}
      <section className="w-full bg-[#001a54] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-left space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/80">
            <Link href="/" className="hover:text-white transition-colors">Student Support</Link>
            <span>/</span>
            <span className="text-white">Welfare & Wellbeing</span>
          </nav>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Welfare & Wellbeing
            </h1>
            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl leading-relaxed font-medium">
              Get confidential support for challenges affecting your health, finances, accommodation, safety or academic life.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a 
              href="#services-grid"
              className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-sm"
            >
              Find the Right Support
            </a>
            <a 
              href="#contact-welfare"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all border border-white/20"
            >
              Contact the Welfare Team
            </a>
          </div>

          {/* Urgent help link */}
          <div className="pt-2">
            <a 
              href="#urgent-contacts" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] hover:underline"
            >
              <AlertTriangle className="w-4 h-4" />
              Need urgent help? View emergency contacts →
            </a>
          </div>
        </div>
      </section>

      {/* 2. Main Service Grid: What do you need help with? */}
      <section id="services-grid" className="max-w-5xl mx-auto px-4 pt-16 space-y-8 text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001a54] tracking-tight">
            What do you need help with?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
            Choose a service below to learn more or request dedicated support from GRASAG-UPSA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon];
            return (
              <div 
                key={idx}
                className="bg-white border border-[#E8E8E8] rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-lg hover:border-[#001a54]/20 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF6EC] border border-[#F5EAD2] flex items-center justify-center text-[#B8860B]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-[#001a54] text-lg leading-snug group-hover:text-[#B8860B] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <a 
                    href={service.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#B8860B] hover:text-[#001a54] transition-colors"
                  >
                    {service.action}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How Support Works */}
      <section className="max-w-5xl mx-auto px-4 pt-20 space-y-8 text-left">
        <div>
          <h2 className="text-2xl font-bold text-[#001a54] tracking-tight">
            How support works
          </h2>
          <p className="text-xs text-neutral-500 font-medium">Simple, confidential guidance in three clear steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-neutral-50 border border-neutral-200/70 p-6 rounded-2xl space-y-3 relative">
              <span className="text-2xl font-black text-[#B8860B]/40 block">{s.step_number ? String(s.step_number).padStart(2, '0') : String(idx + 1).padStart(2, '0')}</span>
              <h3 className="font-bold text-[#001a54] text-base">{s.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Confidentiality Notice */}
      <section className="max-w-5xl mx-auto px-4 pt-16">
        <div className="bg-[#FAF6EC] border border-[#F5EAD2] rounded-2xl p-6 sm:p-8 text-left flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center shrink-0 text-[#B8860B]">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-[#001a54] text-base sm:text-lg">Your privacy matters</h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              Welfare requests are handled discreetly. Information is shared only where necessary to provide support or where someone’s safety may be at risk.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Direct Contact Block & Emergency Contacts */}
      <section id="contact-welfare" className="max-w-5xl mx-auto px-4 pt-20 space-y-10 text-left">
        <div className="bg-[#001a54] text-white p-8 sm:p-10 rounded-3xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Not sure which service you need?
            </h2>
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-xl">
              Contact the GRASAG-UPSA Welfare Team and we’ll help you find the right place to start.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="https://wa.me/233558601545" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-4 rounded-2xl flex items-center gap-3 transition-colors text-white"
            >
              <MessageSquare className="w-5 h-5 text-[#B8860B]" />
              <div className="text-xs font-semibold">
                <span className="block font-bold">Send WhatsApp</span>
                <span className="text-blue-200 text-[10px]">Instant chat</span>
              </div>
            </a>

            <a 
              href="tel:+233558601545" 
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-4 rounded-2xl flex items-center gap-3 transition-colors text-white"
            >
              <PhoneCall className="w-5 h-5 text-[#B8860B]" />
              <div className="text-xs font-semibold">
                <span className="block font-bold">Call Welfare Officer</span>
                <span className="text-blue-200 text-[10px]">+233 (0) 55 860 1545</span>
              </div>
            </a>

            <a 
              href="mailto:grasagpresident@upsamail.edu.gh" 
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-4 rounded-2xl flex items-center gap-3 transition-colors text-white"
            >
              <Mail className="w-5 h-5 text-[#B8860B]" />
              <div className="text-xs font-semibold">
                <span className="block font-bold">Send an Email</span>
                <span className="text-blue-200 text-[10px]">Email response</span>
              </div>
            </a>

            <div className="bg-white/10 border border-white/15 p-4 rounded-2xl flex items-center gap-3 text-white">
              <MapPin className="w-5 h-5 text-[#B8860B] shrink-0" />
              <div className="text-xs font-semibold">
                <span className="block font-bold">Visit GRASAG Office</span>
                <span className="text-blue-200 text-[10px]">Student Centre, 1st Floor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Section */}
        <div id="urgent-contacts" className="border-t border-neutral-200 pt-8 space-y-4">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Emergency Contacts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-neutral-600">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-[#001a54] block">UPSA Campus Security Desk</span>
              <span className="text-neutral-500">Available 24/7 on main campus</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-[#001a54] block">University Medical Centre</span>
              <span className="text-neutral-500">Campus Clinic Services</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-[#001a54] block">National Emergency</span>
              <span className="text-neutral-500">Call 112 / 191 (Police)</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
