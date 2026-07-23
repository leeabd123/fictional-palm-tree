import React, { useState, useRef } from 'react';
import { WebGLOrb } from './WebGLOrb';

// === Icons ===
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const PlayIcon = ({ width = 20, height = 20 }: any) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const OrbIcon = (props: any) => (
  <svg width="24" height="24" viewBox="0 0 20 20" {...props}>
    <defs>
      <radialGradient id="orbGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="var(--purple)" stopOpacity="0.6"/>
      </radialGradient>
      <filter id="orbGlow">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="10" cy="10" r="7" fill="url(#orbGrad)" filter="url(#orbGlow)"/>
    <circle cx="10" cy="10" r="7" stroke="var(--teal)" strokeWidth="0.5" fill="none" opacity="0.5"/>
  </svg>
);

const Icons = {
  Flashcards: (props: any) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 6v12" opacity="0.3" />
    </svg>
  ),
  Coach: (props: any) => <OrbIcon {...props} />,
  Ear: (props: any) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M4 12v0" /><path d="M8 8v8" /><path d="M12 4v16" /><path d="M16 9v6" /><path d="M20 12v0" />
    </svg>
  ),
  Journey: (props: any) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" opacity="0.2"/>
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    </svg>
  )
};

// === Helper Hooks & Components ===

