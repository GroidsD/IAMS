import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../services/LoadingSpinner";
import { useUser } from "../context/UserContext";
import api from "../../../API/axios";
const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, loading: contextLoading } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/user");
    }
  }, [user, navigate]);

  if (contextLoading || loading) {
    return <LoadingSpinner />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/login", { email, password });
      const meRes = await api.get("/api/me");
      setUser(meRes.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: 'url("/3dBackGround.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-white text-5xl sm:text-6xl font-extrabold mb-8 text-center tracking-tight">
        Internal Audit Management System
      </h1>
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <div className="flex justify-center mb-8">
          <img src="/image.png" alt="XP Power Logo" className="w-48 h-auto" />
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email-input"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-1 focus:ring-blue-400 outline-none"
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password-input"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password-input"
              name="password"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-1 focus:ring-blue-400 outline-none"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
