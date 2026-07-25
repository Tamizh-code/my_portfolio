import React, { useEffect, useRef } from 'react';

export default function ParticlesBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000, active: false };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      
      // Update sizes and centers on resize
      const size = Math.min(w, h);
      orbs.forEach((orb, i) => {
        const template = getOrbTemplate(i, w, h, size);
        orb.centerX = template.centerX;
        orb.centerY = template.centerY;
        orb.radius = template.radius;
        orb.orbitRadius = template.orbitRadius;
      });
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const getOrbTemplate = (index, width, height, size) => {
      const positions = [
        { centerX: width * 0.2, centerY: height * 0.25, radius: size * 0.45, orbitRadius: size * 0.12 },
        { centerX: width * 0.8, centerY: height * 0.2, radius: size * 0.4, orbitRadius: size * 0.1 },
        { centerX: width * 0.15, centerY: height * 0.75, radius: size * 0.38, orbitRadius: size * 0.11 },
        { centerX: width * 0.75, centerY: height * 0.8, radius: size * 0.42, orbitRadius: size * 0.13 }
      ];
      return positions[index];
    };

    const size = Math.min(w, h);
    // Initialize orbs in Gemini & Google aesthetic colors
    const orbs = [
      // 1) Google Blue / Gemini Blue
      {
        x: w * 0.2, y: h * 0.25, r: 66, g: 133, b: 244,
        angle: 0, speed: 0.0006,
        ...getOrbTemplate(0, w, h, size)
      },
      // 2) Google Red / Gemini Aura Red-Pink
      {
        x: w * 0.8, y: h * 0.2, r: 234, g: 67, b: 53,
        angle: Math.PI * 0.5, speed: 0.0004,
        ...getOrbTemplate(1, w, h, size)
      },
      // 3) Google Yellow / Gemini Gold
      {
        x: w * 0.15, y: h * 0.75, r: 251, g: 188, b: 5,
        angle: Math.PI, speed: 0.0007,
        ...getOrbTemplate(2, w, h, size)
      },
      // 4) Google Green / Assistant Green
      {
        x: w * 0.75, y: h * 0.8, r: 52, g: 168, b: 83,
        angle: Math.PI * 1.5, speed: 0.0005,
        ...getOrbTemplate(3, w, h, size)
      }
    ];

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationId = null;

    const render = () => {
      ctx.fillStyle = '#f8fafc'; // background color (light slate)
      ctx.fillRect(0, 0, w, h);

      // Draw Large Glowing Aura Orbs (Ambient colors blending)
      ctx.globalCompositeOperation = 'multiply'; // nice ambient color overlay
      for (const orb of orbs) {
        if (!prefersReducedMotion) {
          orb.angle += orb.speed;
        }

        const baseTargetX = orb.centerX + Math.cos(orb.angle) * orb.orbitRadius;
        const baseTargetY = orb.centerY + Math.sin(orb.angle) * orb.orbitRadius;

        if (mouse.active && !prefersReducedMotion) {
          // Gentle pull toward cursor (up to 15% distance)
          const dx = mouse.x - baseTargetX;
          const dy = mouse.y - baseTargetY;
          orb.x = lerp(orb.x, baseTargetX + dx * 0.12, 0.03);
          orb.y = lerp(orb.y, baseTargetY + dy * 0.12, 0.03);
        } else {
          orb.x = lerp(orb.x, baseTargetX, 0.03);
          orb.y = lerp(orb.y, baseTargetY, 0.03);
        }

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        // Gemini soft aura blending values
        grad.addColorStop(0, `rgba(${orb.r}, ${orb.g}, ${orb.b}, 0.13)`);
        grad.addColorStop(0.5, `rgba(${orb.r}, ${orb.g}, ${orb.b}, 0.05)`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over'; // restore default

      // Draw Interactive Dot Grid
      const gridSize = 45;
      const maxHoverDist = 180;

      for (let x = gridSize / 2; x < w; x += gridSize) {
        for (let y = gridSize / 2; y < h; y += gridSize) {
          let r = 1.2;
          let alpha = 0.09;
          let rVal = 79, gVal = 70, bVal = 229; // faint indigo dots by default

          if (mouse.active && !prefersReducedMotion) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxHoverDist) {
              const factor = 1 - dist / maxHoverDist;
              const smoothFactor = factor * factor; // smooth hover curve

              r = 1.2 + smoothFactor * 3.5;
              alpha = 0.09 + smoothFactor * 0.55;
              // Transition colors from default indigo to active violet-blue
              rVal = Math.round(lerp(79, 99, smoothFactor));
              gVal = Math.round(lerp(70, 102, smoothFactor));
              bVal = Math.round(lerp(229, 241, smoothFactor));
            }
          }

          ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    let running = true;
    const handleVisibility = () => {
      running = !document.hidden;
      if (running) {
        if (!prefersReducedMotion) {
          render();
        }
      } else {
        if (animationId) cancelAnimationFrame(animationId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      running = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas id="particles" ref={canvasRef} aria-hidden="true" />;
}
