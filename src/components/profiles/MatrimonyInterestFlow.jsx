// src/components/profiles/MatrimonyInterestFlow.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── INTEREST RESPONSE PAGE ───────────────────────────────────────────────────
export function InterestResponsePage({ senderProfile, recipientIsUpgraded, onUpgrade }) {
  const [step, setStep] = useState("respond");
  const navigate = useNavigate();

  const sender = senderProfile || {
    id: "demo-123",
    name: "Arjun Kumar",
    age: 28,
    gender: "Male",
    religion: "Hindu",
    caste: "MBC",
    education: "B.E. Computer Science",
    profession: "Software Engineer",
    district: "Coimbatore",
    state: "Tamil Nadu",
    annualIncome: 600000,
    photos: [],
    membershipType: "GOLD",
  };

  const handleInterested = () => {
  if (recipientIsUpgraded) {
    setStep("verify");
  } else {
    setStep("upgrade");
  }
};

  const handleUpgrade = (planId) => {
    if (onUpgrade) {
      onUpgrade(planId);
    } else {
      navigate("/upgrade?plan=" + planId);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem", fontFamily: "Georgia, serif" }}>
      {step === "respond" && (
        <RespondStep
          sender={sender}
          onInterested={handleInterested}
          onNotInterested={() => setStep("declined")}
        />
      )}
      {step === "upgrade" && (
        <UpgradePromptSection onUpgrade={handleUpgrade} />
      )}
      {step === "verify" && (
        <VerifyCredentialsStep sender={sender} onVerified={() => setStep("revealed")} />
      )}
      {step === "revealed" && (
        <RevealedContactStep sender={sender} />
      )}
      {step === "declined" && (
        <DeclinedStep />
      )}
    </div>
  );
}

// ─── STEP 1: Respond ─────────────────────────────────────────────────────────
function RespondStep({ sender, onInterested, onNotInterested }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #7f1d1d, #b91c1c)",
          color: "#fff", padding: "6px 20px", borderRadius: 999,
          fontSize: 12, fontFamily: "sans-serif", letterSpacing: "0.12em", marginBottom: 16,
        }}>
          ELITEINOVA MATRIMONY
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
          Someone is Interested in You 💍
        </h1>
        <p style={{ color: "#6b7280", fontFamily: "sans-serif", fontSize: 14, margin: 0 }}>
          Review their profile and respond below
        </p>
      </div>

      <SenderProfileCard profile={sender} />

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          onClick={onNotInterested}
          style={{
            flex: 1, padding: "14px 0", border: "2px solid #d1d5db",
            borderRadius: 12, background: "#fff", color: "#6b7280",
            fontSize: 16, fontFamily: "sans-serif", cursor: "pointer", fontWeight: 600,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#6b7280"; }}
        >
          ✕  Not Interested
        </button>
        <button
          onClick={onInterested}
          style={{
            flex: 1, padding: "14px 0", border: "none", borderRadius: 12,
            background: "linear-gradient(135deg, #b91c1c, #dc2626)",
            color: "#fff", fontSize: 16, fontFamily: "sans-serif",
            cursor: "pointer", fontWeight: 700, boxShadow: "0 4px 20px rgba(185,28,28,0.35)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
        >
          ♥  Interested
        </button>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 16, fontFamily: "sans-serif" }}>
        Your response will be kept confidential
      </p>
    </div>
  );
}

