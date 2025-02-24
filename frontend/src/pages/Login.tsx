import { IonButton, IonContent, IonInput, IonPage, IonText } from "@ionic/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear form when component mounts
  useEffect(() => {
    setEmail("");
    setPassword("");
    // Clear the actual form inputs
    const emailInput = document.querySelector('ion-input[type="email"]');
    const passwordInput = document.querySelector('ion-input[type="password"]');
    if (emailInput) (emailInput as any).value = "";
    if (passwordInput) (passwordInput as any).value = "";
  }, []);

  const handleChange = (field: string) => (event: CustomEvent) => {
    const value = event.detail.value || "";
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (error) setError("");
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.uid);
        history.push("/tasklist");
      } else {
        if (data.error === "NO_ACCOUNT_EXISTS") {
          setError("No account exists with this email");
        } else if (data.error === "INVALID_PASSWORD") {
          setError("Invalid password, please try again");
        } else {
          setError(data.error || "Error logging in. Please try again.");
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-container">
        <div className="login-box">
          <h1>Login</h1>
          <p className="welcome-text">Welcome back! Please log in.</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <IonInput
                  type="email"
                  value={email}
                  placeholder="Email"
                  className={`custom-input ${error && !email ? 'error-bg' : ''}`}
                  onIonInput={handleChange("email")}
                  autocomplete="off"
                  autocapitalize="off"
                  spellcheck={false}
                  clearInput={true}
                  clearOnEdit={true}
                  inputmode="email"
                  disabled={isLoading}
                />

                <IonInput
                  type="password"
                  value={password}
                  placeholder="Password"
                  className={`custom-input ${error && !password ? 'error-bg' : ''}`}
                  onIonInput={handleChange("password")}
                  autocomplete="new-password"
                  autocapitalize="off"
                  spellcheck={false}
                  clearInput={true}
                  clearOnEdit={true}
                  disabled={isLoading}
                />
          </div>

          <div className="forgot-password" onClick={() => console.log("Forgot password clicked")}>
            Forgot your password?
          </div>

          <IonButton
            expand="block"
            className="signin-button"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            Sign In
          </IonButton>

          <IonButton
            expand="block"
            className="create-account-button"
            onClick={() => history.push("/signup")}
            disabled={isLoading}
          >
            Create Account
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;