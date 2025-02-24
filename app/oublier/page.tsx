"use client" ; 
import {useState} from "react" ; 
import axios from "axios";
import Link from "next/link";



export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
  
    const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/forgot-password", {
          email,
        });
        setMessage("Un email de réinitialisation a été envoyé !");
      } catch (error) {
        console.error("Erreur lors de la demande de réinitialisation:", error);
        setMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    };
    

return(
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="card w-96 bg-white shadow-xl rounded-xl p-8">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Mot de passe oublié
      </h2>

      <p className="text-gray-600 text-center mb-4">
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </p>

      {message && <p className="text-center text-green-600">{message}</p>}

      <form onSubmit={handleResetRequest}>
          <div className="mb-6">
            <label htmlFor="email" className="label text-gray-600">
              <span className="label-text">Adresse email</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-color transition duration-300"
              placeholder="Entrez votre adresse email"
              required
            />
          </div>

          <button type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
                        Envoyer le lien 
        </button>

        <div className="text-center mt-6">
          <Link href="login">
            <span className="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">
              Retour à la connexion
            </span>
          </Link>
        </div>
     </form>
</div>
</div>
);
}