"use client";  // Add this at the top of your file

import { useRouter } from "next/navigation"; 
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "../login/styles.css";

export default function LoginPage() {
  const router = useRouter(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
  
      console.log("Connexion réussie:", response.data);
  
      const { token, user } = response.data; // Ensure your backend sends `user` with `role`
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role); // Store role in localStorage
  
      // Redirect based on role
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/profile");
      }
  
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Identifiants incorrects.");
    }
  };
  

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/api/auth/google";
  };

  const handleFacebookLogin = () => {
    // Redirect to your backend to handle Facebook login
    window.location.href = "http://127.0.0.1:8000/api/auth/facebook";
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>Se connecter</h2>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
              <button type="button" onClick={togglePasswordVisibility} className="eye-button">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              <div className="forgot-password">
                <a href="/forgot-password">Mot de passe oublié ?</a>
              </div>
            </div>
          </div>

          <button type="submit" className="button">Se connecter</button>
        </form>

        <div className="google-login">
          <button className="google-button" onClick={handleGoogleLogin}>
            <img src="/google.png" alt="Google Icon" className="google-icon" />
            Se connecter avec Google
          </button>
        </div>

        <div className="facebook-login">
          <button className="facebook-button" onClick={handleFacebookLogin}>
            <img src="/facebook.png" alt="Facebook Icon" className="facebook-icon" />
            Se connecter avec Facebook
          </button>
        </div>

        <div className="footer">
          <span>Pas encore inscrit(e)? </span>
          <a href="/register">S'inscrire</a>
        </div>
      </div>
    </div>
  );
}