// ─── Sender Profile Card ──────────────────────────────────────────────────────
function SenderProfileCard({ profile }) {
  const initials = (profile.name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const mem = (profile.membershipType || "SILVER").toUpperCase();
  const memberColor = mem === "GOLD" ? "#d97706" : mem === "DIAMOND" ? "#be185d" : "#b91c1c";
  const memberLabel = mem === "GOLD" ? "Gold" : mem === "DIAMOND" ? "Diamond" : "Silver";
  const isFemale = (profile.gender || "").toLowerCase().includes("female");

  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f3f4f6", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div style={{
        height: 200,
        background: isFemale ? "linear-gradient(135deg, #fce7f3, #fbcfe8)" : "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      }}>
        {profile.photos && profile.photos[0] ? (
          <img src={profile.photos[0]} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 56, fontWeight: 700, color: isFemale ? "#be185d" : "#1e40af", opacity: 0.7 }}>
            {initials}
          </span>
        )}
        <span style={{ position: "absolute", top: 12, right: 12, background: memberColor, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, fontFamily: "sans-serif" }}>
          {memberLabel}
        </span>
        <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 12, padding: "4px 10px", borderRadius: 999, fontFamily: "sans-serif" }}>
          {profile.age} yrs
        </span>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#111" }}>{profile.name}</h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", fontFamily: "sans-serif" }}>
          {profile.district}, {profile.state}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", fontFamily: "sans-serif" }}>
          {[["Religion", profile.religion], ["Caste", profile.caste], ["Education", profile.education], ["Profession", profile.profession || profile.occupation]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{val || "Not specified"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: Upgrade Prompt ───────────────────────────────────────────────────
export function UpgradePromptSection({ onUpgrade }) {
  const navigate = useNavigate();

  const plans = [
    {
      id: "SILVER",
      name: "Silver",
      price: "1,000",
      period: "+ tax / 3 months",
      badge: "Silver",
      color: "#6b7280",
      bg: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
      btnBg: "linear-gradient(135deg, #6b7280, #4b5563)",
      features: ["View contact details", "Send 50 interests/month", "Basic filters"],
    },
    {
      id: "GOLD",
      name: "Gold",
      price: "2,999",
      period: "/ 3 months",
      badge: "Gold",
      color: "#b45309",
      bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
      border: "#fcd34d",
      btnBg: "linear-gradient(135deg, #d97706, #b45309)",
      popular: true,
      features: ["Unlimited contact views", "Priority search", "Advanced filters", "Support manager"],
    },
    {
      id: "DIAMOND",
      name: "Diamond",
      price: "9,999",
      period: "/ 6 months",
      badge: "Diamond",
      color: "#be185d",
      bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
      btnBg: "linear-gradient(135deg, #ec4899, #be185d)",
      features: ["All Gold features", "Personal matchmaker", "Astrology reports", "24/7 VIP support"],
    },
  ];

  const handleClick = (planId) => {
    if (onUpgrade) {
      onUpgrade(planId);
    } else {
      navigate("/upgrade?plan=" + planId);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #fef3c7, #fde68a)",
          border: "2px solid #fcd34d",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: 28,
        }}>
          🔒
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "#111", fontFamily: "Georgia, serif" }}>
          Upgrade to Connect
        </h2>
        <p style={{ color: "#6b7280", fontFamily: "sans-serif", fontSize: 14, margin: "0 0 4px" }}>
          Great news — they are interested in you!
        </p>
        <p style={{ color: "#374151", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, margin: 0 }}>
          Upgrade your membership to view their full contact details.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background: plan.bg,
            border: "2px solid " + (plan.popular ? (plan.border || "#fcd34d") : "#e5e7eb"),
            borderRadius: 16, padding: "20px 24px", position: "relative",
          }}>
            {plan.popular && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: "#d97706", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "4px 16px",
                borderRadius: 999, fontFamily: "sans-serif",
              }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: plan.color, fontFamily: "Georgia, serif", marginBottom: 4 }}>
                  {plan.name}
                </div>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                  {plan.features.join(" · ")}
                </div>
                <div style={{ fontFamily: "sans-serif" }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>Rs.{plan.price}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>{plan.period}</span>
                </div>
              </div>
              <button
                onClick={() => handleClick(plan.id)}
                style={{
                  background: plan.btnBg, color: "#fff", border: "none", borderRadius: 10,
                  padding: "12px 28px", fontSize: 14, fontWeight: 700, fontFamily: "sans-serif",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
              >
                Upgrade to {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20, padding: "12px 16px",
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#166534",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>i</span>
        After upgrading, verify your account to unlock full contact details instantly.
      </div>
    </div>
  );
}

// ─── STEP 3: Verify Credentials ───────────────────────────────────────────────
export function VerifyCredentialsStep({ sender, onVerified }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.identifier || !form.password) {
      setError("Please enter your username/email and password.");
      return;
    }
    setLoading(true);
    // TODO: Replace with your real auth call: await authService.verify(form)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onVerified && onVerified();
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", fontSize: 26,
        }}>
          🔐
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
          Verify Your Identity
        </h2>
        <p style={{ color: "#6b7280", fontFamily: "sans-serif", fontSize: 13, margin: 0 }}>
          Confirm your account to reveal {sender && sender.name ? sender.name + "'s" : "their"} full contact details
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "sans-serif", display: "block", marginBottom: 6 }}>
              Username or Email
            </label>
            <input
              type="text"
              value={form.identifier}
              onChange={e => setForm(function(p) { return Object.assign({}, p, { identifier: e.target.value }); })}
              placeholder="your@email.com or username"
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#b91c1c"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "sans-serif", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(function(p) { return Object.assign({}, p, { password: e.target.value }); })}
              placeholder="Enter your password"
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#b91c1c"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
            />
          </div>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#b91c1c", fontFamily: "sans-serif" }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px 0",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #b91c1c, #dc2626)",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700, fontFamily: "sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify and View Contact Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── STEP 4: Revealed Contact ─────────────────────────────────────────────────
