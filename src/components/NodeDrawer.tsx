'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Award, GraduationCap, DollarSign, BrainCircuit, Activity, Compass, Volume2 } from 'lucide-react';
import { CareerNode } from '../lib/data/careerData';

interface NodeDrawerProps {
  node: CareerNode | null;
  onClose: () => void;
}

export default function NodeDrawer({ node, onClose }: NodeDrawerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Canvas waveform visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 60;

    let phase = 0;

    const drawWave = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Base line
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Wave parameters based on play state
      const amplitude = isPlaying ? 16 : 2;
      const frequency = isPlaying ? 0.08 : 0.02;
      const speed = isPlaying ? 0.15 : 0.02;

      phase += speed;

      // Primary wave drawing
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = midY + Math.sin(x * frequency + phase) * amplitude * Math.sin(x * Math.PI / width);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      // Theme color mapping for stroke gradient
      let colorGlow = 'rgba(6, 182, 212, 0.8)'; // default cyan
      if (node?.theme_color === 'green') colorGlow = 'rgba(16, 185, 129, 0.8)';
      if (node?.theme_color === 'purple') colorGlow = 'rgba(168, 85, 247, 0.8)';
      if (node?.theme_color === 'orange') colorGlow = 'rgba(249, 115, 22, 0.8)';
      if (node?.theme_color === 'warm') colorGlow = 'rgba(245, 158, 11, 0.8)';

      ctx.strokeStyle = colorGlow;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = isPlaying ? 8 : 0;
      ctx.shadowColor = colorGlow;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Secondary layered wave
      if (isPlaying) {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = midY + Math.cos(x * (frequency * 0.7) - phase * 0.8) * (amplitude * 0.6) * Math.sin(x * Math.PI / width);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = node?.theme_color === 'purple' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, node]);

  // Handle audio play/pause (supporting both direct MP3 stream and natural TTS fallback)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Cleanup previous playing processes
    const cleanupAudio = () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      window.speechSynthesis.cancel();
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };

    if (isPlaying) {
      cleanupAudio();

      // Play professionally recorded/generated MP3 from Supabase Storage if audio_url exists
      if (node?.audio_url) {
        const audio = new Audio(node.audio_url);
        audioPlayerRef.current = audio;

        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            setAudioProgress((audio.currentTime / audio.duration) * 100);
          }
        });

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setAudioProgress(0);
        });

        audio.play().catch((err) => {
          console.warn('Failed to stream audio file from Supabase, falling back to natural speech synthesizer:', err);
          playTTS();
        });
      } else {
        playTTS();
      }
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      window.speechSynthesis.cancel();
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }

    function playTTS() {
      if (!node) return;
      
      const titleText = `${node.title}, in category ${node.category}. `;
      const descText = node.description ? `${node.description} ` : '';
      const scopeText = node.future_scope ? `Regarding its future outlook, ${node.future_scope}. ` : '';
      const salaryText = node.salary_range ? `The estimated standard salary range is ${node.salary_range}. ` : '';
      const skillsText = node.skills_required && node.skills_required.length > 0 
        ? `Core skills you need to master are: ${node.skills_required.join(', ')}. ` 
        : '';
      const examsText = node.exam_list && node.exam_list.length > 0 
        ? `Important entrance examinations include: ${node.exam_list.join(', ')}. ` 
        : '';
      const collegesText = node.college_list && node.college_list.length > 0 
        ? `Top recommended Indian colleges are: ${node.college_list.join(', ')}. ` 
        : '';
      const roadmapText = node.roadmap_steps && node.roadmap_steps.length > 0 
        ? `Here is your step by step action roadmap: ${node.roadmap_steps.map((step, i) => `Step ${i + 1}, ${step}`).join('. ')}. ` 
        : '';
      const guidanceText = node.motivation_guidance ? `Sir Ganguly's motivational guidance: ${node.motivation_guidance}` : '';

      const narrationText = `${titleText}${descText}${scopeText}${salaryText}${skillsText}${examsText}${collegesText}${roadmapText}${guidanceText}`;
      const utterance = new SpeechSynthesisUtterance(narrationText);

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes('google uk english male') ||
        v.name.toLowerCase().includes('microsoft david') ||
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('google us english')
      );
      
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Faster, more natural, authentic pacing parameters
      utterance.pitch = 0.95; // Crisp, warm natural voice
      utterance.rate = 1.05;  // Flowing human speed (approx 150 words per minute)

      utterance.onend = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);

      const wordsCount = narrationText.split(' ').length;
      const estimatedDurationMs = (wordsCount / 150) * 60 * 1000;
      const updateIntervalMs = 150;
      const progressIncrement = (100 / (estimatedDurationMs / updateIntervalMs));

      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 99) return 99;
          return prev + progressIncrement;
        });
      }, updateIntervalMs);
    }

    return () => {
      cleanupAudio();
    };
  }, [isPlaying, node]);

  useEffect(() => {
    // Reset play state on node change
    setIsPlaying(false);
    setAudioProgress(0);
  }, [node]);

  if (!node) return null;

  // Determine neon border accent class based on theme color
  const colorMap = {
    cyan: 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    green: 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    purple: 'border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    orange: 'border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    warm: 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    blue: 'border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    indigo: 'border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    gold: 'border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)]',
    pink: 'border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)]',
    red: 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
  };

  const activeBorder = colorMap[node.theme_color || 'cyan'] || colorMap.cyan;
  const themeColor = node.theme_color || 'cyan';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] cursor-pointer"
      />

      {/* Drawer Body */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className={`w-full max-w-lg md:max-w-xl h-full glass-panel border-l ${activeBorder} relative z-10 flex flex-col justify-between overflow-hidden shadow-2xl`}
      >
        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-32">
          {/* Close & Header */}
          <div className="flex justify-between items-start mb-6">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest border bg-${themeColor}-950/20 text-${themeColor}-400 border-${themeColor}-800/30`}>
              {node.category}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-panel hover:border-red-500/30 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            {node.title}
          </h2>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            {node.description}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {node.salary_range && (
              <div className="glass-panel p-4 rounded-2xl border-gray-800/40">
                <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase block mb-1">
                  Est. Salary Package
                </span>
                <div className="flex items-center gap-1.5 text-white font-bold text-sm md:text-base">
                  <DollarSign size={16} className="text-emerald-400" />
                  {node.salary_range}
                </div>
              </div>
            )}

            {node.future_scope && (
              <div className="glass-panel p-4 rounded-2xl border-gray-800/40 col-span-2 md:col-span-1">
                <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase block mb-1">
                  Future Industry Scope
                </span>
                <div className="flex items-center gap-1.5 text-white font-bold text-xs md:text-sm">
                  <Compass size={16} className="text-cyan-400 flex-shrink-0" />
                  <span className="line-clamp-2">{node.future_scope}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Future Relevance */}
          {node.ai_relevance && (
            <div className="glass-panel p-5 rounded-2xl border-cyan-500/10 mb-6 bg-cyan-950/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
              <div className="flex gap-3">
                <BrainCircuit className="text-cyan-400 flex-shrink-0 mt-0.5 animate-pulse" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-cyan-300 tracking-wider uppercase mb-1">AI Relevance & Impact</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{node.ai_relevance}</p>
                </div>
              </div>
            </div>
          )}

          {/* Core Skills Required */}
          {node.skills_required && node.skills_required.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Required Skill Set</h4>
              <div className="flex flex-wrap gap-2">
                {node.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl glass-panel border-gray-800 text-gray-300 hover:border-cyan-500/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* College recommendations & Exams */}
          {(node.college_list || node.exam_list) && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {node.exam_list && node.exam_list.length > 0 && (
                <div className="glass-panel p-5 rounded-2xl border-gray-800/40">
                  <h4 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Award size={15} className="text-amber-400" />
                    Entrance Exams
                  </h4>
                  <ul className="space-y-2">
                    {node.exam_list.map((exam, i) => (
                      <li key={i} className="text-xs text-gray-400 leading-relaxed flex gap-2">
                        <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                        {exam}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {node.college_list && node.college_list.length > 0 && (
                <div className="glass-panel p-5 rounded-2xl border-gray-800/40">
                  <h4 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <GraduationCap size={16} className="text-indigo-400" />
                    Recommended Colleges
                  </h4>
                  <ul className="space-y-2">
                    {node.college_list.map((college, i) => (
                      <li key={i} className="text-xs text-gray-400 leading-relaxed flex gap-2">
                        <span className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                        {college}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Roadmap Steps */}
          {node.roadmap_steps && node.roadmap_steps.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Step-by-Step Roadmap
              </h4>
              <div className="space-y-4 relative pl-4 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-gray-800">
                {node.roadmap_steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Visual node pin */}
                    <div className="absolute -left-[20px] top-1.5 w-[9px] h-[9px] rounded-full border border-gray-800 bg-black group-hover:border-cyan-400 transition-colors" />
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider block mb-0.5">
                      STEP {idx + 1}
                    </span>
                    <p className="text-xs text-gray-400 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Motivational Guidance */}
          {node.motivation_guidance && (
            <div className="glass-panel p-5 rounded-2xl border-emerald-500/10 mb-6 bg-emerald-950/5">
              <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase block mb-1">
                Sir Ganguly's Guidance
              </span>
              <p className="text-gray-300 text-xs italic leading-relaxed">
                "{node.motivation_guidance}"
              </p>
            </div>
          )}

          {/* Coming Soon Banner */}
          <div className="glass-panel p-5 rounded-2xl border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.06)] relative overflow-hidden bg-amber-950/5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex gap-3">
              <Activity className="text-amber-500 flex-shrink-0 animate-pulse mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-amber-300 tracking-wider uppercase mb-1">🚧 Mock Test Coming Soon</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Advanced evaluation engines, behavioral diagnostic quizzes, and career fit indices powered by AI will be launched in the next update.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Audio Narrator System (Fixed at bottom of Drawer) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 glass-panel border-t border-gray-800/80 bg-black/90 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shadow-lg ${
                  isPlaying
                    ? 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }`}
              >
                {isPlaying ? <Pause size={20} className="text-red-400" /> : <Play size={20} className="text-emerald-400 fill-emerald-400/20 ml-1" />}
              </button>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Volume2 size={13} className="text-emerald-400" />
                  Sir Ganguly's Audio Narrator
                </h4>
                <p className="text-[10px] text-gray-500">
                  {isPlaying ? 'Streaming guidance audio...' : 'Click play to listen to audio narration'}
                </p>
              </div>
            </div>

            {/* Audio Waveform Canvas */}
            <div className="hidden sm:block">
              <canvas ref={canvasRef} className="opacity-90 w-[150px] h-[36px]" />
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${audioProgress}%` }}
              transition={{ ease: 'linear' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
