/**
 * AntigravityScene.jsx
 * ─────────────────────────────────────────────────────────────────────
 * High-fidelity 3D Scroll-Driven Antigravity Experience for PawMatch India.
 *
 * Built with:
 *   • React Three Fiber (v8) + Drei (v9)
 *   • Three.js (v0.170)
 *   • GSAP (v3) ScrollTrigger bridge
 *
 * Features:
 *   • Real photorealistic animated GLTF models (Flamingo, Horse, Parrot, Stork)
 *   • Procedural "Celestial Guardian" fallback with MeshDistortMaterial
 *   • Cinematic 3-point studio lighting + dramatic rim-lighting
 *   • Weightless antigravity floating with organic breathing oscillations
 *   • Particle systems: Golden dust motes (Points) + drifting petals (InstancedMesh) + Drei Sparkles
 *   • Dynamic scroll choreography (Hero -> Profile -> Close-up -> Grand finale CTA)
 *   • Interactive mouse-reactive parallax camera offset
 *   • Animal Switcher selector allowing visitors to switch 3D animals live!
 * ─────────────────────────────────────────────────────────────────────
 */

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  Suspense,
  useCallback
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  Sparkles,
  MeshDistortMaterial,
  useProgress,
  Html,
  useGLTF,
  useAnimations
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────────
 *  AVAILABLE 3D ANIMAL CONFIGURATIONS
 * ──────────────────────────────────────────────────────────────────── */
export const ANIMAL_MODELS = {
  flamingo: {
    id: 'flamingo',
    name: 'Soaring Flamingo',
    category: 'Avian Elegance',
    badge: '🦩',
    url: '/models/flamingo.glb',
    scale: 0.016,
    basePos: [0.7, -0.1, 0],
    baseRot: [0, -Math.PI * 0.4, 0],
    animSpeed: 0.9
  },
  horse: {
    id: 'horse',
    name: 'Majestic Stallion',
    category: 'Power & Grace',
    badge: '🐎',
    url: '/models/horse.glb',
    scale: 0.009,
    basePos: [0.7, -0.6, 0],
    baseRot: [0, -Math.PI * 0.35, 0],
    animSpeed: 0.8
  },
  parrot: {
    id: 'parrot',
    name: 'Vibrant Macaw',
    category: 'Tropical Companion',
    badge: '🦜',
    url: '/models/parrot.glb',
    scale: 0.018,
    basePos: [0.7, -0.05, 0],
    baseRot: [0, -Math.PI * 0.45, 0],
    animSpeed: 1.0
  },
  stork: {
    id: 'stork',
    name: 'Serene Stork',
    category: 'Coastal Traveler',
    badge: '🪶',
    url: '/models/stork.glb',
    scale: 0.016,
    basePos: [0.7, -0.1, 0],
    baseRot: [0, -Math.PI * 0.4, 0],
    animSpeed: 0.85
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial Guardian',
    category: 'Zero-G Spirit',
    badge: '✨',
    url: null,
    scale: 1.0,
    basePos: [0.7, 0, 0],
    baseRot: [0, 0, 0],
    animSpeed: 1.0
  }
};

// Preload models for instant seamless transitions
try {
  useGLTF.preload('/models/flamingo.glb');
  useGLTF.preload('/models/horse.glb');
  useGLTF.preload('/models/parrot.glb');
  useGLTF.preload('/models/stork.glb');
} catch (e) {
  console.warn('Preload notice:', e);
}

