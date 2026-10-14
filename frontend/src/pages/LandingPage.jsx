import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* Navbar */
const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-logo">
        <div className="nav-icon-wrap">
          <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
            <defs>
              <linearGradient id="iconGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a55ee"/>
                <stop offset="100%" stopColor="#00b4ff"/>
              </linearGradient>
            </defs>
            <path d="M20 3L6 10v10.5c0 9.5 6.5 16 14 17.5 7.5-1.5 14-8 14-17.5V10Z"
              fill="rgba(30,100,255,0.18)" stroke="url(#iconGrad)" strokeWidth="1.5"/>
            <rect x="13" y="13" width="14" height="17" rx="2.5"
              fill="rgba(255,255,255,0.06)" stroke="rgba(80,180,255,0.5)" strokeWidth="1.2"/>
            <line x1="16" y1="18" x2="24" y2="18" stroke="#00b4ff" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="16" y1="21" x2="24" y2="21" stroke="#00b4ff" strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
            <line x1="16" y1="24" x2="21" y2="24" stroke="#00b4ff" strokeWidth="1.3" strokeLinecap="round" opacity="0.45"/>
            <rect x="21" y="25.5" width="8" height="5.5" rx="1.5"
              fill="rgba(0,180,255,0.22)" stroke="#00b4ff" strokeWidth="1"/>
            <path d="M23 25.5v-1.8a2 2 0 014 0v1.8"
              fill="none" stroke="#00b4ff" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="25" cy="28" r="0.9" fill="#00b4ff"/>
          </svg>
        </div>
        <div className="nav-logo-name">
          <span className="nav-logo-secure">Trace</span><span className="nav-logo-docs">Lock</span>
        </div>
      </div>

      <ul className="nav-links">
        <li><a href="#" className="nav-active">Home</a></li>
        <li><a href="#about"    onClick={e => { e.preventDefault(); scrollTo("about");    }}>About Us</a></li>
        <li><a href="#features" onClick={e => { e.preventDefault(); scrollTo("features"); }}>Features</a></li>
        <li><a href="#contact"  onClick={e => { e.preventDefault(); scrollTo("contact");  }}>Contact</a></li>
      </ul>

      <div className="nav-actions">
        <button className="btn-ghost" onClick={() => navigate("/login")}>Log In</button>
        <button className="btn-primary" onClick={() => navigate("/signup")}>Get Started</button>
      </div>
    </nav>
  );
};

