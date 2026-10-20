import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Sun,
  Activity,
  Heart,
  Home,
  CheckCircle2,
  Info
} from 'lucide-react';

// Curated 3D animal carousel data spanning dogs, native indies, cats, and calm companions
const ANIMALS_3D = [
  {
    id: 'indie-dog',
    slug: 'indian-pariah-dog',
    name: 'Indian Pariah Dog',
    category: 'Native Indie Dog',
    isNative: true,
    tagline: 'Resilient, low-shedding guardian of Indian households.',
    avatar: '🐕',
    badgeColor: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    bgCard: 'from-amber-900/90 via-stone-900/95 to-neutral-950',
    energy: '3/5',
    climate: '5/5 (Peak Heat Tolerance)',
    apartment: 'High (Calm Indoors)',
    budget: '₹2,500/mo',
    traits: ['Rarely gets sick', 'Natural 40°C heat tolerance', 'Fast house-training'],
    quote: '“Centuries of natural selection make Indies the most adapted companions for Indian cities.”'
  },
  {
    id: 'indie-cat',
    slug: 'indian-desi-cat',
    name: 'Indian Domestic Short-hair Cat',
    category: 'Native Indie Cat',
    isNative: true,
    tagline: 'Intelligent, graceful apartment champion with zero grooming fuss.',
    avatar: '🐈',
    badgeColor: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    bgCard: 'from-emerald-950/90 via-stone-900/95 to-neutral-950',
    energy: '2/5',
    climate: '5/5 (Tropical Ready)',
    apartment: 'Ideal for 1BHK / Studio',
    budget: '₹1,800/mo',
    traits: ['Litter-box pro in 24 hrs', 'Tolerates 8hr workdays', 'Hypoallergenic coat type'],
    quote: '“Desi cats are peaceful studio apartment flatmates who thrive while you are at work.”'
  },
  {
    id: 'golden-retriever',
    slug: 'golden-retriever',
    name: 'Golden Retriever',
    category: 'Family Companion Dog',
    isNative: false,
    tagline: 'Devoted, gentle family dog that needs daily playtime and cool spots.',
    avatar: '🦮',
    badgeColor: 'from-amber-400 to-yellow-600',
    glowColor: 'rgba(234, 179, 8, 0.35)',
    bgCard: 'from-yellow-950/80 via-stone-900/95 to-neutral-950',
    energy: '4/5',
    climate: '3/5 (Needs AC Cooling)',
    apartment: 'Needs 2BHK+ & 60m Walks',
    budget: '₹4,500/mo',
    traits: ['Deeply child-friendly', 'High shedding twice a year', 'Affectionate shadow'],
    quote: '“Heart of gold, but requires dedicated vacuuming and morning walks before peak sun.”'
  },
  {
    id: 'beagle',
    slug: 'beagle',
    name: 'Beagle',
    category: 'Curious Scent Hound',
    isNative: false,
    tagline: 'Compact, cheerful sniffer with an inquisitive heart.',
    avatar: '🐶',
    badgeColor: 'from-rose-500 to-orange-500',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    bgCard: 'from-rose-950/80 via-stone-900/95 to-neutral-950',
    energy: '4/5',
    climate: '4/5 (Moderate Heat)',
    apartment: 'Needs Mental Enrichment',
    budget: '₹3,500/mo',
    traits: ['Compact apartment size', 'Vocal hound baying', 'Food driven learner'],
    quote: '“Keep food locked away and engage their nose with puzzle toys to prevent barking.”'
  },
  {
    id: 'persian-cat',
    slug: 'persian-cat',
    name: 'Persian Cat',
    category: 'Gentle Lap Feline',
    isNative: false,
    tagline: 'Ultra-plush, serene companion requiring daily combing and 24x7 cooling.',
    avatar: '🐱',
    badgeColor: 'from-purple-500 to-indigo-600',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    bgCard: 'from-purple-950/80 via-stone-900/95 to-neutral-950',
    energy: '1/5',
    climate: '2/5 (Sensitive to Humidity)',
    apartment: '100% Indoor Lounger',
    budget: '₹3,200/mo',
    traits: ['Needs daily brushing', 'Heat sensitive flat face', 'Extremely quiet'],
    quote: '“A living cloud on your sofa, but demands consistent eye cleaning and summer AC.”'
  },
  {
    id: 'rabbit',
    slug: 'holland-lop-rabbit',
    name: 'Domestic Rabbit',
    category: 'Gentle Small Herbivore',
    isNative: false,
    tagline: 'Quiet, litter-trainable herbivore perfect for zero-bark societies.',
    avatar: '🐇',
    badgeColor: 'from-sky-500 to-cyan-600',
    glowColor: 'rgba(14, 165, 233, 0.35)',
    bgCard: 'from-cyan-950/80 via-stone-900/95 to-neutral-950',
    energy: '2/5',
    climate: '3/5 (Needs Indoor Fan/AC)',
    apartment: '100% Society Permitted',
    budget: '₹1,500/mo',
    traits: ['Completely silent', 'Litter-box trainable', 'Crepuscular routine (active mornings)'],
    quote: '“Ideal for strict apartment societies where barking dogs are frowned upon.”'
  }
];

