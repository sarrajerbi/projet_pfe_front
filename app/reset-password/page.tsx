"use client" ;

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react"; 

export default function PasswordReset() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Vérifier les paramètres
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showPassword2, setShowPassword2] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };


  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
    } else {
      setMessage("Lien invalide ou expiré.");
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!token || !email) {
      setMessage("Lien invalide ou expiré.");
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/reset-password", { // Changer 127.0.0.1 en localhost
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: confirmPassword, // Assurez-vous que ce champ est bien envoyé
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Mot de passe réinitialisé avec succès !");
        setTimeout(() => {
          router.push('/'); 
        }, 3000);
      } else {
        setMessage(data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur.");
      console.error("Erreur de connexion :", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Réinitialisation du mot de passe</h2>

        {message && <p className="text-center text-red-500">{message}</p>}

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input type="email" value={email} readOnly className="w-full p-2 border rounded bg-gray-200" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Nouveau mot de passe</label>
            <div className="input-group">
            <input
                type={showPassword ? "text" : "password"}
                value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
                 <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Confirmer le mot de passe</label>
            <div className="input-group">
            <input
                type={showPassword2 ? "text" : "password"}
                value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility2}
                >
                  {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}

