/**
 * ========================================================
 * Cinematic Background Effects & Video Editor HUD Engine
 * Ahmed Hamada | Video Editor Portfolio
 * ── Particles • Mouse Interaction • Film Grain • Timecode ──
 * ========================================================
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. High-Performance Particle Canvas (Viewport Fixed)
     ────────────────────────────────────────────── */
  const particleCanvas = document.getElementById('particle-canvas');
  if (!particleCanvas) return;

  const ctx = particleCanvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouseX = -9999;
  let mouseY = -9999;
  let particles = [];
  let animFrameId;

  const CONFIG = {
    particleCount: 65,
    particleMinSize: 1,
    particleMaxSize: 2.4,
    particleSpeed: 0.3,
    connectionDistance: 130,
    connectionOpacity: 0.08,
    mouseRadius: 180,
    mouseRepelForce: 0.03,
    colors: [
      'rgba(59, 130, 246, ',    // blue
      'rgba(139, 92, 246, ',     // violet
      'rgba(251, 191, 36, ',     // amber
      'rgba(34, 197, 94, ',      // emerald
      'rgba(147, 197, 253, ',    // soft cyan
    ],
    depthLayers: 3,
  };

  // Adjust particle count for mobile
  if (window.innerWidth < 768) {
    CONFIG.particleCount = 28;
    CONFIG.connectionDistance = 85;
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    particleCanvas.width = width;
    particleCanvas.height = height;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.depth = Math.floor(Math.random() * CONFIG.depthLayers) + 1;
      const depthScale = 1 / this.depth;
      this.size = (CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize)) * depthScale;
      this.speedX = (Math.random() - 0.5) * CONFIG.particleSpeed * depthScale;
      this.speedY = (Math.random() - 0.5) * CONFIG.particleSpeed * depthScale;
      this.baseOpacity = (0.25 + Math.random() * 0.45) * depthScale;
      this.opacity = this.baseOpacity;
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.01 + Math.random() * 0.02;
    }

    update(time) {
      // Gentle floating motion
      this.x += this.speedX;
      this.y += this.speedY;

      // Subtle pulse
      this.opacity = this.baseOpacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.12;
      this.opacity = Math.max(0.04, Math.min(0.85, this.opacity));

      // Mouse repulsion (viewport-relative coordinates)
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseRepelForce;
        this.x += (dx / dist) * force * (24 / this.depth);
        this.y += (dy / dist) * force * (24 / this.depth);

        // Glow when near mouse
        this.opacity = Math.min(1, this.opacity + 0.35 * (1 - dist / CONFIG.mouseRadius));
      }

      // Wrap around edges
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();

      // Subtle glow for larger particles
      if (this.size > 1.4) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * 0.1) + ')';
        ctx.fill();
      }
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        if (particles[i].depth !== particles[j].depth) continue;

        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const opacity = CONFIG.connectionOpacity * (1 - dist / CONFIG.connectionDistance);

          // Brighten connections near mouse
          const midX = (particles[i].x + particles[j].x) / 2;
          const midY = (particles[i].y + particles[j].y) / 2;
          const mouseDist = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);
          const mouseBoost = mouseDist < CONFIG.mouseRadius ? (1 - mouseDist / CONFIG.mouseRadius) * 0.15 : 0;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity + mouseBoost})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate(currentTime) {
    const time = currentTime || 0;

    ctx.clearRect(0, 0, width, height);

    // Draw connections first
    drawConnections();

    // Update and draw particles
    for (const p of particles) {
      p.update(time);
      p.draw();
    }

    animFrameId = requestAnimationFrame(animate);
  }

  // Throttled mouse tracking
  let mouseThrottle = false;
  document.addEventListener('mousemove', (e) => {
    if (mouseThrottle) return;
    mouseThrottle = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    setTimeout(() => { mouseThrottle = false; }, 16);
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 200);
  });

  // Init particles
  resizeCanvas();
  initParticles();
  animate();


  /* ──────────────────────────────────────────────
     2. Animated Film Grain Canvas
     ────────────────────────────────────────────── */
  const grainCanvas = document.getElementById('grain-canvas');
  if (grainCanvas) {
    const gCtx = grainCanvas.getContext('2d');
    const gWidth = 256;
    const gHeight = 256;
    grainCanvas.width = gWidth;
    grainCanvas.height = gHeight;

    let grainFrameCount = 0;
    function renderGrain() {
      // Throttle grain update to every 2nd frame for cinematic retro feel and efficiency
      grainFrameCount++;
      if (grainFrameCount % 2 === 0) {
        const imageData = gCtx.createImageData(gWidth, gHeight);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = Math.random() * 255;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = 9; // Ultra subtle opacity
        }
        gCtx.putImageData(imageData, 0, 0);
      }
      requestAnimationFrame(renderGrain);
    }

    renderGrain();
  }


  /* ──────────────────────────────────────────────
     3. Parallax Glow Orbs (Mouse-reactive 3D parallax)
     ────────────────────────────────────────────── */
  const glowOrbs = document.querySelectorAll('.aurora-orb');
  if (glowOrbs.length > 0) {
    let orbThrottle = false;

    document.addEventListener('mousemove', (e) => {
      if (orbThrottle) return;
      orbThrottle = true;

      const cx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
      const cy = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      glowOrbs.forEach((orb, i) => {
        const depth = parseFloat(orb.dataset.depth || (0.02 + i * 0.015));
        const moveX = cx * depth * 70;
        const moveY = cy * depth * 70;
        orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      setTimeout(() => { orbThrottle = false; }, 25);
    });
  }


  /* ──────────────────────────────────────────────
     4. Live Video Editor Timecode Clock & Playhead
     ────────────────────────────────────────────── */
  let frames = 18;
  let seconds = 24;
  let minutes = 1;
  let hours = 0;

  const timecodeElements = document.querySelectorAll('.live-timecode-val');

  if (timecodeElements.length > 0) {
    setInterval(() => {
      frames++;
      if (frames >= 60) {
        frames = 0;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
      }
      const pad = (n) => String(n).padStart(2, '0');
      const tcString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
      timecodeElements.forEach((el) => {
        el.textContent = tcString;
      });
    }, 33); // ~30-60fps timecode tick
  }

})();
