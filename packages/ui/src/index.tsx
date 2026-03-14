import React from 'react';

type AppContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function AppContainer({ children, className, style }: AppContainerProps) {
  return (
    <main className={className} style={style}>
      {children}
    </main>
  );
}

type AppSectionProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function AppSection({ children, className, style }: AppSectionProps) {
  return (
    <section className={className} style={style}>
      {children}
    </section>
  );
}

type AppPageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AppPageHeader({ title, subtitle }: AppPageHeaderProps) {
  return (
    <header style={{ marginBottom: '1rem' }}>
      <h1 style={{ margin: 0, marginBottom: subtitle ? '0.45rem' : 0 }}>{title}</h1>
      {subtitle ? <p style={{ margin: 0, color: '#475569' }}>{subtitle}</p> : null}
    </header>
  );
}
