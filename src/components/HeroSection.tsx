import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string; // path relative to /public
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, backgroundImage }) => {
  const bgStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};
  return (
    <section
      className="relative overflow-hidden px-4 py-8 lg:px-8 border-b border-neutral-100 flex items-center justify-center min-h-[25vh]"
      style={{ ...bgStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 max-w-2xl text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-base text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
