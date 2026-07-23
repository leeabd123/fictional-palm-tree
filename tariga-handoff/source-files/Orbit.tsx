import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CircleDot, Lock } from 'lucide-react';

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error("Canvas WebGL error caught by boundary:", error);
  }
  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}

function WebGLFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#120a05] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1d17] to-[#120a05] text-[#f4e8d6] p-8 z-20">
       <div className="relative w-64 h-64 mb-8">
         <div className="absolute inset-0 bg-[#ffcc80] blur-[80px] opacity-20 rounded-full" />
         <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,204,128,0.5)]">
           <path d="M50 100 Q45 70 30 50 Q45 60 50 40 Q55 60 70 50 Q55 70 50 100" fill="none" stroke="#d4af37" strokeWidth="1.5" />
           <circle cx="30" cy="50" r="3" fill="#ffcc80" />
           <circle cx="50" cy="40" r="3" fill="#ffcc80" />
           <circle cx="70" cy="50" r="3" fill="#ffcc80" />
           <circle cx="50" cy="15" r="4" fill="#ffcc80" className="animate-[pulse_2s_ease-in-out_infinite]" />
         </svg>
       </div>
       <h2 className="font-['Instrument_Serif'] text-3xl text-[#ffcc80] mb-3 text-center">3D Learning Tree</h2>
       <p className="text-[#ffcc80]/60 text-center max-w-md font-['DM_Sans'] text-sm leading-relaxed">
         (Static Preview)<br/>
         Your device or browser is currently running in a mode that doesn't support full WebGL 3D rendering. Please enable hardware acceleration to explore the interactive tree.
       </p>
    </div>
  );
}

type NodeData = {
  id: number;
  position: [number, number, number];
  titleAr: string;
  titleEn: string;
  status: 'completed' | 'current' | 'locked';
  progress: number;
};

const NODES: NodeData[] = [
  { id: 0, position: [0, 0, 0], titleAr: "البداية", titleEn: "The Beginning", status: 'completed', progress: 100 },
  { id: 1, position: [0.6, 1.5, 0.4], titleAr: "التحية", titleEn: "Greetings", status: 'completed', progress: 100 },
  { id: 2, position: [-0.4, 3.2, -0.2], titleAr: "الأرقام", titleEn: "Numbers", status: 'completed', progress: 100 },
  { id: 3, position: [0.5, 4.8, -0.5], titleAr: "العائلة", titleEn: "Family", status: 'completed', progress: 100 },
  { id: 4, position: [-0.2, 6.5, 0.4], titleAr: "السوق", titleEn: "At the market", status: 'current', progress: 65 },
  { id: 5, position: [0.8, 8.2, -0.1], titleAr: "الطعام", titleEn: "Food", status: 'locked', progress: 0 },
  { id: 6, position: [-0.5, 9.8, 0.6], titleAr: "السفر", titleEn: "Travel", status: 'locked', progress: 0 },
  { id: 7, position: [0.3, 11.5, -0.3], titleAr: "الأصدقاء", titleEn: "Friends", status: 'locked', progress: 0 },
];

const DECORATIVE_BRANCHES = [
  { start: 1, end: [1.5, 2.2, 1.0], thickness: 0.08 },
  { start: 2, end: [-1.4, 3.8, -0.8], thickness: 0.08 },
  { start: 3, end: [1.6, 5.5, -1.2], thickness: 0.07 },
  { start: 4, end: [-1.2, 7.2, 1.2], thickness: 0.07 },
  { start: 5, end: [1.8, 9.0, -0.5], thickness: 0.06 },
  { start: 6, end: [-1.5, 10.5, 1.4], thickness: 0.05 },
];

function BranchSegment({ start, end, thickness = 0.15, isGolden = false }: { start: [number, number, number], end: [number, number, number], thickness?: number, isGolden?: boolean }) {
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  const distance = startVec.distanceTo(endVec);
  const position = useMemo(() => startVec.clone().add(endVec).multiplyScalar(0.5), [startVec, endVec]);
  
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const direction = new THREE.Vector3().subVectors(endVec, startVec).normalize();
    q.setFromUnitVectors(up, direction);
    return q;
  }, [startVec, endVec]);

  return (
    <mesh position={position} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[thickness * 0.7, thickness, distance, 16]} />
      <meshStandardMaterial 
        color={isGolden ? "#e6c25a" : "#2a1b12"} 
        emissive={isGolden ? "#996b1a" : "#000000"}
        emissiveIntensity={isGolden ? 0.6 : 0}
        roughness={isGolden ? 0.4 : 0.9}
        metalness={isGolden ? 0.5 : 0.1}
      />
    </mesh>
  );
}

