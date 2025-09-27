import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Login - Ocean Professional styled login form with validation, error/success states,
 * password visibility toggle, disclaimer, and register/forgot links.
 */
export default function Login({ onSuccess }) {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // UI states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(""); // string message
  const [success, setSuccess] = useState(""); // string message

  // Simple validation helpers
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      // Placeholder login flow:
      // Integrate with real API or Supabase as needed.
      // For now, simulate success.
      await new Promise((res) => setTimeout(res, 600));
      setSuccess("Login successful. Redirecting…");
      onSuccess && onSuccess({ email });
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page" role="main" aria-label="Login">
      <div className="login-container" role="region" aria-label="Login form card">
        <header className="login-header">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-dot" />
          </div>
          <h1 className="login-title">Sign in to Surgical Schedule</h1>
          <p className="login-subtitle">Ocean Professional · Secure Access</p>
        </header>

        {error && (
          <div className="alert alert-error" role="alert" aria-live="assertive">
            <span className="alert-icon" aria-hidden="true">!</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="status" aria-live="polite">
            <span className="alert-icon" aria-hidden="true">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            <span className="form-label">Email</span>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@hospital.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error && !email ? "true" : "false"}
              autoComplete="username"
              required
            />
          </label>

          <label className="form-field">
            <span className="form-label">Password</span>
            <div className="input-with-icon">
              <input
                className="form-input"
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error && !password ? "true" : "false"}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-icon"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? (
                  // eye-off
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-2.1-2.1c-1.29.37-2.65.56-4.03.56C7 20.46 3.05 17.64 1 12c.76-2 1.96-3.7 3.42-5.02L2 5.27zM12 6c5 0 8.95 2.82 11 8c-.76 2-1.96 3.7-3.42 5.02l-2.2-2.2C18.12 15.55 19 13.88 19 12c0-3.87-3.13-7-7-7c-1.88 0-3.55.88-4.82 2.23L5.98 5.03C7.3 3.57 9 2.37 11 1.61C12 1.2 13 1 14 1" opacity="0"></path>
                    <path fill="currentColor" d="M9.9 7.06l1.52 1.52c.18-.05.37-.08.58-.08A3 3 0 0 1 15 11c0 .2-.03.4-.08.58l1.52 1.52c.35-.6.56-1.3.56-2.1a5 5 0 0 0-5-5c-.8 0-1.5.21-2.1.56zM12 8a3 3 0 0 0-3 3c0 .2.03.4.08.58l4.5-4.5A2.9 2.9 0 0 0 12 8z"></path>
                  </svg>
                ) : (
                  // eye
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path>
                  </svg>
                )}
              </button>
            </div>
            <div className="form-inline">
              <a className="link" href="#forgot" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
          </label>

          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={submitting}
            aria-busy={submitting ? "true" : "false"}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>

          <div className="alt-actions">
            <span className="muted">Don’t have an account?</span>
            <a className="link" href="#register" onClick={(e) => e.preventDefault()}>
              Create account
            </a>
          </div>

          <p className="disclaimer" role="note">
            By continuing you agree to the hospital’s terms and acknowledge the privacy policy.
            For assistance, contact IT Support.
          </p>
        </form>
      </div>
    </main>
  );
}
