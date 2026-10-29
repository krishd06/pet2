import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  PawPrint,
  ArrowRight,
  ShieldCheck,
  Sun,
  IndianRupee,
  Award,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroVideoScrubber() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Overlay Refs for Synchronized Crossfading
  const overlay1Ref = useRef(null);
  const overlay2Ref = useRef(null);
  const overlay3Ref = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let seekTimeout = null;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setVideoDuration(video.duration);
        setVideoLoaded(true);
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Start native hardware-accelerated playback immediately
    const startPlay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch (err) {
        // Autoplay may wait for user interaction; non-fatal
        console.warn('Video auto-playback note:', err.message);
      }
    };
    startPlay();

    // ScrollTrigger setup on the 400vh container
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Hardware-accelerated GPU camera zoom (runs at silky 60fps on compositor thread)
        video.style.transform = `scale(${1.0 + p * 0.12}) translate3d(0, 0, 0)`;

        // Velocity-based playback rate: accelerate subtly when user scrolls actively, without seeking
        const velocity = Math.abs(self.getVelocity() || 0);
        if (velocity > 100) {
          const dynamicRate = Math.min(2.2, 1.0 + velocity * 0.0006);
          video.playbackRate = dynamicRate;
        } else {
          video.playbackRate = 1.0;
        }

        // Only soft-align video timeline when user scrolls a significant distance, debounced
        clearTimeout(seekTimeout);
        seekTimeout = setTimeout(() => {
          if (video.duration && !isNaN(video.duration)) {
            const targetSec = p * video.duration;
            // Only seek if drift between current playback and target section is noticeable (> 2s)
            if (Math.abs(video.currentTime - targetSec) > 2.5) {
              video.currentTime = Math.max(0, Math.min(targetSec, video.duration - 0.1));
            }
            video.playbackRate = 1.0;
          }
        }, 350);

        // Overlay 1: 0% - 28%
        if (overlay1Ref.current) {
          if (p <= 0.28) {
            const op = p < 0.2 ? 1 : 1 - (p - 0.2) / 0.08;
            const y = (p / 0.28) * -25;
            overlay1Ref.current.style.opacity = op;
            overlay1Ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
            overlay1Ref.current.style.pointerEvents = op > 0.4 ? 'auto' : 'none';
          } else {
            overlay1Ref.current.style.opacity = 0;
            overlay1Ref.current.style.pointerEvents = 'none';
          }
        }

        // Overlay 2: 30% - 66%
        if (overlay2Ref.current) {
          if (p >= 0.30 && p <= 0.68) {
            let op = 1;
            if (p < 0.40) op = (p - 0.30) / 0.10;
            else if (p > 0.58) op = 1 - (p - 0.58) / 0.10;
            const y = (p - 0.30) * -25;
            overlay2Ref.current.style.opacity = Math.max(0, Math.min(1, op));
            overlay2Ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
            overlay2Ref.current.style.pointerEvents = op > 0.4 ? 'auto' : 'none';
          } else {
            overlay2Ref.current.style.opacity = 0;
            overlay2Ref.current.style.pointerEvents = 'none';
          }
        }

        // Overlay 3: 70% - 100%
        if (overlay3Ref.current) {
          if (p >= 0.68) {
            const op = Math.min(1, (p - 0.68) / 0.12);
            const y = (p - 0.68) * -20;
            overlay3Ref.current.style.opacity = op;
            overlay3Ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
            overlay3Ref.current.style.pointerEvents = op > 0.4 ? 'auto' : 'none';
          } else {
            overlay3Ref.current.style.opacity = 0;
            overlay3Ref.current.style.pointerEvents = 'none';
          }
        }
      }
    });

    return () => {
      st.kill();
      clearTimeout(seekTimeout);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh] bg-[#0c0a09] text-white"
    >
      {/* ─── STICKY FULLSCREEN VIEWPORT (Pinned for 400vh) ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        {/* Background Video with native hardware-accelerated 60 FPS playback */}
        <video
          ref={videoRef}
          src="/videos/gemini_generated_video_bfbd57b3.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover object-center brightness-100 contrast-[1.05] saturate-[1.05] will-change-transform transform-gpu [image-rendering:-webkit-optimize-contrast]"
        />

        {/* Crisp Cinematic Vignette with subtle ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-35 pointer-events-none" />

        {/* ─── TOP STATUS BADGE & AUDIO CONTROL (Beneath Navbar) ─── */}
        <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 font-semibold drop-shadow-md">
              Cinematic Motion • Urban Pet Fit
            </span>
          </div>

          <button
            onClick={toggleSound}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-all shadow-lg"
            title={isMuted ? 'Unmute video audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isMuted ? 'MUTE' : 'AUDIO ON'}</span>
          </button>
        </div>

        {/* ─── CENTER EDITORIAL TEXT OVERLAYS ─── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-8">
          
          {/* Overlay 1: 0% - 28% */}
          <div
            ref={overlay1Ref}
            className="max-w-4xl mx-auto text-center space-y-6 transition-all duration-100 ease-out"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-black/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Take 01 • Canine Kinship</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-2xl">
              REAL LIFESTYLE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                NOT JUST TRENDS.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-stone-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Scroll to walk through. Our explainable rule-based engine evaluates your real apartment space, daily work hours, Indian city heat, and 5-year vet budgets.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2 text-stone-400 text-xs font-mono uppercase tracking-wider animate-bounce">
              <span>Scroll down to scrub timeline</span>
              <ChevronDown className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* Overlay 2: 30% - 66% */}
          <div
            ref={overlay2Ref}
            className="max-w-4xl mx-auto text-center space-y-6 opacity-0 pointer-events-none transition-all duration-100 ease-out"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/30 text-orange-400 text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-black/40">
              <Sun className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
              <span>Take 02 • Urban Climate Adaptation</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-2xl">
              CLIMATE FIT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                COMES FIRST.
              </span>
            </h2>

            <p className="text-base sm:text-xl text-stone-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Rated for tropical Indian heat, 6-hour alone-time tolerance, housing society (RWA) bylaws, and honest veterinary expenses.
            </p>

            {/* Micro Pillars Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-left">
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">Zero Guesswork</div>
                <div className="text-[10px] text-stone-400">Hard deal-breakers</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <Sun className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-white">Heat Resistance</div>
                <div className="text-[10px] text-stone-400">Summer survival rating</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <Award className="w-5 h-5 text-orange-400 mb-1" />
                <div className="text-xs font-bold text-white">Native Priority</div>
                <div className="text-[10px] text-stone-400">Resilient Indie boost</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <IndianRupee className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">True Cost 5-Yr</div>
                <div className="text-[10px] text-stone-400">₹ vet & food forecast</div>
              </div>
            </div>
          </div>

          {/* Overlay 3: 70% - 100% */}
          <div
            ref={overlay3Ref}
            className="max-w-4xl mx-auto text-center space-y-6 opacity-0 pointer-events-none transition-all duration-100 ease-out"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-black/40">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Take 03 • Autonomous Recommendation</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-2xl">
              FIND YOUR MATCH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
                IN 3 MINUTES.
              </span>
            </h2>

            <p className="text-base sm:text-xl text-stone-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              Skip impulse breeding purchases. Discover whether an Indian Pariah, a calm rescue cat, or a small companion fits your actual lifestyle.
            </p>

            {/* Glowing CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/quiz"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-extrabold text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                <span>Find My Match in 3 Minutes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/pets"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 backdrop-blur-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PawPrint className="w-5 h-5 text-amber-400" />
                <span>Explore Breeds</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM CINEMATIC SCENE TRACKER ─── */}
        <div className="absolute bottom-6 left-0 right-0 z-20 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <button
              onClick={() => {
                const c = containerRef.current;
                if (c) window.scrollTo({ top: c.offsetTop, behavior: 'smooth' });
              }}
              className={`text-[11px] font-mono transition-colors ${scrollProgress < 0.3 ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-white'}`}
            >
              01 KINSHIP
            </button>
            <span className="text-stone-600 text-xs">•</span>
            <button
              onClick={() => {
                const c = containerRef.current;
                if (c) window.scrollTo({ top: c.offsetTop + c.offsetHeight * 0.45, behavior: 'smooth' });
              }}
              className={`text-[11px] font-mono transition-colors ${scrollProgress >= 0.3 && scrollProgress < 0.7 ? 'text-orange-400 font-bold' : 'text-stone-400 hover:text-white'}`}
            >
              02 CLIMATE
            </button>
            <span className="text-stone-600 text-xs">•</span>
            <button
              onClick={() => {
                const c = containerRef.current;
                if (c) window.scrollTo({ top: c.offsetTop + c.offsetHeight * 0.85, behavior: 'smooth' });
              }}
              className={`text-[11px] font-mono transition-colors ${scrollProgress >= 0.7 ? 'text-emerald-400 font-bold' : 'text-stone-400 hover:text-white'}`}
            >
              03 MATCH
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-stone-400">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
