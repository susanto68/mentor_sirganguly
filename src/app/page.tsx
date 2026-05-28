'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Compass, Leaf, Milestone, Sparkles } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import JobPortal from '../components/JobPortal';
import CareerTree from '../components/CareerTree';

export default function HomePage() {
  const [mode, setMode] = useState<'home' | 'job-portal' | 'career-tree'>('home');
  const [transitionState, setTransitionState] = useState<string>('idle');
  const [hoveredOption, setHoveredOption] = useState<'none' | 'job' | 'direction'>('none');

  // Foolproof session-handshake to automatically reload page when user navigates back from external portals
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if we previously set the navigating_away flag
    const pageState = sessionStorage.getItem('growthverse_nav_state');
    if (pageState === 'navigating_away') {
      sessionStorage.setItem('growthverse_nav_state', 'loaded');
      window.location.reload();
      return;
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      // Direct backup check for mobile browsers
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Trigger the Tree of Life Takeover Transition Sequence
  const handleDirectionClick = () => {
    setTransitionState('seeding');
    
    // Stage 1: Shrink into seed
    setTimeout(() => {
      setTransitionState('growing');
      
      // Stage 2: Roots expand across screen
      setTimeout(() => {
        setTransitionState('zoom');
        
        // Stage 3: Deep camera zoom takeover
        setTimeout(() => {
          setMode('career-tree');
          setTransitionState('complete');
        }, 1200);
      }, 1800);
    }, 800);
  };

  const handleBackToHome = () => {
    setMode('home');
    setTransitionState('idle');
  };

  return (
    <main className="relative min-h-screen overflow-hidden select-none font-display">
      {/* Background Star Particles */}
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {/* 1. CINEMATIC HOMEPAGE EXPERIENCE */}
        {mode === 'home' && transitionState !== 'complete' && (
          <motion.div
            key="home-screen"
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex flex-col justify-between p-6 md:p-12"
          >
            {/* Top Left Profile Header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: transitionState === 'idle' ? 1 : 0, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3.5 self-start glass-panel px-4 py-2.5 rounded-full border-gray-800 shadow-lg pointer-events-none"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.3)] bg-gray-950 flex items-center justify-center">
                {/* Visual stylized AI profile avatar since we don't have local image initially */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 opacity-20" />
                <span className="text-sm font-black text-emerald-300 tracking-wider">SG</span>
              </div>
              <div>
                <h4 className="text-white font-extrabold text-sm tracking-wide">Sir Ganguly</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Mentor & Visionary</p>
              </div>
            </motion.div>

            {/* Center Header Titles */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
              <AnimatePresence>
                {transitionState === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                  >
                    {/* Futuristic floating banner */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6 animate-float">
                      <Sparkles size={12} className="animate-pulse" />
                      India's Future Student Ecosystem
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-4">
                      <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                        GrowthVerse
                      </span>
                    </h1>

                    <h2 className="text-lg md:text-2xl font-bold text-gray-400 max-w-2xl mx-auto leading-relaxed glass-panel border-gray-800/40 p-4 rounded-2xl backdrop-blur-md">
                      Life Roadmap + Career Ecosystem for Indian Students
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TWO HUGE CIRCULAR GLOWING BUTTONS / CARDS */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-12 items-center justify-center">
                {/* OPTION 1: 💼 I NEED A JOB */}
                {transitionState === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onMouseEnter={() => setHoveredOption('job')}
                    onMouseLeave={() => setHoveredOption('none')}
                    onClick={() => {
                      sessionStorage.setItem('growthverse_nav_state', 'navigating_away');
                      window.location.href = 'https://career.sirganguly.com';
                    }}
                    className="relative cursor-pointer group"
                  >
                    {/* Glowing border ring overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500" />
                    
                    <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full glass-panel border border-cyan-500/30 flex flex-col items-center justify-center text-center p-6 glow-btn-cyan hover:border-cyan-400 transition-all duration-300 relative group-hover:scale-105 active:scale-95">
                      {/* Floating Particle Dots */}
                      <span className="absolute w-2 h-2 rounded-full bg-cyan-400 top-8 left-8 animate-ping" />
                      <span className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 bottom-10 right-10 animate-pulse" />

                      <Briefcase size={40} className="text-cyan-400 mb-3 group-hover:translate-y-[-4px] transition-transform duration-300" />
                      <h3 className="text-white font-black text-lg md:text-xl tracking-wide uppercase">
                        I Need a Job
                      </h3>
                      <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-1">
                        Professional Portal
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* OPTION 2: 🌳 I WANT DIRECTION IN LIFE */}
                <AnimatePresence mode="wait">
                  {transitionState !== 'complete' && (
                    <motion.div
                      key="direction-button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: transitionState === 'idle' ? 1 : 0.4,
                        y: transitionState === 'idle' ? 0 : -50
                      }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      onMouseEnter={() => setHoveredOption('direction')}
                      onMouseLeave={() => setHoveredOption('none')}
                      onClick={() => {
                        if (transitionState === 'idle') handleDirectionClick();
                      }}
                      className={`relative cursor-pointer group ${
                        transitionState !== 'idle' ? 'pointer-events-none' : ''
                      }`}
                    >
                      {/* Purple/green glowing background blobs */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-purple-600 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500" />

                      <div className={`w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full glass-panel border flex flex-col items-center justify-center text-center p-6 transition-all duration-500 relative ${
                        transitionState === 'seeding' || transitionState === 'growing' || transitionState === 'zoom'
                          ? 'border-emerald-400 bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.9)] scale-50'
                          : 'border-emerald-500/30 glow-btn-green-purple hover:border-emerald-400 group-hover:scale-105 active:scale-95'
                      }`}>
                        {transitionState === 'idle' ? (
                          <>
                            {/* Living organic particles */}
                            <span className="absolute w-2 h-2 rounded-full bg-emerald-400 bottom-8 left-8 animate-pulse" />
                            <span className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 top-10 right-10 animate-ping" />

                            <Leaf size={40} className="text-emerald-400 mb-3 group-hover:rotate-12 transition-transform duration-300" />
                            <h3 className="text-white font-black text-lg md:text-xl tracking-wide uppercase">
                              I Want Direction
                            </h3>
                            <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-1">
                              Tree of Life Roadmap
                            </p>
                          </>
                        ) : (
                          // Glowing seed state
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-yellow-300 shadow-[0_0_20px_#10b981]"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive SVG growing roots overlay */}
            <AnimatePresence>
              {transitionState === 'growing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center"
                >
                  <svg className="w-full h-full absolute inset-0 text-emerald-500/40" viewBox="0 0 1000 1000">
                    {/* Root 1 (Left branch) */}
                    <motion.path
                      d="M 500,450 C 400,420 300,500 200,400 C 100,300 150,150 50,200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                    {/* Root 2 (Right branch) */}
                    <motion.path
                      d="M 500,450 C 600,420 700,500 800,400 C 900,300 850,150 950,200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                    {/* Root 3 (Downward roots) */}
                    <motion.path
                      d="M 500,470 C 500,600 400,700 450,850 C 500,950 350,950 300,1000"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M 500,470 C 500,600 600,700 550,850 C 500,950 650,950 700,1000"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, ease: 'easeInOut' }}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Immersive Camera Zoom Overlay (Google Earth Simulation) */}
            <AnimatePresence>
              {transitionState === 'zoom' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 100, opacity: [1, 1, 0] }}
                  transition={{ duration: 1.2, ease: 'easeIn' }}
                  className="fixed inset-0 z-40 bg-gradient-to-tr from-emerald-950 via-gray-950 to-indigo-950 flex items-center justify-center"
                />
              )}
            </AnimatePresence>

            {/* Footer Brand Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: transitionState === 'idle' ? 1 : 0, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs mt-8 md:mt-0 font-bold uppercase tracking-wider"
            >
              <div>career.sirganguly.com</div>
              <div className="flex gap-4 mt-2 md:mt-0">
                <span className="flex items-center gap-1.5"><Milestone size={13} className="text-emerald-400" /> Career Navigation</span>
                <span className="flex items-center gap-1.5"><Compass size={13} className="text-cyan-400" /> Life Direction</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 2. JOB PORTAL INTERFACE */}
        {mode === 'job-portal' && (
          <motion.div
            key="job-portal-screen"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 28 }}
          >
            <JobPortal onBack={handleBackToHome} />
          </motion.div>
        )}

        {/* 3. DYNAMIC TREE ECOSYSTEM GRAPH */}
        {mode === 'career-tree' && (
          <motion.div
            key="career-tree-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CareerTree onBack={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
