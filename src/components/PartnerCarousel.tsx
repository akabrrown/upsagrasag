import React from 'react';
import Image from 'next/image';
import styles from './PartnerCarousel.module.css';

interface PartnerCarouselProps {
  logos: string[];
  iconSize?: string; // Tailwind size classes, default moderate larger size
}

const PartnerCarousel: React.FC<PartnerCarouselProps> = ({
  logos,
  iconSize = 'w-32 h-32', // increased size for better visibility
}) => {
  const validLogos = logos.filter((url) => url && url.trim() !== '');
  if (!validLogos.length) return null;

  return (
    <div className={styles.carouselWrapper}>
      {validLogos.map((logo, idx) => (
        <div
          key={idx}
          className={`relative ${iconSize} opacity-70 hover:opacity-100 transition-opacity`}
        >
          <Image src={logo} alt={`partner-${idx}`} width={128} height={128} className="object-contain" />
        </div>
      ))}
    </div>
  );
};

export default PartnerCarousel;
