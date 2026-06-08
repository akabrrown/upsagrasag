'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setErrorMsg('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setSuccessMsg('Your message has been sent successfully! We will get back to you shortly.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: 'Our Secretariat',
      details: 'Graduate School Building, Room 204, UPSA Campus, Madina, Accra',
      icon: MapPin,
    },
    {
      title: 'Email Address',
      details: 'Grasagupsa2026@gmail.com',
      icon: Mail,
      href: 'mailto:Grasagupsa2026@gmail.com',
    },
    {
      title: 'Phone Contact',
      details: '+233 (0) 50 123 4567',
      icon: Phone,
      href: 'tel:+233501234567',
    },
    {
      title: 'Office Hours',
      details: 'Monday - Friday (10:00 AM - 5:00 PM)',
      icon: Clock,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge-accent">
          Get in Touch
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl leading-tight">
          Contact the Executive Cabinet
        </h1>
        <p className="text-sm text-neutral-500">
          Have queries about membership registration, thesis support, welfare packages, or partnership opportunities? Reach out using the contact details or form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.title}
                  className="upsa-blue-card flex gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-base">
                      {info.title}
                    </h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="mt-1 block text-sm text-primary hover:text-accent leading-relaxed transition-colors"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-primary leading-relaxed">
                        {info.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guidelines Box */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 space-y-3">
            <h3 className="font-bold text-accent text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5" /> Advocacy & Welfare support
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              If your request concerns an academic grievance, hostel dispute, or emergency loan allocation, you can submit an official request. Our executive cabinet prioritizes welfare requests within 24 hours.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
              <div className="upsa-blue-card p-8">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-accent" /> Send an Email Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-medium text-emerald-600">
                  {successMsg}
                </div>
              )}

              {/* Name & Email Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Mahama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary">
                  Subject / Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Welfare Loan Request Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="form-input"
                  />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary">
                  Message Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Write your detailed query or feedback here..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending Message...
                  </>
                ) : (
                  <>
                    Send Message <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
