import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LogReg.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store token in localStorage in same format as Register
      const authUser = {
        email: user.email!,
        token: user.uid,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
      };
      localStorage.setItem("lnfound_token", JSON.stringify(authUser));

      navigate("/report"); // redirect to report after login
    } catch (err: any) {
      // Custom error messages for Firebase auth errors
      switch (err.code) {
        case "auth/user-not-found":
          setError("User not found.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email.");
          break;
        default:
          setError(err.message);
          break;
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Login to LNFound</h1>
        <form onSubmit={handleLogin} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
