import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, signup, loading } = useAuthStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
      navigate("/dashboard", { replace: true });
    } catch {
      // Error already handled via toast in authStore
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="mobile-logo" style={{ textAlign: 'center', marginBottom: '10px', fontSize: '11px', fontWeight: 900, letterSpacing: '4px', color: 'var(--primary-accent)' }}>ALTEN INDIA</div>
        <h2>
          {mode === "login" ? "Welcome Back" : "User Signup"}
        </h2>
        <p className="subtitle">
          {mode === "login" 
            ? "Enter your credentials to access your portal" 
            : "Join the Alten India referral network"}
        </p>

        {mode === "signup" && (
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Sign Up"}
        </button>

        <p className="toggle-text">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setMode("signup")}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>
                Login
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
