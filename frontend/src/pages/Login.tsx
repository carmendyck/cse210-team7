import { IonButton, IonContent, IonInput, IonPage, IonText } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setMessage("Please enter both your email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful! Redirecting...");
        login(data.token, data.uid);
        history.push("/tasklist");
      } else {
        if (data.error.includes("EMAIL_NOT_FOUND")) {
          setMessage("⚠️ User does not exist. Redirecting to sign-up...");
          setTimeout(() => history.push("/signup"), 2000);
        } else if (data.error.includes("INVALID_PASSWORD")) {
          setMessage("Incorrect password. Please try again.");
        } else {
          setMessage(`${data.error}`);
        }
      }
    } catch (error) {
      setMessage("Error logging in. Please try again.");
    }
  };

  const handleCreateAccount = () => {
    history.push("/signup");
  };

  const handleForgotPassword = () => {
    setMessage("🔔 Forgot password functionality coming soon!");
  };

  return (
    <IonPage>
      <IonContent className="login-container">
        <div className="login-box">
          <h1>Login</h1>
          <p className="welcome-text">Welcome back! Please log in.</p>

          {message && <p className="message-text">{message}</p>}

          <div className="input-group">
            <IonInput
              type="email"
              value={email}
              placeholder="Email"
              className="custom-input"
              onIonInput={(e) => setEmail(e.detail.value!)}
              autofocus
            />
          </div>

          <div className="input-group">
            <IonInput
              type="password"
              value={password}
              placeholder="Password"
              className="custom-input"
              onIonInput={(e) => setPassword(e.detail.value!)}
            />
          </div>

          <IonText className="forgot-password" onClick={handleForgotPassword}>
            Forgot your password?
          </IonText>

          <IonButton expand="block" className="sign-in-button" onClick={handleSignIn}>
            Sign In
          </IonButton>

          <IonButton expand="block" className="create-account-button" onClick={handleCreateAccount}>
            Create Account
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
