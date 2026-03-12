import { useEffect, useRef, useState, useCallback } from "react";

/* ── Particle Canvas ── */
function ParticleCanvas() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });
    const animRef = useRef(null);
    const particlesRef = useRef([]);

    const init = useCallback((canvas) => {
        const particles = [];
        for (let i = 0; i < 110; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.55,
                vy: (Math.random() - 0.5) * 0.55,
                r: Math.random() * 2 + 1,
                a: Math.random() * 0.45 + 0.18,
            });
        }
        particlesRef.current = particles;
    }, []);

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
            const { width: W, height: H } = canvas;
            ctx.clearRect(0, 0, W, H);
            const ps = particlesRef.current;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (let i = 0; i < ps.length; i++) {
                for (let j = i + 1; j < ps.length; j++) {
                    const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59,130,246,${0.13 * (1 - d / 130)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(ps[i].x, ps[i].y);
                        ctx.lineTo(ps[j].x, ps[j].y);
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
                        ctx.moveTo(ps[i].x, ps[i].y);
                        ctx.lineTo(mx, my);
                        ctx.stroke();
                    }
                }
            }

            for (const p of ps) {
                if (mx !== null) {
                    const dx = p.x - mx, dy = p.y - my;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 110) {
                        const f = (110 - d) / 110;
                        p.vx += (dx / d) * f * 0.28;
                        p.vy += (dy / d) * f * 0.28;
                    }
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

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [init]);

    const handleMouseMove = (e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => { mouseRef.current = { x: null, y: null }; };

    return (
        <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
    );
}

