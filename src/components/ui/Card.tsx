import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'hero' | 'accent-green' | 'accent-blue';
    clipPath?: 'top-right' | 'bottom-right' | 'none';
    className?: string;
    span?: number;
}

const variantStyles = {
    default: 'bg-bg-secondary border-2 border-border-color',
    hero: 'bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[3px] border-accent-green',
    'accent-green': 'bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[3px] border-accent-green',
    'accent-blue': 'bg-gradient-to-br from-[#1a0a2e] to-[#0f0520] border-[3px] border-accent-blue',
};

const clipPathStyles = {
    'top-right': 'clip-top-right',
    'bottom-right': 'clip-bottom-right',
    'none': '',
};

export default function Card({
    children,
    variant = 'default',
    clipPath = 'none',
    className = '',
    span = 4
}: CardProps) {
    return (
        <div
            className={`
        ${variantStyles[variant]}
        ${clipPathStyles[clipPath]}
        p-8 relative overflow-hidden transition-all duration-300
        hover:border-accent-green hover:-translate-y-0.5
        opacity-0 animate-fade-in-up
        ${className}
      `}
            style={{ gridColumn: `span ${span}` }}
        >
            {/* Animated top border on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-green to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            {children}
        </div>
    );
}
