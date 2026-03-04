import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0C0F1A",
  surface: "#141829",
  surfaceLight: "#1C2038",
  accent: "#C8A96E",
  accentMuted: "rgba(200,169,110,0.15)",
  accentGlow: "rgba(200,169,110,0.3)",
  text: "#E8E4DD",
  textMuted: "#8B8998",
  blue: "#5B8AF5",
  blueMuted: "rgba(91,138,245,0.15)",
  emerald: "#4ECDA4",
  emeraldMuted: "rgba(78,205,164,0.15)",
  coral: "#E8735A",
  coralMuted: "rgba(232,115,90,0.15)",
  white: "#FFFFFF",
};

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
`;

function AnimatedNumber({ value, suffix = "", prefix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display}{suffix}</span>;
}

function NodeGraph({ variant, seed }) {
  const nodes = [];
  const edges = [];
  const rng = (i) => {
    let x = Math.sin(seed * 1000 + i * 137.5) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 8; i++) {
    nodes.push({
      x: 30 + rng(i * 3) * 240,
      y: 20 + rng(i * 3 + 1) * 140,
      r: 3 + rng(i * 3 + 2) * 5,
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (rng(i * 10 + j) > 0.55) {
        edges.push({ from: i, to: j });
      }
    }
  }

  const color = variant === "A" ? COLORS.blue : COLORS.emerald;
  const colorMuted = variant === "A" ? "rgba(91,138,245,0.2)" : "rgba(78,205,164,0.2)";

  return (
    <svg width="300" height="180" viewBox="0 0 300 180" style={{ overflow: "visible" }}>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={nodes[e.from].x}
          y1={nodes[e.from].y}
          x2={nodes[e.to].x}
          y2={nodes[e.to].y}
          stroke={colorMuted}
          strokeWidth="1"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 4} fill={colorMuted} />
          <circle cx={n.x} cy={n.y} r={n.r} fill={color} opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

function ProbabilityWave() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setOffset((o) => o + 0.03), 40);
    return () => clearInterval(timer);
  }, []);

  const points = [];
  for (let x = 0; x <= 400; x += 2) {
    const y = 50 + Math.sin(x * 0.025 + offset) * 20 + Math.sin(x * 0.04 + offset * 1.5) * 10;
    points.push(`${x},${y}`);
  }

  const points2 = [];
  for (let x = 0; x <= 400; x += 2) {
    const y = 50 + Math.sin(x * 0.03 + offset + 1) * 18 + Math.cos(x * 0.02 + offset * 0.8) * 12;
    points2.push(`${x},${y}`);
  }

  return (
    <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.blue} stopOpacity="0" />
          <stop offset="30%" stopColor={COLORS.blue} stopOpacity="0.5" />
          <stop offset="70%" stopColor={COLORS.emerald} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.emerald} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0" />
          <stop offset="40%" stopColor={COLORS.accent} stopOpacity="0.3" />
          <stop offset="60%" stopColor={COLORS.coral} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.coral} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points.join(" ")} fill="none" stroke="url(#waveGrad1)" strokeWidth="2" />
      <polyline points={points2.join(" ")} fill="none" stroke="url(#waveGrad2)" strokeWidth="1.5" />
    </svg>
  );
}

const sections = [
  {
    id: "experiment",
    title: "The Oxford Experiment",
    subtitle: "A thought exercise for leadership",
  },
  {
    id: "reveal",
    title: "The Honest Answer",
    subtitle: "What every seasoned leader knows",
  },
  {
    id: "parallel",
    title: "Now Replace Interns with AI",
    subtitle: "The exact same principle applies",
  },
  {
    id: "why",
    title: "Why This Is a Feature",
    subtitle: "Not a flaw",
  },
  {
    id: "value",
    title: "The Strategic Advantage",
    subtitle: "What probabilistic AI unlocks",
  },
  {
    id: "dashboard",
    title: "The Dashboard Story",
    subtitle: "From weeks of waiting to seconds of insight",
  },
];

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [showInsights, setShowInsights] = useState([false, false, false]);
  const [animateIn, setAnimateIn] = useState(true);
  const [dashStep, setDashStep] = useState(0);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, [activeSection]);

  const toggleInsight = (i) => {
    setShowInsights((prev) => {
      const n = [...prev];
      n[i] = !n[i];
      return n;
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <div style={{ animation: animateIn ? "fadeUp 0.6s ease forwards" : "none", opacity: animateIn ? 1 : 0 }}>
            <div style={{
              display: "flex", gap: "16px", marginBottom: "40px", flexWrap: "wrap",
              justifyContent: "center",
            }}>
              {[
                { icon: "🎓", label: "Same University", sub: "Oxford" },
                { icon: "📚", label: "Same Degree", sub: "BA + MSc" },
                { icon: "📋", label: "Same Brief", sub: "Variance Analysis" },
                { icon: "📊", label: "Same Data", sub: "Identical Dataset" },
                { icon: "⏱", label: "Same Time", sub: "2 Days" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.accentMuted}`,
                  borderRadius: "12px",
                  padding: "20px 24px",
                  textAlign: "center",
                  minWidth: "130px",
                  flex: "1",
                  animation: animateIn ? `fadeUp 0.5s ease ${i * 0.1}s forwards` : "none",
                  opacity: animateIn ? 0 : 1,
                  animationFillMode: "forwards",
                }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "13px", color: COLORS.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>{item.label}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: COLORS.textMuted, marginTop: "4px" }}>{item.sub}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${COLORS.surfaceLight}, ${COLORS.surface})`,
              borderRadius: "16px",
              padding: "40px",
              border: `1px solid rgba(200,169,110,0.1)`,
              textAlign: "center",
            }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: COLORS.blueMuted, border: `2px solid ${COLORS.blue}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "40px", margin: "0 auto 12px",
                  }}>👤</div>
                  <div style={{ fontFamily: "'Playfair Display'", fontSize: "18px", color: COLORS.text }}>Intern A</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "11px", color: COLORS.blue, marginTop: "4px" }}>Oxford MSc '25</div>
                </div>

                <div style={{ fontFamily: "'Playfair Display'", fontSize: "42px", color: COLORS.accent, fontWeight: 300 }}>vs</div>

                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: COLORS.emeraldMuted, border: `2px solid ${COLORS.emerald}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "40px", margin: "0 auto 12px",
                  }}>👤</div>
                  <div style={{ fontFamily: "'Playfair Display'", fontSize: "18px", color: COLORS.text }}>Intern B</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "11px", color: COLORS.emerald, marginTop: "4px" }}>Oxford MSc '25</div>
                </div>
              </div>

              <div style={{
                marginTop: "36px", padding: "20px 28px",
                background: COLORS.accentMuted, borderRadius: "10px",
                border: `1px solid ${COLORS.accentGlow}`,
              }}>
                <p style={{ fontFamily: "'Playfair Display'", fontSize: "20px", fontStyle: "italic", color: COLORS.accent, margin: 0, lineHeight: 1.6 }}>
                  "Would you expect both interns to produce 100% identical analysis and output?"
                </p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div style={{ animation: animateIn ? "fadeUp 0.6s ease forwards" : "none", opacity: animateIn ? 1 : 0 }}>
            {!revealAnswer ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ fontFamily: "'DM Sans'", fontSize: "18px", color: COLORS.textMuted, marginBottom: "40px", lineHeight: 1.7 }}>
                  Every experienced leader already knows the answer.
                </p>
                <button
                  onClick={() => setRevealAnswer(true)}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.accent}, #A8884E)`,
                    border: "none", borderRadius: "50px", padding: "18px 48px",
                    fontFamily: "'DM Sans'", fontSize: "16px", fontWeight: 600,
                    color: COLORS.bg, cursor: "pointer", letterSpacing: "0.03em",
                    boxShadow: `0 8px 32px ${COLORS.accentGlow}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 40px ${COLORS.accentGlow}`; }}
                  onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 8px 32px ${COLORS.accentGlow}`; }}
                >
                  Reveal the Answer
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  textAlign: "center", marginBottom: "40px",
                  animation: "fadeUp 0.5s ease forwards",
                }}>
                  <div style={{
                    fontFamily: "'Playfair Display'", fontSize: "64px", fontWeight: 700,
                    background: `linear-gradient(135deg, ${COLORS.coral}, ${COLORS.accent})`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    marginBottom: "12px",
                  }}>No.</div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: "18px", color: COLORS.textMuted, maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
                    Of course not. And no reasonable leader would expect them to.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div style={{
                    flex: 1, minWidth: "260px", background: COLORS.surface, borderRadius: "14px",
                    border: `1px solid rgba(91,138,245,0.2)`, padding: "28px",
                    animation: "fadeUp 0.5s ease 0.15s forwards", opacity: 0, animationFillMode: "forwards",
                  }}>
                    <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "14px", color: COLORS.blue, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Intern A's Approach</div>
                    <NodeGraph variant="A" seed={1} />
                    <ul style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: COLORS.textMuted, lineHeight: 2, paddingLeft: "18px", marginTop: "16px" }}>
                      <li>Starts with revenue breakdown</li>
                      <li>Uses waterfall charts</li>
                      <li>Focuses on cost-center gaps</li>
                      <li>Creates 12 slides</li>
                    </ul>
                  </div>

                  <div style={{
                    flex: 1, minWidth: "260px", background: COLORS.surface, borderRadius: "14px",
                    border: `1px solid rgba(78,205,164,0.2)`, padding: "28px",
                    animation: "fadeUp 0.5s ease 0.3s forwards", opacity: 0, animationFillMode: "forwards",
                  }}>
                    <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "14px", color: COLORS.emerald, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Intern B's Approach</div>
                    <NodeGraph variant="B" seed={2} />
                    <ul style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: COLORS.textMuted, lineHeight: 2, paddingLeft: "18px", marginTop: "16px" }}>
                      <li>Starts with margin analysis</li>
                      <li>Uses heat maps</li>
                      <li>Focuses on seasonal patterns</li>
                      <li>Creates 8 detailed slides</li>
                    </ul>
                  </div>
                </div>

                <div style={{
                  marginTop: "28px", textAlign: "center", padding: "20px",
                  background: COLORS.accentMuted, borderRadius: "10px",
                  border: `1px solid ${COLORS.accentGlow}`,
                  animation: "fadeUp 0.5s ease 0.45s forwards", opacity: 0, animationFillMode: "forwards",
                }}>
                  <p style={{ fontFamily: "'Playfair Display'", fontStyle: "italic", fontSize: "17px", color: COLORS.accent, margin: 0, lineHeight: 1.7 }}>
                    Same training. Same data. Same instructions. Different — yet both valuable — outputs.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ animation: animateIn ? "fadeUp 0.6s ease forwards" : "none", opacity: animateIn ? 1 : 0 }}>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "17px", color: COLORS.textMuted, maxWidth: "580px", margin: "0 auto", lineHeight: 1.8 }}>
                Generative AI works the same way. Same model, same prompt, same data — yet the output may vary each time. This isn't a bug.
              </p>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "20px",
              alignItems: "center", marginBottom: "36px",
            }}>
              <div style={{
                background: COLORS.surface, borderRadius: "14px", padding: "28px",
                border: `1px solid rgba(232,115,90,0.2)`, textAlign: "center",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "11px", color: COLORS.coral, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Deterministic</div>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔧</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: COLORS.textMuted, lineHeight: 1.7 }}>
                  Traditional software<br />
                  <span style={{ color: COLORS.text }}>1 + 1 = 2</span><br />
                  Always. Every time.
                </div>
                <div style={{
                  marginTop: "16px", fontFamily: "'JetBrains Mono'", fontSize: "12px",
                  background: COLORS.coralMuted, padding: "10px 16px", borderRadius: "8px",
                  color: COLORS.coral,
                }}>
                  Input → Fixed Output
                </div>
              </div>

              <div style={{ fontFamily: "'Playfair Display'", fontSize: "28px", color: COLORS.textMuted }}>≠</div>

              <div style={{
                background: COLORS.surface, borderRadius: "14px", padding: "28px",
                border: `1px solid rgba(200,169,110,0.2)`, textAlign: "center",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "11px", color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Probabilistic</div>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🧠</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: COLORS.textMuted, lineHeight: 1.7 }}>
                  Generative AI<br />
                  <span style={{ color: COLORS.text }}>Reasons, explores, discovers</span><br />
                  Like a brilliant mind.
                </div>
                <div style={{
                  marginTop: "16px", fontFamily: "'JetBrains Mono'", fontSize: "12px",
                  background: COLORS.accentMuted, padding: "10px 16px", borderRadius: "8px",
                  color: COLORS.accent,
                }}>
                  Input → Rich Possibilities
                </div>
              </div>
            </div>

            <ProbabilityWave />

            <div style={{
              marginTop: "20px", textAlign: "center", padding: "20px",
              background: COLORS.accentMuted, borderRadius: "10px",
              border: `1px solid ${COLORS.accentGlow}`,
            }}>
              <p style={{ fontFamily: "'Playfair Display'", fontStyle: "italic", fontSize: "17px", color: COLORS.accent, margin: 0, lineHeight: 1.7 }}>
                GenAI is probabilistic, not deterministic — and that is its power.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ animation: animateIn ? "fadeUp 0.6s ease forwards" : "none", opacity: animateIn ? 1 : 0 }}>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "17px", color: COLORS.textMuted, maxWidth: "560px", margin: "0 auto", lineHeight: 1.8 }}>
                If you wanted a calculator, you'd use a spreadsheet. You chose AI because you wanted intelligence — and intelligence is inherently creative.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                {
                  q: "Why doesn't it give the same answer twice?",
                  a: "Because neither would two Oxford graduates. Variability in intelligent analysis is a sign of depth, not a defect. Each run can surface different valid perspectives.",
                  color: COLORS.blue,
                },
                {
                  q: "Doesn't that make it unreliable?",
                  a: "A calculator is reliable. An analyst is valuable. GenAI is the analyst — it brings judgment, pattern recognition, and creative problem-solving to your data.",
                  color: COLORS.emerald,
                },
                {
                  q: "How should we think about it instead?",
                  a: "Think of each AI run as a fresh expert perspective. Run it three times and you don't get errors — you get a richer, multi-angle understanding of your data.",
                  color: COLORS.accent,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleInsight(i)}
                  style={{
                    background: COLORS.surface, borderRadius: "14px",
                    border: `1px solid ${showInsights[i] ? item.color + "44" : "rgba(255,255,255,0.05)"}`,
                    padding: "24px 28px", cursor: "pointer",
                    transition: "all 0.3s ease",
                    animation: `fadeUp 0.5s ease ${i * 0.12}s forwards`, opacity: 0, animationFillMode: "forwards",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display'", fontSize: "17px", color: COLORS.text }}>{item.q}</div>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: showInsights[i] ? item.color + "22" : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", color: item.color, transition: "all 0.3s",
                      transform: showInsights[i] ? "rotate(45deg)" : "rotate(0)",
                      flexShrink: 0,
                    }}>+</div>
                  </div>
                  {showInsights[i] && (
                    <div style={{
                      marginTop: "16px", paddingTop: "16px",
                      borderTop: `1px solid rgba(255,255,255,0.05)`,
                      animation: "fadeUp 0.3s ease forwards",
                    }}>
                      <p style={{ fontFamily: "'DM Sans'", fontSize: "15px", color: COLORS.textMuted, margin: 0, lineHeight: 1.8 }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ animation: animateIn ? "fadeUp 0.6s ease forwards" : "none", opacity: animateIn ? 1 : 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "36px" }}>
              {[
                {
                  icon: "🔍",
                  title: "Uncover Hidden Trends",
                  desc: "AI explores analytical paths you wouldn't think to take — surfacing patterns invisible to conventional analysis.",
                  metric: "73",
                  metricLabel: "% of CFOs report AI found insights they missed",
                  color: COLORS.blue,
                },
                {
                  icon: "🌐",
                  title: "Multi-Angle Perspective",
                  desc: "Each run is a fresh lens on your data. Multiple perspectives mean more robust decision-making.",
                  metric: "3×",
                  metricLabel: "richer insight coverage vs. single analysis",
                  color: COLORS.emerald,
                },
                {
                  icon: "⚡",
                  title: "Speed of Exploration",
                  desc: "What takes an analyst days, AI does in seconds — and then does again from a different angle.",
                  metric: "40",
                  metricLabel: "hours saved per variance cycle",
                  color: COLORS.accent,
                },
              ].map((item, i) => (
                <div key={i} style={{
                  background: COLORS.surface, borderRadius: "14px", padding: "28px",
                  border: `1px solid ${item.color}22`,
                  animation: `fadeUp 0.5s ease ${i * 0.12}s forwards`, opacity: 0, animationFillMode: "forwards",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>{item.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display'", fontSize: "18px", color: COLORS.text, marginBottom: "10px" }}>{item.title}</div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: COLORS.textMuted, lineHeight: 1.7, marginBottom: "20px" }}>{item.desc}</p>
                  <div style={{
                    background: `${item.color}15`, borderRadius: "10px", padding: "16px", textAlign: "center",
                  }}>
                    <div style={{ fontFamily: "'Playfair Display'", fontSize: "32px", fontWeight: 700, color: item.color }}>{item.metric}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: "11px", color: COLORS.textMuted, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.metricLabel}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.emerald}10)`,
              borderRadius: "16px", padding: "36px", textAlign: "center",
              border: `1px solid ${COLORS.accentGlow}`,
            }}>
              <p style={{
                fontFamily: "'Playfair Display'", fontSize: "22px", fontWeight: 600,
                color: COLORS.accent, margin: "0 0 12px", lineHeight: 1.5,
              }}>
                The question isn't "why isn't it the same?"
              </p>
              <p style={{
                fontFamily: "'Playfair Display'", fontSize: "22px", fontWeight: 600,
                color: COLORS.emerald, margin: 0, lineHeight: 1.5,
              }}>
                It's "what did it find this time?"
              </p>
            </div>
          </div>
        );

      case 5:
        const oldTimeline = [
          { icon: "📋", label: "Request Submitted", who: "Finance Team", time: "Day 1", desc: "You submit a dashboard request to the BI team with your requirements and data sources." },
          { icon: "⏳", label: "Weeks of Waiting", who: "BI Team", time: "Week 2–6", desc: "The BI team queues your request, gathers requirements, builds ETL pipelines, designs the dashboard." },
          { icon: "📊", label: "Dashboard Delivered", who: "BI Team", time: "Week 7", desc: "You finally receive the dashboard. Time to validate." },
          { icon: "🔍", label: "First Audit Check", who: "You", time: "Week 7", desc: "You open your Excel: Revenue shows $10.56M. The dashboard says $10.41M. It doesn't tie." },
          { icon: "🔙", label: "Back to BI Team", who: "Finance → BI", time: "Week 8–9", desc: "You report the discrepancy. More weeks pass. They find a data pipeline error and push a fix." },
          { icon: "🔍", label: "Second Audit Check", who: "You", time: "Week 10", desc: "Revenue ties now. But GL #456 transaction doesn't match your SAP extract. Back to square one." },
          { icon: "🔄", label: "The Cycle Repeats", who: "Everyone", time: "Week 11+", desc: "Another round of back-and-forth. Weeks turn to months. Strategic decisions wait." },
        ];

        const newTimeline = [
          { icon: "🤖", label: "AI Builds Dashboard", time: "Seconds", desc: "You prompt AI with your data and requirements. A fully visual dashboard is generated instantly." },
          { icon: "🔍", label: "AI Audits Itself", time: "Seconds", desc: "You ask AI to cross-check: does the $10.56M in the dashboard match the source? It validates in real-time." },
          { icon: "✅", label: "Discrepancy? Fixed Live", time: "Minutes", desc: "If something doesn't tie, AI identifies the root cause and corrects it on the spot — no ticket, no queue." },
          { icon: "📖", label: "Financial Storytelling", time: "Now", desc: "With visuals ready, you focus on what matters: interpreting the numbers, telling the story, driving strategy." },
        ];

        return (
          <div style={{ animation: animateIn ? "fadeUp 0.6s ease forwards" : "none", opacity: animateIn ? 1 : 0 }}>
            {/* Toggle between old and new */}
            <div style={{
              display: "flex", justifyContent: "center", gap: "8px", marginBottom: "36px",
            }}>
              <button
                onClick={() => setDashStep(0)}
                style={{
                  background: dashStep === 0 ? COLORS.coralMuted : "transparent",
                  border: `1px solid ${dashStep === 0 ? COLORS.coral + "55" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px", padding: "14px 24px",
                  fontFamily: "'DM Sans'", fontSize: "14px", fontWeight: dashStep === 0 ? 600 : 400,
                  color: dashStep === 0 ? COLORS.coral : COLORS.textMuted,
                  cursor: "pointer", transition: "all 0.25s ease",
                }}
              >
                🏢 The Old Way
              </button>
              <button
                onClick={() => setDashStep(1)}
                style={{
                  background: dashStep === 1 ? COLORS.emeraldMuted : "transparent",
                  border: `1px solid ${dashStep === 1 ? COLORS.emerald + "55" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px", padding: "14px 24px",
                  fontFamily: "'DM Sans'", fontSize: "14px", fontWeight: dashStep === 1 ? 600 : 400,
                  color: dashStep === 1 ? COLORS.emerald : COLORS.textMuted,
                  cursor: "pointer", transition: "all 0.25s ease",
                }}
              >
                ⚡ The AI Way
              </button>
            </div>

            {dashStep === 0 ? (
              <div>
                <div style={{ position: "relative", paddingLeft: "32px" }}>
                  {/* Vertical line */}
                  <div style={{
                    position: "absolute", left: "11px", top: "8px", bottom: "8px",
                    width: "2px", background: `linear-gradient(to bottom, ${COLORS.coral}44, ${COLORS.coral}11)`,
                  }} />

                  {oldTimeline.map((step, i) => (
                    <div key={i} style={{
                      position: "relative", marginBottom: i < oldTimeline.length - 1 ? "8px" : 0,
                      animation: `fadeUp 0.4s ease ${i * 0.08}s forwards`, opacity: 0, animationFillMode: "forwards",
                    }}>
                      {/* Dot on timeline */}
                      <div style={{
                        position: "absolute", left: "-27px", top: "18px",
                        width: "14px", height: "14px", borderRadius: "50%",
                        background: i >= 3 ? COLORS.coral : COLORS.surfaceLight,
                        border: `2px solid ${i >= 3 ? COLORS.coral : COLORS.textMuted + "44"}`,
                        zIndex: 1,
                      }} />

                      <div style={{
                        background: COLORS.surface, borderRadius: "12px", padding: "18px 22px",
                        border: `1px solid ${i >= 3 ? COLORS.coral + "22" : "rgba(255,255,255,0.04)"}`,
                        display: "flex", gap: "14px", alignItems: "flex-start",
                      }}>
                        <div style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>{step.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                            <div style={{ fontFamily: "'Playfair Display'", fontSize: "16px", color: COLORS.text }}>{step.label}</div>
                            <div style={{
                              fontFamily: "'JetBrains Mono'", fontSize: "11px",
                              color: i >= 3 ? COLORS.coral : COLORS.textMuted,
                              background: i >= 3 ? COLORS.coralMuted : "rgba(255,255,255,0.04)",
                              padding: "3px 10px", borderRadius: "20px",
                            }}>{step.time}</div>
                          </div>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: COLORS.textMuted, marginBottom: "4px" }}>
                            <span style={{ color: COLORS.accent, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.who}</span>
                          </div>
                          <p style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total time callout */}
                <div style={{
                  marginTop: "24px", textAlign: "center", padding: "20px",
                  background: COLORS.coralMuted, borderRadius: "12px",
                  border: `1px solid ${COLORS.coral}33`,
                  animation: "fadeUp 0.4s ease 0.6s forwards", opacity: 0, animationFillMode: "forwards",
                }}>
                  <div style={{ fontFamily: "'Playfair Display'", fontSize: "36px", fontWeight: 700, color: COLORS.coral }}>11+ Weeks</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: COLORS.textMuted, marginTop: "4px" }}>
                    And you still haven't started the actual strategic analysis
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ position: "relative", paddingLeft: "32px" }}>
                  <div style={{
                    position: "absolute", left: "11px", top: "8px", bottom: "8px",
                    width: "2px", background: `linear-gradient(to bottom, ${COLORS.emerald}44, ${COLORS.accent}44)`,
                  }} />

                  {newTimeline.map((step, i) => (
                    <div key={i} style={{
                      position: "relative", marginBottom: i < newTimeline.length - 1 ? "8px" : 0,
                      animation: `fadeUp 0.4s ease ${i * 0.1}s forwards`, opacity: 0, animationFillMode: "forwards",
                    }}>
                      <div style={{
                        position: "absolute", left: "-27px", top: "18px",
                        width: "14px", height: "14px", borderRadius: "50%",
                        background: i === newTimeline.length - 1 ? COLORS.accent : COLORS.emerald,
                        border: `2px solid ${i === newTimeline.length - 1 ? COLORS.accent : COLORS.emerald}`,
                        zIndex: 1,
                      }} />

                      <div style={{
                        background: COLORS.surface, borderRadius: "12px", padding: "18px 22px",
                        border: `1px solid ${i === newTimeline.length - 1 ? COLORS.accent + "33" : COLORS.emerald + "22"}`,
                        display: "flex", gap: "14px", alignItems: "flex-start",
                      }}>
                        <div style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>{step.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "6px" }}>
                            <div style={{ fontFamily: "'Playfair Display'", fontSize: "16px", color: COLORS.text }}>{step.label}</div>
                            <div style={{
                              fontFamily: "'JetBrains Mono'", fontSize: "11px",
                              color: COLORS.emerald,
                              background: COLORS.emeraldMuted,
                              padding: "3px 10px", borderRadius: "20px",
                            }}>{step.time}</div>
                          </div>
                          <p style={{ fontFamily: "'DM Sans'", fontSize: "13px", color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time comparison */}
                <div style={{
                  marginTop: "24px", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center",
                  animation: "fadeUp 0.4s ease 0.5s forwards", opacity: 0, animationFillMode: "forwards",
                }}>
                  <div style={{
                    textAlign: "center", padding: "20px",
                    background: COLORS.coralMuted, borderRadius: "12px",
                    border: `1px solid ${COLORS.coral}22`,
                  }}>
                    <div style={{ fontFamily: "'Playfair Display'", fontSize: "28px", fontWeight: 700, color: COLORS.coral }}>11+ Weeks</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: COLORS.textMuted, marginTop: "4px" }}>Traditional BI</div>
                  </div>

                  <div style={{ fontFamily: "'Playfair Display'", fontSize: "24px", color: COLORS.accent }}>→</div>

                  <div style={{
                    textAlign: "center", padding: "20px",
                    background: COLORS.emeraldMuted, borderRadius: "12px",
                    border: `1px solid ${COLORS.emerald}22`,
                  }}>
                    <div style={{ fontFamily: "'Playfair Display'", fontSize: "28px", fontWeight: 700, color: COLORS.emerald }}>Minutes</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: "12px", color: COLORS.textMuted, marginTop: "4px" }}>With AI</div>
                  </div>
                </div>

                {/* Bottom message */}
                <div style={{
                  marginTop: "20px", textAlign: "center", padding: "24px",
                  background: `linear-gradient(135deg, ${COLORS.accent}12, ${COLORS.emerald}08)`,
                  borderRadius: "12px", border: `1px solid ${COLORS.accentGlow}`,
                  animation: "fadeUp 0.4s ease 0.65s forwards", opacity: 0, animationFillMode: "forwards",
                }}>
                  <p style={{
                    fontFamily: "'Playfair Display'", fontSize: "18px", fontStyle: "italic",
                    color: COLORS.accent, margin: 0, lineHeight: 1.7,
                  }}>
                    You still audit. You still validate. But now you spend your expertise on financial storytelling and strategic value — not on chasing BI teams for weeks.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{fonts}{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.accent}44; border-radius: 4px; }
      `}</style>

      {/* Top Resource Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.surfaceLight}, ${COLORS.surface})`,
        borderBottom: `1px solid rgba(200,169,110,0.12)`,
        padding: "14px 40px",
      }}>
        <div style={{
          maxWidth: "960px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "10px",
        }}>
          <div style={{
            fontFamily: "'DM Sans'", fontSize: "12px", color: COLORS.textMuted,
            fontWeight: 500, letterSpacing: "0.03em",
          }}>
            Level up your AI + Finance skills:
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
          }}>
            <a
              href="https://nicolasboucher.online/sp/ai-finance-accelerator/?utm_medium=aff-christianantonio-martinez-gmail-com&utm_content=&utm_source="
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: 600,
                color: COLORS.bg, textDecoration: "none",
                background: `linear-gradient(135deg, ${COLORS.accent}, #A8884E)`,
                padding: "6px 14px", borderRadius: "20px",
                boxShadow: `0 2px 8px ${COLORS.accentGlow}`,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${COLORS.accentGlow}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 2px 8px ${COLORS.accentGlow}`; }}
            >
              <span>🚀</span> AI Finance Accelerator
            </a>
            <a
              href="https://nicolasboucher.online/sp/ref-join-the-ai-finance-club/?aff=203&aero-coupons=10-off"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: 600,
                color: COLORS.emerald, textDecoration: "none",
                background: COLORS.emeraldMuted, border: `1px solid ${COLORS.emerald}44`,
                padding: "6px 14px", borderRadius: "20px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.emerald + "28"; e.currentTarget.style.borderColor = COLORS.emerald + "66"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.emeraldMuted; e.currentTarget.style.borderColor = COLORS.emerald + "44"; }}
            >
              <span>🤝</span> AI Finance Club
            </a>
            <a
              href="https://www.youtube.com/@christianmartinezAIforFinance"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: 600,
                color: COLORS.coral, textDecoration: "none",
                background: COLORS.coralMuted, border: `1px solid ${COLORS.coral}44`,
                padding: "6px 14px", borderRadius: "20px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.coral + "28"; e.currentTarget.style.borderColor = COLORS.coral + "66"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.coralMuted; e.currentTarget.style.borderColor = COLORS.coral + "44"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.coral}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              YouTube Guides
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{
        padding: "32px 40px 0",
        maxWidth: "960px", margin: "0 auto",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px",
        }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: COLORS.accent, boxShadow: `0 0 12px ${COLORS.accentGlow}`,
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono'", fontSize: "11px", color: COLORS.accent,
            textTransform: "uppercase", letterSpacing: "0.15em",
          }}>CFO AI Intelligence Brief</span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display'", fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700, color: COLORS.text, lineHeight: 1.2, marginBottom: "6px",
        }}>
          Understanding GenAI Variability
        </h1>
        <p style={{
          fontFamily: "'DM Sans'", fontSize: "15px", color: COLORS.textMuted, fontWeight: 300,
        }}>
          Why probabilistic output is a strategic advantage, not a limitation
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px", marginTop: "12px",
        }}>
          <span style={{
            fontFamily: "'DM Sans'", fontSize: "13px", color: COLORS.text, fontWeight: 500,
          }}>by Christian Martinez</span>
          <span style={{ color: COLORS.textMuted, fontSize: "13px" }}>·</span>
          <a
            href="https://www.linkedin.com/in/christianmartinezthefinancialfox/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              fontFamily: "'DM Sans'", fontSize: "12px", color: COLORS.accent,
              textDecoration: "none", padding: "4px 10px",
              background: COLORS.accentMuted, borderRadius: "20px",
              border: `1px solid ${COLORS.accent}33`,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.accent + "33"; e.currentTarget.style.borderColor = COLORS.accent + "66"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.accentMuted; e.currentTarget.style.borderColor = COLORS.accent + "33"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.accent}>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        maxWidth: "960px", margin: "28px auto 0", padding: "0 40px",
      }}>
        <div style={{
          display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "4px",
        }}>
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActiveSection(i); if (i !== 1) setRevealAnswer(false); }}
              style={{
                background: activeSection === i ? COLORS.accentMuted : "transparent",
                border: `1px solid ${activeSection === i ? COLORS.accent + "44" : "transparent"}`,
                borderRadius: "8px", padding: "10px 18px",
                fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: activeSection === i ? 600 : 400,
                color: activeSection === i ? COLORS.accent : COLORS.textMuted,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.25s ease",
              }}
            >
              <span style={{ opacity: 0.5, marginRight: "6px" }}>{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "960px", margin: "28px auto 0", padding: "0 40px 60px",
      }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "28px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>
            {sections[activeSection].title}
          </h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "14px", color: COLORS.textMuted, fontWeight: 300, fontStyle: "italic" }}>
            {sections[activeSection].subtitle}
          </p>
        </div>

        {renderSection()}

        {/* Footer nav */}
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: "40px",
          paddingTop: "20px", borderTop: `1px solid rgba(255,255,255,0.05)`,
        }}>
          <button
            onClick={() => { if (activeSection > 0) setActiveSection(activeSection - 1); }}
            disabled={activeSection === 0}
            style={{
              background: "transparent", border: `1px solid ${activeSection === 0 ? "rgba(255,255,255,0.05)" : COLORS.accent + "33"}`,
              borderRadius: "8px", padding: "10px 24px",
              fontFamily: "'DM Sans'", fontSize: "13px",
              color: activeSection === 0 ? COLORS.textMuted + "44" : COLORS.accent,
              cursor: activeSection === 0 ? "default" : "pointer",
            }}
          >
            ← Previous
          </button>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "12px", color: COLORS.textMuted, alignSelf: "center" }}>
            {activeSection + 1} / {sections.length}
          </div>
          <button
            onClick={() => { if (activeSection < sections.length - 1) setActiveSection(activeSection + 1); }}
            disabled={activeSection === sections.length - 1}
            style={{
              background: activeSection === sections.length - 1 ? "transparent" : COLORS.accentMuted,
              border: `1px solid ${activeSection === sections.length - 1 ? "rgba(255,255,255,0.05)" : COLORS.accent + "44"}`,
              borderRadius: "8px", padding: "10px 24px",
              fontFamily: "'DM Sans'", fontSize: "13px",
              color: activeSection === sections.length - 1 ? COLORS.textMuted + "44" : COLORS.accent,
              cursor: activeSection === sections.length - 1 ? "default" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