/* ── Float Card ── */
function FloatCard({ style, label, children }) {
    return (
        <div style={{
            position: "absolute", zIndex: 10,
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(147,197,253,0.5)",
            borderRadius: 14, padding: "12px 18px",
            boxShadow: "0 8px 32px rgba(59,130,246,0.12)",
            backdropFilter: "blur(10px)",
            fontFamily: "'DM Sans', sans-serif",
            ...style,
        }}>
            <div style={{ fontSize: "0.68rem", color: "#6b8cbf", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#1e3a8a" }}>{children}</div>
        </div>
    );
}

/* ── Main Component ── */
export default function HeroSection() {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
    }, []);

    const navLinks = ["Home", "About Us", "Services", "Projects", "Brands", "Blog", "Contact"];

    const fadeUp = (delay) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    });

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#eff6ff", minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .nav-link{color:#1e40af;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:400;letter-spacing:.07em;text-transform:uppercase;position:relative;padding-bottom:4px;transition:color .2s}
        .nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#3b82f6;transition:width .3s}
        .nav-link:hover{color:#3b82f6}.nav-link:hover::after{width:100%}
        .btn-ghost{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.85rem;color:#1e40af;letter-spacing:.07em;text-transform:uppercase;transition:color .2s}
        .btn-ghost:hover{color:#3b82f6}
        .btn-header{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;cursor:pointer;padding:10px 26px;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:transform .2s,box-shadow .2s}
        .btn-header:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(59,130,246,.45)}
        .btn-cta-primary{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;cursor:pointer;padding:15px 40px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));transition:transform .2s,box-shadow .2s}
        .btn-cta-primary:hover{transform:translateY(-3px);box-shadow:0 14px 44px rgba(59,130,246,.5)}
        .btn-cta-secondary{background:transparent;color:#1d4ed8;border:1.5px solid #93c5fd;cursor:pointer;padding:14px 40px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:400;letter-spacing:.08em;text-transform:uppercase;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));transition:all .3s}
        .btn-cta-secondary:hover{background:rgba(59,130,246,.08);border-color:#3b82f6;box-shadow:0 8px 28px rgba(59,130,246,.15)}
        .stat-card{background:rgba(255,255,255,.65);border:1px solid rgba(147,197,253,.4);backdrop-filter:blur(12px);padding:20px 30px;text-align:center;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:transform .3s,box-shadow .3s,background .3s;cursor:default}
        .stat-card:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(59,130,246,.18);background:rgba(255,255,255,.9)}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:#3b82f6;animation:pulse 2s ease-in-out infinite;display:inline-block}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
        .shimmer-text{background:linear-gradient(90deg,#1e3a8a 20%,#60a5fa 50%,#1e3a8a 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .float1{animation:float1 5s ease-in-out infinite}
        .float2{animation:float2 6s ease-in-out infinite}
        .float3{animation:float1 7s ease-in-out 1s infinite}
        @keyframes float1{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-14px) rotate(-2deg)}}
        @keyframes float2{0%,100%{transform:translateY(0) rotate(3deg)}50%{transform:translateY(-10px) rotate(3deg)}}
        .scroll-hint{animation:fadeUp .8s 1.4s both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

            {/* ── HEADER ── */}
            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                padding: scrolled ? "12px 56px" : "20px 56px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: scrolled ? "rgba(240,247,255,0.92)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(147,197,253,0.3)" : "1px solid transparent",
                transition: "all 0.4s ease",
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                        src="https://www.3rdeyess.com/img/logo-white.png"
                        alt="logo"
                        style={{ height: "40px" }}
                    />
                </div>

                {/* Nav */}
                <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
                    {navLinks.map(l => <a key={l} href="#" className="nav-link">{l}</a>)}
                </nav>

                {/* Right */}
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    {/* <button className="btn-ghost">Sign in</button> */}
                    <button className="btn-header">Get Started</button>
                </div>
            </header>

            {/* ── HERO ── */}
            <section style={{
                position: "relative", minHeight: "100vh",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                background: "linear-gradient(155deg,#eff6ff 0%,#dbeafe 45%,#bfdbfe 80%,#e0f2fe 100%)",
            }}>
                <ParticleCanvas />

                {/* Orbs */}
                {[
                    { top: "-10%", left: "-5%", size: 600, color: "rgba(59,130,246,0.1)" },
                    { bottom: "-15%", right: "-8%", size: 700, color: "rgba(147,197,253,0.18)" },
                ].map((o, i) => (
                    <div key={i} style={{
                        position: "absolute", borderRadius: "50%", pointerEvents: "none",
                        width: o.size, height: o.size,
                        top: o.top, left: o.left, bottom: o.bottom, right: o.right,
                        background: `radial-gradient(circle,${o.color} 0%,transparent 70%)`,
                    }} />
                ))}

                {/* Floating cards */}
                <FloatCard label="Workflow" style={{ left: "5%", top: "38%" }} >
                    <span className="float1" style={{ display: "inline-block" }}>✦ Automated</span>
                </FloatCard>

                <FloatCard label="Performance" style={{ right: "5%", top: "30%" }}>
                    <span className="float2" style={{ display: "inline-block" }}>
                        <span style={{ display: "inline-block", width: 64, height: 4, background: "#dbeafe", borderRadius: 2, verticalAlign: "middle", marginRight: 8, overflow: "hidden" }}>
                            <span style={{ display: "block", width: "87%", height: "100%", background: "linear-gradient(90deg,#3b82f6,#60a5fa)", borderRadius: 2 }} />
                        </span>
                        87%
                    </span>
                </FloatCard>

                <FloatCard label="Deploy" style={{ right: "7%", bottom: "20%" }}>
                    <span className="float3" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✦</span>
                        Live 2s ago
                    </span>
                </FloatCard>

                {/* Main content */}
                <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 820, padding: "120px 24px 60px" }}>

                    {/* Badge */}
                    <div style={{ marginBottom: 28, ...fadeUp(0.1) }}>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
                            color: "#1d4ed8", padding: "6px 18px", borderRadius: 100,
                            fontSize: ".75rem", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase",
                        }}>
                            <span className="badge-dot" />
                            Now in Public Beta
                        </span>
                    </div>

                    {/* Headline */}
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 300, lineHeight: 1.05, color: "#1e3a8a", letterSpacing: "-.01em", ...fadeUp(0.2) }}>
                        Advaced Security                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 24, whiteSpace: "nowrap", ...fadeUp(0.3) }}>
                        <span className="shimmer-text">Solar & Smart Solutions</span>
                    </div>

                    {/* Subtext */}
                    <p style={{ fontSize: "1.05rem", fontWeight: 300, color: "#3b5ea6", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px", ...fadeUp(0.4) }}>
                        Smart Surveillance & Reliable Solar Power<br />
                        Secure your space and energize your future.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60, ...fadeUp(0.5) }}>
                        <button className="btn-cta-primary">Get Free site survey</button>
                        <button className="btn-cta-secondary">Whatsapp →</button>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", ...fadeUp(0.65) }}>
                        {[{ val: "50K+", label: "Active Teams" }, { val: "99.9%", label: "Uptime SLA" }, { val: "4.9★", label: "User Rating" }].map(s => (
                            <div key={s.val} className="stat-card">
                                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.1rem", fontWeight: 600, color: "#1d4ed8", lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
                                <div style={{ fontSize: ".72rem", color: "#6b8cbf", letterSpacing: ".1em", textTransform: "uppercase" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="scroll-hint" style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.45 }}>
                    <span style={{ fontSize: ".68rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#3b82f6" }}>Scroll</span>
                    <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,#3b82f6,transparent)" }} />
                </div>
            </section>
        </div>
    );
}