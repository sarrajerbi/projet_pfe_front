"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../admin/styles.css"; 

export default function AdminHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (!token || storedRole !== "admin") {
      router.push("/login"); // Redirect to login if not admin
    } else {
      setIsAuthenticated(true);
      setRole(storedRole); // Store the role for further use
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login"); // Redirect to login page
  };

  return (
    isAuthenticated && (
      <div className="home">
        <div className="sidebar">
          <h2>Admin Panel</h2>
          <ul>
            <li onClick={() => router.push("/admin/dashboard")}>Dashboard</li>
            <li onClick={() => router.push("/admin/utilisateurs")}>Utilisateurs</li>
            <li onClick={() => router.push("/admin/categories")}>Categories</li>
            <li onClick={() => router.push("/admin_profile")}>Profile</li>
            <li onClick={handleLogout}>Deconnexion</li>
          </ul>
        </div>

        <div className="content">
          {/* Display Dashboard or other content based on routing */}
          <h1>Welcome to the Admin Dashboard</h1>
        </div>
      </div>
    )
  );
}