const isMobileDevice = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: 3D Loader
 * ════════════════════════════════════════════════════════════════════ */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2.5 px-4 py-2 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-amber-500/20 shadow-2xl">
        <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] font-mono text-amber-300/90 tracking-wider">
          Materializing 3D Space {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: Cinematic Studio Lighting
 *  Strong warm key, soft cool fill, dramatic golden rim light
 * ════════════════════════════════════════════════════════════════════ */
function CinematicLights() {
  const keyLightRef = useRef();
  const rimLightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Gentle breathing modulation of key light
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 2.0 + Math.sin(t * 0.8) * 0.25;
    }
    // Subtle sweep of the golden rim light
    if (rimLightRef.current) {
      rimLightRef.current.position.x = Math.sin(t * 0.4) * 3;
    }
  });

  return (
    <>
      {/* Ambient warm fill */}
      <ambientLight intensity={0.4} color="#fef3c7" />

      {/* Main warm key light from high right */}
      <directionalLight
        ref={keyLightRef}
        position={[6, 9, 6]}
        intensity={2.2}
        color="#fef08a"
        castShadow={false}
      />

      {/* Soft cool fill from opposite side */}
      <directionalLight
        position={[-5, 4, 3]}
        intensity={0.8}
        color="#93c5fd"
      />

      {/* Dramatic rim/back light for silhouette & fur/feather definition */}
      <pointLight
        ref={rimLightRef}
        position={[0, 3, -6]}
        intensity={3.5}
        color="#f97316"
        distance={20}
        decay={2}
      />

      {/* Subtle under-bounce light */}
      <pointLight
        position={[0, -4, 2]}
        intensity={0.6}
        color="#fbbf24"
        distance={10}
        decay={2}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: Real GLTF Animated Animal Model
 * ════════════════════════════════════════════════════════════════════ */
function GLTFAnimalModel({ config }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(config.url);
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]];
      action.reset().fadeIn(0.4).play();
      action.timeScale = config.animSpeed || 1.0;
    }
    return () => {
      if (names.length > 0 && actions[names[0]]) {
        actions[names[0]].fadeOut(0.3);
      }
    };
  }, [actions, names, config]);

  return (
    <Float
      speed={1.6}
      rotationIntensity={0.18}
      floatIntensity={0.45}
      floatingRange={[-0.15, 0.15]}
    >
      <group
        ref={groupRef}
        scale={config.scale}
        position={config.basePos}
        rotation={config.baseRot}
      >
        <primitive object={scene} />
      </group>
    </Float>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: Procedural Celestial Guardian (Fallback / Special)
 * ════════════════════════════════════════════════════════════════════ */
function CelestialCreature() {
  const bodyRef = useRef();
  const shellRef = useRef();
  const coreRef = useRef();
  const mobile = useMemo(() => isMobileDevice(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bodyRef.current) {
      bodyRef.current.distort = 0.35 + Math.sin(t * 1.3) * 0.15;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = t * 0.2;
      shellRef.current.rotation.x = Math.sin(t * 0.25) * 0.2;
    }
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(t * 2.5) * 0.4;
      coreRef.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.5}>
      <group position={[0.7, 0, 0]}>
        {/* Glowing Heart Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>

        {/* Organic Morphing Body */}
        <mesh>
          <icosahedronGeometry args={[1.0, mobile ? 6 : 8]} />
          <MeshDistortMaterial
            ref={bodyRef}
            color="#ea580c"
            emissive="#7c2d12"
            emissiveIntensity={0.2}
            roughness={0.2}
            metalness={0.8}
            distort={0.4}
            speed={2.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Geometric Wireframe Cage */}
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1.35, 2]} />
          <meshStandardMaterial
            color="#fde047"
            wireframe
            transparent
            opacity={0.15}
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: Floating Dust Motes (Points BufferGeometry)
 * ════════════════════════════════════════════════════════════════════ */
