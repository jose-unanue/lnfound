import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useNavigate, Link } from "react-router-dom";
import InfoTooltip from "../components/InfoTooltip";
import "../styles/LogReg.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  type ErrorType = "validation" | "auth" | null;
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<ErrorType>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorType("validation");
      setError("Invalid email or password.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorType("validation");
      setError("Invalid email or password.");
      return;
    }
    if (password !== confirm) {
      setErrorType("validation");
      setError("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email,
        createdAt: Date.now(),
        isAdmin: false,
        requestedAdmin: false,
      });

      navigate("/login");
    } catch (err: any) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setErrorType("auth");
            setError("Email already in use.");
            break;
          case "auth/invalid-email":
            setErrorType("validation");
            setError("Invalid email.");
            break;
          case "auth/weak-password":
            setErrorType("validation");
            setError("Weak password.");
            break;
          default:
            setError(err.message);
            break;
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Register for LNFound</h1>
        <form onSubmit={handleRegister} noValidate>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && (
            <p className="error">
              {errorType === "validation" && (
                <InfoTooltip
                  message="Passwords must match and be 6+ chars, include a number, and no spaces.
              Email must contain @ and ."
                />
              )}
              {error}
            </p>
          )}
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
