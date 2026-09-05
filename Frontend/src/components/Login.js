import React, { useState } from "react";
import { apiRequest, saveSession } from "../api";

const logoUrl =
  "https://www.tomorrowisbetter.org/assets/Tomorrow%20is%20better%20logo-CBq5aH4y.jpg";

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest(
        `/auth/${isRegistering ? "register" : "login"}`,
        {
          method: "POST",
          body: JSON.stringify(form),
        },
      );
      saveSession(data);
      onLogin(data.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <img src={logoUrl} alt="Tomorrow is Better" className="login-logo" />
        <p className="eyebrow">Inventory workspace</p>
        <h1>
          Good work needs <em>good tools.</em>
        </h1>
        <p>
          Keep the resources behind Tomorrow is Better organized, visible, and
          ready when the team needs them.
        </p>
        <div className="login-mark" aria-hidden="true">
          TiB
        </div>
      </section>
      <section className="login-form-panel">
        <div className="login-form-wrap">
          <p className="eyebrow">
            {isRegistering ? "Create account" : "Welcome back"}
          </p>
          <h2>
            {isRegistering ? "Start your workspace." : "Sign in to inventory."}
          </h2>
          <p className="login-helper">
            {isRegistering
              ? "Create an account to manage your team resources."
              : "Enter your details to continue to the dashboard."}
          </p>
          <form onSubmit={submit} className="auth-form">
            {isRegistering && (
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  autoComplete="name"
                  required
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                autoComplete={
                  isRegistering ? "new-password" : "current-password"
                }
                minLength="6"
                required
              />
            </div>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegistering
                  ? "Create account"
                  : "Sign in"}{" "}
              <span>↗</span>
            </button>
          </form>
          <button
            className="auth-switch"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
          >
            {" "}
            {isRegistering
              ? "Already have an account? Sign in"
              : "Need an account? Create one"}{" "}
          </button>
        </div>
      </section>
    </main>
  );
}
