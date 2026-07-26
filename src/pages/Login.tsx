import { useState } from "react";
import { signIn, signUp } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await signIn(email, password);

      // AuthContext will automatically detect the login
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!email || !password) {
      alert("Please enter an email and password.");
      return;
    }
  
    try {
      setLoading(true);
  
      await signUp(email, password);
  
      alert(
        "Account created successfully.\n\nYou can now sign in."
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        className="card"
        style={{
          width: "400px",
          maxWidth: "90%",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          ⚡ EV Toolkit
        </h2>

        <p style={{ textAlign: "center" }}>
          Sign in to continue
        </p>

        <label>Email</label>

        <input
          type="email"
          value={email}
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <button
          className="saveButton"
          style={{ width: "100%" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div
  style={{
    textAlign: "center",
    marginTop: 20,
  }}
>
  <p>New to EV Toolkit?</p>

  <button
  className="register-btn"
  onClick={handleRegister}
  disabled={loading}
>
  Create Account
</button>
</div>

      </div>
    </div>
  );
}