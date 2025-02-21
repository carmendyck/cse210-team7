import { IonButton, IonContent, IonInput, IonPage } from "@ionic/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

const SignUp: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setTimeout(() => {
      document.querySelectorAll('ion-input').forEach(input => (input as any).value = "");
    }, 100);
  }, []);

  const handleChange = (field: string) => (event: CustomEvent) => {
    const value = event.detail.value || "";
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return setError("Full name is required"), false;
    if (!formData.email.trim()) return setError("Email is required"), false;
    if (!/\S+@\S+\.\S+/.test(formData.email)) return setError("Invalid email format"), false;
    if (!formData.password) return setError("Password is required"), false;
    if (formData.password.length < 6) return setError("Password must be at least 6 characters"), false;
    if (formData.password !== formData.confirmPassword) return setError("Passwords don't match"), false;
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5050/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        localStorage.setItem("redirectPath", "/create_acct_pref");
        setTimeout(() => {
          login(data.token);
          history.push("/create_acct_pref");
        }, 2000);
      } else {
        setError(data.error.includes("already registered") || data.error.includes("EMAIL_EXISTS") ? "This email is already registered. Please use a different email." : data.error || "Error creating account. Please try again.");
      }
    } catch {
      setError("Error creating account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => history.push("/login");

  if (showSuccess) {
    return (
      <IonPage>
        <IonContent className="signup-container">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
            <h2 className="success-text">Welcome aboard!</h2>
            <p className="success-subtext">Setting up your preferences...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="signup-container">
        <div className="signup-box">
          <h1>Sign Up</h1>
          <p className="welcome-text">Create an account to continue</p>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <IonInput type="text" value={formData.fullName} placeholder="Full Name" className={`custom-input ${error && !formData.fullName ? 'error-bg' : ''}`} onIonInput={handleChange("fullName")} autocomplete="off" autocapitalize="off" spellcheck={false} disabled={isLoading} />
            <IonInput type="email" value={formData.email} placeholder="Email" className={`custom-input ${error && error.includes("email") ? 'error-bg' : ''}`} onIonInput={handleChange("email")} autocomplete="off" autocapitalize="off" spellcheck={false} disabled={isLoading} />
            <IonInput type="password" value={formData.password} placeholder="Password" className={`custom-input ${error && error.includes("Password") ? 'error-bg' : ''}`} onIonInput={handleChange("password")} autocomplete="new-password" autocapitalize="off" spellcheck={false} disabled={isLoading} />
            <IonInput type="password" value={formData.confirmPassword} placeholder="Confirm Password" className={`custom-input ${error && error.includes("Passwords") ? 'error-bg' : ''}`} onIonInput={handleChange("confirmPassword")} autocomplete="new-password" autocapitalize="off" spellcheck={false} disabled={isLoading} />
          </div>
          <IonButton expand="block" className="signup-button" onClick={handleSignUp} disabled={isLoading}>{isLoading ? "Creating Account..." : "Sign Up"}</IonButton>
          <div className="login-text" onClick={handleLogin}>Already have an account? Log in</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;