import React from 'react';

export interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon, href }) => {
  const Container = href ? 'a' : 'div';
  const commonProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <Container
      {...commonProps}
      className="group flex flex-col rounded-xl bg-white/10 p-6 backdrop-blur-md border border-white/20 hover:border-primary transition-colors"
    >
      {icon && <div className="mb-4 text-primary group-hover:text-accent">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">{description}</p>
    </Container>
  );
};
