import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <h1>Admin Chat Dashboard</h1>
        <p className='subtitle'>Login to manage conversations</p>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='admin@example.com'
              required
              disabled={loading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              required
              disabled={loading}
            />
          </div>

          {error && <div className='error-message'>{error}</div>}

          <button type='submit' disabled={loading} className='login-button'>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className='demo-info'>Demo: Use your admin credentials to login</p>
      </div>
    </div>
  );
};

export default Login;
