/* ============================================================
   HERO ANIMATIONS
   All values use CSS custom properties where possible
============================================================ */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ── 1. Particle network canvas ── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COUNT = 38;
    const MAX_DIST = 130;
 
    // Brand colours from tokens (can't read CSS vars in JS easily for canvas)
    const COLORS = ['rgba(31,111,235,', 'rgba(89,168,255,', 'rgba(11,42,91,'];
 
    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    }
 
    function makeParticle() {
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - .5) * .4,
        vy: (Math.random() - .5) * .4,
        r:  Math.random() * 2 + 1.5,
        c:  COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    }
 
    function init() {
      resize();
      particles = Array.from({ length: COUNT }, makeParticle);
    }
 
    function draw() {
      ctx.clearRect(0, 0, W, H);
 
      // Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * .45;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(89,168,255,${alpha})`;
            ctx.lineWidth = .8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
 
      // Dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + '.7)';
        ctx.fill();
 
        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
 
      requestAnimationFrame(draw);
    }
 
    init();
    draw();
    window.addEventListener('resize', () => { init(); });
  }
 
  /* ── 2. GSAP — left copy entrance ── */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
 
  tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: .6 })
    .from('.hero-title',   { opacity: 0, y: 24, duration: .7 }, '-=.3')
    .from('.hero-sub',     { opacity: 0, y: 18, duration: .6 }, '-=.4')
    .from('.hero-actions', { opacity: 0, y: 14, duration: .5 }, '-=.35')
    .from('.trust-pill',   { opacity: 0, y: 10, duration: .4, stagger: .08 }, '-=.3')
    .from('.hero-dashboard',{ opacity: 0, x: 24, duration: .8 }, '-=.7');
 
  /* ── 3. Health bar count-up ── */
  const healthBar = document.getElementById('health-bar');
  const uptimePct = document.getElementById('uptime-pct');
  const TARGET_UPTIME = 99.7;
 
  setTimeout(() => {
    if (healthBar) healthBar.style.width = TARGET_UPTIME + '%';
    if (uptimePct) {
      let cur = 0;
      const step = () => {
        cur = Math.min(cur + 1.8, TARGET_UPTIME);
        uptimePct.textContent = cur.toFixed(1) + '%';
        if (cur < TARGET_UPTIME) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, 600);
 
  /* ── 4. Ticket rows stagger in ── */
  const rows = document.querySelectorAll('.ticket-row');
  rows.forEach(row => {
    const delay = parseInt(row.dataset.delay || 0);
    setTimeout(() => row.classList.add('visible'), 800 + delay);
  });
 
  /* ── 5. Security score arc + number ── */
  const arc     = document.getElementById('score-arc');
  const scoreEl = document.getElementById('score-num');
  const TARGET_SCORE = 94;
  const CIRCUMFERENCE = 126; // 2 * π * 20
 
  setTimeout(() => {
    if (arc) {
      const offset = CIRCUMFERENCE - (TARGET_SCORE / 100) * CIRCUMFERENCE;
      arc.style.strokeDashoffset = offset;
    }
    if (scoreEl) {
      let n = 0;
      const step = () => {
        n = Math.min(n + 1.8, TARGET_SCORE);
        scoreEl.textContent = Math.round(n);
        if (n < TARGET_SCORE) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, 900);
 
  /* ── 6. Response time count-up ── */
  const respEl = document.getElementById('resp-num');
  const TARGET_RESP = 11;
 
  setTimeout(() => {
    if (respEl) {
      let n = 0;
      const step = () => {
        n = Math.min(n + .4, TARGET_RESP);
        respEl.textContent = Math.round(n);
        if (n < TARGET_RESP) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, 1000);
 
  /* ── 7. Sparkline bars grow ── */
  setTimeout(() => {
    document.querySelectorAll('.spark-bar').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.height = bar.dataset.h + '%';
      }, i * 80);
    });
  }, 1100);
 
});
const ticketList = document.getElementById('ticket-list');

if (ticketList) {
  const ticketPool = [
    { id: '#1045', name: 'Email quarantine review', status: 'resolved', label: 'Resolved', time: '1 min' },
    { id: '#1046', name: 'VPN access restored', status: 'resolved', label: 'Resolved', time: '3 min' },
    { id: '#1047', name: 'Defender alert triage', status: 'progress', label: 'In progress', time: 'Now' },
    { id: '#1048', name: 'Switch firmware scheduled', status: 'scheduled', label: 'Scheduled', time: 'Today' },
    { id: '#1049', name: 'New device enrolled', status: 'resolved', label: 'Resolved', time: '4 min' }
  ];

  function buildTicketRow(item) {
    const row = document.createElement('div');
    row.className = 'ticket-row visible';
    row.innerHTML = `
      <div class="ticket-id-name">
        <span class="ticket-id">${item.id}</span>
        <span class="ticket-name">${item.name}</span>
      </div>
      <span class="ticket-status ${item.status}">${item.label}</span>
      <span class="ticket-time">${item.time}</span>
    `;
    return row;
  }

  let ticketIndex = 0;

  setInterval(() => {
    const first = ticketList.querySelector('.ticket-row');
    if (!first) return;

    first.style.transition = 'opacity .35s ease, transform .35s ease';
    first.style.opacity = '0';
    first.style.transform = 'translateY(-14px)';

    setTimeout(() => {
      first.remove();

      const newRow = buildTicketRow(ticketPool[ticketIndex % ticketPool.length]);
      newRow.style.opacity = '0';
      newRow.style.transform = 'translateY(14px)';
      ticketList.appendChild(newRow);

      requestAnimationFrame(() => {
        newRow.style.transition = 'opacity .35s ease, transform .35s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
      });

      ticketIndex++;
    }, 350);
  }, 2600);
}
const sparkBars = document.querySelectorAll('.spark-bar');

function randomBarHeight(min = 35, max = 85) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (sparkBars.length) {
  setInterval(() => {
    sparkBars.forEach((bar, i) => {
      const next = i === sparkBars.length - 1
        ? randomBarHeight(60, 85)
        : randomBarHeight(35, 80);

      bar.style.height = next + '%';
    });
  }, 3200);
}
const respEl = document.getElementById('resp-num');

if (respEl) {
  setInterval(() => {
    const next = [9, 10, 11, 12][Math.floor(Math.random() * 4)];
    respEl.textContent = next;
  }, 3200);
}
const arc = document.getElementById('score-arc');
const scoreEl = document.getElementById('score-num');
const CIRCUMFERENCE = 126;

function updateScore(score) {
  if (arc) {
    const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
    arc.style.strokeDashoffset = offset;
  }
  if (scoreEl) scoreEl.textContent = score;
}

setInterval(() => {
  const nextScore = [92, 93, 94, 95][Math.floor(Math.random() * 4)];
  updateScore(nextScore);
}, 5000);











document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
 
  /* Header */
  gsap.from('.sec-header > *', {
    opacity: 0, y: 22, duration: .65, stagger: .12, ease: 'power3.out',
    scrollTrigger: { trigger: '.sec-header', start: 'top 85%', once: true }
  });
 
  /* Cards stagger in */
  gsap.utils.toArray('.pcard').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1, y: 0, duration: .7, ease: 'power3.out',
      delay: (i % 4) * 0.10,
      scrollTrigger: { trigger: card, start: 'top 88%', once: true,
        onEnter: () => {
          /* Trigger card-specific animations */
          if (i === 0) animTickets();
          if (i === 1) animThreats();
        }
      }
    });
  });
 
  /* CTA */
  gsap.from('.sec-cta > *', {
    opacity: 0, y: 14, duration: .55, stagger: .10, ease: 'power2.out',
    scrollTrigger: { trigger: '.sec-cta', start: 'top 92%', once: true }
  });
 
  /* Ticket rows slide in */
  function animTickets() {
    document.querySelectorAll('.tq-row').forEach(row => {
      const d = parseInt(row.dataset.d || 0);
      setTimeout(() => row.classList.add('show'), 300 + d);
    });
  }
 
  /* Threat bars grow */
  function animThreats() {
    document.querySelectorAll('.threat-bar-fill').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 400);
    });
  }
});