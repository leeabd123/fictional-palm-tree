import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Check, Lock } from 'lucide-react';

const LESSONS = [
  { id: 1, arabic: "التحية", english: "Greetings", status: "completed", master: 100, y: 350, x: -10, z: 80 },
  { id: 2, arabic: "العائلة", english: "Family", status: "completed", master: 80, y: 150, x: -160, z: 20 },
  { id: 3, arabic: "الأرقام", english: "Numbers", status: "unlocked", master: 20, y: 0, x: 150, z: -50 },
  { id: 4, arabic: "الألوان", english: "Colors", status: "locked", master: 0, y: -150, x: -130, z: -110 },
  { id: 5, arabic: "الطعام", english: "Food", status: "locked", master: 0, y: -300, x: 140, z: -70 },
  { id: 6, arabic: "السوق", english: "At the market", status: "locked", master: 0, y: -450, x: -150, z: 50 },
  { id: 7, arabic: "السفر", english: "Travel", status: "locked", master: 0, y: -600, x: 90, z: 140 },
  { id: 8, arabic: "الطقس", english: "Weather", status: "locked", master: 0, y: -720, x: -30, z: 10 },
];

const TRUNK_TOP = -780;
const TRUNK_BOTTOM = 400;
const TRUNK_HEIGHT = TRUNK_BOTTOM - TRUNK_TOP;
const TRUNK_WIDTH_BOTTOM = 140;
const TRUNK_WIDTH_TOP = 20;

function PathLine({ p1, p2, active }: { p1: any, p2: any, active: boolean }) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const yaw = Math.atan2(-dz, dx);
  const pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));

  const color = active ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #4a352a, #2a1f1a)';
  const shadow = active ? '0 0 15px rgba(245,158,11,0.6)' : 'none';

  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, marginTop: '-5px',
      width: `${length}px`, height: '10px',
      transformOrigin: '0 50%',
      transform: `translate3d(${p1.x}px, ${p1.y}px, ${p1.z}px) rotateY(${yaw}rad) rotateZ(${pitch}rad)`,
      transformStyle: 'preserve-3d'
    }}>
      {[0, 90].map(rotX => (
        <div key={rotX} style={{
          position: 'absolute', inset: 0,
          background: color,
          boxShadow: shadow,
          borderRadius: '5px',
          transform: `rotateX(${rotX}deg)`
        }} />
      ))}
    </div>
  );
}

function Branch({ node }: { node: any }) {
  const startY = node.y + 70; // Trunk connection point (lower)
  const dy = node.y - startY; 
  const dx = node.x;
  const dz = node.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const yaw = Math.atan2(-dz, dx);
  const pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));

  const heightRatio = Math.max(0, Math.min(1, (TRUNK_BOTTOM - startY) / TRUNK_HEIGHT));
  const scale = 1 - (heightRatio * 0.5);
  const thickness = 28 * scale;

  return (
    <div style={{
      position: 'absolute', left: 0, top: `${startY}px`,
      width: `${length}px`, height: `${thickness}px`,
      transformOrigin: '0 50%',
      transform: `translateY(-50%) rotateY(${yaw}rad) rotateZ(${pitch}rad)`,
      transformStyle: 'preserve-3d'
    }}>
      {[0, 90].map(rotX => (
        <div key={rotX} style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #8a5a33 0%, #5c3a21 40%, #2a1f1a 100%)',
          clipPath: 'polygon(0 0, 100% 35%, 100% 65%, 0 100%)',
          transform: `rotateX(${rotX}deg)`
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60" />
        </div>
      ))}
    </div>
  );
}

function DecorativeBranch({ branch }: { branch: any }) {
  const thickness = 24 * branch.scale;
  return (
    <div style={{
      position: 'absolute', left: 0, top: `${branch.startY}px`,
      width: `${branch.length}px`, height: `${thickness}px`,
      transformOrigin: '0 50%',
      transform: `translateY(-50%) rotateY(${branch.yaw}rad) rotateZ(${branch.pitch}rad)`,
      transformStyle: 'preserve-3d'
    }}>
      {[0, 90].map(rotX => (
        <div key={rotX} style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #7a4a2a 0%, #4a3020 50%, #1a1311 100%)',
          clipPath: 'polygon(0 0, 100% 40%, 100% 60%, 0 100%)',
          transform: `rotateX(${rotX}deg)`
        }}>
           <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/80" />
        </div>
      ))}
    </div>
  );
}

