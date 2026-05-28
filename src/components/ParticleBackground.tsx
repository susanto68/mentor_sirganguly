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
    let twinklingStars: TwinklingStar[] = [];
    let nebulae: NebulaCloud[] = [];
    let shootingStars: ShootingStar[] = [];
    
    const mouse = { x: null as number | null, y: null as number | null, radius: 130 };

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initUniverse();
    };

    // 1. STANDARD CONNECTING NETWORK NODES (CONSTELLATION)
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        
        const nodeColors = [
          'rgba(6, 182, 212, 0.45)',   // Cyan
          'rgba(16, 185, 129, 0.45)',   // Emerald
          'rgba(139, 92, 246, 0.45)',   // Purple
        ];
        this.color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Bounce off edges
        if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas!.height) this.vy = -this.vy;

        this.x += this.vx;
        this.y += this.vy;

        // Interactive mouse repellent force
        if (mouse.x !== null && mouse.y !== null) {
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

    // 2. STATIC/DRIFTING TWINKLING STARS
    class TwinklingStar {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      phase: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.6 + 0.3;
        this.opacity = Math.random() * 0.75 + 0.15;
        this.speed = Math.random() * 0.015 + 0.005;
        this.phase = Math.random() * Math.PI * 2;
        
        const colors = [
          '#ffffff',               // Pure White
          'rgba(224, 242, 254, 1)', // Cyan/Ice Blue
          'rgba(254, 240, 138, 0.9)', // Pale Gold
          'rgba(168, 85, 247, 0.8)'  // Soft Purple
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        if (!ctx) return;
        const currentAlpha = this.opacity * (0.3 + 0.7 * Math.sin(this.phase));
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Add extremely subtle glow to larger stars
        if (this.size > 1.2) {
          ctx.save();
          ctx.shadowBlur = this.size * 2;
          ctx.shadowColor = this.color;
          ctx.fillStyle = this.color;
          ctx.globalAlpha = currentAlpha;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = this.color;
          ctx.globalAlpha = currentAlpha;
          ctx.fill();
        }
        
        ctx.globalAlpha = 1.0; // Reset
      }

      update() {
        this.phase += this.speed;
        
        // Slow global drift (galaxy rotation effect)
        this.x += 0.025;
        if (this.x > canvas!.width) {
          this.x = 0;
          this.y = Math.random() * canvas!.height;
        }
      }
    }

    // 3. DRIFTING ATMOSPHERIC NEBULAE GAS CLOUDS
    class NebulaCloud {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      colorStart: string;
      colorMid: string;
      phase: number;
      pulseSpeed: number;

      constructor(x: number, y: number, radius: number, colorStart: string, colorMid: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = (Math.random() - 0.5) * 0.04;
        this.vy = (Math.random() - 0.5) * 0.04;
        this.colorStart = colorStart;
        this.colorMid = colorMid;
        this.phase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.003 + 0.001;
      }

      draw() {
        if (!ctx) return;
        const currentRadius = this.radius * (1.0 + 0.08 * Math.sin(this.phase));
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, currentRadius
        );
        grad.addColorStop(0, this.colorStart);
        grad.addColorStop(0.4, this.colorMid);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.phase += this.pulseSpeed;
        this.x += this.vx;
        this.y += this.vy;

        // Bounce back smoothly from edges
        if (this.x - this.radius * 0.3 < 0 || this.x + this.radius * 0.3 > canvas!.width) {
          this.vx = -this.vx;
        }
        if (this.y - this.radius * 0.3 < 0 || this.y + this.radius * 0.3 > canvas!.height) {
          this.vy = -this.vy;
        }
      }
    }

    // 4. RANDOM DIAGONAL METEORS (SHOOTING STARS)
    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      dx: number;
      dy: number;
      opacity: number;
      active: boolean;

      constructor() {
        this.active = true;
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.speed = 0;
        this.angle = 0;
        this.dx = 0;
        this.dy = 0;
        this.opacity = 0;
        this.reset();
      }

      reset() {
        if (Math.random() < 0.5) {
          this.x = Math.random() * canvas!.width * 0.65;
          this.y = 0;
        } else {
          this.x = 0;
          this.y = Math.random() * canvas!.height * 0.45;
        }
        this.length = Math.random() * 90 + 50;
        this.speed = Math.random() * 11 + 7;
        this.angle = Math.PI / 6 + (Math.random() - 0.5) * 0.12; // ~30 degrees
        this.dx = Math.cos(this.angle) * this.speed;
        this.dy = Math.sin(this.angle) * this.speed;
        this.opacity = 1.0;
        this.active = true;
      }

      draw() {
        if (!ctx || !this.active) return;
        
        ctx.save();
        ctx.beginPath();
        
        const endX = this.x - Math.cos(this.angle) * this.length;
        const endY = this.y - Math.sin(this.angle) * this.length;
        
        const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(0.12, `rgba(34, 211, 238, ${this.opacity * 0.85})`); // neon cyan
        grad.addColorStop(0.45, `rgba(168, 85, 247, ${this.opacity * 0.35})`); // electric purple
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.random() * 1.8 + 1.2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
      }

      update() {
        if (!this.active) return;
        
        this.x += this.dx;
        this.y += this.dy;
        this.opacity -= 0.016; // dissolve over time
        
        if (
          this.opacity <= 0 ||
          this.x > canvas!.width ||
          this.y > canvas!.height
        ) {
          this.active = false;
        }
      }
    }

    // INITIALIZE UNIVERSE COMPLEMENTS
    const initUniverse = () => {
      particles = [];
      twinklingStars = [];
      nebulae = [];
      shootingStars = [];

      const isMobile = window.innerWidth < 768;

      // 1. Constellation nodes
      const particleDensity = isMobile ? 32 : 80;
      for (let i = 0; i < particleDensity; i++) {
        particles.push(new Particle());
      }

      // 2. Starfield twinkles
      const starDensity = isMobile ? 60 : 160;
      for (let i = 0; i < starDensity; i++) {
        twinklingStars.push(new TwinklingStar());
      }

      // 3. Galactic gas clouds (Nebulae)
      // Standard: 3 large clouds (Indigo/Teal/Pink-Magenta)
      const w = canvas.width;
      const h = canvas.height;
      
      nebulae.push(
        new NebulaCloud(w * 0.25, h * 0.3, isMobile ? 180 : 380, 'rgba(124, 58, 237, 0.07)', 'rgba(30, 27, 75, 0.03)') // Violet-Indigo Cloud
      );
      nebulae.push(
        new NebulaCloud(w * 0.75, h * 0.4, isMobile ? 220 : 420, 'rgba(6, 182, 212, 0.07)', 'rgba(15, 23, 42, 0.03)')  // Cyan-Deep Blue Cloud
      );
      nebulae.push(
        new NebulaCloud(w * 0.5, h * 0.75, isMobile ? 200 : 400, 'rgba(236, 72, 153, 0.05)', 'rgba(88, 28, 135, 0.02)') // Magenta-Purple Cloud
      );
    };

    // Draw Constellation connection strings
    const drawConstellations = () => {
      if (!ctx) return;
      const maxDistance = 125;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.14;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Soft celestial color gradient linking the nodes
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`; // emerald connector strings
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }
    };

    // CORE ANIMATION LOOP
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gorgeous dark space void base
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      grad.addColorStop(0, '#0a0b1c');   // Cosmic Black Indigo
      grad.addColorStop(0.5, '#05040e'); // Deep Space Violet
      grad.addColorStop(1, '#010103');   // Pitch Black Universe Void
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render 1: Atmospheric Gas Nebulae
      nebulae.forEach((neb) => {
        neb.update();
        neb.draw();
      });

      // Render 2: Deep Twinkling Starfield
      twinklingStars.forEach((star) => {
        star.update();
        star.draw();
      });

      // Render 3: Shooting Stars
      // Spawn shooting stars randomly (average 1 every 240 frames)
      if (Math.random() < 0.004 && shootingStars.length < 2) {
        shootingStars.push(new ShootingStar());
      }
      
      shootingStars.forEach((star) => {
        star.update();
        star.draw();
      });
      // Remove dead shooting stars
      shootingStars = shootingStars.filter((s) => s.active);

      // Render 4: Constellation Particle Nodes & Connections
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConstellations();

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

