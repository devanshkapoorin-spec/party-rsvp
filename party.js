// ─────────────────────────────────────────────
//  DISCO LIGHTS BACKGROUND
// ─────────────────────────────────────────────
function startDiscoLights() {
  const overlay = document.createElement('div');
  overlay.className = 'disco-lights';
  document.body.prepend(overlay);

  const lights = [
    { color: 'rgba(255,20,147,1)', size: '500px', duration: 12, x: 10, y: 20 },
    { color: 'rgba(0,212,255,1)',  size: '400px', duration: 16, x: 70, y: 60 },
    { color: 'rgba(255,215,0,1)',  size: '350px', duration: 10, x: 40, y: 80 },
    { color: 'rgba(191,95,255,1)', size: '450px', duration: 14, x: 80, y: 10 },
    { color: 'rgba(57,255,20,1)',  size: '300px', duration: 18, x: 20, y: 70 },
  ];

  lights.forEach(l => {
    const el = document.createElement('div');
    el.className = 'disco-light';
    el.style.cssText = `
      width:${l.size};height:${l.size};
      background:radial-gradient(circle, ${l.color} 0%, transparent 70%);
      left:${l.x}%;top:${l.y}%;
      animation-duration:${l.duration}s;
      animation-delay:${Math.random() * -10}s;
    `;
    overlay.appendChild(el);
  });
}

// ─────────────────────────────────────────────
//  FLOATING EMOJIS
// ─────────────────────────────────────────────
function startFloaties() {
  const emojis = ['🍹','🥂','🎉','🎊','✨','🍾','🎈','💃','🕺','⭐','🌟','🎶','🎵','🥳','💫','🪩','🎤','💎','🌈','🪅','🎸','🥁','🎷'];
  const container = document.createElement('div');
  container.className = 'floaties';
  document.body.appendChild(container);

  function spawnFloaty() {
    const el = document.createElement('div');
    el.className = 'floaty';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.fontSize = (Math.random() * 28 + 22) + 'px';
    const dur = Math.random() * 7 + 7;
    el.style.animationDuration = dur + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 500);
  }

  // Initial burst
  for (let i = 0; i < 25; i++) setTimeout(spawnFloaty, i * 150);
  // Continuous stream
  setInterval(spawnFloaty, 600);
}