/* Shield SVG */
const ShieldVisual = () => (
  <div className="hero-visual">
    <svg viewBox="0 0 360 380" fill="none" className="shield-svg">
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a55cc"/>
          <stop offset="100%" stopColor="#0099dd"/>
        </linearGradient>
        <linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d1e4a"/>
          <stop offset="100%" stopColor="#1040a0"/>
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.03)"/>
        </linearGradient>
      </defs>

      {/* Back screen / card */}
      <rect x="70" y="55" width="210" height="175" rx="18"
        fill="url(#sg2)" stroke="rgba(80,140,255,0.35)" strokeWidth="1.5"/>
      <rect x="70" y="55" width="210" height="175" rx="18" fill="url(#glass)"/>
      {/* Window dots */}
      <circle cx="95"  cy="76" r="5" fill="rgba(255,80,80,0.75)"/>
      <circle cx="111" cy="76" r="5" fill="rgba(255,200,50,0.75)"/>
      <circle cx="127" cy="76" r="5" fill="rgba(50,210,100,0.75)"/>
      {/* Screen content lines */}
      <rect x="88" y="96"  width="90"  height="7" rx="3.5" fill="rgba(255,255,255,0.14)"/>
      <rect x="88" y="111" width="130" height="7" rx="3.5" fill="rgba(255,255,255,0.09)"/>
      <rect x="88" y="126" width="70"  height="7" rx="3.5" fill="rgba(255,255,255,0.07)"/>
      <rect x="88" y="141" width="110" height="7" rx="3.5" fill="rgba(255,255,255,0.06)"/>

      {/* Main shield */}
      <path
        d="M180 78 L116 108 L116 162 C116 205 148 232 180 242 C212 232 244 205 244 162 L244 108 Z"
        fill="url(#sg1)" stroke="rgba(100,200,255,0.55)" strokeWidth="2"/>
      <path
        d="M180 78 L116 108 L116 162 C116 205 148 232 180 242 C212 232 244 205 244 162 L244 108 Z"
        fill="url(#glass)" opacity="0.55"/>
      {/* Inner shield ring */}
      <path
        d="M180 92 L128 118 L128 162 C128 198 154 222 180 230 C206 222 232 198 232 162 L232 118 Z"
        fill="none" stroke="rgba(160,220,255,0.2)" strokeWidth="1.5"/>

      {/* Checkmark */}
      <path d="M156 162 L172 178 L206 144"
        stroke="white" strokeWidth="8"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* Floating tablet bottom-right */}
      <rect x="232" y="210" width="84" height="62" rx="11"
        fill="rgba(10,20,56,0.95)" stroke="rgba(80,140,255,0.3)" strokeWidth="1"
        transform="rotate(-7 274 241)"/>
      <rect x="232" y="210" width="84" height="62" rx="11"
        fill="url(#glass)" opacity="0.4" transform="rotate(-7 274 241)"/>

      {/* Floating card bottom-left */}
      <rect x="38" y="225" width="72" height="52" rx="9"
        fill="rgba(10,20,56,0.9)" stroke="rgba(80,140,255,0.25)" strokeWidth="1"
        transform="rotate(6 74 251)"/>
      <rect x="38" y="225" width="72" height="52" rx="9"
        fill="url(#glass)" opacity="0.3" transform="rotate(6 74 251)"/>

      {/* Gold accent dot */}
      <circle cx="272" cy="138" r="9" fill="#f59e0b" opacity="0.88"/>
      {/* Small blue dot */}
      <circle cx="76"  cy="186" r="7" fill="#f59e0b" opacity="0.65"/>
      {/* Tiny square accent */}
      <rect x="54" y="88" width="13" height="13" rx="3"
        fill="rgba(100,160,255,0.25)" stroke="rgba(120,180,255,0.45)" strokeWidth="1"
        transform="rotate(18 60 95)"/>
      <rect x="280" y="78" width="11" height="11" rx="2.5"
        fill="rgba(255,160,60,0.35)" stroke="rgba(255,190,80,0.55)" strokeWidth="1"
        transform="rotate(-14 285 83)"/>
    </svg>
  </div>
);

/* Hero */
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-tag">
          <span className="hero-tag-dot"/>
          Trusted Document Security
        </div>
        <h1 className="hero-heading">
          We Provide<br/>
          <span className="hero-blue">Secure Document</span><br/>
          Sharing &amp; Leak<br/>
          Detection.
        </h1>
        <p className="hero-desc">
          A powerful platform for organizations to share confidential files
          with employees — while tracking, monitoring, and preventing data
          leaks in real time.
        </p>
        <div className="hero-btns">
          <button className="btn-primary btn-lg" onClick={() => navigate("/login")}>
            Get Started
          </button>
          <button className="btn-outline btn-lg" onClick={() => scrollTo("features")}>
            Learn More
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">256-bit</div>
            <div className="hero-stat-label">Encryption</div>
          </div>
          <div className="hero-stat-sep"/>
          <div className="hero-stat">
            <div className="hero-stat-num">Real-time</div>
            <div className="hero-stat-label">Leak Alerts</div>
          </div>
          <div className="hero-stat-sep"/>
          <div className="hero-stat">
            <div className="hero-stat-num">100%</div>
            <div className="hero-stat-label">Traceable</div>
          </div>
        </div>
      </div>
      <ShieldVisual/>
    </section>
  );
};

