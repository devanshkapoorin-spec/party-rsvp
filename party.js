// ── FLOATING BACKGROUND DECORATIONS ──
function startFloaties() {
  const emojis = ['🍹','🥂','🎉','🎊','✨','🍾','🎈','💃','🕺','⭐','🌟','🎶','🎵','🥳','💫','🪩'];
  const container = document.createElement('div');
  container.className = 'floaties';
  document.body.appendChild(container);

  function spawnFloaty() {
    const el = document.createElement('div');
    el.className = 'floaty';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 20 + 16) + 'px';
    const duration = Math.random() * 12 + 10;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = (Math.random() * 4) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (duration + 4) * 1000);
  }

  // Spawn initial batch
  for (let i = 0; i < 12; i++) setTimeout(spawnFloaty, i * 600);
  // Keep spawning
  setInterval(spawnFloaty, 1800);
}

// ── CONFETTI ──
function launchConfetti() {
  const existing = document.getElementById('confetti-canvas');
  if (existing) existing.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#ff2d6b','#a855f7','#22d3ee','#fbbf24','#34d399','#ff6b9d','#ffffff','#f0abfc'];
  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: Math.random() * 12 + 4,
    h: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.15,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    opacity: 1,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.vy += 0.08; // gravity
      if (frame > 120) p.opacity -= 0.012;
      if (p.opacity <= 0 || p.y > canvas.height + 20) return;
      alive++;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (alive > 0 && frame < 300) requestAnimationFrame(draw);
    else { canvas.remove(); window.removeEventListener('resize', resize); }
  }
  draw();
}

startFloaties();
