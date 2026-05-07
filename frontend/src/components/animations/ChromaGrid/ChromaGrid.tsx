import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './ChromaGrid.css';

interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient: string;
  url?: string;
  location?: string;
}

interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

export const ChromaGrid = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((value: number) => void) | null>(null);
  const setY = useRef<((value: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();

  const demo: ChromaItem[] = [
    // ... demo kept same
  ];
  const data = items?.length ? items : demo;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    
    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries[0].isIntersecting);
    }, { threshold: 0.1 });
    
    observer.observe(el);
    
    setX.current = gsap.quickSetter(el, '--x', 'px') as (value: number) => void;
    setY.current = gsap.quickSetter(el, '--y', 'px') as (value: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current?.(pos.current.x);
    setY.current?.(pos.current.y);

    return () => observer.disconnect();
  }, []);

  const moveTo = (x: number, y: number) => {
    if (!isVisible) return;
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: 'auto'
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!rootRef.current || !isVisible) return;
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: 'auto' });
  };

  const handleCardClick = (url?: string) => {
    if (!url) return;
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: 'auto'
    });
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    // Optimization: Skip complex card hover effects on low-performance devices or if not clearly needed
    if (window.innerWidth < 1024) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Use direct CSS variable setting for faster response than GSAP for simple mouse follows
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows
      } as React.CSSProperties}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <div key={i} className="chroma-card-container">
          <article
            className="chroma-card"
            onMouseMove={handleCardMove}
            onClick={() => handleCardClick(c.url)}
            style={{
              '--card-border': c.borderColor || 'transparent',
              '--card-gradient': c.gradient,
              cursor: c.url ? 'pointer' : 'default'
            } as React.CSSProperties}
          >
            <div className="chroma-img-wrapper">
              <img src={c.image} alt={c.title} loading="lazy" />
            </div>
          </article>
          <footer className="chroma-info" onClick={() => handleCardClick(c.url)}>
            <h3 className="name">{c.title}</h3>
            <div className="details">
              {c.handle && <span className="handle">{c.handle}</span>}
              <span className="separator">/</span>
              <p className="role">{c.subtitle}</p>
            </div>
          </footer>
        </div>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
