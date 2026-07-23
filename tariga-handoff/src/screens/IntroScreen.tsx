import React from 'react';

export default function IntroScreen() {
  return (
    <div 
      className="tariga-theme-dark font-sans-body min-h-screen w-full relative flex items-center justify-center selection:bg-[var(--gold-ghost-bg)] selection:text-[var(--gold)]" 
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .tariga-theme-dark {
          --bg: #0f0d0b;
          --surface: rgba(255, 250, 242, 0.04);
          --surface-border: rgba(255, 255, 255, 0.08);
          --gold: #c9a96e;
          --gold-light: #e8c99a;
          --gold-border: rgba(201, 169, 110, 0.35);
          --gold-ghost-bg: rgba(201, 169, 110, 0.12);
          --purple: #a78bfa;
          --text-primary: #f6f1e8;
          --text-secondary: #a09e9a;
          --text-muted: #7a756e;
        }
        .font-serif-ar {
          font-family: 'Instrument Serif', 'Noto Naskh Arabic', serif;
        }
        .font-sans-body {
          font-family: 'DM Sans', sans-serif;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute rounded-full"
          style={{ 
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(201,169,110,0.08), transparent 60%)', 
            filter: 'blur(60px)' 
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[500px] px-6 flex flex-col items-center text-center pb-12">
        {/* Orb */}
        <div className="relative w-32 h-32 mb-12 flex justify-center items-center">
          <div className="absolute inset-0 rounded-full" style={{ background: 'var(--gold)', filter: 'blur(30px)', opacity: 0.3, animation: 'breathe 4s ease-in-out infinite' }} />
          <div 
            className="w-24 h-24 rounded-full relative z-10" 
            style={{ 
              background: 'radial-gradient(circle at 35% 35%, #e8c99a, #c9a96e 40%, #e08a7a 80%, #7d6544)',
              boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.5), inset 4px 4px 10px rgba(255,255,255,0.4)',
              animation: 'breathe 4s ease-in-out infinite' 
            }} 
          />
        </div>

        {/* Greetings */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <h1 className="font-serif-ar text-[52px] leading-tight text-[var(--gold)]" dir="rtl" style={{ textShadow: '0 0 30px rgba(201,169,110,0.3)' }}>السلام عليكم</h1>
          <div className="font-serif-ar italic text-[28px] text-[var(--purple)]">as-salamu alaykum</div>
          <div className="text-[16px] text-[var(--text-muted)] font-medium mt-2">Peace be upon you</div>
        </div>

        <div className="text-[15px] text-[var(--text-secondary)] mb-6 font-medium">
          Try saying it back — out loud or typed. Arabizi counts.
        </div>

        {/* Input Row */}
        <div className="w-full flex items-center gap-3 p-2 rounded-[28px] shadow-lg" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', backdropFilter: 'blur(16px)' }}>
          <button className="w-[46px] h-[46px] rounded-full shrink-0 flex items-center justify-center relative group">
            <div className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', filter: 'blur(8px)' }} />
            <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
          
          <input 
            type="text" 
            placeholder="السلام عليكم … or salam alaykum" 
            className="flex-1 bg-transparent border-none outline-none text-[16px] text-[var(--text-primary)] placeholder-[var(--text-muted)] px-1"
            dir="auto"
          />
          
          <button className="shrink-0 px-5 h-[46px] rounded-full font-semibold text-[15px] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2" style={{ background: 'var(--gold-ghost-bg)', color: 'var(--gold-light)', border: '1px solid var(--gold-border)' }}>
            Say it
            <span>→</span>
          </button>
        </div>

        {/* Skip intro */}
        <button className="mt-12 text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors opacity-60 hover:opacity-100 font-medium tracking-wide">
          Skip intro
        </button>
      </div>
    </div>
  );
}