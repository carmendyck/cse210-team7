import { IonButton, IonContent, IonInput, IonPage, IonText } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Signup.css";

const SignUp: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState("");

  const handleChange = (field: string) => (event: CustomEvent) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.detail.value || "",
    }));
    setErrors(prev => ({
      ...prev,
      [field]: false,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      fullName: !formData.fullName.trim(),
      email: !/\S+@\S+\.\S+/.test(formData.email),
      password: formData.password.length < 6,
      confirmPassword: formData.password !== formData.confirmPassword,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

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
        setMessage("Account created successfully! Redirecting...");
        setTimeout(() => history.push("/tasklist"), 2000);
      } else {
        setMessage(`${data.error}`);
      }
    } catch (error) {
      setMessage("Error signing up. Please try again.");
    }
  };

  const handleLogin = () => {
    history.push("/login");
  };

  return (
    <IonPage>
      <IonContent className="signup-container">
        <div className="signup-box">
          <h1>Sign Up</h1>
          <p className="welcome-text">Create an account to continue</p>

          {message && <p className="message-text">{message}</p>}

          <div className="input-group">
            <IonInput
              type="text"
              value={formData.fullName}
              placeholder="Full Name"
              className={`custom-input ${errors.fullName ? 'error' : ''}`}
              onIonInput={handleChange("fullName")}
            />
            {errors.fullName && <span className="required-indicator">*</span>}
          </div>

          <div className="input-group">
            <IonInput
              type="email"
              value={formData.email}
              placeholder="Email"
              className={`custom-input ${errors.email ? 'error' : ''}`}
              onIonInput={handleChange("email")}
            />
            {errors.email && <span className="required-indicator">*</span>}
          </div>

          <div className="input-group">
            <IonInput
              type="password"
              value={formData.password}
              placeholder="Password"
              className={`custom-input ${errors.password ? 'error' : ''}`}
              onIonInput={handleChange("password")}
            />
            {errors.password && <span className="required-indicator">*</span>}
          </div>

          <div className="input-group">
            <IonInput
              type="password"
              value={formData.confirmPassword}
              placeholder="Confirm Password"
              className={`custom-input ${errors.confirmPassword ? 'error' : ''}`}
              onIonInput={handleChange("confirmPassword")}
            />
            {errors.confirmPassword && <span className="required-indicator">*</span>}
          </div>

          <IonButton expand="block" className="signup-button" onClick={handleSignUp}>
            Sign Up
          </IonButton>

          <IonText className="login-link" onClick={handleLogin}>
            Already have an account? Please Log in!
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
