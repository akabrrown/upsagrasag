import React, { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const cssVariables = `
    :root {
      --color-primary: #004080;
      --color-secondary: #FFB800;
      --color-accent: #B8860B;
    }
  `;
  return (
    <>
      <style>{cssVariables}</style>
      {children}
    </>
  );
}