export function RevealedContactStep({ sender }) {
  const profile = sender || {};
  const phone = (profile.mobile || "").replace(/\D/g, "");
  const waMsg = encodeURIComponent("Hello " + (profile.name || "") + "! I saw your profile on Eliteinova Matrimony and I am interested in connecting with you.");

  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
          You are Connected!
        </h2>
        <p style={{ color: "#6b7280", fontFamily: "sans-serif", fontSize: 13 }}>
          Here are {profile.name || "their"}'s full contact details
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, border: "2px solid #bbf7d0", padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#be185d",
          }}>
            {(profile.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif" }}>{profile.name}</div>
            <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "sans-serif" }}>
              {profile.age} yrs · {profile.district}, {profile.state}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "📱", label: "Mobile", value: profile.mobile || "Not provided" },
            { icon: "📧", label: "Email", value: profile.email || "Not provided" },
            { icon: "📍", label: "Location", value: (profile.district || "") + ", " + (profile.state || "") },
            { icon: "💼", label: "Profession", value: profile.profession || profile.occupation || "Not specified" },
            { icon: "💰", label: "Annual Income", value: profile.annualIncome ? "Rs." + Number(profile.annualIncome).toLocaleString("en-IN") : "Not disclosed" },
          ].map(function(item) {
            return (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16, width: 24 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif" }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111", fontFamily: "sans-serif" }}>{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {phone && (
          <a
            href={"https://wa.me/" + phone + "?text=" + waMsg}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              marginTop: 20, padding: "13px 0",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", borderRadius: 10,
              fontFamily: "sans-serif", fontWeight: 700, fontSize: 14,
              textDecoration: "none",
            }}
          >
            Message on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

// ─── DECLINED ─────────────────────────────────────────────────────────────────
function DeclinedStep() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🙏</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginBottom: 8 }}>
        Thank you for responding
      </h2>
      <p style={{ color: "#6b7280", fontFamily: "sans-serif", fontSize: 14 }}>
        We have noted your response. The interested person will be notified privately.
      </p>
      <button
        onClick={() => navigate("/profiles")}
        style={{
          marginTop: 24, padding: "12px 32px",
          background: "linear-gradient(135deg, #b91c1c, #dc2626)",
          color: "#fff", border: "none", borderRadius: 10,
          fontFamily: "sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}
      >
        Browse Profiles
      </button>
    </div>
  );
}

