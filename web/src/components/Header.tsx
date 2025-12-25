import { Wand2 } from 'lucide-react';
import { CSSProperties, useState } from 'react';

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyle: CSSProperties = {
    fontSize: '0.875rem',
    color: isHovered ? '#f1f5f9' : '#64748b',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s',
    background: isHovered ? 'rgba(255,255,255,0.05)' : 'transparent'
  };

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
          style={linkStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
