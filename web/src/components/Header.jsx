import { Wand2 } from 'lucide-react';

export default function Header() {
    return (
        <header>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)'
                    }}>
                        <Wand2 size={20} color="white" />
                    </div>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Photo Enhancer
                    </span>
                </div>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        textDecoration: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = '#f1f5f9';
                        e.target.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = '#64748b';
                        e.target.style.background = 'transparent';
                    }}
                >
                    GitHub
                </a>
            </div>
        </header>
    );
}
