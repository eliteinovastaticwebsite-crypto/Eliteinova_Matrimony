// src/pages/InterestResponsePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import profileService from "../services/profileService";
import {
  InterestResponsePage as InterestFlow,
} from "../components/profiles/MatrimonyInterestFlow";
 
export default function InterestResponsePage() {
  const { profileId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [senderProfile, setSenderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Check if logged-in user is upgraded
  const isUpgraded = !!(user?.membership &&
    ["GOLD", "DIAMOND"].includes(user.membership.toUpperCase()));
 
  useEffect(() => {
    const fetchSender = async () => {
      try {
        // Fetch the profile of the person who expressed interest
        const data = await profileService.getProfileById(profileId);
        setSenderProfile(data?.profile || data);
      } catch (err) {
        console.error("Could not load sender profile", err);
      } finally {
        setLoading(false);
      }
    };
    if (profileId) fetchSender();
  }, [profileId]);
 
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid #b91c1c", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#6b7280", fontFamily: "sans-serif" }}>Loading profile...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
 
  return (
    <InterestFlow
      senderProfile={senderProfile}
      recipientIsUpgraded={isUpgraded}
      onUpgrade={(planId) => navigate(`/upgrade?plan=${planId}`)}
    />
  );
}