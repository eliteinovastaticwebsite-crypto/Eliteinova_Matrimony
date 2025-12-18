import React from "react";
import ProfilesList from "../components/profiles/ProfilesList";


export default function DiamondMembers() {
return (
<div className="min-h-screen bg-[#F0F7FF] bg-cover bg-center" style={{ backgroundImage: "url('/diamond-bg.jpg')" }}>
<ProfilesList />
</div>
);
}