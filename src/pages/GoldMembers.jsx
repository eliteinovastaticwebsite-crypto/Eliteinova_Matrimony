import React from "react";
import ProfilesList from "../components/profiles/ProfilesList";


export default function GoldMembers() {
return (
<div className="min-h-screen bg-[#FFF8E1] bg-cover bg-center" style={{ backgroundImage: "url('/gold-bg.jpg')" }}>
<ProfilesList />
</div>
);
}