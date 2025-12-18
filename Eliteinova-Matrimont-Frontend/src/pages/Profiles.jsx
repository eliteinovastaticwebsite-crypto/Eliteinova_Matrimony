// src/pages/ProfilesPage.jsx
import React from "react";
import ProfilesList from "../components/profiles/ProfilesList";

export default function Profiles() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfilesList />
    </div>
  );
}