import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, loading } = useAuthStore();
  const [currentState, setCurrentState] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "login") {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await signup({
          companyName: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/dashboard");
    } catch {
      // Error handled via toast in authStore
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>
          {currentState === "login" ? "Employer Login" : "Employer Signup"}
        </h2>
        <p className="subtitle">
          {currentState === "login"
            ? "Welcome back"
            : "Create your employer account"}
        </p>

        {currentState === "signup" && (
          <input
            type="text"
            name="name"
            placeholder="Company / Employer Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : currentState === "login"
              ? "Login"
              : "Signup"}
        </button>

        <p className="toggle-text">
          {currentState === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span
            onClick={() =>
              setCurrentState((p) => (p === "login" ? "signup" : "login"))
            }
          >
            {currentState === "login" ? " Sign up" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
