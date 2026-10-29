import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PortraitVideoScrubber() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const progressLineRef = useRef(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMythTab, setActiveMythTab] = useState(0);

  // Overlay Refs
  const comparisonRef = useRef(null);
  const mythsRef = useRef(null);

  const myths = [
    {
      myth: '“Indie dogs are aggressive street dogs and cannot live in apartment flats.”',
      fact: 'Indies are exceptionally calm indoor sleepers when given 40 minutes of daily walking. They are clean, rarely bark without reason, and house-train faster than most imported breeds.',
      badge: 'Urban Living'
    },
    {
      myth: '“Huskies and Saint Bernards will adapt just fine to Indian summers with ice cubes.”',
      fact: 'Arctic breeds possess heavy insulating double coats built for -40°C tundras. In 40°C Indian heat and humidity, they suffer chronic heat stress, dehydration, and eczema.',
      badge: 'Climate Health'
    },
    {
      myth: '“Housing Societies and RWAs can legally ban pet dogs or cats.”',
      fact: 'False. Under statutory guidelines from the Animal Welfare Board of India (AWBI) and Supreme Court rulings, housing societies cannot ban companion animals or impose discriminatory bylaws.',
      badge: 'Adopter Rights'
    },
    {
      myth: '“Buying a purebred puppy from an online shop or market is safe and legal.”',
      fact: 'Commercial puppy mills in India frequently subject mother dogs to cruel continuous breeding in wire cages, producing puppies with severe inbreeding defects and parvo vulnerabilities.',
      badge: 'Responsible Welfare'
    }
  ];

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let smoothedTime = 0;
    let isSeeking = false;
    let pendingSeek = null;
    let animFrameId = null;

    const handleLoadedMetadata = () => {
      // duration ready
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    const doSeek = (t) => {
      if (!video.duration || isNaN(video.duration)) return;
      const clamped = Math.max(0, Math.min(t, video.duration - 0.05));

      if (video.seeking || isSeeking) {
        pendingSeek = clamped;
        return;
      }

      if (Math.abs(video.currentTime - clamped) > 0.04) {
        isSeeking = true;
        video.currentTime = clamped;
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (pendingSeek !== null) {
        const nextTime = pendingSeek;
        pendingSeek = null;
        doSeek(nextTime);
      }
    };

    video.addEventListener('seeked', handleSeeked);

    const renderLoop = () => {
      if (video.duration) {
        smoothedTime += (targetTime - smoothedTime) * 0.14;
        doSeek(smoothedTime);
      }
      animFrameId = requestAnimationFrame(renderLoop);
    };
    animFrameId = requestAnimationFrame(renderLoop);

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      onUpdate: (self) => {
        const p = self.progress;
        setProgressPercent(Math.round(p * 100));

        if (video.duration) {
          targetTime = p * video.duration;
        }

        if (progressLineRef.current) {
          progressLineRef.current.style.width = `${p * 100}%`;
        }

        // Section A: Comparison Cards (0% - 48%)
        if (comparisonRef.current) {
          if (p <= 0.48) {
            const op = p < 0.40 ? 1 : 1 - (p - 0.40) / 0.08;
            comparisonRef.current.style.opacity = Math.max(0, op);
            comparisonRef.current.style.transform = `translateY(${-p * 30}px)`;
            comparisonRef.current.style.pointerEvents = op > 0.3 ? 'auto' : 'none';
          } else {
            comparisonRef.current.style.opacity = 0;
            comparisonRef.current.style.pointerEvents = 'none';
          }
        }

        // Section B: Myths Cards (50% - 100%)
        if (mythsRef.current) {
          if (p >= 0.48) {
            const op = Math.min(1, (p - 0.48) / 0.10);
            mythsRef.current.style.opacity = op;
            mythsRef.current.style.transform = `translateY(${-(p - 0.48) * 20}px)`;
            mythsRef.current.style.pointerEvents = op > 0.3 ? 'auto' : 'none';
          } else {
            mythsRef.current.style.opacity = 0;
            mythsRef.current.style.pointerEvents = 'none';
          }
        }
      }
    });

    return () => {
      st.kill();
      cancelAnimationFrame(animFrameId);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[350vh] bg-[#0a0908] text-white"
    >
      {/* ─── STICKY FULLSCREEN VIEWPORT (Pinned for 350vh) ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Background Scrubbed Portrait Video */}
        <video
          ref={videoRef}
          src="/videos/portrait-dog.mp4"
          muted={isMuted}
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover brightness-70 contrast-110 filter will-change-transform"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090807] via-black/40 to-[#090807]/75 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

        {/* ─── TOP STATUS HEADER ─── */}
        <div className="relative z-20 px-6 sm:px-12 pt-8 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Chapter 03 • Macro Biology & Indigenous Welfare</span>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-all"
            title={isMuted ? 'Unmute video audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isMuted ? 'MUTE' : 'AUDIO ON'}</span>
          </button>
        </div>

        {/* ─── CENTER CONTENT OVERLAYS ─── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-8">
          
          {/* Phase 1: Native Indie vs Arctic/Foreign Import Comparison (0% - 48%) */}
          <div
            ref={comparisonRef}
            className="w-full max-w-5xl mx-auto space-y-6 transition-all duration-100 ease-out"
          >
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Why Native Indian Breeds (Indies) <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-500">
                  Win Urban Hearts
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium">
                Thousands of years of tropical natural selection make Indian Pariah dogs and Indie cats the healthiest, most climate-resilient companions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Native Indies Card */}
              <div className="bg-black/50 backdrop-blur-2xl p-6 sm:p-7 rounded-3xl border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      RECOMMENDED FOR INDIA
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      Native Indian Indie Dogs & Cats
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40 font-bold">
                    <Award className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Naturally Immune:</strong> Virtually zero congenital hip dysplasia, skin eczema, or respiratory collapse.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Zero AC Dependency:</strong> Single short coat naturally dissipates heat in 42°C Indian summer temperatures.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Minimal Maintenance:</strong> Self-grooming, minimal odor, and low shedding compared to double-coated breeds.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Stops Commercial Mills:</strong> Adopting saves lives and stops cruel commercial cage breeding.</span>
                  </li>
                </ul>
              </div>

              {/* Foreign / Arctic Imports Card */}
              <div className="bg-black/50 backdrop-blur-2xl p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                      CONSIDER CAREFULLY
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      Foreign / Arctic Imports (Husky, Pug, Persian)
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 font-bold">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Severe Heat Distress:</strong> Arctic double coats (-40°C origin) or flat brachycephalic skulls risk fatal heat exhaustion.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>High Monthly Vet Expenses:</strong> Continuous AC electric bills, ear infections, allergy meds (₹6,000–₹12,000+/mo).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Tragic Abandonment Rates:</strong> Over 40% of impulse-bought Huskies and Pugs in India are abandoned by age 2.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Phase 2: Pet Adoption Myths Debunked (50% - 100%) */}
          <div
            ref={mythsRef}
            className="w-full max-w-4xl mx-auto space-y-6 opacity-0 pointer-events-none transition-all duration-100 ease-out"
          >
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                LEGAL & BIOLOGICAL FACTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Pet Adoption Myths Debunked
              </h2>
              <p className="text-xs sm:text-sm text-stone-300">
                Click a myth to inspect the statutory guidelines and biological science.
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {myths.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMythTab(idx)}
                    className={`text-left p-3 rounded-2xl border text-xs font-bold transition-all ${
                      activeMythTab === idx
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="block text-[9px] font-mono uppercase tracking-wider mb-1 opacity-70">
                      {item.badge}
                    </span>
                    <span className="line-clamp-2 leading-snug">{item.myth}</span>
                  </button>
                ))}
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>The Biological & Legal Reality:</span>
                </div>
                <p className="text-stone-100 font-medium text-sm sm:text-base leading-relaxed">
                  {myths[activeMythTab].fact}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ─── BOTTOM HUD BAR ─── */}
        <div className="relative z-30 px-6 sm:px-12 pb-6">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-md shadow-orange-500/50" />
              <div className="text-xs sm:text-sm font-mono tracking-widest text-stone-300 font-bold uppercase">
                TAKE 03 / MACRO PORTRAIT & WELFARE
              </div>
            </div>

            <div className="flex-1 w-full max-w-md mx-auto sm:mx-6 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                <div
                  ref={progressLineRef}
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-75 ease-out shadow-sm shadow-orange-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-stone-400 tracking-wider">TIMECODE</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-orange-400 font-bold">
                {String(progressPercent).padStart(2, '0')}%
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
