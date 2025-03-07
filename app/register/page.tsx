// pages/register/page.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "../register/styles.css";  // Import styles from the local styles.css

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
    } else {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/register", {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        });
        console.log("Inscription réussie:", response.data);
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h2>Inscription</h2>
        <form onSubmit={handleRegister}>
          <div className="input-field">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez votre nom"
              required
            />
          </div>

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
              <button
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="confirmPassword">Confirmer mot de passe</label>
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility2}
              >
                {showPassword2 ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="button">S'inscrire</button>
        </form>

        <div className="footer">
          <span>Déjà inscrit(e) ? </span>
          <a href="/login">Connectez-vous</a>
        </div>
      </div>
    </div>
  );
}
