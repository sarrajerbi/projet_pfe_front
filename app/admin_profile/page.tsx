"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./styles.css";

interface FormData {
  name: string;
  lname: string;
  email: string;
  new_password: string;
  confirmPassword: string;
  photo: string; // still needed for displaying the profile image, but not sent in update
}

const admin_profile = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    lname: "",
    email: "",
    photo: "",
    new_password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }
  
      const response = await axios.get("http://localhost:8000/api/admin/profile", {
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
        new_password: "",
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
    }));
  };
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }
  
      const imageData = new FormData();
      imageData.append("photo", file);
  
      const response = await axios.put("http://localhost:8000/api/admin/profile", imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Update the photo URL in formData state
      setFormData((prev) => ({ ...prev, photo: response.data.user.photo }));
      setSuccessMessage("Photo mise à jour !");
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError("Échec de la mise à jour de la photo.");
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      const payload = {
        name: formData.name,
        lname: formData.lname,
        email: formData.email,
        new_password: formData.new_password,
        new_password_confirmation: formData.confirmPassword,
      };

      await axios.put("http://localhost:8000/api/admin/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Profil mis à jour !");
      router.push("/admin_profile");
    } catch (error: any) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!user) return null;

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Profil</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="profile-photo-wrapper">
          <input type="file" accept="image/*" id="photoUpload" style={{ display: "none" }} onChange={handlePhotoChange} />
          <label htmlFor="photoUpload" className="profile-photo-label">
            <img
              src={formData.photo || "/default-profile.png"}
              alt="Profile"
              className="profile-image"
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group"><label>Nom</label><input name="name" value={formData.name} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Prénom</label><input name="lname" value={formData.lname} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div>
          <div className="form-group"><label>New Password</label><input type="password" name="new_password" value={formData.new_password} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} /></div>

          <button type="submit" className="update-button">Modifier</button>
          <button type="button" className="back-button" onClick={() => router.push("/admin_profile")}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default admin_profile;
