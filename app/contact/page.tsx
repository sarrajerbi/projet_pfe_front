"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulaire soumis :", formData);
  };

  return (
    <div className="container mt-5">
      {/* Bannière promo */}
      <div className="alert alert-primary text-center fw-bold" role="alert">
        🎉 Économisez 15 % ! Contactez-nous maintenant !
      </div>

      {/* Section Contact */}
      <div className="text-center">
        <h2 className="fw-bold">Contact</h2>
        <p className="text-muted">Besoin d'aide ? Contactez-nous.</p>
      </div>

      {/* Informations de contact */}
      <div className="row text-center my-4">
        <div className="col-md-6">
          <h5>📞 Appelez-nous</h5>
          <p className="fw-bold">+216 22 487 777</p>
        </div>
        <div className="col-md-6">
          <h5>📧 Envoyez-nous un courriel</h5>
          <p className="fw-bold">contact@freeoui.com</p>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nom" className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                id="nom"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Votre e-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows={4}
                placeholder="Votre message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Soumettre</button>
          </form>
        </div>
      </div>
    </div>
  );
}
