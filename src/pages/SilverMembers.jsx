import React from "react";
import ProfilesList from "../components/profiles/ProfilesList";


export default function SilverMembers() {
return (
<div className="min-h-screen bg-[#F8F8F8] bg-cover bg-center" style={{ backgroundImage: "url('/silver-bg.jpg')" }}>
<ProfilesList />
</div>
);
}