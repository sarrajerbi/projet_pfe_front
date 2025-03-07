"use client"; // Ensure this file is treated as a client component

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import "../profile/styles.css"; // Import the CSS file here

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch the user data with authentication token
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token for authentication
        },
      });

      console.log("User data:", response.data);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile data:", error);
      setError("Failed to load profile data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData(); // Call the function inside useEffect when the component mounts
  }, []); // Empty dependency array means it will run only once

  // Handle adding to favoris
  const handleFavoris = () => {
    axios
      .post("http://localhost:8000/api/profile/favoris", { favoris: "some_favoris" }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token to headers
        },
      })
      .then(() => alert("Added to favoris"))
      .catch(() => alert("Error adding favoris"));
  };

  // Handle adding points
  const handlePoints = () => {
    axios
      .post("http://localhost:8000/api/profile/points", { points: 10 }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token to headers
        },
      })
      .then(() => alert("Points added"))
      .catch(() => alert("Error adding points"));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h2>MyApp</h2>
        </div>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/profile">Profil</Link>
          </li>
        </ul>
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-photo-container">
            <img
              src={user?.photo || "/default-avatar.png"} // Fallback to default avatar if no photo
              alt="User Photo"
              className="profile-photo"
            />
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="email">{user?.email}</p>
            <div className="buttons">
              <button onClick={handleFavoris} className="action-button">
                Favoris
              </button>
              <button onClick={handlePoints} className="action-button">
                Mes Points
              </button>
            </div>
          </div>
        </div>

        <div className="profile-links">
          <Link href="/edit-profile" className="profile-link">
            Éditer mes informations personnelles
          </Link>
          <Link href="/edit-categories" className="profile-link">
            Modifier mes catégories
          </Link>
          <Link href="/contact-us" className="profile-link">
            Contacter-nous
          </Link>
          <Link href="/delete-account" className="profile-link danger">
            Supprimer mon compte
          </Link>
          <Link href="/logout" className="profile-link">
            Déconnexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
