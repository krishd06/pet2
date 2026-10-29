import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Layers,
  ArrowRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 15000;

function MorphingParticles({ progressRef }) {
  const pointsRef = useRef();

  // Generate 15,000 coordinates for Shape A (Tree + Floor Ripples) and Shape B (Compatibility Cube)
  const { treePositions, cubePositions, treeColors, cubeColors } = useMemo(() => {
    const tree = new Float32Array(PARTICLE_COUNT * 3);
    const cube = new Float32Array(PARTICLE_COUNT * 3);
    const cTree = new Float32Array(PARTICLE_COUNT * 3);
    const cCube = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // ─── SHAPE A: GLOWING ECOSYSTEM TREE + FLOOR RIPPLES ───
      if (i < 4000) {
        // Concentric floor ripples
        const ring = (i % 8) + 1;
        const r = ring * 0.45 + Math.random() * 0.25;
        const angle = Math.random() * Math.PI * 2;
        tree[i3] = Math.cos(angle) * r;
        tree[i3 + 1] = -2.6 + Math.sin(r * 4) * 0.12;
        tree[i3 + 2] = Math.sin(angle) * r;

        cTree[i3] = 0.05;
        cTree[i3 + 1] = 0.75 + Math.random() * 0.2;
        cTree[i3 + 2] = 0.55 + Math.random() * 0.3; // Emerald/Cyan glow
      } else if (i < 8000) {
        // Tree trunk & root spirals
        const u = (i - 4000) / 4000;
        const y = -2.6 + u * 4.2;
        const radius = 0.38 * (1.2 - u * 0.65) + Math.random() * 0.15;
        const angle = Math.random() * Math.PI * 2;
        tree[i3] = Math.cos(angle) * radius + Math.sin(y * 2) * 0.15;
        tree[i3 + 1] = y;
        tree[i3 + 2] = Math.sin(angle) * radius;

        cTree[i3] = 0.95;
        cTree[i3 + 1] = 0.60 + Math.random() * 0.2;
        cTree[i3 + 2] = 0.15; // Golden Amber trunk
      } else {
        // Canopy: lush organic foliage sphere
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.55) * 2.8;
        tree[i3] = r * Math.sin(phi) * Math.cos(theta);
        tree[i3 + 1] = 1.2 + r * Math.sin(phi) * Math.sin(theta) * 0.85;
        tree[i3 + 2] = r * Math.cos(phi);

        cTree[i3] = 0.1 + Math.random() * 0.3;
        cTree[i3 + 1] = 0.85 + Math.random() * 0.15;
        cTree[i3 + 2] = 0.4 + Math.random() * 0.4; // Lush bioluminescent green
      }

      // ─── SHAPE B: 3D COMPATIBILITY ROTATING HYPERCUBE ───
      const face = Math.floor(Math.random() * 6);
      const u = (Math.random() - 0.5) * 3.6;
      const v = (Math.random() - 0.5) * 3.6;
      const s = 1.8;
      switch (face) {
        case 0: cube[i3] = s; cube[i3 + 1] = u; cube[i3 + 2] = v; break;
        case 1: cube[i3] = -s; cube[i3 + 1] = u; cube[i3 + 2] = v; break;
        case 2: cube[i3] = u; cube[i3 + 1] = s; cube[i3 + 2] = v; break;
        case 3: cube[i3] = u; cube[i3 + 1] = -s; cube[i3 + 2] = v; break;
        case 4: cube[i3] = u; cube[i3 + 1] = v; cube[i3 + 2] = s; break;
        case 5: cube[i3] = u; cube[i3 + 1] = v; cube[i3 + 2] = -s; break;
      }

      cCube[i3] = 1.0;
      cCube[i3 + 1] = 0.65 + Math.random() * 0.35;
      cCube[i3 + 2] = 0.15 + Math.random() * 0.25; // Radiant Gold & Solar Orange
    }

    return {
      treePositions: tree,
      cubePositions: cube,
      treeColors: cTree,
      cubeColors: cCube
    };
  }, []);

  // Dynamic positions buffer initialized with Shape A
  const currentPositions = useMemo(() => new Float32Array(treePositions), [treePositions]);
  const currentColors = useMemo(() => new Float32Array(treeColors), [treeColors]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const p = progressRef.current || 0; // scroll progress 0 -> 1
    const time = state.clock.getElapsedTime();

    const positionAttr = pointsRef.current.geometry.attributes.position;
    const colorAttr = pointsRef.current.geometry.attributes.color;
    const pos = positionAttr.array;
    const col = colorAttr.array;

    // Smooth smoothstep transition
    const t = p * p * (3 - 2 * p);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Base interpolation between Tree and Cube
      const tx = treePositions[i3];
      const ty = treePositions[i3 + 1];
      const tz = treePositions[i3 + 2];

      const cx = cubePositions[i3];
      const cy = cubePositions[i3 + 1];
      const cz = cubePositions[i3 + 2];

      // Subtle organic floating noise
      const wave = Math.sin(time * 1.5 + tx * 2) * 0.05 * (1 - t * 0.5);

      pos[i3] = tx * (1 - t) + cx * t;
      pos[i3 + 1] = (ty * (1 - t) + cy * t) + wave;
      pos[i3 + 2] = tz * (1 - t) + cz * t;

      // Color interpolation
      col[i3] = treeColors[i3] * (1 - t) + cubeColors[i3] * t;
      col[i3 + 1] = treeColors[i3 + 1] * (1 - t) + cubeColors[i3 + 1] * t;
      col[i3 + 2] = treeColors[i3 + 2] * (1 - t) + cubeColors[i3 + 2] * t;
    }

    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // Organic continuous rotation
    pointsRef.current.rotation.y = time * 0.15 + p * Math.PI;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1 + p * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={currentPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={currentColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleMorphEngine() {
  const containerRef = useRef(null);
  const progressRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [livePercent, setLivePercent] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setLivePercent(Math.round(p * 100));

        if (p < 0.35) {
          setActiveStep(0);
        } else if (p < 0.70) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#090807] text-white"
    >
      {/* ─── STICKY 3D CANVAS & OVERLAY VIEWPORT (300vh pinned) ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* 3D Particle Canvas Background */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0.5, 6.5], fov: 48 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.4} />
            <MorphingParticles progressRef={progressRef} />
          </Canvas>
        </div>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none z-10" />

        {/* ─── TOP SECTION HEADING HUD ─── */}
        <div className="relative z-20 px-6 sm:px-12 pt-8 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Chapter 02 • Biological Compatibility Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              From Urban Ecosystem <span className="text-amber-400">To Exact Match</span>
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-stone-400">
            <span>PARTICLES: 15,000</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>MORPH ENGINE: ACTIVE</span>
          </div>
        </div>

        {/* ─── CENTER FLOATING GLASSMORPHIC STEP CARDS ─── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 01: Tell Us Your Routine */}
            <div
              className={`p-6 sm:p-7 rounded-3xl backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between ${
                activeStep === 0
                  ? 'bg-amber-500/15 border-amber-400/60 shadow-2xl shadow-amber-500/20 scale-105'
                  : 'bg-white/5 border-white/10 opacity-40 scale-95'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-black text-xl mb-4 font-mono">
                  01
                </div>
                <h3 className="font-black text-xl text-white mb-2 tracking-tight">
                  Tell Us Your Routine
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                  Input your apartment square footage, daily alone hours, Indian city climate, RWA policies, and monthly budget.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Zero signup required</span>
              </div>
            </div>

            {/* Card 02: We Run The Compatibility Engine */}
            <div
              className={`p-6 sm:p-7 rounded-3xl backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between ${
                activeStep === 1
                  ? 'bg-emerald-500/15 border-emerald-400/60 shadow-2xl shadow-emerald-500/20 scale-105'
                  : 'bg-white/5 border-white/10 opacity-40 scale-95'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-black text-xl mb-4 font-mono">
                  02
                </div>
                <h3 className="font-black text-xl text-white mb-2 tracking-tight">
                  Compatibility Engine
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                  Hard deal-breakers filter out dangerous fits. Remaining companions are scored across 9 weighted lifestyle dimensions.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Explainable match scores</span>
              </div>
            </div>

            {/* Card 03: Adopt Responsibly */}
            <div
              className={`p-6 sm:p-7 rounded-3xl backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between ${
                activeStep === 2
                  ? 'bg-orange-500/15 border-orange-400/60 shadow-2xl shadow-orange-500/20 scale-105'
                  : 'bg-white/5 border-white/10 opacity-40 scale-95'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-300 flex items-center justify-center font-black text-xl mb-4 font-mono">
                  03
                </div>
                <h3 className="font-black text-xl text-white mb-2 tracking-tight">
                  Adopt Responsibly
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                  Connect with verified shelters, start a self-managed trial foster, and execute the 3-3-3 rule onboarding roadmap.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-orange-300 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-orange-400" />
                <span>Zero broker fees</span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── BOTTOM HUD BAR ─── */}
        <div className="relative z-30 px-6 sm:px-12 pb-6">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/50" />
              <div className="text-xs sm:text-sm font-mono tracking-widest text-stone-300 font-bold uppercase">
                TAKE 02 / PARTICLE LERP ENGINE
              </div>
            </div>

            <div className="flex-1 w-full max-w-md mx-auto sm:mx-6 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-400 rounded-full transition-all duration-75 ease-out shadow-sm shadow-emerald-400/50"
                  style={{ width: `${livePercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-stone-400 tracking-wider">MORPH</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-emerald-400 font-bold">
                {livePercent < 50 ? 'TREE (01)' : 'CUBE (02)'} • {String(livePercent).padStart(2, '0')}%
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