const use3DTilt = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    setTilt({ x: (dy / yc) * -6, y: (dx / xc) * 6, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  return { ref, tilt, handleMouseMove, handleMouseLeave };
};

const GlassCard = ({ children, className = "", innerClassName = "", active = false }: any) => {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = use3DTilt();
  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col ${className}`}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${active ? 'var(--gold-border)' : 'var(--surface-border)'}`,
        backdropFilter: 'var(--card-blur)',
        WebkitBackdropFilter: 'var(--card-blur)',
        boxShadow: active ? '0 0 30px -10px var(--gold-border), var(--glass-shadow)' : 'var(--glass-shadow)',
        transform: tilt.active ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out, box-shadow 0.3s'
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
        style={{
          background: `linear-gradient(105deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 100%)`,
          opacity: tilt.active ? 1 : 0.3,
          transform: tilt.active ? `translate(${tilt.y * 1.5}px, ${tilt.x * -1.5}px)` : 'translate(0px, 0px)'
        }}
      />
      {active && (
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,169,110,0.1), transparent 70%)' }} 
        />
      )}
      <div className={`relative z-10 w-full flex-1 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};

const Tile = ({ title, sub, icon, active = false, colorVar = 'var(--gold)' }: any) => {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = use3DTilt();
  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-[20px] p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer ${active ? 'hover:-translate-y-1.5' : 'hover:-translate-y-1'}`}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${active ? 'var(--gold-border)' : 'var(--surface-border)'}`,
        backdropFilter: 'var(--card-blur)',
        WebkitBackdropFilter: 'var(--card-blur)',
        boxShadow: active ? '0 0 24px -8px var(--gold-border), var(--glass-shadow)' : 'var(--glass-shadow)',
        transform: tilt.active ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out, box-shadow 0.3s'
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none z-20 transition-all duration-300 rounded-[20px]"
        style={{
          background: `linear-gradient(105deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 100%)`,
          opacity: tilt.active ? 1 : 0.3,
          transform: tilt.active ? `translate(${tilt.y * 1.5}px, ${tilt.x * -1.5}px)` : 'translate(0px, 0px)'
        }}
      />
      {active ? (
        <div 
          className="absolute inset-0 pointer-events-none rounded-[20px]" 
          style={{ background: 'radial-gradient(circle at top left, var(--gold-ghost-bg), transparent 70%)' }} 
        />
      ) : (
        <div 
          className="absolute inset-0 pointer-events-none rounded-[20px]" 
          style={{ background: `radial-gradient(circle at top left, color-mix(in srgb, ${colorVar} 8%, transparent), transparent 70%)` }} 
        />
      )}
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6 flex items-center justify-center w-12 h-12 rounded-full" style={{ color: colorVar, backgroundColor: `color-mix(in srgb, ${colorVar} 12%, transparent)` }}>
          {React.cloneElement(icon, { width: 24, height: 24 })}
        </div>
        <div className="mt-auto">
          <div className="text-[18px] font-semibold text-[var(--text-primary)] leading-tight mb-1.5" style={{ textShadow: active ? '0 0 12px rgba(255,255,255,0.2)' : 'none' }}>{title}</div>
          <div className="text-[14px] text-[var(--text-secondary)]">{sub}</div>
        </div>
      </div>
    </div>
  );
};

// === Domain Data ===
const DOMAIN_DATA: Record<string, any> = {
  family: {
    color: 'var(--gold)',
    title: '◆ Family',
    meta: '4 phrases · comfortable',
    moments: [
      { id: 1, title: 'Greeting your grandmother', state: 'done', meta: 'guided · 2 min' },
      { id: 2, title: 'Answering how are you', state: 'done', meta: 'guided · 2 min' },
      { id: 3, title: 'Good morning — the right reply', state: 'done', meta: 'guided · 2 min' },
      { id: 4, title: 'Your khalto puts food in front of you', state: 'done', meta: 'big moment' },
      { id: 5, title: 'Where have you disappeared to', state: 'next', meta: 'guided · 2 min' },
      { id: 6, title: 'Wedding congratulations', state: 'locked', meta: 'guided · 2 min' },
      { id: 7, title: 'Habooba checks in', state: 'locked', meta: 'phone call' },
      { id: 8, title: 'Eid call across time zones', state: 'locked', meta: 'phone call' },
      { id: 9, title: 'A condolence visit', state: 'locked', meta: 'phone call' },
    ]
  },
  friends: {
    color: 'var(--teal)',
    title: '● Friends',
    meta: '2 phrases · exploring',
    moments: [
      { id: 1, title: 'The casual hello', state: 'done', meta: 'guided · 1 min' },
      { id: 2, title: 'Agreeing to meet up', state: 'done', meta: 'guided · 2 min' },
      { id: 3, title: 'Declining politely', state: 'next', meta: 'guided · 2 min' },
      { id: 4, title: 'Inside jokes', state: 'locked', meta: 'big moment' }
    ]
  },
  community: {
    color: 'var(--green)',
    title: '▲ Community',
    meta: '2 phrases · exploring',
    moments: [
      { id: 1, title: 'Buying bread at the dukkan', state: 'done', meta: 'guided · 2 min' },
      { id: 2, title: 'Thanking the bus driver', state: 'done', meta: 'guided · 1 min' },
      { id: 3, title: 'Asking for directions', state: 'next', meta: 'guided · 3 min' }
    ]
  },
  identity: {
    color: 'var(--purple)',
    title: '■ Identity',
    meta: '0 phrases · locked',
    moments: [
      { id: 1, title: 'Saying where you are from', state: 'locked', meta: 'guided · 2 min' },
      { id: 2, title: 'Explaining your background', state: 'locked', meta: 'guided · 4 min' }
    ]
  },
  culture: {
    color: 'var(--coral)',
    title: '✦ Culture',
    meta: '0 phrases · locked',
    moments: [
      { id: 1, title: 'Proverbs and wisdom', state: 'locked', meta: 'guided · 3 min' },
      { id: 2, title: 'Wedding traditions', state: 'locked', meta: 'guided · 5 min' }
    ]
  }
};

// === Section Components ===

const TopNav = ({ theme, setTheme }: any) => (
  <div className="flex items-center justify-between pt-2 pb-6 border-b border-[var(--surface-border)]">
    <div className="flex items-baseline gap-3">
      <span className="font-serif-ar text-[32px] text-[var(--gold)] drop-shadow-[0_0_8px_var(--gold-border)]">طريقة</span>
      <span className="font-sans-body text-[13px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">Tariga</span>
    </div>
    
    <div className="flex items-center gap-8">
      <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[var(--text-secondary)]">
        <a href="#" className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">Dashboard</a>
        <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Curriculum</a>
        <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Library</a>
      </div>

      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-[56px] h-[30px] rounded-full relative flex items-center px-1.5 transition-colors duration-300 shadow-inner"
        style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}
        aria-label="Toggle theme"
      >
        <div 
          className="absolute w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
          style={{ 
            background: 'var(--gold)', 
            color: theme === 'dark' ? '#0f0d0b' : '#f7f2e8',
            transform: theme === 'dark' ? 'translateX(0px)' : 'translateX(24px)' 
          }}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </div>
      </button>
    </div>
  </div>
);

const Greeting = () => (
  <div className="flex flex-col gap-4 mb-8 mt-4 items-start">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[12px] w-fit backdrop-blur-md shadow-sm" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }}></div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mt-[1px]">Freq: Family & Home</span>
    </div>
    <div className="flex flex-col gap-1 items-start max-w-[800px]">
      <h1 className="font-serif-ar text-[64px] md:text-[80px] leading-[1.1] text-[var(--text-primary)] text-left w-full drop-shadow-md" dir="rtl" style={{ textAlign: 'left' }}>
        يا هلا بيك تاني
      </h1>
      <span className="font-serif-ar italic text-[28px] md:text-[34px] text-[var(--purple)] mt-1 drop-shadow-sm">
        ya hala beek tani — Welcome back
      </span>
    </div>
  </div>
);

const HeroCard = () => (
  <GlassCard className="h-full w-full" innerClassName="flex items-center p-8 gap-8">
    <div className="shrink-0 w-[80px] h-[80px] rounded-full overflow-hidden shadow-[0_0_30px_rgba(201,169,110,0.25)] relative border border-[rgba(201,169,110,0.15)]">
      <WebGLOrb mode="idle" />
    </div>
    <div className="flex-1">
      <div className="text-[13px] uppercase tracking-[0.16em] text-[var(--teal)] mb-3 font-bold">Continue where you left off</div>
      <div className="text-[26px] text-[var(--text-primary)] font-semibold leading-snug mb-2">Coach · scenario 2 — "Tell me about yourself"</div>
      <div className="text-[15px] text-[var(--text-muted)]">~2 min to finish</div>
    </div>
    <button 
      className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-lg" 
      style={{ background: 'var(--gold-ghost-bg)', border: '1px solid var(--gold-border)', color: 'var(--gold-light)' }}
    >
      <div className="ml-1.5"><PlayIcon width={24} height={24} /></div>
    </button>
  </GlassCard>
);

const StatsWidget = () => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = 62;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <GlassCard className="h-full w-full" innerClassName="flex items-center justify-center gap-8 p-8">
      {/* Left: SVG Ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 drop-shadow-lg">
          <circle 
            cx={size/2} cy={size/2} r={radius} 
            stroke="var(--ring-bg)" 
            strokeWidth={strokeWidth} 
            fill="none" 
          />
          <circle 
            cx={size/2} cy={size/2} r={radius} 
            stroke="var(--teal)" 
            strokeWidth={strokeWidth} 
            fill="none" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px var(--teal))', transition: 'stroke-dashoffset 1.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[24px] font-bold text-[var(--text-primary)] leading-none mb-1 font-serif-ar">{percent}%</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--teal)] font-bold">Deck</div>
        </div>
      </div>
      
      {/* Right: 3 stat rows */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[var(--text-secondary)] font-medium">Mastered</span>
          <span className="text-[18px] font-bold text-[var(--green)]" style={{ textShadow: 'var(--glow-green)' }}>34</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[var(--text-secondary)] font-medium">Still learning</span>
          <span className="text-[18px] font-bold text-[var(--gold-light)]" style={{ textShadow: 'var(--glow-gold)' }}>12</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[var(--text-secondary)] font-medium">Coached scenarios</span>
          <span className="text-[18px] font-bold text-[var(--teal)]" style={{ textShadow: 'var(--glow-teal)' }}>7</span>
        </div>
      </div>
    </GlassCard>
  );
};

const getBezierPoint = (t: number, p0: any, p1: any, p2: any, p3: any) => {
  const cX = 3 * (p1.x - p0.x);
  const bX = 3 * (p2.x - p1.x) - cX;
  const aX = p3.x - p0.x - cX - bX;
  const cY = 3 * (p1.y - p0.y);
  const bY = 3 * (p2.y - p1.y) - cY;
  const aY = p3.y - p0.y - cY - bY;
  const x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
  const y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
  return { x, y };
};

const getPolyline = (p0: any, p1: any, p2: any, p3: any, tMax: number, steps = 30) => {
  if (tMax <= 0) return "";
  let pts = [];
  for(let i=0; i<=steps; i++){
    let t = (i/steps)*tMax;
    let pt = getBezierPoint(t, p0, p1, p2, p3);
    pts.push(`${pt.x},${pt.y}`);
  }
  return pts.join(" ");
};

const getTaperedBranchPath = (curve: any[], startWidth: number, endWidth: number) => {
  const getNormal = (pA: any, pB: any) => {
    let dx = pB.x - pA.x;
    let dy = pB.y - pA.y;
    let len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { nx: -dy / len, ny: dx / len };
  };

  const n0 = getNormal(curve[0], curve[1]);
  const n1 = getNormal(curve[0], curve[2]);
  const n2 = getNormal(curve[1], curve[3]);
  const n3 = getNormal(curve[2], curve[3]);

  const w0 = startWidth / 2;
  const w1 = startWidth / 2 * 0.7 + endWidth / 2 * 0.3;
  const w2 = startWidth / 2 * 0.3 + endWidth / 2 * 0.7;
  const w3 = endWidth / 2;

  const offset = (p: any, n: any, w: number, dir: number) => ({
    x: p.x + n.nx * w * dir,
    y: p.y + n.ny * w * dir
  });

  const top = [
    offset(curve[0], n0, w0, 1),
    offset(curve[1], n1, w1, 1),
    offset(curve[2], n2, w2, 1),
    offset(curve[3], n3, w3, 1)
  ];
  
  const bottom = [
    offset(curve[0], n0, w0, -1),
    offset(curve[1], n1, w1, -1),
    offset(curve[2], n2, w2, -1),
    offset(curve[3], n3, w3, -1)
  ];

  return `M ${top[0].x} ${top[0].y} C ${top[1].x} ${top[1].y}, ${top[2].x} ${top[2].y}, ${top[3].x} ${top[3].y} L ${bottom[3].x} ${bottom[3].y} C ${bottom[2].x} ${bottom[2].y}, ${bottom[1].x} ${bottom[1].y}, ${bottom[0].x} ${bottom[0].y} Z`;
};

const BRANCH_DEFS: Record<string, any> = {
  family: {
    color: 'var(--gold)',
    curve: [ {x: 450, y: 450}, {x: 600, y: 400}, {x: 750, y: 300}, {x: 820, y: 150} ],
    nodes: [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95],
    zoom: { cx: 635, cy: 300, scale: 1.9 },
    labelPos: { x: 840, y: 140 },
    labelSide: 'right'
  },
  friends: {
    color: 'var(--teal)',
    curve: [ {x: 450, y: 450}, {x: 300, y: 400}, {x: 150, y: 300}, {x: 80, y: 150} ],
    nodes: [0.25, 0.5, 0.75, 0.95],
    zoom: { cx: 265, cy: 300, scale: 1.9 },
    labelPos: { x: 60, y: 140 },
    labelSide: 'left'
  },
  community: {
    color: 'var(--green)',
    curve: [ {x: 450, y: 450}, {x: 520, y: 350}, {x: 600, y: 250}, {x: 650, y: 100} ],
    nodes: [0.35, 0.65, 0.95],
    zoom: { cx: 550, cy: 275, scale: 2.0 },
    labelPos: { x: 670, y: 90 },
    labelSide: 'right'
  },
  identity: {
    color: 'var(--purple)',
    curve: [ {x: 450, y: 450}, {x: 380, y: 350}, {x: 300, y: 250}, {x: 250, y: 100} ],
    nodes: [0.5, 0.9],
    zoom: { cx: 350, cy: 275, scale: 2.0 },
    labelPos: { x: 230, y: 90 },
    labelSide: 'left'
  },
  culture: {
    color: 'var(--coral)',
    curve: [ {x: 450, y: 450}, {x: 430, y: 350}, {x: 470, y: 200}, {x: 450, y: 80} ],
    nodes: [0.4, 0.8],
    zoom: { cx: 450, cy: 265, scale: 2.0 },
    labelPos: { x: 470, y: 60 },
    labelSide: 'right'
  }
};


const JourneyParticles = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles: any[] = [];
    const NUM_PARTICLES = 50;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const z = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: z,
        size: z * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.6 * (z + 0.5),
        vy: (Math.random() * 0.6 + 0.2) * (z + 0.5),
        opacity: z * 0.7 + 0.1,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: (Math.random() * 0.02 + 0.01) * (z + 0.5),
        color: Math.random() > 0.2 ? '201, 169, 110' : '224, 138, 122'
      });
    }

    let animationFrameId: number;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * 0.001 * p.swaySpeed + p.swayOffset) * 0.5;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        ctx.beginPath();
        const blur = (1 - p.z) * 3; 
        
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        
        if (blur > 0.5) {
          ctx.shadowBlur = blur * 3;
          ctx.shadowColor = `rgba(${p.color}, ${p.opacity})`;
        } else {
          ctx.shadowBlur = p.size * 2;
          ctx.shadowColor = `rgba(232, 201, 154, 0.8)`;
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.clientWidth;
      height = canvasRef.current.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ opacity: 0.6, zIndex: 0, mixBlendMode: 'screen' }}
    />
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("JOURNEY_TREE_ERROR:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error.message}</h1>;
    }
    return this.props.children; 
  }
}

const JourneyTree = () => {
  return <ErrorBoundary><JourneyTreeInner /></ErrorBoundary>;
}

const JourneyTreeInner = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const handleDomainClick = (domainId: string) => {
    setSelectedDomain(domainId);
    setSelectedNodeId(null);
  };

  const zoom = selectedDomain ? BRANCH_DEFS[selectedDomain].zoom : { cx: 450, cy: 330, scale: 1 };
  const isZoomed = selectedDomain !== null;

  return (
    <div className="mt-20 relative flex flex-col items-center pb-12 w-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[40px]" style={{ top: '-100px', bottom: '-100px', width: '100vw', left: '50%', transform: 'translateX(-50%)', maxWidth: '1400px' }}>
         <JourneyParticles />
      </div>

      <div className={`text-center mb-10 relative z-10 transition-all duration-500 ${isZoomed ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="font-serif-ar italic text-[40px] text-[var(--gold)] mb-2 drop-shadow-sm">شجرتك — The Tree</div>
        <div className="text-[16px] text-[var(--text-muted)]">35 moments across 5 domains</div>
      </div>
      
      <div className="relative w-full max-w-[1000px] h-[600px] mx-auto rounded-[24px] overflow-hidden bg-[var(--surface)] border border-[var(--surface-border)] backdrop-blur-sm shadow-2xl">
        {/* Transform layer */}
        <div 
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translate(${450 - zoom.cx}px, ${330 - zoom.cy}px) scale(${zoom.scale})`,
            transformOrigin: `${zoom.cx}px ${zoom.cy}px`
          }}
        >
          <svg viewBox="0 0 900 660" className="w-full h-full absolute inset-0 overflow-visible">
            <defs>
              <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2D1A13" />
                <stop offset="15%" stopColor="#4A2F1D" />
                <stop offset="50%" stopColor="#B37033" />
                <stop offset="85%" stopColor="#4A2F1D" />
                <stop offset="100%" stopColor="#1E100A" />
              </linearGradient>
              <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="branchShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.4"/>
              </filter>
            </defs>

            {/* Base / Ground marker */}
            <ellipse cx="450" cy="650" rx="70" ry="14" fill="var(--tree-dim)" opacity="0.6" filter="url(#nodeGlow)" />

            {/* Trunk — tapered, bark-shaded, with a subtle root flare at the base */}
            <path
              d={getTaperedBranchPath(
                [ {x: 450, y: 655}, {x: 450, y: 583}, {x: 450, y: 517}, {x: 450, y: 452} ],
                46,
                17
              )}
              fill="url(#trunkGrad)"
              stroke="#1E100A"
              strokeWidth="1"
              filter="url(#branchShadow)"
            />

            {Object.entries(DOMAIN_DATA).map(([id, data]) => {
              const def = BRANCH_DEFS[id];
              const { curve } = def;
              const pathD = `M ${curve[0].x} ${curve[0].y} C ${curve[1].x} ${curve[1].y}, ${curve[2].x} ${curve[2].y}, ${curve[3].x} ${curve[3].y}`;
              
              let tMax = 0;
              data.moments.forEach((m: any, i: number) => {
                if (m.state === 'done' || m.state === 'next') tMax = def.nodes[i];
              });

              const isOther = selectedDomain && selectedDomain !== id;

              return (
                <g key={id} className={`transition-opacity duration-500 ${isOther ? 'opacity-20' : 'opacity-100'}`}>
                  {/* Invisible hit area */}
                  <path 
                    d={pathD} 
                    stroke="transparent" 
                    strokeWidth="40" 
                    fill="none" 
                    className={!selectedDomain ? "cursor-pointer" : ""}
                    onClick={() => !selectedDomain && handleDomainClick(id)}
                  />
                  
                  {/* Base branch — tapered, thicker at the trunk join, thinning toward the tip */}
                  <path
                    d={getTaperedBranchPath(curve, 15, 3)}
                    fill="url(#trunkGrad)"
                    stroke="#1E100A"
                    strokeWidth="0.75"
                    opacity="0.92"
                  />
                  
                  {/* Lit branch */}
                  {tMax > 0 && (
                    <polyline 
                      points={getPolyline(curve[0], curve[1], curve[2], curve[3], tMax)}
                      stroke={def.color}
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      filter="url(#pathGlow)"
                    />
                  )}

                  {/* SVG Nodes */}
                  {data.moments.map((m: any, i: number) => {
                    const t = def.nodes[i];
                    const pt = getBezierPoint(t, curve[0], curve[1], curve[2], curve[3]);
                    if (m.state === 'done') {
                      return (
                        <g key={m.id}>
                          <circle cx={pt.x} cy={pt.y} r="3.5" fill={def.color} filter="url(#nodeGlow)" />
                          <circle cx={pt.x} cy={pt.y} r="3.5" fill={def.color} />
                        </g>
                      );
                    } else if (m.state === 'next') {
                      return (
                        <g key={m.id}>
                          <circle cx={pt.x} cy={pt.y} r="2.5" fill={def.color} filter="url(#nodeGlow)" />
                          <circle cx={pt.x} cy={pt.y} r="2.5" fill="none" stroke={def.color} strokeWidth="1.5">
                            <animate attributeName="r" values="2.5;7;2.5" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                          </circle>
                        </g>
                      );
                    } else {
                      return (
                        <circle key={m.id} cx={pt.x} cy={pt.y} r="2.5" fill="var(--bg)" stroke="var(--tree-dim)" strokeWidth="1.5" />
                      );
                    }
                  })}
                </g>
              )
            })}
          </svg>

          {/* HTML Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {Object.entries(DOMAIN_DATA).map(([id, data]) => {
              const def = BRANCH_DEFS[id];
              const isSelected = selectedDomain === id;
              const isOther = selectedDomain && selectedDomain !== id;
              
              return (
                <div key={id} className={`absolute inset-0 transition-opacity duration-500 ${isOther ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  {/* Domain Title Label (Unzoomed) */}
                  <div 
                    className={`absolute transition-all duration-500 flex flex-col ${def.labelSide === 'left' ? 'items-end text-right' : 'items-start text-left'} ${selectedDomain ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto cursor-pointer hover:brightness-125'}`}
                    style={{ 
                      left: def.labelPos.x, top: def.labelPos.y, 
                      transform: def.labelSide === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)'
                    }}
                    onClick={() => handleDomainClick(id)}
                  >
                    <div className="text-[16px] font-semibold" style={{ color: def.color }}>{data.title}</div>
                    <div className="text-[12px] text-[var(--text-muted)] whitespace-nowrap">{data.meta}</div>
                  </div>

                  {/* HTML Nodes overlay for interactions & zoomed labels */}
                  {data.moments.map((nodeData: any, i: number) => {
                    const t = def.nodes[i];
                    const pt = getBezierPoint(t, def.curve[0], def.curve[1], def.curve[2], def.curve[3]);
                    const isNodeSelected = selectedNodeId === nodeData.id;
                    
                    return (
                      <div 
                        key={nodeData.id}
                        className="absolute"
                        style={{ left: pt.x, top: pt.y, transform: 'translate(-50%, -50%)' }}
                      >
                        {/* Hit Area */}
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'pointer-events-auto cursor-pointer hover:scale-125' : 'pointer-events-none'} transition-transform`}
                          onClick={(e) => { e.stopPropagation(); isSelected && setSelectedNodeId(nodeData.id); }}
                        />

                        {/* Label (Zoomed) */}
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 ${def.labelSide === 'left' ? 'right-4 text-right' : 'left-4 text-left'} transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-0'} pointer-events-none whitespace-nowrap`}
                        >
                          <div className={`text-[6px] font-bold tracking-wide drop-shadow-md ${nodeData.state === 'locked' ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                            {nodeData.title}
                          </div>
                        </div>

                        {/* Callout */}
                        <div 
                          className={`absolute z-50 flex flex-col gap-1 p-2.5 rounded-[8px] w-36 shadow-2xl transition-all duration-300 origin-top ${isNodeSelected && isSelected ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
                          style={{
                            background: 'var(--bg)', 
                            border: `1px solid ${def.color}80`,
                            top: '8px', 
                            left: '50%',
                            transform: 'translateX(-50%)',
                            boxShadow: `0 12px 32px -4px rgba(0,0,0,0.8), 0 0 16px ${def.color}30`
                          }}
                        >
                          <div className="text-[7px] font-semibold text-[var(--text-primary)] leading-snug whitespace-normal">{nodeData.title}</div>
                          <div className="text-[5px] uppercase tracking-wider font-bold mt-0.5" style={{ color: def.color }}>{nodeData.meta}</div>
                          {nodeData.state === 'next' && (
                            <button className="mt-1.5 w-full py-1.5 rounded-[4px] text-[5px] font-bold uppercase tracking-widest text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: def.color }}>
                              Start Session
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Back Button Overlay */}
        <div className={`absolute top-6 left-6 z-50 transition-all duration-500 ${isZoomed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
           <button 
             className="px-5 py-2.5 rounded-full backdrop-blur-md text-[var(--gold)] text-[12px] font-bold tracking-[0.15em] uppercase flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors shadow-lg cursor-pointer pointer-events-auto"
             style={{ background: 'var(--bg)', border: '1px solid var(--gold-border)' }}
             onClick={() => { setSelectedDomain(null); setSelectedNodeId(null); }}
           >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
             Full Tree
           </button>
        </div>
      </div>
    </div>
  );
};


export default function HomePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  return (
    <div 
      className={`tariga-theme-${theme} font-sans-body min-h-screen w-full relative selection:bg-[var(--gold-ghost-bg)] selection:text-[var(--gold)]`} 
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)', transition: 'background-color 0.5s ease' }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .tariga-theme-dark {
          --bg: #0f0d0b;
          --surface: rgba(255, 250, 242, 0.04);
          --surface-border: rgba(255, 255, 255, 0.08);
          --surface-hover: rgba(255, 250, 242, 0.07);
          --gold: #c9a96e;
          --gold-light: #e8c99a;
          --gold-border: rgba(201, 169, 110, 0.35);
          --gold-ghost-bg: rgba(201, 169, 110, 0.12);
          --teal: #4fd8c4;
          --green: #56c98f;
          --purple: #a78bfa;
          --coral: #e08a7a;
          --text-primary: #f6f1e8;
          --text-secondary: #a09e9a;
          --text-muted: #7a756e;
          --glass-shadow: 0 20px 44px -26px rgba(0,0,0,0.85);
          --ambient-gold: rgba(201, 169, 110, 0.13);
          --tree-trunk-start: #7d6544;
          --tree-trunk-end: #c9a96e;
          --tree-dim: rgba(255, 250, 242, 0.15);
          --card-blur: blur(16px);
          --ring-bg: rgba(255,255,255,0.06);
          --glow-green: 0 0 12px rgba(86, 201, 143, 0.4);
          --glow-gold: 0 0 12px rgba(232, 201, 154, 0.4);
          --glow-teal: 0 0 12px rgba(79, 216, 196, 0.4);
        }

        .tariga-theme-light {
          --bg: #f7f2e8;
          --surface: rgba(255, 255, 255, 0.5);
          --surface-border: rgba(169, 128, 62, 0.2);
          --surface-hover: rgba(255, 255, 255, 0.8);
          --gold: #a9803e;
          --gold-light: #8a662e;
          --gold-border: rgba(169, 128, 62, 0.4);
          --gold-ghost-bg: rgba(169, 128, 62, 0.1);
          --teal: #14a38f;
          --green: #2c9f65;
          --purple: #7b57db;
          --coral: #c96a58;
          --text-primary: #2d2926;
          --text-secondary: #6e6962;
          --text-muted: #969088;
          --glass-shadow: 0 10px 30px -10px rgba(169, 128, 62, 0.15);
          --ambient-gold: rgba(169, 128, 62, 0.08);
          --tree-trunk-start: #8a662e;
          --tree-trunk-end: #a9803e;
          --tree-dim: rgba(169, 128, 62, 0.2);
          --card-blur: blur(20px);
          --ring-bg: rgba(169, 128, 62, 0.15);
          --glow-green: none;
          --glow-gold: none;
          --glow-teal: none;
        }
        
        .font-serif-ar {
          font-family: 'Instrument Serif', 'Noto Naskh Arabic', serif;
        }
        .font-sans-body {
          font-family: 'DM Sans', sans-serif;
        }
      `}} />

      {/* Ambient background glow & noise */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glow 1 (Main/Top-Left) */}
        <div 
          className="absolute rounded-full transition-colors duration-1000"
          style={{ 
            top: '-20%', left: '0%', width: '80%', height: '80%',
            background: 'radial-gradient(circle, var(--ambient-gold), transparent 60%)', 
            filter: 'blur(100px)',
            opacity: 0.8
          }}
        />
        {/* Glow 2 (Center-Right) */}
        <div 
          className="absolute rounded-full transition-colors duration-1000"
          style={{ 
            top: '20%', right: '-10%', width: '60%', height: '70%',
            background: 'radial-gradient(circle, rgba(201,169,110,0.06), transparent 60%)', 
            filter: 'blur(90px)' 
          }}
        />
        {/* Glow 3 (Bottom-Left) */}
        <div 
          className="absolute rounded-full transition-colors duration-1000"
          style={{ 
            bottom: '-10%', left: '-10%', width: '70%', height: '60%',
            background: 'radial-gradient(circle, rgba(224,138,122,0.05), transparent 60%)', 
            filter: 'blur(120px)' 
          }}
        />
        {/* Noise overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      {/* Main Content Container (Desktop Frame Constraint) */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 pb-24 flex flex-col pt-8">
        <TopNav theme={theme} setTheme={setTheme} />
        
        <div className="mt-10 mb-6">
          <Greeting />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 mt-6 items-stretch">
          <div className="flex-1 flex flex-col">
            <HeroCard />
          </div>
          <div className="w-full lg:w-[420px] shrink-0 flex flex-col">
            <StatsWidget />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Tile title="Flashcards" sub="Solja episode" icon={<Icons.Flashcards />} colorVar="var(--teal)" />
          <Tile active={true} title="Your coach" sub="scenario 2 waiting →" icon={<Icons.Coach />} colorVar="var(--gold)" />
          <Tile title="Tune your ear" sub="Clip 2 of 5" icon={<Icons.Ear />} colorVar="var(--purple)" />
          <Tile title="Your journey" sub="Then → now" icon={<Icons.Journey />} colorVar="var(--green)" />
        </div>
        
        <JourneyTree />
      </div>
    </div>
  );
}
