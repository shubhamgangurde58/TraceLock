import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";
import "./Forgotpassword.css";

/* Shield Icon */
const ShieldIcon = () => (
  <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
    <path d="M40 8L14 20V40C14 55 25 68 40 72C55 68 66 55 66 40V20L40 8Z"
      fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2"/>
    <path d="M40 14L20 24V40C20 52 29 62 40 66C51 62 60 52 60 40V24L40 14Z"
      fill="rgba(80,140,255,0.2)" stroke="rgba(100,160,255,0.6)" strokeWidth="1.5"/>
    <circle cx="40" cy="38" r="8" fill="none" stroke="rgba(150,190,255,0.8)" strokeWidth="1.5"/>
    <circle cx="40" cy="38" r="3" fill="rgba(150,190,255,0.9)"/>
    <line x1="40" y1="41" x2="40" y2="48"
      stroke="rgba(150,190,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* Eye Icon*/
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

/* Step Indicator */
const StepBar = ({ step }) => {
  const steps = ["Email", "Verify OTP", "New Password"];
  return (
    <div className="fp-steps">
      {steps.map((label, i) => {
        const idx  = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <React.Fragment key={idx}>
            <div className="fp-step">
              <div className={`fp-step-circle ${active ? "fp-step-active" : done ? "fp-step-done" : ""}`}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7"/>
                  </svg>
                ) : idx}
              </div>
              <span className={`fp-step-label ${active ? "fp-step-label-active" : done ? "fp-step-label-done" : ""}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`fp-step-line ${step > idx ? "fp-step-line-done" : ""}`}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/*  Enter Email */
const StepEmail = ({ onNext }) => {
  const [email, setEmail]   = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Email is required."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }

    setLoading(true);
    try {
      
    const res = await fetch("http://localhost:5000/api/users/forgot-password", {
     method: "POST",
     headers: {
    "Content-Type": "application/json"
  },
   body: JSON.stringify({
  email: email
})
});

    const data = await res.json();

    if (!res.ok) {
  setError(data.message);
  return;
}

onNext(email);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="fp-desc">
        Enter your registered email address. We'll send a 6-digit OTP to verify your identity.
      </div>

      <div className="form-group">
        <label htmlFor="fp-email">Email Address</label>
        <div className={`input-wrap ${error ? "input-error" : ""}`}>
          <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input
            id="fp-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            autoFocus
          />
        </div>
        {error && <span className="field-error">{error}</span>}
      </div>

      <button type="submit" className="btn-auth" disabled={loading}>
        {loading ? (
          <span className="fp-loading">
            <span className="fp-spinner"/>
            Sending OTP…
          </span>
        ) : (
          <>Send OTP <span className="btn-auth-arrow">&#8594;</span></>
        )}
      </button>
    </form>
  );
};

/* Verify OTP */
const StepOTP = ({ email, onNext, onBack }) => {
  const [otp,     setOtp]     = useState(["", "", "", "", "", ""]);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [resent,  setResent]  = useState(false);

  const refs = Array.from({ length: 6 }, () => React.createRef());

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return; // no numbers
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    setError("");
    // Auto-focus next
    if (val && idx < 5) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    refs[Math.min(pasted.length, 5)].current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const otpStr = otp.join("");
    if (otpStr.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: email,
    otp: otpStr
  })
});

const data = await res.json();

if (!res.ok) {
  setError(data.message);
  return;
}

onNext(); 
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResent(false);
    setError("");
    // POST /api/auth/forgot-password again
    await new Promise(r => setTimeout(r, 600));
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="fp-desc">
        We sent a 6-digit OTP to <strong>{email}</strong>.
        Check your inbox and enter it below.
      </div>

      {/* OTP boxes */}
      <div className="otp-row" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            className={`otp-box ${digit ? "otp-box-filled" : ""} ${error ? "otp-box-error" : ""}`}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && <span className="field-error" style={{display:"block",textAlign:"center",marginTop:4}}>{error}</span>}

      {resent && (
        <div className="fp-resent-msg">
          ✓ OTP resent successfully. Check your email.
        </div>
      )}

      <button type="submit" className="btn-auth" disabled={loading}>
        {loading ? (
          <span className="fp-loading"><span className="fp-spinner"/>Verifying…</span>
        ) : (
          <>Verify OTP <span className="btn-auth-arrow">&#8594;</span></>
        )}
      </button>

      <div className="fp-resend-row">
        Didn't receive it?{" "}
        <button type="button" className="link-btn" onClick={handleResend}>
          Resend OTP
        </button>
      </div>
    </form>
  );
};

/* Set New Password */
const StepNewPassword = ({ email, onDone }) =>  {
  const [form,    setForm]    = useState({ password: "", confirm: "" });
  const [showP1,  setShowP1]  = useState(false);
  const [showP2,  setShowP2]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#e24b4a", "#ef9f27", "#5dcaa5", "#4f8aff"];
  const s = strength();

  const validate = () => {
    const e = {};
    if (!form.password)              e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Minimum 8 characters required.";
    if (!form.confirm)               e.confirm  = "Please confirm your password.";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {

const res = await fetch("http://localhost:5000/api/users/reset-password",{
    method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
 body: JSON.stringify({
  email: email, 
  newPassword: form.password 
})
});

const data = await res.json();

if (!res.ok) {
  setErrors({ password: data.message });
  return;
}

    onDone();
    } catch {
      setErrors({ password: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="fp-desc">
        Choose a strong new password for your account.
      </div>

      {/* New Password */}
      <div className="form-group">
        <label htmlFor="fp-pass">New Password</label>
        <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>
          <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            id="fp-pass"
            type={showP1 ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={set("password")}
            autoFocus
          />
          <button type="button" className="eye-btn" onClick={() => setShowP1(!showP1)}>
            <EyeIcon open={showP1}/>
          </button>
        </div>
        {/* Strength bar */}
        {form.password && (
          <div className="strength-wrap">
            <div className="strength-bars">
              {[1,2,3,4].map(i => (
                <div key={i} className="strength-bar"
                  style={{ background: i <= s ? strengthColor[s] : "rgba(255,255,255,0.1)" }}/>
              ))}
            </div>
            <span className="strength-label" style={{ color: strengthColor[s] }}>
              {strengthLabel[s]}
            </span>
          </div>
        )}
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label htmlFor="fp-confirm">Confirm New Password</label>
        <div className={`input-wrap ${errors.confirm ? "input-error" : ""}`}>
          <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <input
            id="fp-confirm"
            type={showP2 ? "text" : "password"}
            placeholder="Re-enter new password"
            value={form.confirm}
            onChange={set("confirm")}
          />
          <button type="button" className="eye-btn" onClick={() => setShowP2(!showP2)}>
            <EyeIcon open={showP2}/>
          </button>
        </div>
        {form.confirm && (
          <span className="match-indicator"
            style={{ color: form.password === form.confirm ? "#5dcaa5" : "#e24b4a" }}>
            {form.password === form.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
          </span>
        )}
        {errors.confirm && <span className="field-error">{errors.confirm}</span>}
      </div>

      <button type="submit" className="btn-auth" disabled={loading}>
        {loading ? (
          <span className="fp-loading"><span className="fp-spinner"/>Resetting…</span>
        ) : (
          <>Reset Password <span className="btn-auth-arrow">&#8594;</span></>
        )}
      </button>
    </form>
  );
};

/* STEP 4 — Success */
const StepSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="fp-success-wrap">
      <div className="fp-success-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <path d="M22 4L12 14.01l-3-3"/>
        </svg>
      </div>
      <h3 className="fp-success-title">Password Reset Successful!</h3>
      <p className="fp-success-sub">
        Your password has been updated. You can now log in with your new password.
      </p>
      <button className="btn-auth" onClick={() => navigate("/login")}
        style={{ marginTop: 8 }}>
        Go to Login <span className="btn-auth-arrow">&#8594;</span>
      </button>
    </div>
  );
};

/* MAIN COMPONENT */
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step,       setStep]       = useState(1);   // 1 | 2 | 3 | 4
  const [email,      setEmail]      = useState("");
  const [resetToken, setResetToken] = useState("");

  const stepTitles = {
    1: { title: "Forgot Password",    sub: "We'll help you recover your account" },
    2: { title: "Verify Your Email",  sub: "Enter the OTP sent to your email"    },
    3: { title: "Set New Password",   sub: "Choose a strong password"             },
    4: { title: "All Done!",          sub: ""                                     },
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-left"/>
      <div className="auth-glow auth-glow-right"/>

      {/* Navbar */}
      <nav className="auth-nav">
        <div className="auth-nav-logo" onClick={() => navigate("/")}>
          <ShieldIcon/>
          <span>TraceLock</span>
        </div>
        <div className="auth-nav-right">
          <span className="auth-nav-hint">Remember your password?</span>
          <button className="auth-nav-btn" onClick={() => navigate("/login")}>
            Log In
          </button>
        </div>
      </nav>

      {/* Card */}
      <div className="auth-center">
        <div className="auth-card fp-card">

          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-card-icon">
              {step === 4 ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(93,202,165,0.9)" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
              ) : (
                <ShieldIcon/>
              )}
            </div>
            <h1 className="auth-title">{stepTitles[step].title}</h1>
            {stepTitles[step].sub && (
              <p className="auth-subtitle">{stepTitles[step].sub}</p>
            )}
          </div>

          {/* Step indicator */}
          {step < 4 && <StepBar step={step}/>}

          {/* Step content */}
          {step === 1 && (
            <StepEmail onNext={(em) => { setEmail(em); setStep(2); }}/>
          )}
          {step === 2 && (
            <StepOTP
              email={email}
              onNext={(token) => { setResetToken(token); setStep(3); }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepNewPassword
            email={email}
         onDone={() => setStep(4)}
             />
        )}
          {step === 4 && <StepSuccess/>}

          {/* Back link  */}
          {step === 2 && (
            <p className="auth-switch" style={{marginTop:16}}>
              Wrong email?{" "}
              <button className="link-btn" onClick={() => setStep(1)}>Go back</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;