export default function Animal3DShowcase() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const total = ANIMALS_3D.length;
  const anglePerItem = 360 / total;

  // Scroll tracking for scroll-driven 3D rotation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Rotate carousel smoothly on scroll
  useEffect(() => {
    return smoothProgress.onChange((latest) => {
      // Map scroll progress to a 360-degree rotation
      setRotationY(latest * -240);
    });
  }, [smoothProgress]);

  // Card mouse tilt effect for realistic 3D depth
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 22), y: x * 22 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const nextAnimal = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevAnimal = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const current = ANIMALS_3D[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#1c1815] via-[#241e19] to-[#171310] text-sand-50 rounded-3xl mx-2 sm:mx-6 lg:mx-8 border border-amber-900/30 shadow-2xl"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 -z-10"
        style={{ background: current.glowColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-extrabold uppercase tracking-widest shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Interactive 3D Experience</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Meet Your Real Urban <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Match in 3D</span>
        </h2>
        <p className="text-sand-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Scroll or swipe to inspect different companions in dynamic 3D depth. Understand their real energy, heat resilience, and apartment demands before adopting.
        </p>
      </div>

      {/* 3D Carousel Cylinder / Orbit Preview */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left: 3D Animal Holographic Display Stage */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            className="perspective-1200 w-full max-w-[420px] aspect-[4/5] relative flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.85, rotateY: 35, z: -100 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateY: tilt.y,
                  rotateX: tilt.x,
                  z: 0,
                  transition: { type: 'spring', stiffness: 220, damping: 22 }
                }}
                exit={{ opacity: 0, scale: 0.85, rotateY: -35, z: -100 }}
                className={`w-full h-full rounded-3xl p-8 bg-gradient-to-br ${current.bgCard} border border-white/15 shadow-2xl relative preserve-3d flex flex-col justify-between overflow-hidden backdrop-blur-xl`}
                style={{
                  boxShadow: `0 25px 60px -15px ${current.glowColor}, 0 0 0 1px rgba(255,255,255,0.1) inset`
                }}
              >
                {/* 3D Glass Layer depth reflections */}
                <div className="absolute -top-24 -left-24 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 p-6 pointer-events-none text-right">
                  <span className="text-8xl font-black text-white/5 select-none tracking-tighter">
                    0{activeIndex + 1}
                  </span>
                </div>

                {/* Top Badges */}
                <div className="flex items-center justify-between relative z-10">
                  <div className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r ${current.badgeColor} text-white shadow-md flex items-center gap-1.5`}>
                    {current.isNative && <Award className="w-3.5 h-3.5" />}
                    <span>{current.category}</span>
                  </div>

                  <span className="text-xs font-mono font-bold text-sand-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                    {activeIndex + 1} / {total}
                  </span>
                </div>

                {/* 3D Floating Animal Avatar / Mascot */}
                <div className="my-auto py-4 text-center relative z-10 preserve-3d">
                  <motion.div
                    animate={{
                      y: [0, -14, 0],
                      rotateZ: [0, 2, -2, 0],
                      scale: [1, 1.04, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="inline-block relative filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                  >
                    <span className="text-8xl sm:text-9xl select-none block transform-gpu hover:scale-110 transition-transform duration-300">
                      {current.avatar}
                    </span>
                    {/* Ring pedestal underneath */}
                    <div
                      className="w-32 h-6 rounded-full mx-auto mt-2 blur-sm opacity-60"
                      style={{ background: current.glowColor }}
                    />
                  </motion.div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-4 tracking-tight drop-shadow-md">
                    {current.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-sand-300 max-w-xs mx-auto mt-1 font-medium">
                    {current.tagline}
                  </p>
                </div>

                {/* Bottom Quick Metric pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs relative z-10 pt-4 border-t border-white/10">
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-2.5 border border-white/5">
                    <span className="block text-[10px] text-sand-400 uppercase font-semibold">Energy</span>
                    <span className="font-extrabold text-amber-300 text-xs sm:text-sm">{current.energy}</span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-2.5 border border-white/5">
                    <span className="block text-[10px] text-sand-400 uppercase font-semibold">Heat Fit</span>
                    <span className="font-extrabold text-emerald-400 text-xs sm:text-sm">{current.climate.split(' ')[0]}</span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-2.5 border border-white/5">
                    <span className="block text-[10px] text-sand-400 uppercase font-semibold">Est. Cost</span>
                    <span className="font-extrabold text-sky-400 text-xs sm:text-sm">{current.budget}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={prevAnimal}
              aria-label="Previous animal"
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15 shadow-md flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Thumbnail dots */}
            <div className="flex items-center gap-2">
              {ANIMALS_3D.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Jump to ${item.name}`}
                />
              ))}
            </div>

            <button
              onClick={nextAnimal}
              aria-label="Next animal"
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15 shadow-md flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Detailed 3D Insight Panel & Realities */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Animal Card Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300 font-mono">
                Indian City Lifestyle Compatibility
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Why {current.name.split(' ')[0]} Fits Your Home
            </h3>
            <blockquote className="italic text-sand-300 text-sm sm:text-base border-l-2 border-amber-400/60 pl-4 py-1 leading-relaxed">
              {current.quote}
            </blockquote>
          </div>

          {/* Key Attribute Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 flex-shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-sand-400 uppercase">Climate Resilience</h4>
                <p className="text-sm font-bold text-white mt-0.5">{current.climate}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 flex-shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-sand-400 uppercase">Space Requirement</h4>
                <p className="text-sm font-bold text-white mt-0.5">{current.apartment}</p>
              </div>
            </div>
          </div>

          {/* Traits & Realities */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sand-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Honest Care Facts</span>
              </span>
              <span className="text-[11px] text-sand-400">Zero Commercial Filters</span>
            </div>

            <div className="space-y-2.5">
              {current.traits.map((trait, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-sand-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Navigation Thumbnails Carousel */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-sand-400 block">
              Quick Select Animal:
            </span>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {ANIMALS_3D.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    activeIndex === idx
                      ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md scale-105'
                      : 'bg-white/5 text-sand-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{item.avatar}</span>
                  <span className="truncate max-w-[100px]">{item.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/quiz"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-neutral-950 font-extrabold text-sm shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>See If You Match {current.name.split(' ')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={`/pets/${current.slug}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all text-center"
            >
              Full Biological Profile
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}
