"use client"; // Ensure this file is treated as a client component

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use next/navigation for routing in Next.js 13+
import "./styles.css"; // Ensure the correct CSS file path

const EditProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    photo: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          photo: response.data.photo || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      await axios.patch(
        "http://localhost:8000/api/user", 
        { name: formData.name, email: formData.email, photo: formData.photo }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      alert("Profile updated successfully!");
      router.push("/profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        {formData.photo && <img src={formData.photo} alt="Profile" className="profile-image" />}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Profile Photo URL</label>
            <input type="text" id="photo" name="photo" value={formData.photo} onChange={handleInputChange} />
          </div>

          <button type="submit" className="update-button">Save Changes</button>
        </form>

        <button className="back-button" onClick={() => router.push("/profile")}>Back to Profile</button>
      </div>
    </div>
  );
};

export default EditProfilePage;
