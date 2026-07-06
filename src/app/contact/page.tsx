'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !subject || !message) {
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
        body: JSON.stringify({ name: `${firstName} ${lastName}`, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setSuccessMsg('Your message has been sent successfully! We will get back to you shortly.');
      setFirstName('');
      setLastName('');
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
      title: 'Head Quarter',
      details: 'University of Professional Studies Accra, First floor on the student centre',
      icon: MapPin,
      href: '#',
    },
    {
      title: 'Email Address',
      details: 'grasagpresident@upsamail.edu.gh',
      icon: Mail,
      href: 'mailto:grasagpresident@upsamail.edu.gh',
    },
    {
      title: 'Telephone',
      details: '+233 (0) 55 860 1545',
      icon: Phone,
      href: 'tel:+233558601545',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20 bg-background text-foreground">
      {/* Top Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-8">
        <span className="text-accent font-medium tracking-wide text-sm uppercase">
          Stay Tuned
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl leading-tight">
          Lets <span className="text-accent">Meet</span> With Us
        </h1>
        <p className="text-sm text-neutral-500 max-w-2xl mx-auto pb-8 pt-4">
          Have queries about membership registration, thesis support, welfare packages, or partnership opportunities? Reach out using the contact details or form below.
        </p>

        {/* Map */}
        <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg border border-neutral-100 relative z-10">
          <iframe
            src="https://maps.google.com/maps?q=5.6626696586617795, -0.16745413348149168&hl=en&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Left Column: Contact Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <span className="text-accent font-medium tracking-wide text-sm uppercase">
              Keep Connected
            </span>
            <h2 className="text-3xl font-extrabold text-primary">
              Stay <span className="text-accent">In Touch</span> With Us
            </h2>
            <p className="text-sm text-neutral-500 pt-2 pb-6 leading-relaxed">
              We are here to assist you with any inquiries or support you may need during your time at UPSA.
            </p>
          </div>

          <div className="space-y-4">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.title}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 transition-all hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-base">
                      {info.title}
                    </h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="mt-1 block text-sm text-neutral-500 hover:text-primary leading-relaxed transition-colors"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
                        {info.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 relative overflow-hidden h-full">
            {/* Decorative icon top right */}
            <div className="absolute top-6 right-6 opacity-20 hidden sm:block">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-2">
              Leave a Message For Us
            </h2>
            <p className="text-sm text-neutral-500 mb-8">
              Fill out the form below and we will get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Name Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-primary">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-neutral-50/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-primary">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Email & Subject Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-primary">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-neutral-50/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-primary">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-primary">
                  Message
                </label>
                <textarea
                  placeholder="Your message here..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-neutral-50/50 resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-sm mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