/* Services */
const services = [
  {
    icon: (
      <svg viewBox="0 0 44 44" fill="none">
        <rect x="4" y="8" width="36" height="28" rx="6"
          fill="rgba(30,100,255,0.12)" stroke="rgba(100,170,255,0.4)" strokeWidth="1.5"/>
        <path d="M12 19h20M12 25h12" stroke="rgba(100,190,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="29" r="5.5"
          fill="rgba(30,100,255,0.25)" stroke="rgba(100,200,255,0.55)" strokeWidth="1.5"/>
        <path d="M30.5 29l1.5 1.5L34.5 27"
          stroke="rgba(120,220,255,1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Secure File Sharing",
    desc: "Upload PDF and DOCX files to an encrypted server. Only assigned employees can access their designated documents — no exceptions.",
  },
  {
    icon: (
      <svg viewBox="0 0 44 44" fill="none">
        <path d="M22 3L6 10v12c0 11 7 18.5 16 20.5 9-2 16-9.5 16-20.5V10Z"
          fill="rgba(245,158,11,0.12)" stroke="rgba(245,190,70,0.45)" strokeWidth="1.5"/>
        <path d="M16 22l4.5 4.5 8-8"
          stroke="rgba(245,210,80,1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Invisible Watermarking",
    desc: "Every download is silently stamped with the employee's ID and timestamp. If a file leaks, the source is identified instantly.",
  },
  {
    icon: (
      <svg viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="15"
          fill="rgba(239,68,68,0.10)" stroke="rgba(239,100,100,0.4)" strokeWidth="1.5"/>
        <path d="M22 14v8l4.5 2.5"
          stroke="rgba(239,130,130,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="30" y="7" width="10" height="10" rx="5"
          fill="rgba(239,68,68,0.25)" stroke="rgba(239,100,100,0.65)" strokeWidth="1.5"/>
        <path d="M33 12h4M35 10v4"
          stroke="rgba(255,160,160,1)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Real-time Leak Alerts",
    desc: "Attempting to share or copy a file triggers an instant notification to the admin panel. Suspicious activity never goes unnoticed.",
  },
];

const Services = () => (
  <section className="services-section" id="features">
    <div className="section-eyebrow">OUR SERVICES</div>
    <h2 className="section-title">Security Solutions</h2>
    <div className="services-grid">
      {services.map((s, i) => (
        <div className="service-card" key={i}>
          <div className="service-icon">{s.icon}</div>
          <h3 className="service-title">{s.title}</h3>
          <p className="service-desc">{s.desc}</p>
          <button className="service-btn">Read more</button>
        </div>
      ))}
    </div>
  </section>
);

/* About  */
const checks = [
  "Watermark Detection",   "Cloud Security",
  "End-to-End Encryption", "Access Control",
  "Activity Monitoring",   "Server Security",
];

const About = () => {
  const navigate = useNavigate();
  return (
    <section className="about-section" id="about">
      {/* Left: two mock-screen cards */}
      <div className="about-visuals">
        <div className="mock-card mock-card-main">
          <div className="mock-topbar">
            <span className="dot-r"/><span className="dot-y"/><span className="dot-g"/>
          </div>
          <div className="mock-body">
            <div className="mock-side">
              {[80,62,72,55,68].map((w,i) => (
                <div key={i} className="mock-side-item" style={{width:`${w}%`}}/>
              ))}
            </div>
            <div className="mock-main-area">
              <div className="mock-cards-row">
                <div className="mock-mini-card"/>
                <div className="mock-mini-card"/>
                <div className="mock-mini-card"/>
              </div>
              <div className="mock-lines">
                {[100,85,65,90].map((w,i) => (
                  <div key={i} className="mock-line" style={{width:`${w}%`}}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mock-card mock-card-sm">
          <div className="mock-topbar">
            <span className="dot-r"/><span className="dot-y"/><span className="dot-g"/>
          </div>
          <div className="mock-sm-body">
            <div className="mock-upload-ring">
              <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
                <circle cx="20" cy="20" r="17"
                  fill="rgba(30,100,255,0.15)" stroke="rgba(80,150,255,0.4)" strokeWidth="1.5"/>
                <path d="M20 26V16M15 21l5-5 5 5"
                  stroke="rgba(100,190,255,0.9)" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="mock-sm-label"/>
            <div className="mock-sm-sub"/>
            <div className="mock-progress-track">
              <div className="mock-progress-fill"/>
            </div>
          </div>
        </div>

        <div className="about-accent-dot"/>
        <div className="about-accent-sq"/>
      </div>

      {/* Right: content */}
      <div className="about-content">
        <div className="section-eyebrow">ABOUT US</div>
        <h2 className="section-title about-title">
          24/7 Secure Document<br/>Operation Center
        </h2>
        <p className="about-desc">
          SecureDocs provides a centralized platform where admins upload
          sensitive files, assign them to specific employees, and monitor
          every access event in real time. Every download is watermarked
          with the recipient's identity — ensuring complete traceability.
        </p>
        <div className="check-grid">
          {checks.map((c, i) => (
            <div className="check-item" key={i}>
              <div className="check-icon">
                <svg viewBox="0 0 14 14" fill="none" width="10" height="10">
                  <path d="M2 7l3.5 3.5L12 4"
                    stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary btn-lg" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>
    </section>
  );
};

/* Partners */
const Partners = () => (
  <section className="partners-section">
    <div className="section-eyebrow" style={{textAlign:"center",marginBottom:"28px"}}>
      WE'RE WORKING WITH
    </div>
    <div className="partners-row">
      {["TechCorp","DataSafe","NetGuard","CloudShield","InfoSec"].map((p,i) => (
        <div className="partner-logo" key={i}>{p}</div>
      ))}
    </div>
  </section>
);

/*  Contact  */
const Contact = () => (
  <section className="contact-section" id="contact">
    <div className="contact-left">
      <div className="section-eyebrow">GET IN TOUCH</div>
      <h2 className="section-title about-title">
        Ready to Secure<br/>Your Documents?
      </h2>
      <p className="about-desc">
        Contact us for a demo or to learn how TraceLock can protect
        your organization's sensitive files and prevent data leaks.
      </p>
      <div className="contact-info-list">
        {[
          {label:"Email",   val:"hello@TraceLock.in"},
          {label:"Phone",   val:"+91 98765 43210"},
          {label:"Support", val:"Mon–Fri, 9AM–6PM IST"},
        ].map(r => (
          <div className="contact-info-row" key={r.label}>
            <div className="contact-info-label">{r.label}</div>
            <div className="contact-info-val">{r.val}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="contact-form-card">
      <div className="contact-form-title">Send a Message</div>
      <form onSubmit={e => e.preventDefault()}>
        <div className="cf-row">
          <div className="cf-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe"/>
          </div>
          <div className="cf-group">
            <label>Email</label>
            <input type="email" placeholder="john@company.com"/>
          </div>
        </div>
        <div className="cf-group">
          <label>Subject</label>
          <input type="text" placeholder="Request a demo"/>
        </div>
        <div className="cf-group">
          <label>Message</label>
          <textarea rows={4} placeholder="Tell us about your requirements..."/>
        </div>
        <button type="submit" className="btn-primary"
          style={{width:"100%", padding:"14px", justifyContent:"center"}}>
          Send Message
        </button>
      </form>
    </div>
  </section>
);

/* Footer */
const Footer = () => (
  <footer className="footer">
    <div className="footer-logo">Trace<span>Lock</span></div>
    <p className="footer-copy">© 2026 Team TraceLock. All rights reserved.</p>
  </footer>
);

/* Main  */
const LandingPage = () => (
  <div className="page">
    <Navbar/>
    <Hero/>
    <Services/>
    <About/>
    <Partners/>
    <Contact/>
    <Footer/>
  </div>
);

export default LandingPage;