function TreeBranches({ nodes }: { nodes: NodeData[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        if (i === nodes.length - 1) return null;
        const nextNode = nodes[i + 1];
        const isPathGolden = node.status === 'completed' && (nextNode.status === 'completed' || nextNode.status === 'current');
        
        return (
          <BranchSegment 
            key={`branch-${i}`} 
            start={node.position} 
            end={nextNode.position} 
            thickness={isPathGolden ? 0.18 : 0.15} 
            isGolden={isPathGolden} 
          />
        );
      })}
      {DECORATIVE_BRANCHES.map((b, i) => {
         const startNode = nodes.find(n => n.id === b.start);
         if (!startNode) return null;
         return (
           <BranchSegment 
             key={`dec-${i}`}
             start={startNode.position}
             end={b.end as [number, number, number]}
             thickness={b.thickness}
             isGolden={false}
           />
         );
      })}
    </>
  );
}

function NodeSphere({ node, onClick, isSelected }: { node: NodeData, onClick: (id: number) => void, isSelected: boolean }) {
  const isCompleted = node.status === 'completed';
  const isCurrent = node.status === 'current';
  
  const color = isCompleted || isCurrent ? "#ffcc80" : "#3e2723";
  const emissive = isCompleted || isCurrent ? "#ffaa33" : "#000000";
  const emissiveIntensity = isCurrent ? 1.5 : isCompleted ? 0.8 : 0;
  
  const groupRef = useRef<THREE.Group>(null);
  const basePos = useMemo(() => new THREE.Vector3(...node.position), [node.position]);

  useFrame((state) => {
    if (groupRef.current && isCurrent) {
      groupRef.current.position.y = basePos.y + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={node.position} ref={groupRef}>
      <mesh 
        onClick={(e) => { 
          e.stopPropagation(); 
          onClick(node.id); 
        }} 
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
        castShadow
      >
        <sphereGeometry args={[isCurrent ? 0.35 : 0.25, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={emissive} 
          emissiveIntensity={emissiveIntensity} 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
      
      {(isCompleted || isCurrent) && (
        <mesh>
          <sphereGeometry args={[isCurrent ? 0.55 : 0.4, 16, 16]} />
          <meshBasicMaterial color="#ffaa33" transparent opacity={isCurrent ? 0.2 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {isCurrent && <pointLight color="#ffcc80" intensity={2} distance={4} />}
      
      <Html position={[0, 0, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-56 bg-[#170e08]/95 backdrop-blur-md border border-[#d4af37]/30 p-4 rounded-2xl shadow-2xl shadow-black/80 flex flex-col gap-3 pointer-events-auto ml-24 -mt-24"
            >
               <div className="flex justify-between items-start">
                 <div className="bg-[#2a1d17] p-2.5 rounded-xl border border-[#d4af37]/20 shadow-inner">
                   {node.status === 'completed' && <Star className="w-5 h-5 text-[#ffcc80] fill-[#ffcc80]" />}
                   {node.status === 'current' && <CircleDot className="w-5 h-5 text-[#ffcc80]" />}
                   {node.status === 'locked' && <Lock className="w-5 h-5 text-white/30" />}
                 </div>
                 <div className="text-right flex flex-col pt-1">
                   <span className="font-['Noto_Naskh_Arabic'] text-2xl text-[#ffcc80] drop-shadow-md leading-none">{node.titleAr}</span>
                   <span className="font-['DM_Sans'] text-[13px] font-medium text-white/70 mt-1">{node.titleEn}</span>
                 </div>
               </div>
               
               <div className="mt-1">
                 <div className="flex justify-between text-[10px] mb-1.5 font-['DM_Sans'] uppercase tracking-widest text-[#d4af37]/80">
                    <span>Mastery</span>
                    <span>{node.progress}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#8b5a2b] via-[#d4af37] to-[#ffcc80] rounded-full transition-all duration-1000" 
                      style={{ width: `${node.progress}%` }} 
                    />
                 </div>
               </div>
               
               {node.status === 'current' && (
                 <button className="mt-2 w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#ffb347] text-[#1a120b] font-bold text-[13px] rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-[1.02] transition-all font-['DM_Sans'] uppercase tracking-widest active:scale-95">
                   Continue
                 </button>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </group>
  );
}

function CameraRig({ selectedId, isAutoPanning }: { selectedId: number | null, isAutoPanning: boolean }) {
  const controls = useThree((state) => state.controls) as any;
  const { camera } = useThree();
  
  useFrame((state, delta) => {
    if (controls && isAutoPanning) {
      if (selectedId !== null) {
        const node = NODES.find(n => n.id === selectedId);
        if (node) {
          const targetPos = new THREE.Vector3(...node.position);
          controls.target.lerp(targetPos, 4 * delta);
          
          const desiredPos = targetPos.clone().add(new THREE.Vector3(0, 1, 6));
          camera.position.lerp(desiredPos, 4 * delta);
        }
      } else {
        const targetPos = new THREE.Vector3(0, 5, 0);
        controls.target.lerp(targetPos, 4 * delta);
        const desiredPos = new THREE.Vector3(0, 6, 14);
        camera.position.lerp(desiredPos, 4 * delta);
      }
    }
  });
  return null;
}

function TreeScene({ selectedNode, onSelectNode }: { selectedNode: number | null, onSelectNode: (id: number) => void }) {
  return (
    <group>
       <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
         <circleGeometry args={[20, 64]} />
         <meshStandardMaterial color="#0a0502" roughness={1} metalness={0} />
       </mesh>
       <TreeBranches nodes={NODES} />
       {NODES.map(node => (
         <NodeSphere 
           key={node.id} 
           node={node} 
           isSelected={selectedNode === node.id} 
           onClick={onSelectNode} 
         />
       ))}
    </group>
  );
}

export default function Tariga3DTreeOrbit() {
  const [selectedNode, setSelectedNode] = useState<number | null>(4);
  const [isAutoPanning, setIsAutoPanning] = useState(true);

  // Synchronous check for WebGL support to avoid crashing the whole page
  const [hasWebGL] = useState(() => {
    if (typeof window === 'undefined') return true; // Assume true during SSR
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="w-full h-[100dvh] bg-[#120a05] text-[#f4e8d6] font-['DM_Sans'] relative overflow-hidden">
      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="font-['Instrument_Serif'] text-5xl text-[#ffcc80] mb-2 drop-shadow-lg">طريقة</h1>
          <p className="text-[#d4af37]/80 text-xs font-bold tracking-[0.2em] uppercase ml-1">Tariga Learning</p>
        </div>
        <div className="bg-[#1a120b]/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#d4af37]/30 flex items-center gap-3 shadow-xl shadow-black/50 pointer-events-auto cursor-pointer hover:bg-[#2a1d17]/80 transition-colors">
           <div className="w-2.5 h-2.5 rounded-full bg-[#ffcc80] animate-[pulse_2s_ease-in-out_infinite]" />
           <span className="text-sm text-[#ffcc80] font-bold tracking-wider">1,240 XP</span>
        </div>
      </div>
      
      {/* Interaction Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
         <div className="bg-[#0a0502]/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/70 text-sm flex items-center gap-3 shadow-2xl">
            <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="font-medium tracking-wide">Drag to rotate • Click a node to zoom</span>
         </div>
      </div>

      <div className="w-full h-full absolute inset-0">
        {!hasWebGL ? (
          <WebGLFallback />
        ) : (
          <CanvasErrorBoundary fallback={<WebGLFallback />}>
            <Canvas 
              shadows 
              camera={{ position: [0, 6, 14], fov: 45 }}
              onPointerMissed={() => {
                setSelectedNode(null);
                setIsAutoPanning(true);
              }}
              gl={{ failIfMajorPerformanceCaveat: false, antialias: true }}
              onCreated={(state) => {
                 // Optional: Additional setup if needed upon successful context creation
              }}
            >
               <color attach="background" args={['#120a05']} />
               <fog attach="fog" args={['#120a05', 8, 25]} />
               
               <ambientLight intensity={0.6} color="#ffb347" />
               <directionalLight 
                 position={[8, 12, 5]} 
                 intensity={1.5} 
                 color="#ffd599" 
                 castShadow 
                 shadow-mapSize={[2048, 2048]} 
               />
               <pointLight position={[0, 6, 0]} intensity={0.8} color="#ffcc80" distance={15} />

               <CameraRig selectedId={selectedNode} isAutoPanning={isAutoPanning} />
               
               <OrbitControls 
                 makeDefault 
                 onStart={() => setIsAutoPanning(false)}
                 minPolarAngle={Math.PI / 4} 
                 maxPolarAngle={Math.PI / 2 + 0.05} 
                 minAzimuthAngle={-Math.PI / 2}
                 maxAzimuthAngle={Math.PI / 2}
                 enableZoom={true}
                 minDistance={3}
                 maxDistance={20}
                 enablePan={false}
                 dampingFactor={0.05}
               />

               <TreeScene 
                 selectedNode={selectedNode} 
                 onSelectNode={(id) => {
                   setSelectedNode(id);
                   setIsAutoPanning(true);
                 }} 
               />

               <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.6} color="#ffcc80" />
               <Sparkles count={50} scale={10} size={4} speed={0.2} opacity={0.4} color="#d4af37" />
            </Canvas>
          </CanvasErrorBoundary>
        )}
      </div>
    </div>
  );
}