// ─────────────────────────────────────────────
//  DISCO BALL
// ─────────────────────────────────────────────
function createDiscoBall(parentEl, size = 180) {
  const wrap = document.createElement('div');
  wrap.className = 'disco-ball-wrap';
  wrap.style.position = 'relative';
  wrap.style.width = size + 'px';

  const string = document.createElement('div');
  string.className = 'disco-string';
  wrap.appendChild(string);

  const canvas = document.createElement('canvas');
  canvas.className = 'disco-ball-canvas';
  canvas.width = size;
  canvas.height = size;
  canvas.style.boxShadow = `0 0 60px rgba(255,255,255,0.5), 0 0 120px rgba(191,95,255,0.3), 0 0 200px rgba(255,20,147,0.2)`;
  wrap.appendChild(canvas);

  // Sparkle container
  const sparkles = document.createElement('div');
  sparkles.className = 'disco-sparkles';
  sparkles.style.cssText = `position:absolute;top:36px;left:50%;transform:translateX(-50%);width:${size}px;height:${size}px;pointer-events:none;`;
  wrap.appendChild(sparkles);

  parentEl.insertBefore(wrap, parentEl.firstChild);

  // Draw the ball
  const ctx = canvas.getContext('2d');
  const r = size / 2;
  const tileSize = size / 14;
  let angle = 0;

  const tileColors = [
    '#FF1493','#BF5FFF','#00D4FF','#FFD700','#39FF14',
    '#FF69B4','#87CEEB','#FFA500','#7CFC00','#DA70D6',
    '#ffffff','#E8E8E8','#C8C8C8','#FF4500','#00CED1',
  ];

  function draw() {
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.clip();

    // Base sphere gradient
    const baseGrad = ctx.createRadialGradient(r * 0.6, r * 0.45, 0, r, r, r);
    baseGrad.addColorStop(0, '#f5f5f5');
    baseGrad.addColorStop(0.4, '#c0c0c0');
    baseGrad.addColorStop(0.75, '#888');
    baseGrad.addColorStop(1, '#333');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, size, size);

    // Tiles
    for (let row = 0; row < Math.ceil(size / tileSize); row++) {
      for (let col = 0; col < Math.ceil(size / tileSize); col++) {
        const x = col * tileSize;
        const y = row * tileSize;
        const cx = x + tileSize / 2 - r;
        const cy = y + tileSize / 2 - r;
        const dist = Math.sqrt(cx * cx + cy * cy);
        if (dist > r - 2) continue;

        const tileAngle = (Math.atan2(cy, cx) + angle) / (Math.PI * 2);
        const idx = Math.abs(Math.floor((tileAngle * tileColors.length + row * 0.7) % tileColors.length));
        const bright = 0.4 + 0.6 * (1 - dist / r);
        const isFlash = Math.sin(angle * 5 + row * 2.1 + col * 1.7) > 0.8;

        ctx.globalAlpha = isFlash ? 1 : bright * 0.9;
        ctx.fillStyle = isFlash ? '#ffffff' : tileColors[idx];
        ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
      }
    }
    ctx.globalAlpha = 1;

    // Specular highlight
    const shine = ctx.createRadialGradient(r * 0.42, r * 0.35, 0, r * 0.42, r * 0.35, r * 0.45);
    shine.addColorStop(0, 'rgba(255,255,255,0.7)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, size, size);

    ctx.restore();
    angle += 0.025;
    requestAnimationFrame(draw);
  }
  draw();

  // Sparkles around ball
  const sparkColors = ['#FF1493','#FFD700','#00D4FF','#BF5FFF','#39FF14','#ffffff','#FFA500'];
  function spawnBallSparkle() {
    const a = Math.random() * Math.PI * 2;
    const dist = r + Math.random() * 70 + 10;
    const x = r + Math.cos(a) * dist;
    const y = r + Math.sin(a) * dist;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    const s = document.createElement('div');
    const sz = Math.random() * 10 + 5;
    s.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:${sz}px;height:${sz}px;
      background:${color};
      transform:translate(-50%,-50%) rotate(45deg);
      clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
      animation:sparkleAnim 0.8s ease forwards;
      pointer-events:none;
      filter:drop-shadow(0 0 4px ${color});
    `;
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
  setInterval(spawnBallSparkle, 120);

  return wrap;
}

// ─────────────────────────────────────────────
//  CONFETTI
// ─────────────────────────────────────────────
function launchConfetti() {
  const existing = document.getElementById('confetti-canvas');
  if (existing) existing.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#FF1493','#BF5FFF','#00D4FF','#FFD700','#39FF14','#FF69B4','#ffffff','#FFA500','#87CEEB','#DA70D6'];
  const pieces = Array.from({ length: 220 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height * 1.2,
    w: Math.random() * 14 + 5,
    h: Math.random() * 7 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.18,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 5 + 2,
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
      p.vy += 0.1;
      if (frame > 140) p.opacity -= 0.01;
      if (p.opacity <= 0 || p.y > canvas.height + 20) return;
      alive++;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (alive > 0 && frame < 350) requestAnimationFrame(draw);
    else { canvas.remove(); window.removeEventListener('resize', resize); }
  }
  draw();
}

// ─────────────────────────────────────────────
//  FULL CELEBRATION (confirm)
// ─────────────────────────────────────────────
function celebrate(successBoxEl) {
  launchConfetti();

  // Disco ball above success box
  createDiscoBall(successBoxEl, 160);

  // Screen-wide sparkles burst
  const colors = ['#FF1493','#FFD700','#00D4FF','#BF5FFF','#39FF14','#fff'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const el = document.createElement('div');
      const sz = Math.random() * 18 + 8;
      el.className = 'sparkle';
      el.style.cssText = `
        left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;
        background:${color};
        clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
        filter:drop-shadow(0 0 6px ${color});
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    }, i * 80);
  }

  // Celebration hype text
  const msgs = ['🎉 LESSGOO!!','🔥 YOU\'RE IN!!','🥳 LET\'S GOOO!!','✨ IT\'S HAPPENING!!','🎊 YESSS!!'];
  msgs.forEach((msg, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'hype-comment';
      el.textContent = msg;
      el.style.cssText = `
        left:${10 + Math.random() * 70}%;
        top:${20 + Math.random() * 50}%;
        color:#FFD700;
        font-size:${18 + Math.random() * 10}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2600);
    }, i * 300);
  });
}

// ─────────────────────────────────────────────
//  FORM HYPE (while typing)
// ─────────────────────────────────────────────
function startFormHype(formEl) {
  const hypeMessages = [
    { text: 'lessgoooo 🔥', color: '#FF1493' },
    { text: 'yesss almost on the list! 🎉', color: '#FFD700' },
    { text: "don't miss out on thisss ✨", color: '#00D4FF' },
    { text: 'this is gonna be CRAZY 🥳', color: '#BF5FFF' },
    { text: 'everyone is going!! 👀', color: '#39FF14' },
    { text: 'best night of the year 🍾', color: '#FF1493' },
    { text: 'you need to be there!! 🎊', color: '#FFD700' },
    { text: 'ur missing out if u skip 😤', color: '#00D4FF' },
    { text: 'almost thereeee 💃', color: '#BF5FFF' },
    { text: 'the squad is waiting!! 🕺', color: '#39FF14' },
    { text: 'vibes are IMMACULATE ✨', color: '#FF1493' },
    { text: "it's giving party of the year 🎸", color: '#FFD700' },
  ];

  let lastHype = 0;
  let sparkleInterval = null;

  function spawnHype() {
    const now = Date.now();
    if (now - lastHype < 1800) return;
    lastHype = now;

    const msg = hypeMessages[Math.floor(Math.random() * hypeMessages.length)];
    const el = document.createElement('div');
    el.className = 'hype-comment';
    el.textContent = msg.text;

    const rect = formEl.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height * 0.5;

    el.style.cssText = `
      left:${x}px;
      top:${y}px;
      color:${msg.color};
      font-size:${13 + Math.random() * 5}px;
      text-shadow:0 0 12px ${msg.color};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  function spawnFormSparkle() {
    const rect = formEl.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    const colors = ['#FF1493','#FFD700','#00D4FF','#BF5FFF','#39FF14'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const sz = Math.random() * 12 + 6;
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.style.cssText = `
      left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;
      background:${color};
      clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
      filter:drop-shadow(0 0 4px ${color});
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  formEl.addEventListener('focusin', () => {
    if (!sparkleInterval) {
      sparkleInterval = setInterval(spawnFormSparkle, 400);
    }
    spawnHype();
  });

  formEl.addEventListener('input', spawnHype);

  formEl.addEventListener('focusout', () => {
    if (sparkleInterval) {
      clearInterval(sparkleInterval);
      sparkleInterval = null;
    }
  });
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
startDiscoLights();
startFloaties();
