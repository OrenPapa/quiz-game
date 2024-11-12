import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./style.css"

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await login(username);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form className="login_form" onSubmit={handleLogin}>
        <h2 className="login_title">Login</h2>
        <h3 className="login_subtitle">You have to login to start the quiz</h3>
        <input
          className="username_input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <button disabled={loading} type="submit" className="login_button">
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <p className="login_error_message" style={{ color: "red" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
