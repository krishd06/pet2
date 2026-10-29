import React from 'react';
import HeroVideoScrubber from '../components/scrollytelling/HeroVideoScrubber.jsx';

export default function HomePage() {
  return (
    <div id="home-scroll-root" className="relative w-full bg-[#0c0a09] text-white selection:bg-amber-500 selection:text-black">
      {/* ─── FULL-SCREEN SCROLL-SCRUBBED HERO VIDEO (400vh) ─── */}
      <HeroVideoScrubber />
    </div>
  );
}
