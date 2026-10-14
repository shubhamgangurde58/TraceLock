import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

const ShieldIcon = () => (
  <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
    <path d="M40 8L14 20V40C14 55 25 68 40 72C55 68 66 55 66 40V20L40 8Z"
      fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
    <path d="M40 14L20 24V40C20 52 29 62 40 66C51 62 60 52 60 40V24L40 14Z"
      fill="rgba(80,140,255,0.2)" stroke="rgba(100,160,255,0.6)" strokeWidth="1.5" />
    <circle cx="40" cy="38" r="8" fill="none" stroke="rgba(150,190,255,0.8)" strokeWidth="1.5" />
    <circle cx="40" cy="38" r="3" fill="rgba(150,190,255,0.9)" />
    <line x1="40" y1="41" x2="40" y2="48"
      stroke="rgba(150,190,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const departments = [
  "Engineering","Human Resources","Finance","Marketing",
  "Operations","Legal","Product","Sales","Design","IT Support",
];

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    employeeId: "", department: "",
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]           = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName = "Full name is required";
    if (!form.email)            e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)         e.password = "Password is required";
    else if (form.password.length < 8)         e.password = "Minimum 8 characters";
    if (!form.confirmPassword)  e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.employeeId.trim()) e.employeeId = "Employee ID is required";
    if (!form.department)        e.department = "Please select a department";
    return e;
  };

  const handleSubmit = async (ev) => {
  ev.preventDefault();

  const e = validate();
  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: "employee",
        employeeId: form.employeeId,   
        department: form.department    
      })
    });

    const data = await res.json();
    console.log("SIGNUP RESPONSE:", data);

    if (res.ok) {
      alert("Signup successful ✅");
      navigate("/login");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
    alert("Signup failed ❌");
  }
};

  const set = (field) => (ev) => {
    setForm({ ...form, [field]: ev.target.value });
    setErrors({ ...errors, [field]: "" });
  };

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

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      {/* Navbar */}
      <nav className="auth-nav">
        <div className="auth-nav-logo" onClick={() => navigate("/")}>
          <ShieldIcon />
          <span>TraceLock</span>
        </div>
        <div className="auth-nav-right">
          <span className="auth-nav-hint">Already have an account?</span>
          <button className="auth-nav-btn" onClick={() => navigate("/login")}>Log In</button>
        </div>
      </nav>

      {/* Card */}
      <div className="auth-center">
        <div className="auth-card auth-card-wide">

          <div className="auth-card-header">
            <div className="auth-card-icon"><ShieldIcon /></div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Join TraceLock as an employee</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Row 1: Full Name + Employee ID */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="su-name">Full Name</label>
                <div className={`input-wrap ${errors.fullName ? "input-error" : ""}`}>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input id="su-name" type="text" placeholder="John Doe"
                    value={form.fullName} onChange={set("fullName")} />
                </div>
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="su-empid">Employee ID</label>
                <div className={`input-wrap ${errors.employeeId ? "input-error" : ""}`}>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M8 10h8M8 14h4" />
                  </svg>
                  <input id="su-empid" type="text" placeholder="EMP-0042"
                    value={form.employeeId} onChange={set("employeeId")} />
                </div>
                {errors.employeeId && <span className="field-error">{errors.employeeId}</span>}
              </div>
            </div>

            {/* Row 2: Email + Department */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="su-email">Email Address</label>
                <div className={`input-wrap ${errors.email ? "input-error" : ""}`}>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input id="su-email" type="email" placeholder="you@company.com"
                    value={form.email} onChange={set("email")} />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="su-dept">Department</label>
                <div className={`input-wrap select-wrap ${errors.department ? "input-error" : ""}`}>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  <select id="su-dept" value={form.department} onChange={set("department")}>
                    <option value="">Select department</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <svg className="select-arrow" width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {errors.department && <span className="field-error">{errors.department}</span>}
              </div>
            </div>

            {/* Row 3: Password + Confirm Password */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="su-pass">Password</label>
                <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input id="su-pass" type={showPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password} onChange={set("password")} />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {form.password && (
                  <div className="strength-wrap">
                    <div className="strength-bars">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="strength-bar"
                          style={{ background: i <= s ? strengthColor[s] : "rgba(255,255,255,0.1)" }} />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strengthColor[s] }}>
                      {strengthLabel[s]}
                    </span>
                  </div>
                )}
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="su-confirm">Confirm Password</label>
                <div className={`input-wrap ${errors.confirmPassword ? "input-error" : ""}`}>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <input id="su-confirm" type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword} onChange={set("confirmPassword")} />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {form.confirmPassword && (
                  <span className="match-indicator"
                    style={{ color: form.password === form.confirmPassword ? "#5dcaa5" : "#e24b4a" }}>
                    {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </span>
                )}
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="btn-auth">
              Create Account <span className="btn-auth-arrow">&#8594;</span>
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button className="link-btn" onClick={() => navigate("/login")}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;