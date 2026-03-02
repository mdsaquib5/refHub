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
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="page-title">
          {mode === "login" ? "Login to your account" : "Create a new account"}
        </h2>

        {mode === "signup" && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Sign Up"}
        </button>

        <p className="auth-toggle-text">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="auth-toggle-link"
                onClick={() => setMode("signup")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="auth-toggle-link"
                onClick={() => setMode("login")}
              >
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
