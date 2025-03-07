"use client";
import { useRouter } from "next/navigation"; // Correct import for Next.js App Router
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "../login/styles.css";  

export default function LoginPage() {
  const router = useRouter(); // ✅ Place `useRouter()` inside the function component

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

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to the profile page
      router.push("/profile");  
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Identifiants incorrects.");
    }
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
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="button">Se connecter</button>
        </form>

        <div className="footer">
          <span>Pas encore inscrit(e)? </span>
          <a href="/register">S'inscrire</a>
        </div>
      </div>
    </div>
  );
}