// ─── PROFILE PHOTO EDITOR ─────────────────────────────────────────────────────
export function ProfilePhotoEditor({ photos, isEditing, onUpload, onRemove, activeImage, onSetActive, formatImageUrl, profileName }) {
  const safePhotos = photos || [];
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);

  const validPhotos = safePhotos.filter(function(p) { return p && p.trim(); });
  const currentPhoto = safePhotos[activeImage] && safePhotos[activeImage].trim() ? safePhotos[activeImage] : validPhotos[0];

  const getUrl = function(photo) {
    if (!photo) return null;
    if (typeof formatImageUrl === "function") return formatImageUrl(photo);
    return photo;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 200, height: 200, borderRadius: 20,
          border: isEditing ? "3px dashed #b91c1c" : "4px solid #fff",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
          cursor: isEditing ? "pointer" : "default",
        }}
        onClick={function() { if (isEditing && fileRef.current) fileRef.current.click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragging(true); }}
        onDragLeave={function() { setDragging(false); }}
        onDrop={function(e) {
          e.preventDefault(); setDragging(false);
          if (isEditing && e.dataTransfer.files.length > 0 && onUpload) {
            onUpload({ target: { files: e.dataTransfer.files } });
          }
        }}
      >
        {currentPhoto ? (
          <img
            src={getUrl(currentPhoto)}
            alt={profileName || "Profile"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 44, fontWeight: 700, color: "#be185d" }}>
              {(profileName || "U")[0].toUpperCase()}
            </span>
            {isEditing && (
              <span style={{ fontSize: 11, color: "#be185d", fontFamily: "sans-serif" }}>Click to upload</span>
            )}
          </div>
        )}
        {dragging && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(185,28,28,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#b91c1c", fontFamily: "sans-serif", fontWeight: 600 }}>
            Drop photo here
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" multiple accept="image/*" onChange={onUpload} style={{ display: "none" }} />

      {validPhotos.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 220 }}>
          {validPhotos.map(function(photo, idx) {
            const originalIndex = safePhotos.indexOf(photo);
            return (
              <div key={idx} style={{ position: "relative" }}>
                <button
                  onClick={function() { if (onSetActive) onSetActive(originalIndex); }}
                  style={{
                    width: 44, height: 44, borderRadius: 10, overflow: "hidden",
                    border: "2px solid " + (activeImage === originalIndex ? "#b91c1c" : "#e5e7eb"),
                    cursor: "pointer", padding: 0, background: "none",
                  }}
                >
                  <img src={getUrl(photo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
                {isEditing && (
                  <button
                    onClick={function() { if (onRemove) onRemove(originalIndex); }}
                    style={{
                      position: "absolute", top: -6, right: -6,
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#ef4444", color: "#fff", border: "none",
                      cursor: "pointer", fontSize: 9, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    x
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isEditing && (
        <button
          onClick={function() { if (fileRef.current) fileRef.current.click(); }}
          style={{
            padding: "9px 24px",
            background: validPhotos.length === 0 ? "linear-gradient(135deg, #b91c1c, #dc2626)" : "transparent",
            color: validPhotos.length === 0 ? "#fff" : "#b91c1c",
            border: "2px solid " + (validPhotos.length === 0 ? "transparent" : "#b91c1c"),
            borderRadius: 10, fontFamily: "sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}
        >
          {validPhotos.length === 0 ? "Upload Photo" : "Add Photo (" + validPhotos.length + "/6)"}
        </button>
      )}
    </div>
  );
}

// ─── PHONE EDITOR ─────────────────────────────────────────────────────────────
export function PhoneEditor({ value, isEditing, onChange }) {
  const [error, setError] = useState("");

  const validate = function(val) {
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length === 0) { setError(""); return; }
    if (cleaned.length < 10) { setError("Must be 10 digits"); return; }
    setError("");
  };

  const handleChange = function(e) {
    validate(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  if (!isEditing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb", fontFamily: "sans-serif" }}>
        <span style={{ fontSize: 16 }}>📱</span>
        <div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>Mobile</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: value ? "#111" : "#9ca3af" }}>
            {value || "Not provided"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "sans-serif", display: "block", marginBottom: 6 }}>
        Mobile Number
      </label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#6b7280", fontFamily: "sans-serif", fontWeight: 600 }}>
          +91
        </span>
        <input
          type="tel"
          value={value || ""}
          onChange={handleChange}
          placeholder="98765 43210"
          maxLength={10}
          style={{
            width: "100%", padding: "11px 14px 11px 44px",
            border: "1.5px solid " + (error ? "#ef4444" : "#e5e7eb"),
            borderRadius: 10, fontSize: 14, fontFamily: "sans-serif",
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={function(e) { if (!error) e.currentTarget.style.borderColor = "#b91c1c"; }}
          onBlur={function(e) { if (!error) e.currentTarget.style.borderColor = "#e5e7eb"; }}
        />
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", margin: "4px 0 0", fontFamily: "sans-serif" }}>{error}</p>
      )}
    </div>
  );
}