function FloatingDustMotes({ count = 200 }) {
  const pointsRef = useRef();
  const mobile = useMemo(() => isMobileDevice(), []);
  const actualCount = mobile ? Math.floor(count * 0.4) : count;

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const ph = new Float32Array(actualCount);
    for (let i = 0; i < actualCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 8;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [actualCount]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < actualCount; i++) {
      const idx = i * 3;
      arr[idx]     += Math.sin(t * 0.18 + phases[i]) * 0.002;
      arr[idx + 1] += Math.cos(t * 0.15 + phases[i]) * 0.002;
      arr[idx]     += pointer.x * 0.0003;
      arr[idx + 1] += pointer.y * 0.0003;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={actualCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#fef08a"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: Drifting Organic Petals / Leaf Elements
 * ════════════════════════════════════════════════════════════════════ */
function DriftingPetals({ count = 25 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petals = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 10,
      rotSpeed: 0.2 + Math.random() * 0.4,
      driftSpeed: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.06
    })),
    [count]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!meshRef.current) return;

    petals.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.driftSpeed + p.phase) * 1.2,
        p.y + Math.cos(t * p.driftSpeed * 0.8 + p.phase) * 0.6,
        p.z + Math.sin(t * p.driftSpeed * 0.5) * 0.4
      );
      dummy.rotation.set(
        t * p.rotSpeed,
        t * p.rotSpeed * 0.7,
        t * p.rotSpeed * 0.3
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeGeometry args={[1, 0.6, 1, 1]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#d97706"
        emissiveIntensity={0.2}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: Mouse / Cursor-Reactive Parallax Camera
 * ════════════════════════════════════════════════════════════════════ */
function CursorReactiveCam() {
  const { camera } = useThree();
  const targetOffset = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }) => {
    targetOffset.current.x = THREE.MathUtils.lerp(
      targetOffset.current.x,
      pointer.x * 0.45,
      0.04
    );
    targetOffset.current.y = THREE.MathUtils.lerp(
      targetOffset.current.y,
      pointer.y * 0.25,
      0.04
    );

    camera.position.x = targetOffset.current.x;
    camera.position.y = targetOffset.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENT: Scroll Choreography Engine
 *
 *  Storyline Keyframes (0.0 -> 1.0):
 *    0.00 Hero        – Floats gracefully on the right, greets user
 *    0.25 Features    – Glides left, rotates to elegant side profile
 *    0.50 Spotlight   – Moves closer with dramatic angle highlighting contours
 *    0.75 Details     – Dynamic banking turn as user explores guides
 *    1.00 Final CTA   – Ascends center-stage with radiant aura
 * ════════════════════════════════════════════════════════════════════ */
function ScrollChoreo({ scrollProgress, activeAnimal }) {
  const groupRef = useRef();
  const smoothed = useRef(0);
  const mobile = useMemo(() => isMobileDevice(), []);

  // Multi-phase scroll choreography keyframes
  const keyframes = useMemo(() => [
    { at: 0.0,  x: mobile ? 0 : 0.8,  y: 0.1,  z: 0.2,  ry: 0,              rz: 0,             s: 1.0 },
    { at: 0.22, x: mobile ? 0 : -1.2, y: 0.2,  z: 0.0,  ry: Math.PI * 0.45, rz: 0.08,          s: 0.95 },
    { at: 0.48, x: mobile ? 0 : 1.1,  y: -0.2, z: 0.4,  ry: Math.PI * 0.9,  rz: -0.06,         s: 1.1 },
    { at: 0.72, x: mobile ? 0 : -0.6, y: 0.3,  z: -0.2, ry: Math.PI * 1.4,  rz: 0.12,          s: 1.0 },
    { at: 1.0,  x: 0.0,               y: 0.1,  z: 0.3,  ry: Math.PI * 2.0,  rz: 0,             s: 1.05 }
  ], [mobile]);

  const interpolate = useCallback((progress, prop) => {
    let lower = keyframes[0];
    let upper = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].at && progress <= keyframes[i + 1].at) {
        lower = keyframes[i];
        upper = keyframes[i + 1];
        break;
      }
    }

    const range = upper.at - lower.at;
    const t = range > 0 ? (progress - lower.at) / range : 0;
    // Smooth quintic easing
    const eased = t * t * (3 - 2 * t);
    return THREE.MathUtils.lerp(lower[prop], upper[prop], eased);
  }, [keyframes]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth damping to eliminate jitter on fast mousewheel
    smoothed.current = THREE.MathUtils.lerp(
      smoothed.current,
      scrollProgress.current,
      0.065
    );

    const p = smoothed.current;
    const g = groupRef.current;

    g.position.x = interpolate(p, 'x');
    g.position.y = interpolate(p, 'y');
    g.position.z = interpolate(p, 'z');
    g.rotation.y = interpolate(p, 'ry');
    g.rotation.z = interpolate(p, 'rz');

    const targetScale = interpolate(p, 's');
    g.scale.setScalar(
      THREE.MathUtils.lerp(g.scale.x, targetScale, 0.08)
    );
  });

  const animalConfig = ANIMAL_MODELS[activeAnimal] || ANIMAL_MODELS.flamingo;

  return (
    <group ref={groupRef}>
      {animalConfig.url ? (
        <GLTFAnimalModel config={animalConfig} key={animalConfig.id} />
      ) : (
        <CelestialCreature key="celestial" />
      )}
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  MAIN EXPORT: AntigravityScene
 * ════════════════════════════════════════════════════════════════════ */
export default function AntigravityScene({
  scrollContainerId = 'home-scroll-root',
  activeAnimal = 'flamingo'
}) {
  const scrollProgress = useRef(0);
  const mobile = useMemo(() => isMobileDevice(), []);

  // GSAP ScrollTrigger bridge: sync DOM scroll to scrollProgress ref
  useEffect(() => {
    const timer = setTimeout(() => {
      const trigger = document.getElementById(scrollContainerId) || document.body;

      ScrollTrigger.create({
        trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        }
      });
    }, 250);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [scrollContainerId]);

  return (
    <div
      id="antigravity-canvas"
      className="antigravity-canvas-container"
      aria-hidden="true"
    >
      <Canvas
        dpr={mobile ? [1, 1.25] : [1, 2]}
        gl={{
          antialias: !mobile,
          alpha: true,
          powerPreference: 'high-performance',
          depth: true
        }}
        camera={{
          position: [0, 0, 5.2],
          fov: 46,
          near: 0.1,
          far: 60
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Loader />}>
          {/* Subtle atmosphere fog */}
          <fog attach="fog" args={['#1c1611', 7, 24]} />

          {/* Cinematic 3-point lighting */}
          <CinematicLights />

          {/* Glowing ambient sparkles */}
          <Sparkles
            count={mobile ? 35 : 90}
            scale={12}
            size={mobile ? 2 : 3}
            speed={0.35}
            color="#fbbf24"
            opacity={0.45}
          />

          {/* Dust motes */}
          <FloatingDustMotes count={mobile ? 80 : 220} />

          {/* Floating organic leaf/petal fragments */}
          <DriftingPetals count={mobile ? 8 : 22} />

          {/* Scroll Choreographed Creature */}
          <ScrollChoreo
            scrollProgress={scrollProgress}
            activeAnimal={activeAnimal}
          />

          {/* Cursor Parallax */}
          <CursorReactiveCam />
        </Suspense>
      </Canvas>
    </div>
  );
}
