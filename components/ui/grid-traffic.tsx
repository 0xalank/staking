'use client';

import { useEffect, useRef } from 'react';

export const GridTraffic = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      trail: Array<{x: number, y: number}>;
    }> = [];

    const gridSize = 50; // Match global grid size

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => {
      // Spawn on a grid line
      const axis = Math.random() > 0.5 ? 'x' : 'y';
      const x = axis === 'x'
        ? Math.random() * canvas.width
        : Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
      const y = axis === 'y'
        ? Math.random() * canvas.height
        : Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

      const speed = 2 + Math.random() * 2;
      const vx = axis === 'x' ? (Math.random() > 0.5 ? speed : -speed) : 0;
      const vy = axis === 'y' ? (Math.random() > 0.5 ? speed : -speed) : 0;

      return {
        x,
        y,
        vx,
        vy,
        size: 2 + Math.random() * 2,
        color: '#E22901',
        trail: []
      };
    };

    // Initial population
    for(let i=0; i<20; i++) particles.push(createParticle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Trail logic
        p.trail.push({x: p.x, y: p.y});
        if(p.trail.length > 10) p.trail.shift();

        // Randomly turn at intersections
        if (Math.abs(p.x % gridSize) < Math.abs(p.vx) && Math.abs(p.y % gridSize) < Math.abs(p.vy)) {
          if (Math.random() < 0.1) {
            // 90 degree turn
            if (p.vx !== 0) {
              p.vy = Math.random() > 0.5 ? Math.abs(p.vx) : -Math.abs(p.vx);
              p.vx = 0;
            } else {
              p.vx = Math.random() > 0.5 ? Math.abs(p.vy) : -Math.abs(p.vy);
              p.vy = 0;
            }
            // Snap to grid exactly to prevent drift
            p.x = Math.round(p.x / gridSize) * gridSize;
            p.y = Math.round(p.y / gridSize) * gridSize;
          }
        }

        // Draw Trail
        ctx.beginPath();
        for(let j=0; j<p.trail.length; j++) {
          const point = p.trail[j];
          if(j===0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = `rgba(226, 41, 1, ${0.1 + (i/particles.length)*0.3})`;
        ctx.lineWidth = p.size;
        ctx.stroke();

        // Draw Head
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);

        // Reset if out of bounds
        if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
          particles[i] = createParticle();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};
