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

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "", role: "" });
  const set = (field) => (e) => {
  setForm({ ...form, [field]: e.target.value });
};
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    if (!form.role)     e.role     = "Please select a role";
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
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        role: form.role   
      })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (res.ok) {
  alert("Login successful ✅");

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("email", form.email);
  localStorage.setItem("email", data.user.email);
  localStorage.setItem("name", data.user.name);

  

  // ROLE BASED REDIRECT
  if (data.user.role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/employee/dashboard");
  }

    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
    alert("Login failed ❌");
  }
};
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
          <span className="auth-nav-hint">Don't have an account?</span>
          <button className="auth-nav-btn" onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </nav>

      {/* Card */}
      <div className="auth-center">
        <div className="auth-card">

          <div className="auth-card-header">
            <div className="auth-card-icon"><ShieldIcon /></div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your TraceLock account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Role */}
            <div className="form-group">
              <label>Select Role</label>
              <div className="role-toggle">
                {["Admin", "Employee"].map((r) => (
                  <button key={r} type="button"
                    className={`role-btn ${form.role === r ? "active" : ""}`}
                    onClick={() => { setForm({ ...form, role: r }); setErrors({ ...errors, role: "" }); }}>
                    <span className="role-dot" />
                    {r}
                  </button>
                ))}
              </div>
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className={`input-wrap ${errors.email ? "input-error" : ""}`}>
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input id="login-email" type="email" placeholder="you@company.com"
                  value={form.email} onChange={set("email")} />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="login-password">Password</label>
                <a href="#" className="forgot-link"onClick={e=>{e.preventDefault();navigate("/forgot-password")}}>Forgot password?</a>
              </div>
              <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input id="login-password" type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password} onChange={set("password")} />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-auth">
              Sign In <span className="btn-auth-arrow">&#8594;</span>
            </button>

          </form>

          <p className="auth-switch">
            New to TraceLock?{" "}
            <button className="link-btn" onClick={() => navigate("/signup")}>
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;