import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────
   useWindowSize hook
───────────────────────────────────────── */
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

/* ─────────────────────────────────────────
   Particle Canvas
───────────────────────────────────────── */
function ParticleCanvas({ count = 110 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const init = useCallback((canvas) => {
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 2 + 1,
      a: Math.random() * 0.45 + 0.18,
    }));
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init(canvas);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const ps = particlesRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${0.13 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
        if (mx !== null) {
          const dx = ps[i].x - mx, dy = ps[i].y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 170) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(96,165,250,${0.4 * (1 - d / 170)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }

      for (const p of ps) {
        if (mx !== null) {
          const dx = p.x - mx, dy = p.y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) { const f = (110 - d) / 110; p.vx += (dx / d) * f * 0.28; p.vy += (dy / d) * f * 0.28; }
        }
        p.vx *= 0.979; p.vy *= 0.979;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        g.addColorStop(0, `rgba(147,210,255,${p.a + 0.15})`);
        g.addColorStop(1, "rgba(59,130,246,0)");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,235,255,${p.a + 0.25})`; ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [init]);

  const onMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const src = e.touches ? e.touches[0] : e;
      mouseRef.current = { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }
  };
  const onLeave = () => { mouseRef.current = { x: null, y: null }; };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMove} onMouseLeave={onLeave}
      onTouchMove={onMove} onTouchEnd={onLeave}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

/* ─────────────────────────────────────────
   FloatCard
───────────────────────────────────────── */
function FloatCard({ label, animClass, style, children }) {
  return (
    <div className={`float-card ${animClass}`} style={style}>
      <div className="fc-label">{label}</div>
      <div className="fc-val">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function HeroSection() {
  const { width } = useWindowSize();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isLarge = width >= 1440;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Close menu on resize to desktop
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  const navLinks = ["Features", "Solutions", "Pricing", "About"];

  const fadeUp = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const headerPad = isMobile ? "14px 20px" : isTablet ? "16px 32px" : scrolled ? "12px 56px" : "20px 56px";

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#eff6ff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        .nav-link { color:#1e40af; text-decoration:none; font-family:'DM Sans',sans-serif; font-size:.85rem; font-weight:400; letter-spacing:.07em; text-transform:uppercase; position:relative; padding-bottom:4px; transition:color .2s; white-space:nowrap; }
        .nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:#3b82f6; transition:width .3s; }
        .nav-link:hover { color:#3b82f6; }
        .nav-link:hover::after { width:100%; }

        .mobile-nav-link { display:block; color:#1e40af; text-decoration:none; font-family:'DM Sans',sans-serif; font-size:1.1rem; font-weight:400; letter-spacing:.07em; text-transform:uppercase; padding:14px 0; border-bottom:1px solid rgba(147,197,253,0.3); transition:color .2s; }
        .mobile-nav-link:hover { color:#3b82f6; }

        .btn-ghost { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:.85rem; color:#1e40af; letter-spacing:.07em; text-transform:uppercase; transition:color .2s; white-space:nowrap; }
        .btn-ghost:hover { color:#3b82f6; }

        .btn-header { background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; border:none; cursor:pointer; padding:10px 22px; font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:500; letter-spacing:.08em; text-transform:uppercase; clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px)); transition:transform .2s,box-shadow .2s; white-space:nowrap; }
        .btn-header:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(59,130,246,.45); }

        .btn-cta-primary { background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:500; letter-spacing:.08em; text-transform:uppercase; clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px)); transition:transform .2s,box-shadow .2s; }
        .btn-cta-primary:hover { transform:translateY(-3px); box-shadow:0 14px 44px rgba(59,130,246,.5); }

        .btn-cta-secondary { background:transparent; color:#1d4ed8; border:1.5px solid #93c5fd; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:400; letter-spacing:.08em; text-transform:uppercase; clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px)); transition:all .3s; }
        .btn-cta-secondary:hover { background:rgba(59,130,246,.08); border-color:#3b82f6; box-shadow:0 8px 28px rgba(59,130,246,.15); }

        .stat-card { background:rgba(255,255,255,.65); border:1px solid rgba(147,197,253,.4); backdrop-filter:blur(12px); text-align:center; clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px)); transition:transform .3s,box-shadow .3s,background .3s; cursor:default; }
        .stat-card:hover { transform:translateY(-5px); box-shadow:0 20px 44px rgba(59,130,246,.18); background:rgba(255,255,255,.9); }

        .float-card { position:absolute; z-index:10; background:rgba(255,255,255,0.82); border:1px solid rgba(147,197,253,0.5); border-radius:14px; padding:12px 18px; box-shadow:0 8px 32px rgba(59,130,246,0.12); backdrop-filter:blur(10px); font-family:'DM Sans',sans-serif; }
        .fc-label { font-size:.68rem; color:#6b8cbf; letter-spacing:.1em; text-transform:uppercase; margin-bottom:4px; }
        .fc-val { font-size:.9rem; font-weight:500; color:#1e3a8a; }

        .badge-dot { width:6px; height:6px; border-radius:50%; background:#3b82f6; animation:pulse 2s ease-in-out infinite; display:inline-block; }
        .shimmer-text { background:linear-gradient(90deg,#1e3a8a 20%,#60a5fa 50%,#1e3a8a 80%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 4s linear infinite; }

        .float1 { animation: float1 5s ease-in-out infinite; }
        .float2 { animation: float2 6s ease-in-out infinite; }
        .float3 { animation: float1 7s ease-in-out 1s infinite; }

        .hamburger { background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:4px; z-index:200; }
        .hamburger span { display:block; width:22px; height:1.5px; background:#1d4ed8; transition:all .3s; }
        .hamburger.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity:0; }
        .hamburger.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

        .mobile-menu { position:fixed; top:0; left:0; right:0; bottom:0; z-index:150; background:rgba(240,247,255,0.97); backdrop-filter:blur(20px); display:flex; flex-direction:column; justify-content:center; padding:60px 32px 40px; transform:translateX(100%); transition:transform .35s cubic-bezier(.4,0,.2,1); }
        .mobile-menu.open { transform:translateX(0); }

        .scroll-anim { animation:fadeUp .8s 1.4s both; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(-2deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        @media (max-width: 767px) {
          .float-card { display:none; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .float-card { transform:scale(0.88); }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: headerPad,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled || menuOpen ? "rgba(240,247,255,0.95)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(147,197,253,0.3)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 200 }}>
          <div style={{ width: isMobile ? 28 : 34, height: isMobile ? 28 : 34, background: "linear-gradient(135deg,#1d4ed8,#60a5fa)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? "1.3rem" : "1.6rem", fontWeight: 600, color: "#1e3a8a", letterSpacing: ".02em" }}>Luminary</span>
        </div>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", gap: isTablet ? 24 : 36, alignItems: "center" }}>
            {navLinks.map(l => <a key={l} href="#" className="nav-link">{l}</a>)}
          </nav>
        )}

        {/* Desktop Right */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {!isTablet && <button className="btn-ghost">Sign in</button>}
            <button className="btn-header">Get Started</button>
          </div>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        )}
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav style={{ marginBottom: 40 }}>
          {navLinks.map(l => (
            <a key={l} href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
        </nav>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-cta-primary" style={{ padding: "15px 0", fontSize: ".9rem", width: "100%" }}>Start Building Free</button>
          <button className="btn-cta-secondary" style={{ padding: "14px 0", fontSize: ".9rem", width: "100%" }}>Sign In</button>
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(155deg,#eff6ff 0%,#dbeafe 45%,#bfdbfe 80%,#e0f2fe 100%)",
      }}>
        <ParticleCanvas count={isMobile ? 60 : isTablet ? 80 : 110} />

        {/* Orbs */}
        <div style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", width: isMobile ? 300 : 600, height: isMobile ? 300 : 600, top: "-10%", left: "-5%", background: "radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", width: isMobile ? 350 : 700, height: isMobile ? 350 : 700, bottom: "-15%", right: "-8%", background: "radial-gradient(circle,rgba(147,197,253,0.18) 0%,transparent 70%)" }} />

        {/* Floating Cards — hidden on mobile via CSS */}
        <FloatCard label="Workflow" animClass="float1" style={{ left: isTablet ? "2%" : "5%", top: isTablet ? "32%" : "38%" }}>
          ✦ Automated
        </FloatCard>
        <FloatCard label="Performance" animClass="float2" style={{ right: isTablet ? "2%" : "5%", top: isTablet ? "24%" : "30%" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 64, height: 4, background: "#dbeafe", borderRadius: 2, overflow: "hidden" }}>
              <span style={{ display: "block", width: "87%", height: "100%", background: "linear-gradient(90deg,#3b82f6,#60a5fa)", borderRadius: 2 }} />
            </span>
            87%
          </span>
        </FloatCard>
        <FloatCard label="Deploy" animClass="float3" style={{ right: isTablet ? "2%" : "7%", bottom: isTablet ? "14%" : "20%" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✦</span>
            Live 2s ago
          </span>
        </FloatCard>

        {/* Main Content */}
        <div style={{
          position: "relative", zIndex: 10, textAlign: "center",
          maxWidth: isLarge ? 960 : 820,
          width: "100%",
          padding: isMobile ? "100px 20px 60px" : isTablet ? "110px 40px 60px" : "120px 24px 60px",
        }}>
          {/* Badge */}
          <div style={{ marginBottom: isMobile ? 20 : 28, ...fadeUp(0.1) }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
              color: "#1d4ed8", padding: "6px 18px", borderRadius: 100,
              fontSize: ".75rem", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase",
            }}>
              <span className="badge-dot" /> Now in Public Beta
            </span>
          </div>

          {/* Headline */}
          <div style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: isMobile ? "2.8rem" : isTablet ? "4rem" : isLarge ? "6.5rem" : "5.5rem",
            fontWeight: 300, lineHeight: 1.05, color: "#1e3a8a", letterSpacing: "-.01em",
            ...fadeUp(0.2)
          }}>Design the Future</div>
          <div style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: isMobile ? "2.8rem" : isTablet ? "4rem" : isLarge ? "6.5rem" : "5.5rem",
            fontWeight: 600, lineHeight: 1.05, letterSpacing: "-.01em",
            marginBottom: isMobile ? 18 : 24,
            ...fadeUp(0.3)
          }}>
            <span className="shimmer-text">with Precision</span>
          </div>

          {/* Sub */}
          <p style={{
            fontSize: isMobile ? ".95rem" : isTablet ? "1rem" : "1.05rem",
            fontWeight: 300, color: "#3b5ea6", lineHeight: 1.8,
            maxWidth: isMobile ? "100%" : 560, margin: "0 auto",
            marginBottom: isMobile ? 32 : 40,
            ...fadeUp(0.4)
          }}>
            An intelligent platform that transforms how your team collaborates,
            creates, and ships extraordinary digital experiences at scale.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 16,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isMobile ? 40 : 60,
            ...fadeUp(0.5)
          }}>
            <button className="btn-cta-primary" style={{
              padding: isMobile ? "14px 0" : "15px 40px",
              fontSize: isMobile ? ".88rem" : ".9rem",
              width: isMobile ? "100%" : "auto",
            }}>Start Building Free</button>
            <button className="btn-cta-secondary" style={{
              padding: isMobile ? "13px 0" : "14px 40px",
              fontSize: isMobile ? ".88rem" : ".9rem",
              width: isMobile ? "100%" : "auto",
            }}>Watch Demo →</button>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "row",
            flexWrap: "wrap",
            gap: isMobile ? 10 : 16,
            justifyContent: "center",
            ...fadeUp(0.65)
          }}>
            {[{ val: "50K+", label: "Active Teams" }, { val: "99.9%", label: "Uptime SLA" }, { val: "4.9★", label: "User Rating" }].map(s => (
              <div key={s.val} className="stat-card" style={{
                padding: isMobile ? "14px 18px" : isLarge ? "24px 40px" : "20px 30px",
                flex: isMobile ? "1 1 calc(33% - 10px)" : "0 0 auto",
                minWidth: isMobile ? 80 : 120,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? "1.5rem" : isLarge ? "2.5rem" : "2.1rem", fontWeight: 600, color: "#1d4ed8", lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: isMobile ? ".62rem" : ".72rem", color: "#6b8cbf", letterSpacing: ".1em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        {!isMobile && (
          <div className="scroll-anim" style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.45 }}>
            <span style={{ fontSize: ".68rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#3b82f6" }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,#3b82f6,transparent)" }} />
          </div>
        )}
      </section>
    </div>
  );
}