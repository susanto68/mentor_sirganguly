'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 120 };

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      isNebula: boolean;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.isNebula = Math.random() < 0.15; // 15% are larger glowing space bodies

        if (this.isNebula) {
          // Large slow drifting stellar nebula stars
          this.size = Math.random() * 4 + 3;
          this.vx = (Math.random() - 0.5) * 0.08;
          this.vy = (Math.random() - 0.5) * 0.08;
          
          const nebulaColors = [
            'rgba(168, 85, 247, 0.22)',  // Violet Glow
            'rgba(6, 182, 212, 0.22)',   // Cyan Glow
            'rgba(245, 158, 11, 0.15)',   // Warm Gold Glow
          ];
          this.color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
        } else {
          // Standard sharp connection nodes
          this.size = Math.random() * 1.5 + 0.6;
          this.vx = (Math.random() - 0.5) * 0.35;
          this.vy = (Math.random() - 0.5) * 0.35;
          
          const nodeColors = [
            'rgba(6, 182, 212, 0.45)',   // Cyan
            'rgba(16, 185, 129, 0.45)',   // Green
            'rgba(139, 92, 246, 0.45)',   // Purple
          ];
          this.color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        if (this.isNebula) {
          // Glow effect for large nebulae stars
          ctx.shadowBlur = this.size * 1.8;
          ctx.shadowColor = this.color;
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.shadowBlur = 0; // reset instantly to maintain high drawing FPS
        } else {
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }

      update() {
        // Bounce off edges
        if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas!.height) this.vy = -this.vy;

        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction (only affect standard nodes, let nebulae float smoothly)
        if (!this.isNebula && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 1.2;
            this.y -= (dy / distance) * force * 1.2;
          }
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const particleDensity = window.innerWidth < 768 ? 35 : 95;
      for (let i = 0; i < particleDensity; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      if (!ctx) return;
      const maxDistance = 130;

      for (let i = 0; i < particles.length; i++) {
        // Skip link-drawing for glowing nebulae to keep connections thin and neat
        if (particles[i].isNebula) continue;

        for (let j = i + 1; j < particles.length; j++) {
          if (particles[j].isNebula) continue;

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gorgeous three-stop radial gradient simulating a deep space void
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      grad.addColorStop(0, '#0c0d21');   // Deep Space Cosmic Indigo
      grad.addColorStop(0.5, '#070614'); // Mysterious Stellar Violet/Navy
      grad.addColorStop(1, '#020206');   // Absolute Space Void Black
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render & update particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Listeners
    window.addEventListener('resize', resizeCanvas);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-50 block" />;
}