export default function Parallax3DTree() {
  const [rotation, setRotation] = useState({ x: -5, y: -15 });
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [prevNode, setPrevNode] = useState<any>(null);

  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (selectedNodeId !== null) {
      setPrevNode(LESSONS.find(l => l.id === selectedNodeId));
    }
  }, [selectedNodeId]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    currentRot.current = { ...rotation };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDragged.current = true;
    }
    
    let newY = currentRot.current.y + dx * 0.3;
    let newX = currentRot.current.x - dy * 0.3;
    
    newX = Math.max(-25, Math.min(25, newX));
    newY = Math.max(-45, Math.min(45, newY));
    
    setRotation({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!hasDragged.current) {
      setSelectedNodeId(null);
    }
  };

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 800 - 400,
      y: Math.random() * 1400 - 700,
      z: Math.random() * 600 - 300,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6
    }));
  }, []);

  const selectedNode = LESSONS.find(l => l.id === selectedNodeId);
  const displayNode = selectedNode || prevNode;

  const focus = selectedNode 
    ? { x: -selectedNode.x, y: -selectedNode.y, z: -selectedNode.z, scale: 1.4 }
    : { x: 0, y: 175, z: 0, scale: 0.6 };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden select-none bg-[#14100E] font-['DM_Sans'] text-amber-50"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-400px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* 3D Container */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `scale(${focus.scale})`,
            transition: 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Drag Rotation */}
          <div
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Camera Focus Translation */}
            <div
              style={{
                transform: `translate3d(${focus.x}px, ${focus.y}px, ${focus.z}px)`,
                transition: 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Tree Base Glow */}
              <div style={{
                position: 'absolute', left: 0, top: `${TRUNK_BOTTOM}px`,
                width: '300px', height: '300px',
                transform: 'translate(-50%, -50%) rotateX(90deg)',
                background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 30%, transparent 70%)',
              }} />

              {/* Trunk */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = i * 30;
                return (
                  <div key={angle} style={{
                    position: 'absolute', left: `${-TRUNK_WIDTH_BOTTOM / 2}px`, top: `${TRUNK_TOP}px`,
                    width: `${TRUNK_WIDTH_BOTTOM}px`, height: `${TRUNK_HEIGHT}px`,
                    background: 'linear-gradient(90deg, #0a0807 0%, #3d2b1f 30%, #5c3a21 50%, #3d2b1f 70%, #0a0807 100%)',
                    clipPath: `polygon(calc(50% - ${TRUNK_WIDTH_TOP/2}px) 0, calc(50% + ${TRUNK_WIDTH_TOP/2}px) 0, 100% 100%, 0 100%)`,
                    transformOrigin: '50% 100%',
                    transform: `rotateY(${angle}deg)`
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-transparent to-amber-900/30 opacity-80" />
                  </div>
                );
              })}

              {/* Decorative Branches */}
              {Array.from({ length: 14 }).map((_, i) => {
                // Procedurally generated static branches for fullness
                // using a seeded pseudo-random approach for consistency
                const rand = (i * 137) % 100 / 100;
                const rand2 = (i * 251) % 100 / 100;
                const rand3 = (i * 389) % 100 / 100;
                
                const startY = TRUNK_BOTTOM - (rand * TRUNK_HEIGHT * 0.85) - 30;
                const length = 150 + rand2 * 200;
                const yaw = rand3 * Math.PI * 2;
                const pitch = -0.15 - (rand * 0.7); // slight upward angle
                const scale = 1 - (TRUNK_BOTTOM - startY) / TRUNK_HEIGHT;

                return <DecorativeBranch key={`dec-${i}`} branch={{ startY, length, yaw, pitch, scale }} />;
              })}

              {/* Main Branches */}
              {LESSONS.map(node => <Branch key={`branch-${node.id}`} node={node} />)}

              {/* Paths */}
              {LESSONS.map((node, i) => {
                if (i === LESSONS.length - 1) return null;
                const nextNode = LESSONS[i + 1];
                const isActive = nextNode.status !== 'locked';
                return <PathLine key={`path-${node.id}`} p1={node} p2={nextNode} active={isActive} />;
              })}

              {/* Particles */}
              {particles.map(p => (
                <div key={p.id} style={{
                  position: 'absolute', left: 0, top: 0,
                  transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
                  transformStyle: 'preserve-3d'
                }}>
                  <div style={{
                    width: `${p.size}px`, height: `${p.size}px`,
                    backgroundColor: '#fbbf24',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #fbbf24',
                    animation: `float-up ${p.duration}s infinite linear ${p.delay}s`,
                    opacity: 0,
                    // Inverse rotation so particles face camera
                    transform: `rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`
                  }} />
                </div>
              ))}

              {/* Nodes */}
              {LESSONS.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isUnlocked = node.status !== 'locked';

                return (
                  <div key={node.id} style={{
                    position: 'absolute', left: 0, top: 0,
                    // The wrapper translates to 3D pos, then counter-rotates to face camera perfectly!
                    transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`,
                  }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                      className={`
                        absolute -translate-x-1/2 -translate-y-1/2
                        flex flex-col items-center pointer-events-auto
                        transition-transform duration-500
                        ${isSelected ? 'scale-125' : 'hover:scale-110'}
                      `}
                      style={{ minWidth: '240px' }} // Plenty of width to avoid text clipping
                    >
                      <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center relative
                        transition-all duration-500
                        ${node.status === 'completed' ? 'bg-amber-500 text-amber-950' :
                          node.status === 'unlocked' ? 'bg-[#2a1f1a] border-2 border-amber-500 text-amber-500' :
                          'bg-[#0a0807] border-2 border-[#3d2b1f] text-[#4a352a]'}
                      `}>
                        {node.status === 'completed' && <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]" />}
                        {node.status === 'unlocked' && <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]" />}
                        
                        {node.status === 'completed' ? <Check size={24} strokeWidth={3} /> : 
                         node.status === 'locked' ? <Lock size={20} /> :
                         <span className="font-bold text-xl">{node.id}</span>}
                      </div>

                      <div className="mt-3 flex flex-col items-center overflow-visible" style={{ transform: 'translateZ(1px)' }}>
                        <div 
                          dir="rtl"
                          className={`font-['Noto_Naskh_Arabic'] text-4xl transition-colors duration-500 rounded-xl px-4 py-1 whitespace-nowrap ${
                            isUnlocked ? 'text-amber-50' : 'text-[#8a756a]'
                          }`}
                          style={{ 
                            fontFamily: '"Noto Naskh Arabic", serif',
                            direction: 'rtl',
                            unicodeBidi: 'isolate',
                            width: 'max-content',
                            backgroundColor: 'rgba(10,8,7,0.82)',
                            backdropFilter: 'blur(2px)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
                            textShadow: isUnlocked ? '0 2px 4px rgba(0,0,0,1)' : 'none'
                          }}
                        >
                          {node.arabic}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hint UI */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-80">
        <div className="px-5 py-2.5 rounded-full border border-amber-500/20 bg-[#1a1311]/60 backdrop-blur-md text-amber-100/90 text-sm tracking-wide shadow-lg">
          Drag to rotate • Click a node to zoom
        </div>
      </div>

      {/* Detail Panel */}
      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 w-[340px] transition-all duration-500 pointer-events-none ${
          selectedNodeId !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {displayNode && (
          <div className="bg-[#1a1311]/95 backdrop-blur-xl border border-[#3d2b1f] p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-5 relative overflow-hidden pointer-events-auto">
            {/* Decorative top glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            
            <div className="flex justify-between items-start">
              <div>
                <h2 
                  className="font-['Noto_Naskh_Arabic'] text-3xl text-amber-400 mb-1"
                  style={{ fontFamily: '"Noto Naskh Arabic", serif' }}
                >
                  {displayNode.arabic}
                </h2>
                <p 
                  className="font-['Instrument_Serif'] text-2xl text-amber-50/70 tracking-wide italic"
                  style={{ fontFamily: '"Instrument Serif", serif' }}
                >
                  {displayNode.english}
                </p>
              </div>
              
              {displayNode.status !== 'locked' && (
                <div className="w-14 h-14 rounded-full border border-amber-500/30 bg-[#2a1f1a] flex flex-col items-center justify-center shadow-inner">
                  <span className="font-['DM_Sans'] font-bold text-amber-500 text-lg leading-none">{displayNode.master}%</span>
                </div>
              )}
              {displayNode.status === 'locked' && (
                <div className="w-14 h-14 rounded-full border border-[#3d2b1f] bg-[#0a0807] flex items-center justify-center shadow-inner">
                  <Lock size={20} className="text-[#4a352a]" />
                </div>
              )}
            </div>
            
            <div className="h-2.5 w-full bg-[#0a0807] rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${displayNode.master}%` }} 
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>

            <button 
              className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all ${
                displayNode.status === 'locked' 
                  ? 'bg-[#2a1f1a] text-[#8a756a] cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-amber-50 shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_25px_rgba(217,119,6,0.5)]'
              }`}
            >
              {displayNode.status === 'locked' ? 'Locked' : displayNode.status === 'completed' ? 'Review Lesson' : 'Start Lesson'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
