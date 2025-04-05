"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./styles.css";

interface FormData {
  name: string;
  lname: string;
  email: string;
  photo: string;
  dob: string;
  telephone: string;
  genre: string;
  gouvernorat: string;
  ville: string;
  password: string;
  confirmPassword: string;
}

const EditProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null); // Store the selected file temporarily
  const [isPhotoChanged, setIsPhotoChanged] = useState(false); // To track if the photo was changed

  const [formData, setFormData] = useState<FormData>({
    name: "",
    lname: "",
    email: "",
    photo: "",
    dob: "",
    telephone: "",
    genre: "",
    gouvernorat: "",
    ville: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const gouvernoratsVilles: { [key: string]: string[] } = {
    "Tunis": ["Tunis", "La Marsa", "Carthage", "Le Bardo"],
    "Ariana": ["Ariana", "Menzeh"],
    "Sfax": ["Sfax", "Kerkennah", "Skhira", "Mahares"],
    "Sousse": ["Sousse", "Hergla", "Khezama", "Sidi Bou Ali"],
    "Nabeul": ["Nabeul", "Hammamet", "Kelibia", "Menzel Bouzelfa"],
    "Kairouan": ["Kairouan", "El Alâa", "Sidi Salah", "Haffouz"],
    "Gabès": ["Gabès", "Matmata"],
    "Médenine": ["Médenine", "Zarzis"],
    "Tozeur": ["Tozeur", "Nefta", "Tamerza"],
    "Bizerte": ["Bizerte", "Menzel Bourguiba", "Rafraf", "Mateur"],
    "Mahdia": ["Mahdia", "El Jem", "Chebba", "Cousa"],
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.user;

      setUser(user);
      setFormData({
        name: user.name || "",
        lname: user.lname || "",
        email: user.email || "",
        photo: user.photo || "",
        dob: user.dob || "",
        telephone: user.telephone || "",
        genre: user.genre || "",
        gouvernorat: user.gouvernorat || "",
        ville: user.ville || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "gouvernorat" ? { ville: "" } : {}), // Reset ville when gouvernorat changes
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Temporarily store the file and mark photo as changed
    setPhotoFile(file);
    setIsPhotoChanged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      const payload: any = { ...formData };
      delete payload.confirmPassword;

      // If a new photo file is selected, upload it and update the photo URL
      if (photoFile) {
        const imageData = new FormData();
        imageData.append("photo", photoFile);

        const response = await axios.post("http://localhost:8000/api/upload-photo", imageData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        payload.photo = response.data.photoUrl;  // Add the photo URL to the payload
      }

      await axios.patch("http://localhost:8000/api/user", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Profil mis à jour !");
      router.push("/profile");
    } catch (error: any) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  const handleCancel = () => {
    if (isPhotoChanged || Object.values(formData).some(value => value !== "")) {
      const confirmDiscard = window.confirm("Voulez-vous vraiment annuler les modifications ?");
      if (confirmDiscard) {
        router.push("/profile"); // Navigate back to profile if confirmed
      }
    } else {
      router.push("/profile"); // Navigate back if no changes were made
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!user) return null;

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Modifier le profil</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="profile-photo-wrapper">
          <input type="file" accept="image/*" id="photoUpload" style={{ display: "none" }} onChange={handlePhotoChange} />
          <label htmlFor="photoUpload" className="profile-photo-label">
            <img
              src={photoFile ? URL.createObjectURL(photoFile) : formData.photo || "/default-profile.png"}
              alt="Profile"
              className="profile-image"
            />
            <div className="edit-icon">✎</div>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group"><label>Nom</label><input name="name" value={formData.name} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Prénom</label><input name="lname" value={formData.lname} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Date de naissance</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Téléphone</label><input name="telephone" value={formData.telephone} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Genre</label>
            <select name="genre" value={formData.genre} onChange={handleInputChange}>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>

          {/* Gouvernorat and Ville dropdowns */}
          <div className="form-group">
            <label>Gouvernorat</label>
            <select name="gouvernorat" value={formData.gouvernorat} onChange={handleInputChange}>
              <option value="">Sélectionnez un gouvernorat</option>
              {Object.keys(gouvernoratsVilles).map((gouv, index) => (
                <option key={index} value={gouv}>{gouv}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ville</label>
            <select name="ville" value={formData.ville} onChange={handleInputChange} disabled={!formData.gouvernorat}>
              <option value="">Sélectionnez une ville</option>
              {formData.gouvernorat && gouvernoratsVilles[formData.gouvernorat]?.map((ville, index) => (
                <option key={index} value={ville}>{ville}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="update-button">Modifier</button>
          <button type="button" className="back-button" onClick={handleCancel}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
