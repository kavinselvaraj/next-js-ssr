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

type MonorepoBadgeProps = {
    appName: string;
};

export function MonorepoBadge({ appName }: MonorepoBadgeProps) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
            }}
        >
            {appName}
        </span>
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
