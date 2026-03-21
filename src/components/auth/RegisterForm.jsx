// src/components/auth/RegisterForm.jsx (UPDATED VERSION)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../ui/Stepper";
import StepperController from "../ui/StepperControl";
import FloatingInput from "../ui/FloatingInput";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";

const MEMBERSHIP_PLANS = {
  SILVER: {
  label: "SILVER", price: 299, tax: 53.82, icon: "🥈",
  color: "#16a34a",
  gradient: "linear-gradient(135deg, #86efac 0%, #22c55e 50%, #16a34a 100%)",
  route: "/silver-members",
  perks: ["50 Interests/month", "Basic Profile Visibility", "Email Support"],
},
  GOLD: {
    label: "GOLD", price: 499, tax: 89.82, icon: "🥇",
    color: "#D97706",
    gradient: "linear-gradient(135deg, #FCD34D 0%, #D97706 100%)",
    route: "/gold-members",
    perks: ["150 Interests/month", "Priority Visibility", "Chat Access", "Phone Support"],
  },
  DIAMOND: {
  label: "DIAMOND", price: 749, tax: 134.82, icon: "💎",
  color: "#be185d",
  gradient: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 30%, #db2777 55%, #ec4899 75%, #f472b6 100%)",
  route: "/diamond-members",
  perks: ["Unlimited Interests", "Top Profile Boost", "Video Call Access", "Dedicated Manager"],
},
};
 
// ─── PaymentSummary Component ─────────────────────────────────────────────────
function PaymentSummary({ plan, onProceed, onBack }) {
  const p = MEMBERSHIP_PLANS[plan];
  const total = (p.price + p.tax).toFixed(2);
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="text-4xl mb-2">{p.icon}</div>
        <h3 className="text-xl font-bold text-gray-800">{p.label} Membership</h3>
        <p className="text-sm text-gray-500">3 Months Subscription</p>
      </div>
      <div className="rounded-2xl border-2 overflow-hidden shadow-lg" style={{ borderColor: p.color }}>
        <div className="p-1" style={{ background: p.gradient }}>
          <div className="bg-white rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-700 text-base">Payment Summary</span>
              <span className="text-xs px-2 py-1 rounded-full text-white font-bold" style={{ background: p.gradient }}>{p.label}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{p.label} Registration Fee</span>
              <span className="font-semibold">₹{p.price}.00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax (18% GST)</span>
              <span>₹{p.tax}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-800 text-base">Total Payable</span>
              <span className="font-bold text-lg" style={{ color: p.color }}>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">What you get:</p>
        <ul className="space-y-1.5">
          {p.perks.map((perk, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✓</span> {perk}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
        <span>📅</span>
        <span>Valid for <strong>3 months</strong> from date of activation.</span>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
          ← Back
        </button>
        <button type="button" onClick={onProceed}
          className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
          style={{ background: p.gradient }}>
          Pay Now 
        </button>
      </div>
    </div>
  );
}
 
function PaymentMethod({ plan, onProceed, onBack, loading = false }) {
  const p = MEMBERSHIP_PLANS[plan];
  const total = (p.price + p.tax).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">Complete Payment</h3>
        <p className="text-sm text-gray-500 mt-1">Secure payment · 256-bit SSL</p>
      </div>

      <div
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-full text-white text-sm font-bold mx-auto w-fit shadow-md"
        style={{ background: p.gradient }}
      >
        {p.icon} {p.label} · ₹{total}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{p.label} Registration Fee</span>
          <span className="font-semibold">₹{p.price}.00</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Tax (18% GST)</span>
          <span>₹{p.tax}</span>
        </div>
        <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between">
          <span className="font-bold text-gray-800">Total Payable</span>
          <span className="font-bold text-lg" style={{ color: p.color }}>₹{total}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          What you get:
        </p>
        <ul className="space-y-1.5">
          {p.perks.map((perk, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✓</span> {perk}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>🔒</span>
        <span>256-bit SSL Encrypted · Secured by Razorpay</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onProceed}
          disabled={loading}
          className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: p.gradient }}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span>💳</span>
              Pay ₹{total} via Razorpay
            </>
          )}
        </button>
      </div>
      {/* Fallback payment link */}
      <div className="text-center mt-3">
        <p className="text-xs text-gray-400 mb-1">Having trouble? Pay directly:</p>
        
          <a href="https://razorpay.me/@eliteinovatechprivatelimited"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          Pay via Razorpay Payment Link
        </a>
      </div>
    </div>
  );
}
 
// ─── PaymentSuccess Component ─────────────────────────────────────────────────
function PaymentSuccess({ plan, userData, onVisitPage }) {
  const p = MEMBERSHIP_PLANS[plan];
  const total = (p.price + p.tax).toFixed(2);
  const txnId = React.useMemo(() => "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase(), []);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const expiry = new Date(new Date().setMonth(new Date().getMonth() + 3))
    .toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
 
  const downloadInvoice = () => {
    // ── Build HTML invoice page ───────────────────────────────────────────
    const planColor = p.color;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>EliteInova Invoice ${txnId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fa; padding: 40px 20px; color: #1a1a2e; }
    .page { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
    .header { background: ${p.gradient}; padding: 32px 36px 24px; color: white; }
    .header h1 { font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { font-size: 13px; opacity: 0.85; margin-top: 4px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; margin-top: 10px; }
    .status-bar { background: #d1fae5; border-bottom: 2px solid #6ee7b7; padding: 10px 36px; display: flex; align-items: center; gap: 8px; }
    .status-bar span { color: #065f46; font-weight: 700; font-size: 13px; }
    .body { padding: 28px 36px; }
    .section-title { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 24px; }
    .section-title:first-child { margin-top: 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; }
    .info-item label { font-size: 11px; color: #9ca3af; display: block; margin-bottom: 2px; }
    .info-item span { font-size: 13px; font-weight: 600; color: #111827; }
    .divider { border: none; border-top: 1px dashed #e5e7eb; margin: 20px 0; }
    .price-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
    .price-row .label { font-size: 13px; color: #6b7280; }
    .price-row .value { font-size: 13px; font-weight: 600; color: #374151; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f9fafb; border-radius: 10px; margin-top: 10px; border: 1px solid #e5e7eb; }
    .total-row .label { font-size: 15px; font-weight: 700; color: #111827; }
    .total-row .value { font-size: 20px; font-weight: 800; color: ${planColor}; }
    .footer { background: #f9fafb; border-top: 1px solid #f0f0f0; padding: 18px 36px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; }
    .footer strong { color: #374151; }
    .txn-box { background: #f3f4f6; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-family: monospace; font-size: 13px; color: #374151; letter-spacing: 1px; }
    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>EliteInova Matrimony</h1>
      <p>Payment Invoice &nbsp;·&nbsp; Tax Invoice</p>
      <div class="badge">${p.icon} ${p.label} Member</div>
    </div>

    <div class="status-bar">
      <svg width="16" height="16" fill="none" stroke="#065f46" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      <span>Payment Successful — Thank you for registering!</span>
    </div>

    <div class="body">
      <p class="section-title">Invoice Details</p>
      <div class="info-grid">
        <div class="info-item"><label>Invoice No</label><span>INV-${txnId}</span></div>
        <div class="info-item"><label>Transaction ID</label><span>${txnId}</span></div>
        <div class="info-item"><label>Date</label><span>${dateStr}</span></div>
        <div class="info-item"><label>Payment Status</label><span style="color:#059669">✓ Success</span></div>
      </div>

      <hr class="divider"/>

      <p class="section-title">Member Details</p>
      <div class="info-grid">
        <div class="info-item"><label>Full Name</label><span>${userData?.name || "—"}</span></div>
        <div class="info-item"><label>Mobile</label><span>${userData?.mobile || "—"}</span></div>
        <div class="info-item" style="grid-column:1/-1"><label>Email</label><span>${userData?.email || "—"}</span></div>
      </div>

      <hr class="divider"/>

      <p class="section-title">Membership Details</p>
      <div class="info-grid">
        <div class="info-item"><label>Plan</label><span>${p.label} Membership</span></div>
        <div class="info-item"><label>Duration</label><span>3 Months</span></div>
        <div class="info-item"><label>Activation Date</label><span>${dateStr}</span></div>
        <div class="info-item"><label>Valid Until</label><span>${expiry}</span></div>
      </div>

      <hr class="divider"/>

      <p class="section-title">Payment Breakdown</p>
      <div class="price-row"><span class="label">${p.label} Registration Fee</span><span class="value">₹${p.price}.00</span></div>
      <div class="price-row"><span class="label">GST @ 18%</span><span class="value">₹${p.tax}</span></div>
      <div class="total-row"><span class="label">Total Paid</span><span class="value">₹${total}</span></div>

      <div class="txn-box">Transaction Ref: ${txnId}</div>
    </div>

    <div class="footer">
      <p>Thank you for choosing <strong>EliteInova Matrimony</strong></p>
      <p style="margin-top:4px">Questions? Email us at <strong>support@eliteinova.com</strong></p>
      <p style="margin-top:8px; font-size:11px; color:#d1d5db">This is a computer-generated invoice and does not require a signature.</p>
    </div>
  </div>
</body>
</html>`;

    // ── Open print dialog → Save as PDF ──────────────────────────────────
    const printWindow = window.open("", "_blank", "width=700,height=900");
    if (!printWindow) {
      alert("Please allow popups for this site to download the invoice as PDF.");
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Small delay so styles load before print dialog opens
    setTimeout(() => {
      printWindow.print();
      // printWindow.close(); // optionally close after print
    }, 600);
  };
 
  return (
    <div className="space-y-5 text-center">
      <style>{`
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        .pop-in { animation: popIn 0.5s ease-out forwards; }
      `}</style>
      <div className="flex flex-col items-center gap-3">
        <div className="pop-in w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
          <p className="text-gray-500 text-sm mt-1">Welcome to EliteInova Matrimony {p.label} {p.icon}</p>
        </div>
      </div>
 
      {/* Invoice Card */}
      <div className="bg-white border-2 border-green-200 rounded-2xl p-5 text-left shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-gray-200">
          <div><p className="font-bold text-gray-800">EliteInova Matrimony</p><p className="text-xs text-gray-500">Payment Invoice</p></div>
          <span className="text-xs px-3 py-1 rounded-full text-white font-bold" style={{ background: p.gradient }}>{p.icon} {p.label}</span>
        </div>
        <div className="space-y-2 text-sm">
          {[["Transaction ID", txnId], ["Date", dateStr], ["Membership", `${p.label} – 3 Months`], ["Valid Until", expiry]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-gray-600">
              <span>{k}</span><span className="font-semibold text-gray-800">{v}</span>
            </div>
          ))}
          <div className="border-t border-dashed pt-2 mt-1 space-y-1">
            <div className="flex justify-between text-xs text-gray-500"><span>Registration Fee</span><span>₹{p.price}.00</span></div>
            <div className="flex justify-between text-xs text-gray-400"><span>Tax (18% GST)</span><span>₹{p.tax}</span></div>
            <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
              <span>Total Paid</span><span className="text-green-600 text-base">₹{total}</span>
            </div>
          </div>
        </div>
      </div>
 
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 text-left">
        <span className="flex-shrink-0 text-base">📧</span>
        <span>Invoice automatically sent to <strong>{userData?.email || "your email"}</strong></span>
      </div>
 
      <div className="space-y-3">
        <button type="button" onClick={downloadInvoice}
          className="w-full py-3 rounded-xl border-2 border-green-500 text-green-600 font-bold text-sm hover:bg-green-50 transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Invoice (PDF)
        </button>
       {/* <button type="button" onClick={() => onVisitPage(p.route)}
          className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          style={{ background: p.gradient }}>
          {p.icon} Visit {p.label} Member Page
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>*/}
      </div>
    </div>
  );
}

export default function RegisterForm({
  isInModal = false,
  onRegisterSuccess,
  onSwitch,
  onClose,
}) {
  const { register, syncAuthFromStorage } = useAuth(); // MOVED TO TOP LEVEL
  const navigate = useNavigate();
  const inModal = isInModal || !!onRegisterSuccess || !!onSwitch || !!onClose;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form");
  const [registrationError, setRegistrationError] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
const formScrollRef = React.useRef(null);

// ── OTP Gate states ──────────────────────────────────────────────────────────
const [otpStep, setOtpStep] = useState("phone"); // "phone" | "otp" | "done"
const [preForm, setPreForm] = useState({ name: "", mobile: "" });
const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const [otpLoading, setOtpLoading] = useState(false);
const [otpError, setOtpError] = useState("");
const [otpTimer, setOtpTimer] = useState(0);
const otpRefs = [
  React.useRef(), React.useRef(), React.useRef(),
  React.useRef(), React.useRef(), React.useRef()
];

// OTP countdown timer
useEffect(() => {
  if (otpTimer > 0) {
    const t = setTimeout(() => setOtpTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }
}, [otpTimer]);

const handleSendOtp = async () => {
  if (!preForm.name.trim()) return setOtpError("Full name is required");
  if (!/^\d{10}$/.test(preForm.mobile)) return setOtpError("Enter a valid 10-digit mobile number");
  setOtpLoading(true);
  setOtpError("");
  try {
    // ── REPLACE with your real API call ──
    // const res = await fetch("/api/auth/send-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ mobile: preForm.mobile, name: preForm.name }),
    // });
    // if (!res.ok) throw new Error("Failed to send OTP");
    await new Promise((r) => setTimeout(r, 1000)); // mock delay
    console.log("📲 Mock OTP: 123456");
    // ─────────────────────────────────────
    setOtpStep("otp");
    setOtpTimer(30);
  } catch (err) {
    setOtpError(err.message || "Failed to send OTP. Try again.");
  } finally {
    setOtpLoading(false);
  }
};

const handleVerifyOtp = async () => {
  const enteredOtp = otp.join("");
  if (enteredOtp.length !== 6) return setOtpError("Please enter all 6 digits");
  setOtpLoading(true);
  setOtpError("");
  try {
    // ── REPLACE with your real API call ──
    // const res = await fetch("/api/auth/verify-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ mobile: preForm.mobile, otp: enteredOtp }),
    // });
    // if (!res.ok) throw new Error("Invalid OTP");
    await new Promise((r) => setTimeout(r, 800)); // mock delay
    if (enteredOtp !== "123456") throw new Error("Invalid OTP. Try again.");
    // ─────────────────────────────────────
    setForm((prev) => ({ ...prev, name: preForm.name, mobile: preForm.mobile }));
    setOtpStep("done");
  } catch (err) {
    setOtpError(err.message || "OTP verification failed.");
    setOtp(["", "", "", "", "", ""]);
    otpRefs[0].current?.focus();
  } finally {
    setOtpLoading(false);
  }
};

const handleOtpChange = (index, value) => {
  if (!/^\d*$/.test(value)) return;
  const newOtp = [...otp];
  newOtp[index] = value.slice(-1);
  setOtp(newOtp);
  if (value && index < 5) otpRefs[index + 1].current?.focus();
};

const handleOtpKeyDown = (index, e) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    otpRefs[index - 1].current?.focus();
  }
};
useEffect(() => {
  setTimeout(() => {
    if (formScrollRef.current) {
      formScrollRef.current.scrollTop = 0;
    }
    const selectors = [
      ".register-form-scrollable",
      '[role="dialog"]',
      ".modal-body",
      ".modal-content",
      ".overflow-y-auto",
      ".overflow-auto",
    ];
    selectors.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) el.scrollTop = 0;
    });
    window.scrollTo(0, 0);
  }, 50);
}, [step]);

  const [form, setForm] = useState({
    // Step 1: Basic Info
    profileFor: "Myself",
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",

    // Step 2: Personal Details
    gender: "",
    dob: "",
    age: "",
    partnerAgeMin: "",
    partnerAgeMax: "",
    email: "",
    physicallyChallenged: "No",
    physicallyChallengedDescription: "",

    // Step 3: Religion Details
    religion: "",
    motherTongue: "",
    motherTongueOther: "",
    religionOther: "",
    willingOtherCaste: false,
    community: "",
    communityOther: "",
    caste: "",
    subCaste: "",
    subCasteOther: "",
    dosham: "Don't Know",

    // Step 4: Family Background
    maritalStatus: "Single",
    childrenCount: "0",
    childrenWithYou: false,
    height: "5.6",
    familyStatus: "Middle Class",
    familyType: "Joint",
    familyStatusOther: "",
    familyTypeOther: "",

    // Step 5: Professional Details
    education: "Bachelor's",
    educationalQualification: "",
    certificateCourses: "",
    specialization: "",
    employedIn: "Private",
    occupation: "",
    occupationOther: "",      // <-- ADD THIS LINE
    employedInOther: "",       // <-- ADD THIS LINE
    annualIncome: "5-10 L",
    address: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    country: "India",
    educationOther: "",
    educationalQualificationOther: "",
    annualIncomeOther: "",

    // Step 6: About & Files
    about: "",
    photos: [],
    aadhar: null,
    membershipType: "SILVER", // Default to Silver
  });

  const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
  
];

// ------------- Districts Mapping -------------
const districtsByState = {

  "Andhra Pradesh": [
    "Anantapur","Chittoor","East Godavari","Guntur","Kadapa","Krishna",
    "Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam",
    "Vizianagaram","West Godavari","Tirupati"
  ],

  "Arunachal Pradesh": [
    "Tawang","West Kameng","East Kameng","Papum Pare","Kurung Kumey",
    "Kra Daadi","Lower Subansiri","Upper Subansiri","West Siang",
    "East Siang","Siang","Upper Siang","Lower Siang","Lower Dibang Valley",
    "Dibang Valley","Anjaw","Lohit","Namsai","Changlang","Tirap","Longding"
  ],

  "Assam": [
    "Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo",
    "Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao",
    "Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup",
    "Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar",
    "Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar",
    "Sonitpur","South Salmara","Tinsukia","Udalguri","West Karbi Anglong"
  ],

  "Bihar": [
    "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur",
    "Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui",
    "Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai",
    "Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada",
    "Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura",
    "Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"
  ],

  "Chhattisgarh": [
    "Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur",
    "Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir-Champa",
    "Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Korea",
    "Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon",
    "Sukma","Surajpur","Surguja"
  ],

  "Goa": ["North Goa","South Goa"],

  "Gujarat": [
    "Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch",
    "Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka",
    "Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch",
    "Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal",
    "Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar",
    "Tapi","Vadodara","Valsad"
  ],

  "Haryana": [
    "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurgaon",
    "Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh",
    "Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa",
    "Sonipat","Yamunanagar"
  ],

  "Himachal Pradesh": [
    "Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu",
    "Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"
  ],

  "Jharkhand": [
    "Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum",
    "Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti",
    "Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh",
    "Ranchi","Sahebganj","Saraikela Kharsawan","Simdega","West Singhbhum"
  ],

  "Karnataka": [
    "Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban",
    "Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru",
    "Chitradurga","Dakshina Kannada","Davanagere","Dharwad",
    "Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal",
    "Mandya","Mysuru","Raichur","Ramanagara","Shivamogga",
    "Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"
  ],

  "Kerala": [
    "Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam",
    "Idukki","Ernakulam","Thrissur","Palakkad","Malappuram",
    "Kozhikode","Wayanad","Kannur","Kasaragod"
  ],

  "Madhya Pradesh": [
    "Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani",
    "Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara",
    "Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda",
    "Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa",
    "Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch",
    "Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna",
    "Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri",
    "Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"
  ],

  "Maharashtra": [
    "Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara",
    "Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli",
    "Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban",
    "Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar",
    "Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara",
    "Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"
  ],

  "Manipur": [
    "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West",
    "Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl",
    "Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"
  ],

  "Meghalaya": [
    "East Garo Hills","East Khasi Hills","Jaintia Hills",
    "North Garo Hills","Ri-Bhoi","South Garo Hills",
    "South West Garo Hills","South West Khasi Hills",
    "West Garo Hills","West Khasi Hills"
  ],

  "Mizoram": [
    "Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei",
    "Mamit","Saiha","Serchhip"
  ],

  "Nagaland": [
    "Dimapur","Kiphire","Kohima","Longleng","Mokokchung",
    "Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"
  ],

  "Odisha": [
    "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh",
    "Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur",
    "Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara",
    "Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj",
    "Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada",
    "Sambalpur","Subarnapur","Sundargarh"
  ],

  "Punjab": [
    "Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib",
    "Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar",
    "Kapurthala","Ludhiana","Mansa","Moga","Mohali",
    "Muktsar","Pathankot","Patiala","Rupnagar","Sangrur",
    "Shaheed Bhagat Singh Nagar","Tarn Taran"
  ],

  "Rajasthan": [
    "Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur",
    "Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa",
    "Dholpur","Dungarpur","Hanumangarh","Jaipur","Jaisalmer",
    "Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota",
    "Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur",
    "Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"
  ],

  "Sikkim": ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"],

  "Tamil Nadu": [
    "Chennai","Chengalpattu","Kanchipuram","Tiruvallur","Vellore",
    "Tiruvannamalai","Villupuram","Cuddalore","Salem","Namakkal",
    "Erode","Coimbatore","Tiruppur","Karur","Dindigul","Madurai",
    "Theni","Sivaganga","Ramanathapuram","Virudhunagar","Tenkasi",
    "Thoothukudi","Kanniyakumari","Nagapattinam","Thanjavur",
    "Tiruchirappalli","Perambalur","Ariyalur","Mayiladuthurai",
    "Krishnagiri","Dharmapuri","Nilgiris","Kallakurichi"
  ],

  "Telangana": [
    "Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial",
    "Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal",
    "Kamareddy","Karimnagar","Khammam","Mahabubabad",
    "Mahabubnagar","Mancherial","Medak","Medchal",
    "Nagarkurnool","Nalgonda","Narayanpet","Nirmal",
    "Nizamabad","Peddapalli","Rajanna Sircilla",
    "Rangareddy","Sangareddy","Siddipet","Suryapet",
    "Vikarabad","Wanaparthy","Warangal"
  ],

  "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],

  "Uttar Pradesh": [
    "Agra","Aligarh","Allahabad","Ambedkar Nagar","Amethi","Amroha",
    "Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia",
    "Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi",
    "Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria",
    "Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar",
    "Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur",
    "Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj",
    "Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri",
    "Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba",
    "Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad",
    "Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur",
    "Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur",
    "Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra",
    "Sultanpur","Unnao","Varanasi"
  ],

  "Uttarakhand": [
    "Almora","Bageshwar","Chamoli","Champawat","Dehradun",
    "Haridwar","Nainital","Pauri Garhwal","Pithoragarh",
    "Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"
  ],

  "West Bengal": [
    "Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur",
    "Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram",
    "Kalimpong","Kolkata","Malda","Murshidabad","Nadia",
    "North 24 Parganas","Paschim Bardhaman","Paschim Medinipur",
    "Purba Bardhaman","Purba Medinipur","Purulia",
    "South 24 Parganas","Uttar Dinajpur"
  ],

  "Andaman and Nicobar Islands": ["Nicobar","North and Middle Andaman","South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman","Diu","Dadra and Nagar Haveli"],
  "Delhi": ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
  "Jammu and Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
  "Ladakh": ["Kargil","Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal","Mahe","Puducherry","Yanam"]

};

// ------------ Tamil Nadu Government Community Categories ------------
// Community categories as per Tamil Nadu Government official classification
const communityCategories = [
  { value: "Other", label: "Other" },
  { value: "SC", label: "SC - Scheduled Castes" },
  { value: "ST", label: "ST - Scheduled Tribes" },
  { value: "BC", label: "BC - Backward Classes" },
  { value: "MBC", label: "MBC - Most Backward Classes" },
  { value: "BCM", label: "BCM - Backward Class Muslims" },
  { value: "DNC", label: "DNC - Denotified Communities" },
  { value: "GENERAL", label: "General / Others" },
  
];

// Caste/Subcaste data for each community category (Official Tamil Nadu Government Lists)
const communityCasteData = {
  SC: [
    "Others",
    "Adi Dravida",
    "Adi Andhra",
    "Arunthathiyar",
    "Ayyanavar",
    "Baira",
    "Bandi",
    "Chakkiliyan",
    "Chandala",
    "Cheruman",
    "Devendrakula Velalar",
    "Kadaiyan",
    "Kalladi",
    "Khojhal",
    "Madari",
    "Pallan",
    "Paraiyar",
    "Samban",
    "Thoti",
  ],
  ST: [
    "Others",
    "Adiyan",
    "Aranadan",
    "Eravallan",
    "Irular",
    "Kadar",
    "Kattunayakan",
    "Kurumans",
    "Malai Vedan",
    "Malasar",
    "Muthuvan",
    "Paniyan",
    "Toda",
    "Kota",
  ],
  BC: [
    "Others",
    "Agamudayar (including Thozhu / Thuluva Vellala)",
    "Archakarai Vellala",
    "Aryavathi",
    "Badagar",
    "Billava",
    "Bondil",
    "Boyar",
    "Chettiar (various sub-sects)",
    "Devangar",
    "Mudaliar",
    "Naidu",
    "Nadar",
    "Sengunthar",
    "Vellalar",
    "Viswakarma (Goldsmith, Carpenter, etc.)",
    "Yadava",
    "Arya Vysya",
  ],
  MBC: [
    "Others",
    "Ambalakarar",
    "Bestha / Siviar",
    "Boyar / Oddar",
    "Dasari",
    "Jogi / Jambuvanodai",
    "Kallar",
    "Kurumba / Kurumba Gounder",
    "Maravar",
    "Mutharaiyar",
    "Piramalai Kallar",
    "Vannar",
    "Vanniyar",
    "Andipandaram",
    "Kuravar",
  ],
  BCM: [
    "Others",
    "Ansar",
    "Dekkani Muslims",
    "Labbai (including Rowthar, Marakayar)",
    "Labbai",
    "Rowther",
    "Marakayar",
    "Mapilla",
    "Sheik",
    "Syed",
  ],
  DNC: [
    "Others",
    "Attur Kilnad Koravars",
    "Appanad Koravars",
    "Dommars",
    "Donga Boya",
    "Narikuravar",
  ],
  GENERAL: [
    "Others",
    "Brahmin (Iyer, Iyengar)",
    "Jain",
    "Sikh",
    "Christian (Forward communities not in BC list)", 
  ],
};

// ------------ Profession Options ------------
const professionOptions = [
  { value: "Occupation with own", label: "Occupation with own" },
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "Doctor", label: "Doctor" },
  { value: "Nurse", label: "Nurse" },
  { value: "Pharmacist", label: "Pharmacist" },
  { value: "Teacher", label: "Teacher" },
  { value: "Professor", label: "Professor" },
  { value: "Business Owner", label: "Business Owner" },
  { value: "Entrepreneur", label: "Entrepreneur" },
  { value: "Government Employee", label: "Government Employee" },
  { value: "Bank Employee", label: "Bank Employee" },
  { value: "CA / Accountant", label: "CA / Accountant" },
  { value: "Marketing Specialist", label: "Marketing Specialist" },
  { value: "Sales Executive", label: "Sales Executive" },
  { value: "Self Employed", label: "Self Employed" },
  { value: "Construction Engineer", label: "Construction Engineer" },
  { value: "Mechanical Engineer", label: "Mechanical Engineer" },
  { value: "Civil Engineer", label: "Civil Engineer" },
  { value: "Electrical Engineer", label: "Electrical Engineer" },
  { value: "Lawyer", label: "Lawyer" },
  { value: "Police Officer", label: "Police Officer" },
  { value: "Army / Defence", label: "Army / Defence" },
  { value: "Fashion Designer", label: "Fashion Designer" },
  { value: "Graphic Designer", label: "Graphic Designer" },
  { value: "Artist", label: "Artist" },
  { value: "Actor / Actress", label: "Actor / Actress" },
  { value: "Chef", label: "Chef" },
  { value: "Hotel Management", label: "Hotel Management" },
  { value: "Driver", label: "Driver" },
  { value: "Farmer", label: "Farmer" },
  { value: "Not Working", label: "Not Working" },
];

  const steps = [
    "Register",
    "Basic Details",
    "Religion Details",
    "Personal Details",
    "Professional Details",
    "About Yourself",
  ];

  const getStepHeading = () => {
    const stepHeadings = {
      1: "Create Your Account",
      2: "Basic Details",
      3: "Religion & Community",
      4: "Personal Information",
      5: "Professional Details",
      6: "About Yourself & Documents",
    };
    return stepHeadings[step] || `Step ${step}`;
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--;
    return age;
  };

  const formatMobileNumber = (value) => value.replace(/\D/g, "").slice(0, 14);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "mobile") processedValue = formatMobileNumber(value);
    setForm((prev) => ({ ...prev, [name]: processedValue }));

    if (name === "dob" && value) {
      const age = calculateAge(value);
      setForm((prev) => ({ ...prev, age: age.toString() }));
      
      // Add validation for minimum age (18) and maximum age (born after 1975)
      const birthYear = new Date(value).getFullYear();
      if (birthYear < 1975) {
        setValidationErrors(prev => ({ 
          ...prev, 
          dob: "Sorry, registration is only available for individuals born after 1975" 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, dob: "" }));
      }
    }

    if (validationErrors[name])
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const handleCheckbox = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

    const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setError("");

    // Check if adding new files would exceed the 3 photo limit
    const totalAfterAdd = form.photos.length + files.length;
    if (totalAfterAdd > 3) {
      setError(`You can only upload up to 3 photos. You already have ${form.photos.length} photo(s).`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} too large (max 5MB)`);
          return false;
        }
        return true;
      } else {
        setError(`File ${file.name} not supported. Please upload only images.`);
        return false;
      }
    });

    if (validFiles.length > 0) {
      setForm((prev) => ({ 
        ...prev, 
        photos: [...prev.photos, ...validFiles] 
      }));
      // Clear validation error when photos are uploaded
      if (validationErrors.photos) {
        setValidationErrors((prev) => ({ ...prev, photos: "" }));
      }
    }
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    // Re-validate photos if removing last photo
    if (form.photos.length === 1) {
      setValidationErrors((prev) => ({ ...prev, photos: "At least one profile photo is required" }));
    } else {
      setValidationErrors((prev) => ({ ...prev, photos: "" }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 1:
        if (!form.name?.trim()) errors.name = "Full name is required";
        if (!form.mobile?.trim()) errors.mobile = "Mobile number is required";
        if (!form.password || form.password.trim() === "") errors.password = "Password is required";
        if (form.password && form.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (form.password && form.password.length >= 6) {
          const hasUpperCase = /[A-Z]/.test(form.password);
          const hasLowerCase = /[a-z]/.test(form.password);
          const hasNumber = /[0-9]/.test(form.password);
          if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
          }
        }
        if (form.password !== form.confirmPassword)
          errors.confirmPassword = "Passwords do not match";
        break;
      case 2:
  if (!form.gender) errors.gender = "Gender is required";
  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(form.email.trim())) {
    errors.email = "Only Gmail addresses are accepted (e.g., name@gmail.com)";
  }
  
  if (form.dob) {
    const calculatedAge = calculateAge(form.dob);
    const birthYear = new Date(form.dob).getFullYear();
    
    if (calculatedAge < 18) {
      errors.dob = "You must be at least 18 years old to register";
      errors.age = "Age must be 18 or above";
    }
    
    if (birthYear < 1975) {
      errors.dob = "Sorry, registration is only available for individuals born after 1975";
    }
  } else if (form.age) {
    const ageNum = parseInt(form.age);
    if (isNaN(ageNum) || ageNum < 18) {
      errors.age = "Age must be 18 or above";
    }
  }

  const userAge = parseInt(form.age) || calculateAge(form.dob);
  const minAge = parseInt(form.partnerAgeMin);
  const maxAge = parseInt(form.partnerAgeMax);

  if (form.gender === "Female") {
    if (form.partnerAgeMin) {
      if (isNaN(minAge) || minAge < 18) {
        errors.partnerAgeMin = "Preferred minimum age must be 18 or above";
      } else if (minAge < userAge) {
        errors.partnerAgeMin = `Minimum age must be at least your age (${userAge}). Female profiles should prefer same age or older partners`;
      }
    }
    if (form.partnerAgeMax) {
      if (isNaN(maxAge) || maxAge < 18) {
        errors.partnerAgeMax = "Preferred maximum age must be 18 or above";
      } else if (maxAge <= userAge) {
        errors.partnerAgeMax = `Maximum age must be greater than your age (${userAge}). Female profiles should prefer partners older than themselves`;
      }
    }
    if (form.partnerAgeMin && form.partnerAgeMax) {
      if (!isNaN(minAge) && !isNaN(maxAge) && maxAge < minAge) {
        errors.partnerAgeMax = "Maximum age must be greater than or equal to minimum age";
      }
      // ← REMOVED: 10 years difference condition for Female
    }
  }

  if (form.gender === "Male") {
    if (form.partnerAgeMin) {
      if (isNaN(minAge) || minAge < 18) {
        errors.partnerAgeMin = "Preferred minimum age must be 18 or above";
      } else if (minAge >= userAge) {
        errors.partnerAgeMin = `Minimum age must be less than your age (${userAge}). Male profiles should prefer partners younger than themselves`;
      }
    }
    if (form.partnerAgeMax) {
      if (isNaN(maxAge) || maxAge < 18) {
        errors.partnerAgeMax = "Preferred maximum age must be 18 or above";
      } else if (maxAge > userAge) {
        errors.partnerAgeMax = `Maximum age must not exceed your age (${userAge}). Male profiles should prefer partners up to their own age`;
      }
    }
    if (form.partnerAgeMin && form.partnerAgeMax) {
      if (!isNaN(minAge) && !isNaN(maxAge) && maxAge < minAge) {
        errors.partnerAgeMax = "Maximum age must be greater than or equal to minimum age";
      }
      // ← REMOVED: 10 years difference condition for Male
    }
  }
  break;

        case 3:
          if (!form.religion) errors.religion = "Religion is required";
          if (!form.motherTongue) errors.motherTongue = "Mother tongue is required";
          if (form.motherTongue === "Other" && !form.motherTongueOther?.trim())
             errors.motherTongueOther = "Please specify your mother tongue";
          if (form.religion === "Other" && !form.religionOther?.trim())
             errors.religionOther = "Please specify your religion";
          // Community "Other" text and caste "Others" text are now OPTIONAL
         break;
        
      case 4:
        if (!form.maritalStatus)
          errors.maritalStatus = "Marital status required";
        if (!form.height) errors.height = "Height required";
        {/*if (!form.familyStatus) errors.familyStatus = "Family status required";
        if (!form.familyType) errors.familyType = "Family type required"; */}
        if (!form.physicallyChallenged) errors.physicallyChallenged = "Please specify if physically challenged";
        if (form.physicallyChallenged === "Yes" && !form.physicallyChallengedDescription?.trim()) {
          errors.physicallyChallengedDescription = "Description required when physically challenged is Yes";
        }
        break;
      case 5:
          if (!form.education) errors.education = "Education required";
          if (form.education === "Other" && !form.educationOther?.trim())
            errors.educationOther = "Please specify your education";
          if (form.educationalQualification === "Other" && !form.educationalQualificationOther?.trim())
            errors.educationalQualificationOther = "Please specify your qualification";
          if (!form.employedIn) errors.employedIn = "Employment required";
          if (!form.annualIncome) errors.annualIncome = "Income required";
          if (!form.district?.trim()) errors.district = "District required";
          if (!form.state?.trim()) errors.state = "State required";
          if (!form.address?.trim()) errors.address = "Address is required"
        break;
      case 6:
        if (!form.about?.trim()) errors.about = "About yourself required";
        if (!form.photos || form.photos.length === 0) errors.photos = "At least one profile photo is required";
        if (!form.aadhar) errors.aadhar = "ID proof is required for verification";
        break;
      default:
        break;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const scrollToTop = () => {
  if (formScrollRef.current) {
    formScrollRef.current.scrollTop = 0;
  }
  const selectors = [
    ".register-form-scrollable",
    '[role="dialog"]',
    ".modal-body",
    ".modal-content",
    ".overflow-y-auto",
    ".overflow-auto",
  ];
  selectors.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollTop = 0;
  });
  window.scrollTo(0, 0);
};

const nextStep = () => {
  if (validateStep(step)) {
    setStep((s) => s + 1);
    setError("");
    setTimeout(scrollToTop, 50);
  } else {
    setError("Please fix errors");
    setTimeout(() => {
      const firstError = document.querySelector(
        ".register-form-scrollable .text-red-500, .register-form-scrollable .text-red-600"
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }
};

const prevStep = () => {
  setStep((s) => s - 1);
  setError("");
  setValidationErrors({});
  setTimeout(scrollToTop, 50);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 6) {
        nextStep();
        return;
    }
 
    // Show payment summary before final submission
    if (paymentStep === "form") {
        if (!validateStep(6)) {
            setError("Please fix errors before proceeding.");
            return;
        }
        setError("");
        setPaymentStep("summary");
        return;
    }
 
    // Final validation - ensure password is present before submission
    if (!form.password || form.password.trim() === "") {
        setError("Password is required. Please go back to step 1 and enter your password.");
        setValidationErrors({ password: "Password is required" });
        setStep(1);
        return;
    }

    setLoading(true);
    setError("");

    try {
        console.log("🚀 Starting registration WITH file uploads...");

        // Create FormData for multipart request
        const formData = new FormData();

        // ✅ FIXED: Remove duplicate keys - CORRECT VERSION
        const userData = {
            profileFor: form.profileFor,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            mobile: form.mobile.replace(/\D/g, ""), 
            password: (form.password || "").trim(),
            gender: form.gender.toUpperCase(),
            maritalStatus: convertMaritalStatus(form.maritalStatus),
            age: parseInt(form.age) || calculateAge(form.dob),
            dob: form.dob,
            // For mother tongue - use the "Other" text if selected
            motherTongue: form.motherTongue === "Other" 
              ? (form.motherTongueOther || "Other") 
              : form.motherTongue,
            // For religion - use the "Other" text if selected
            religion: form.religion === "Other" 
              ? (form.religionOther || "Other") 
              : form.religion,
            community: form.community === "Other" ? form.communityOther : form.community,
            caste: form.caste === "Others" ? form.subCasteOther : form.caste,
            subCaste: form.caste === "Others" ? form.subCasteOther : (form.community === "Other" ? form.subCasteOther : form.caste), // Keep subCaste for backward compatibility
            willingOtherCaste: form.willingOtherCaste,
            dosham: form.dosham,
            education: form.education,
            occupation: form.occupation || "",
            profession: form.occupation || "",
            employedIn: form.employedIn,
            specialization: form.specialization || "",
            educationalQualification: form.educationalQualification || "",
            certificateCourses: form.certificateCourses || "",
            annualIncome: parseIncome(form.annualIncome),
            address: form.address || "",
            city: form.city || "",
            state: form.state,
            district: form.district,
            country: form.country,
            pincode: form.pincode || "",
            familyStatus: form.familyStatus,
            familyType: form.familyType,
            height: convertHeightToCm(form.height),
            physicallyChallenged: form.physicallyChallenged === "Yes",
            physicallyChallengedDescription: form.physicallyChallenged === "Yes" ? (form.physicallyChallengedDescription || "") : "",
            about: form.about,
            childrenCount: form.childrenCount || "0",
            childrenWithYou: form.childrenWithYou || false,
            minAge: parseInt(form.partnerAgeMin) || parseInt(form.minAge),
            maxAge: parseInt(form.partnerAgeMax) || parseInt(form.maxAge),
            membershipType: form.membershipType || "SILVER"
        };

        // ✅ ADD DEBUG LOGS HERE (BEFORE sending)
        console.log("📤 DEBUG - Data being sent to backend:");
        console.log("   Password:", userData.password ? "***" + userData.password.substring(userData.password.length - 2) : "MISSING!");
        console.log("   Password length:", userData.password?.length || 0);
        console.log("   Mobile:", userData.mobile);
        console.log("   Specialization:", userData.specialization);
        console.log("   MinAge:", userData.minAge);
        console.log("   MaxAge:", userData.maxAge);
        console.log("   Form specialization value:", form.specialization);
        
        // Validate password before sending
        if (!userData.password || userData.password.trim() === "") {
            throw new Error("Password is required");
        }

        // Add user data as JSON blob
        formData.append(
            "user",
            new Blob([JSON.stringify(userData)], {
                type: "application/json",
            })
        );

        // ✅ FIXED: Add photos as separate files
        if (form.photos.length > 0) {
            form.photos.forEach((photo, index) => {
                formData.append("photos", photo);
            });
            console.log(`📸 Added ${form.photos.length} photos`);
        }

        if (form.aadhar) {
    formData.append("aadhar", form.aadhar);
    console.log("📄 Added Aadhar:", form.aadhar.name);
}

        // ✅ FIXED: Send multipart request to registration endpoint
        const api = await import('../../config/api');
        const url = api.buildApiUrl("api/auth/register");
        console.log("🌐 Registration URL:", url);
        console.log("🌐 API Base URL:", api.API_BASE_URL);
        console.log("📦 FormData entries:", formData.entries ? Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `${v.name} (${v.size} bytes)` : typeof v === 'object' ? 'Blob' : v]) : "N/A");
        
        console.log("📤 Sending registration request to:", url);
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary
            // Add credentials for CORS
            credentials: 'include',
            mode: 'cors',
        });

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Registration failed:", {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            
            let errorMessage = "Registration failed";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = errorText || `Server returned ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log("📨 Registration response:", result);

        if (result.token) {
            console.log("✅ Registration complete with file uploads:", result);

            // Store token for immediate login (use same key as AuthContext expects)
            if (result.token) {
                localStorage.setItem("authToken", result.token); // Changed from "token" to "authToken" to match AuthContext
                localStorage.setItem("user", JSON.stringify(result.user));
                
                // Set API authorization header
                const api = await import('../../config/api');
                const axiosInstance = (await import('../../api/axiosUser')).default;
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
            }

            // ✅ CRITICAL FIX: Sync AuthContext state from localStorage
            // This ensures isAuthenticated is set to true before navigation
            syncAuthFromStorage();

            // Get membership type and redirect to registration completion page
            const membershipType = form.membershipType || "SILVER";
            
            console.log("✅ Registration successful! Redirecting to registration completion page...");
            console.log("   Membership Type:", membershipType);
            console.log("   Token stored:", !!result.token);
            
            // Close modal if opened from modal (but don't wait for it)
            if (onClose) {
                onClose();
            }
            
            // Call onRegisterSuccess callback if provided (for any cleanup)
            if (onRegisterSuccess) {
                onRegisterSuccess(result);
            }
            
            // ✅ CHANGED: Navigate directly to profiles page (skip dashboard/registration completion)
            // ❌ OLD: Was navigating to registration completion page, then dashboard
            // setTimeout(() => {
            //     const completionUrl = `/registration-completion?membershipType=${membershipType}`;
            //     console.log("🚀 Navigating to:", completionUrl);
            //     navigate(completionUrl, { replace: true });
            // }, 100);
            
            // ✅ NEW: Navigate directly to profiles page (same as login)
            setTimeout(() => {
                console.log("🚀 Navigating directly to profiles page...");
                navigate("/profiles", { replace: true });
            }, 100);
        } else {
            throw new Error(
                result.error || result.message || "Registration failed"
            );
        }
    } catch (err) {
        console.error("❌ Registration error:", err);
        console.error("❌ Error details:", {
            message: err.message,
            stack: err.stack,
            name: err.name,
            cause: err.cause
        });
        
        // Show more detailed error message
        let errorMessage = err.message || "Registration failed. Please try again.";
        
        // Check for specific error types from backend
        const errorMsg = err.message?.toLowerCase() || "";
        
        if (errorMsg.includes("duplicate") || errorMsg.includes("already exists")) {
    if (errorMsg.includes("mobile") || errorMsg.includes("phone")) {
        errorMessage = "An account with this mobile number already exists. Please use a different mobile number or try logging in.";
    } else if (errorMsg.includes("email")) {
        errorMessage = "An account with this email already exists. Please use a different email or try logging in.";
    } else {
        errorMessage = "This information is already registered. Please check your details or try logging in.";
    }
        } else if (errorMsg.includes("invalid email") || errorMsg.includes("email")) {
            errorMessage = "Invalid email address. Please enter a valid email.";
        } else if (errorMsg.includes("password") && (errorMsg.includes("short") || errorMsg.includes("length"))) {
            errorMessage = "Password must be at least 6 characters long.";
        } else if (errorMsg.includes("mobile") || errorMsg.includes("phone")) {
            errorMessage = "Invalid mobile number. Please enter a valid mobile number.";
        } else if (err.name === "TypeError" && err.message?.includes("Failed to fetch")) {
            errorMessage = "Cannot connect to server. Please check your internet connection and try again.";
        } else if (errorMsg.includes("403") || errorMsg.includes("forbidden")) {
            errorMessage = "Access denied. Please try again later.";
        } else if (errorMsg.includes("cors")) {
            errorMessage = "Server configuration error. Please contact support.";
        } else if (errorMsg.includes("network") || errorMsg.includes("connection")) {
            errorMessage = "Network error. Please check your internet connection and try again.";
        }
        
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
};

  const uploadFiles = async (userId) => {
  try {
    console.log("📤 Starting file uploads for user:", userId);

    // Upload photos
    if (form.photos.length > 0) {
      console.log(`📸 Uploading ${form.photos.length} photos...`);

      for (const photo of form.photos) {
        try {
          console.log("🔼 Uploading photo:", photo.name);
          const uploadResult = await ProfileService.uploadProfilePhoto(photo);

          if (uploadResult.success) {
            console.log(
              "✅ Photo uploaded successfully:",
              uploadResult.imageUrl
            );
          } else {
            console.warn("⚠️ Photo upload failed:", uploadResult.error);
          }

          // Small delay to prevent overwhelming the server
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (photoError) {
          console.error("❌ Photo upload error:", photoError);
        }
      }
    }

    // Upload Aadhar document
    if (form.aadhar) {
      try {
        console.log("🆔 Uploading Aadhar document:", form.aadhar.name);
        await ProfileService.uploadDocument(form.aadhar, "AADHAR");
        console.log("✅ Aadhar uploaded successfully");
      } catch (aadharError) {
        console.error("❌ Aadhar upload error:", aadharError);
      }
    }

    console.log("✅ All file uploads completed");
  } catch (error) {
    console.error("❌ File upload process error:", error);
    setError(
      (prev) =>
        prev +
        " Note: Aadhar document failed to upload. You can upload it later in your profile."
    );
  }
};

  // ✅ IMPROVED HELPER FUNCTIONS:
  const convertMaritalStatus = (status) => {
    const mapping = {
      Single: "NEVER_MARRIED",
      "Never Married": "NEVER_MARRIED",
      Divorced: "DIVORCED",
      Widowed: "WIDOWED",
      Separated: "SEPARATED",
    };
    return mapping[status] || "NEVER_MARRIED";
  };

  const parseIncome = (incomeString) => {
    if (!incomeString) return 0;

    // Handle different income formats
    if (incomeString.includes("Cr")) {
      // Handle crores format like "1Cr-3Cr", "3Cr-5Cr", "5Cr+"
      if (incomeString.includes("-")) {
        const range = incomeString.split("-");
        const upperLimit = parseFloat(range[1].trim().replace("Cr", "").replace("+", ""));
        return Math.round(upperLimit * 10000000); // Convert crores to rupees
      } else if (incomeString.includes("+")) {
        const value = parseFloat(incomeString.replace("Cr+", "").replace("Cr", ""));
        return Math.round(value * 10000000);
      } else {
        const crores = parseFloat(incomeString.replace("Cr", ""));
        return Math.round(crores * 10000000);
      }
    } else if (incomeString.includes("LPA")) {
      // Handle formats like "10-15 LPA" or "15-20 LPA"
      if (incomeString.includes("-")) {
        const range = incomeString.split("-");
        const upperLimit = parseFloat(range[1].trim().split(" ")[0]);
        return Math.round(upperLimit * 100000);
      }
      // Handle single value with LPA
      const lakhs = parseFloat(incomeString.split(" ")[0]);
      return Math.round(lakhs * 100000);
    } else if (incomeString.includes("L")) {
      // Handle formats like "20L-50L", "50L-75L", "75L-1Cr", "0-2L", "2L-5L", etc.
      if (incomeString.includes("-")) {
        const range = incomeString.split("-");
        // Check if second part has Cr
        if (range[1].includes("Cr")) {
          const crores = parseFloat(range[1].trim().replace("Cr", ""));
          return Math.round(crores * 10000000);
        }
        // Extract number from second part (could be "50L" or "50")
        const upperLimitStr = range[1].trim().replace("L", "");
        const upperLimit = parseFloat(upperLimitStr);
        return Math.round(upperLimit * 100000);
      }
      const lakhs = parseFloat(incomeString.replace("L", ""));
      return Math.round(lakhs * 100000);
    } else if (incomeString.includes("+")) {
      // Handle "1Cr+" format - take the minimum value
      if (incomeString.includes("Cr")) {
        const value = parseFloat(incomeString.replace("Cr+", "").replace("+", ""));
        return Math.round(value * 10000000);
      }
      const value = parseFloat(incomeString.replace("+", ""));
      return Math.round(value * 100000);
    } else if (incomeString.includes("-")) {
      // Handle range like "0-2L" or "1Cr-3Cr" - take the upper limit
      const range = incomeString.split("-");
      const upperLimitStr = range[1].trim();
      if (upperLimitStr.includes("Cr")) {
        const crores = parseFloat(upperLimitStr.replace("Cr", ""));
        return Math.round(crores * 10000000);
      } else if (upperLimitStr.includes("L")) {
        const lakhs = parseFloat(upperLimitStr.replace("L", ""));
        return Math.round(lakhs * 100000);
      } else {
        // Assume lakhs if no unit
        const lakhs = parseFloat(upperLimitStr);
        return Math.round(lakhs * 100000);
      }
    }

    return 0;
  };

  const convertHeightToCm = (heightString) => {
    if (!heightString) return 0;

    // Handle feet format like "5.6"
    const feet = parseFloat(heightString);

    // Convert feet to cm (1 foot = 30.48 cm)
    const cm = Math.round(feet * 30.48);

    console.log(`📏 Height conversion: ${heightString} feet = ${cm} cm`);
    return cm;
  };

  // const fillTestData = () => {
  //   setForm({...form, name:"Test User", mobile:"9876543210", password:"Test@123", confirmPassword:"Test@123", email:"test@example.com", dob:"1990-01-01", age:"34"});
  //   setError(""); setValidationErrors({});
  // };
  
  // ── OTP Gate Screen ──────────────────────────────────────────────────────────
if (otpStep !== "done") {
  return (
    <div className={`bg-white shadow-2xl rounded-2xl w-full max-w-lg mx-auto ${inModal ? "h-full flex flex-col" : "p-6"}`}>
      <div className={`text-center mb-6 ${inModal ? "shrink-0 px-6 pt-6" : ""}`}>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">💍</span>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-1">
          {otpStep === "phone" ? "Get Started" : "Verify Your Number"}
        </h2>
        <p className="text-gray-500 text-sm">
          {otpStep === "phone"
            ? "Enter your name and mobile number to begin"
            : `OTP sent to +91 ${preForm.mobile}`}
        </p>
      </div>

      <div className={`${inModal ? "flex-1 overflow-y-auto px-6 pb-6" : ""}`}>
        {otpError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {otpError}
          </div>
        )}

        {/* ── Phone Step ── */}
        {otpStep === "phone" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={preForm.name}
                onChange={(e) => { setPreForm((p) => ({ ...p, name: e.target.value })); setOtpError(""); }}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  value={preForm.mobile}
                  onChange={(e) => { setPreForm((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })); setOtpError(""); }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex gap-2">
              <span>📱</span>
              <span>An OTP will be sent to this number for verification. Standard SMS charges may apply.</span>
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {otpLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                <>Send OTP <span>→</span></>
              )}
            </button>

            {onSwitch && (
              <p className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <button type="button" onClick={onSwitch} className="text-red-600 font-medium underline hover:text-red-700">
                  Sign In
                </button>
              </p>
            )}
          </div>
        )}

        {/* ── OTP Step ── */}
        {otpStep === "otp" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter 6-digit OTP
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 border-gray-300 text-gray-800"
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              {otpTimer > 0 ? (
                <span>Resend OTP in <span className="text-red-600 font-semibold">{otpTimer}s</span></span>
              ) : (
                <button
                  type="button"
                  onClick={() => { setOtp(["","","","","",""]); handleSendOtp(); }}
                  className="text-red-600 font-medium underline hover:text-red-700"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpLoading || otp.join("").length !== 6}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {otpLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>Verify & Continue <span>→</span></>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setOtpStep("phone"); setOtp(["","","","","",""]); setOtpError(""); }}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Change mobile number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

  if (paymentStep === "summary") {
    return (
      <div className={`bg-white shadow-2xl rounded-2xl w-full max-w-lg mx-auto ${inModal ? 'h-full flex flex-col' : 'p-6'}`}>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-red-600">Few Steps to Complete Your Registration!</h2>
          <p className="text-gray-500 text-sm">Review your order</p>
        </div>
        <div className={`${inModal ? 'flex-1 overflow-y-auto px-6 pb-6' : 'max-h-[75vh] overflow-y-auto'}`}>
          <PaymentSummary
            plan={form.membershipType}
            onProceed={() => setPaymentStep("payment")}
            onBack={() => setPaymentStep("form")}
          />
        </div>
      </div>
    );
  }
 
  if (paymentStep === "payment") {
    const handlePaymentProceed = async () => {
      setLoading(true);
      setRegistrationError("");

      try {
        const formData = new FormData();
        const userData = {
          profileFor: form.profileFor,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.replace(/\D/g, ""),
          password: (form.password || "").trim(),
          gender: form.gender.toUpperCase(),
          maritalStatus: convertMaritalStatus(form.maritalStatus),
          age: parseInt(form.age) || calculateAge(form.dob),
          dob: form.dob,
          motherTongue: form.motherTongue === "Other" ? (form.motherTongueOther || "Other") : form.motherTongue,
          religion: form.religion === "Other" ? (form.religionOther || "Other") : form.religion,
          community: form.community === "Other" ? form.communityOther : form.community,
          caste: form.caste === "Others" ? form.subCasteOther : form.caste,
          subCaste: form.caste === "Others" ? form.subCasteOther : (form.community === "Other" ? form.subCasteOther : form.caste),
          willingOtherCaste: form.willingOtherCaste,
          dosham: form.dosham,
          education: form.education,
          occupation: form.occupation || "",
          profession: form.occupation || "",
          employedIn: form.employedIn,
          specialization: form.specialization || "",
          educationalQualification: form.educationalQualification || "",
          certificateCourses: form.certificateCourses || "",
          annualIncome: parseIncome(form.annualIncome),
          address: form.address || "",
          city: form.city || "",
          state: form.state,
          district: form.district,
          country: form.country,
          pincode: form.pincode || "",
          familyStatus: form.familyStatus,
          familyType: form.familyType,
          height: convertHeightToCm(form.height),
          physicallyChallenged: form.physicallyChallenged === "Yes",
          physicallyChallengedDescription: form.physicallyChallenged === "Yes"
            ? (form.physicallyChallengedDescription || "") : "",
          about: form.about,
          childrenCount: form.childrenCount || "0",
          childrenWithYou: form.childrenWithYou || false,
          minAge: parseInt(form.partnerAgeMin) || 18,
          maxAge: parseInt(form.partnerAgeMax) || 60,
          membershipType: form.membershipType || "SILVER",
        };

        formData.append(
          "user",
          new Blob([JSON.stringify(userData)], { type: "application/json" })
        );

        if (form.photos && form.photos.length > 0) {
          form.photos.forEach((photo) => formData.append("photos", photo));
        }
        if (form.aadhar) {
          formData.append("aadhar", form.aadhar);
        }

        // ── RAZORPAY PAYMENT ─────────────────────────────────────────────
const plan = MEMBERSHIP_PLANS[form.membershipType];
const totalAmount = Math.round((plan.price + plan.tax) * 100); // Razorpay needs paise

const options = {
  key: "rzp_live_xxxxxxxxxx", // paste your actual Razorpay key here
  amount: totalAmount,
  currency: "INR",
  name: "Eliteinova Matrimony",
  description: `${plan.label} Membership - 3 Months`,
  image: "/logo.png",
  callback_url: "https://razorpay.me/@eliteinovatechprivatelimited",
  redirect: false,
  notes: {
    membershipType: form.membershipType,
    userName: form.name,
  },
  handler: async function (response) {
    // Payment successful — response.razorpay_payment_id is the payment ID
    console.log("✅ Razorpay payment success:", response);

    // Now register the user
    try {
      setLoading(true);
      const apiModule = await import('../../config/api');
      const url = apiModule.buildApiUrl("api/auth/register");
      const regResponse = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
        mode: "cors",
      });

      if (!regResponse.ok) {
        let errorMessage = `Server error ${regResponse.status}`;
        try {
          const errorText = await regResponse.text();
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const result = await regResponse.json();
      if (!result.token) throw new Error(result.error || "Registration failed");

      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      try {
        const axiosInstance = (await import('../../api/axiosUser')).default;
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
      } catch (_) {}

      syncAuthFromStorage();
      if (onClose) onClose();
      if (onRegisterSuccess) onRegisterSuccess(result);
      setPaymentStep("success");

    } catch (err) {
      console.error("❌ Registration after payment failed:", err);
      setRegistrationError("Payment successful but registration failed. Please contact support with payment ID: " + response.razorpay_payment_id);
    } finally {
      setLoading(false);
    }
  },
  prefill: {
    name: form.name || "",
    email: form.email || "",
    contact: form.mobile || "",
  },
  theme: {
    color: "#DC2626", // red to match your brand
  },
  modal: {
    ondismiss: function () {
      console.log("Razorpay modal closed by user");
      setLoading(false);
      // Fallback: open payment link directly if modal fails
    },
    escape: true,
    confirm_close: true,
  },
};

// Load Razorpay script if not already loaded
if (!window.Razorpay) {
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const rzp = new window.Razorpay(options);
rzp.open();
setLoading(false);
return;
        // ── REAL API CALL (uncomment when backend is ready) ───────────────
        // const apiModule = await import('../../config/api');
        // const url = apiModule.buildApiUrl("api/auth/register");
        // const response = await fetch(url, {
        //   method: "POST",
        //   body: formData,
        //   credentials: "include",
        //   mode: "cors",
        // });
        // if (!response.ok) {
        //   let errorMessage = `Server error ${response.status}`;
        //   try {
        //     const errorText = await response.text();
        //     const errorJson = JSON.parse(errorText);
        //     errorMessage = errorJson.message || errorJson.error || errorMessage;
        //   } catch (_) {}
        //   throw new Error(errorMessage);
        // }
        // const result = await response.json();
        // if (!result.token) throw new Error(result.error || "Registration failed");
        // localStorage.setItem("authToken", result.token);
        // localStorage.setItem("user", JSON.stringify(result.user));
        // try {
        //   const axiosInstance = (await import('../../api/axiosUser')).default;
        //   axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
        // } catch (_) {}
        // syncAuthFromStorage();
        // if (onClose) onClose();
        // if (onRegisterSuccess) onRegisterSuccess(result);
        // setPaymentStep("success");

      } catch (err) {
        console.error("❌ Registration error during payment:", err);

        let msg = err.message || "Registration failed. Please try again.";

        // ── Friendly error messages ───────────────────────────────────────
        if (err.name === "TypeError" && msg.includes("Failed to fetch")) {
          msg = "Cannot reach the server. Please check your internet connection and try again.";
        } else if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already exists")) {
          if (msg.toLowerCase().includes("mobile") || msg.toLowerCase().includes("phone")) {
            msg = "This mobile number is already registered. Please go back and use a different number.";
          } else if (msg.toLowerCase().includes("email")) {
            msg = "This email is already registered. Please go back and use a different email.";
          } else {
            msg = "Account already exists. Please try logging in instead.";
          }
        }

        // ── Stay on payment screen, show error — do NOT go back to form ──
        setRegistrationError(msg);

      } finally {
        setLoading(false);
      }
    };

    return (
      <div className={`bg-white shadow-2xl rounded-2xl w-full max-w-lg mx-auto ${inModal ? 'h-full flex flex-col' : 'p-6'}`}>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-red-600">Secure Payment</h2>
          <p className="text-gray-500 text-sm">Choose your payment method</p>
        </div>

        {/* Show registration error on payment screen — don't redirect away */}
        {registrationError && (
          <div className="mx-0 mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold mb-0.5">Registration Failed</p>
              <p>{registrationError}</p>
              <button
                type="button"
                onClick={() => { setRegistrationError(""); setPaymentStep("form"); setStep(1); }}
                className="mt-2 text-xs underline text-red-600 hover:text-red-800"
              >
                ← Go back and fix your details
              </button>
            </div>
          </div>
        )}

        <div className={`${inModal ? 'flex-1 overflow-y-auto px-6 pb-6' : 'max-h-[75vh] overflow-y-auto'}`}>
          <PaymentMethod
            plan={form.membershipType}
            onProceed={handlePaymentProceed}
            onBack={() => { setRegistrationError(""); setPaymentStep("summary"); }}
            loading={loading}
          />
        </div>
      </div>
    );
  }
 
  if (paymentStep === "success") {
    return (
      <div className={`bg-white shadow-2xl rounded-2xl w-full max-w-lg mx-auto ${inModal ? 'h-full flex flex-col' : 'p-6'}`}>
        <div className={`${inModal ? 'flex-1 overflow-y-auto px-6 py-6' : 'max-h-[75vh] overflow-y-auto'}`}>
          <PaymentSuccess
            plan={form.membershipType}
            userData={form}
            onVisitPage={(route) => {
              // Navigate to the plan-specific member page
              // SILVER → /silver-members, GOLD → /gold-members, DIAMOND → /diamond-members
              navigate(route, { replace: true });
            }}
          />
        </div>
      </div>
    );
  }
 
  return (
    <div className={`bg-white shadow-2xl rounded-2xl w-full max-w-lg mx-auto ${inModal ? 'h-full flex flex-col' : 'p-6'}`}>
      <div className={`text-center mb-6 ${inModal ? 'shrink-0 px-6 pt-6' : ''}`}>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          {getStepHeading()}
        </h2>
        <p className="text-gray-600 text-sm">
          Step {step} of {steps.length}
        </p>
        {/* {process.env.NODE_ENV==='development' && <button type="button" onClick={fillTestData} className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Fill Test Data</button>} */}
      </div>

      {step > 1 && (
        <div className={`mb-6 ${inModal ? 'shrink-0 px-6' : ''}`}>
          <Stepper steps={steps.slice(1)} currentStep={step - 1} />
        </div>
      )}
      {error && (
        <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 animate-pulse ${inModal ? 'shrink-0 mx-6' : ''}`}>
          {error}
        </div>
      )}

      {/* Scrollable form content wrapper - enables scrolling for all steps */}
      <div 
        ref={formScrollRef}
        className={`register-form-scrollable ${inModal ? 'flex-1 overflow-y-auto min-h-0 px-6' : 'max-h-[70vh] overflow-y-auto pr-2'} scroll-smooth`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
        onWheel={(e) => {
          // Prevent scroll from propagating to background when scrolling inside form
          const element = e.currentTarget;
          const { scrollTop, scrollHeight, clientHeight } = element;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
          
          // Only prevent propagation if we're not at the boundaries
          // This allows natural scroll behavior at the edges
          if (!isAtTop && !isAtBottom) {
            e.stopPropagation();
          } else if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            // At boundary and trying to scroll further - prevent background scroll
            e.stopPropagation();
          }
        }}
        onTouchMove={(e) => {
          // Prevent touch scroll from propagating to background
          const element = e.currentTarget;
          const { scrollTop, scrollHeight, clientHeight } = element;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
          
          // Only prevent if not at boundaries
          if (!isAtTop && !isAtBottom) {
            e.stopPropagation();
          }
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Registration */}
        {step === 1 && (
          <div className="space-y-4 ">
            <FloatingInput
              label="Creating profile for"
              name="profileFor"
              value={form.profileFor}
              onChange={handleChange}
              required
              select
              error={validationErrors.profileFor}
            >
              <option value="Myself">Myself</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Relative">Relative</option>
              <option value="Friend">Friend</option>
            </FloatingInput>

            <FloatingInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              error={validationErrors.name}
              placeholder="Enter your full name"
            />

            <FloatingInput
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              type="tel"
              error={validationErrors.mobile}
              placeholder="mobile number"
              maxLength="14"
            />

            <div className="relative h-fit" style={{ marginBottom: 0 }}>  <FloatingInput
    label="Create Password"
    name="password"
    type={showPassword ? "text" : "password"}
    value={form.password}
    onChange={handleChange}
    required
    error={validationErrors.password}
    placeholder="Enter Your Password"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
    tabIndex={-1}
  >
    {showPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
</div>

            <div className="relative h-fit" style={{ marginBottom: 0 }}>  <FloatingInput
    label="Confirm Password"
    name="confirmPassword"
    type={showConfirmPassword ? "text" : "password"}
    value={form.confirmPassword}
    onChange={handleChange}
    required
    error={validationErrors.confirmPassword}
    placeholder="Re-enter your password"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
    tabIndex={-1}
  >
    {showConfirmPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
</div>
            {/* Password Requirements */}
<div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 space-y-1">
  <p className="font-semibold text-gray-700 mb-1">Password must contain:</p>
  <ul className="space-y-1">
    <li className={`flex items-center gap-2 ${form.password?.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
      <span>{form.password?.length >= 6 ? '✅' : '⬜'}</span> At least 6 characters
    </li>
    <li className={`flex items-center gap-2 ${/[A-Z]/.test(form.password || '') ? 'text-green-600' : 'text-gray-500'}`}>
      <span>{/[A-Z]/.test(form.password || '') ? '✅' : '⬜'}</span> At least one uppercase letter (A-Z)
    </li>
    <li className={`flex items-center gap-2 ${/[a-z]/.test(form.password || '') ? 'text-green-600' : 'text-gray-500'}`}>
      <span>{/[a-z]/.test(form.password || '') ? '✅' : '⬜'}</span> At least one lowercase letter (a-z)
    </li>
    <li className={`flex items-center gap-2 ${/[0-9]/.test(form.password || '') ? 'text-green-600' : 'text-gray-500'}`}>
      <span>{/[0-9]/.test(form.password || '') ? '✅' : '⬜'}</span> At least one number (0-9)
    </li>
  </ul>
</div>
          </div>
        )}

        {/* Step 2: Basic Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
  Gender <span className="text-red-500">*</span>
</label>
              <div className="flex items-center space-x-6">
                {["Male", "Female"].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={form.gender === gender}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
              {validationErrors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.gender}
                </p>
              )}
            </div>

            <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Date of Birth <span className="text-red-500">*</span>
  </label>
  <input
    type="date"
    name="dob"
    value={form.dob}
    onChange={handleChange}
    required
    min="1975-01-01"
    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
      .toISOString().split("T")[0]}
    className={`w-full border rounded-lg px-3 py-3 text-gray-800 text-sm bg-white
      focus:outline-none focus:ring-2 focus:ring-red-400 transition-all cursor-pointer
      ${validationErrors.dob ? "border-red-400" : "border-gray-300"}`}
    style={{ colorScheme: "light" }}
  />
  {validationErrors.dob && (
    <p className="text-red-500 text-xs mt-1">{validationErrors.dob}</p>
  )}
</div>

            <FloatingInput
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />

            <div className="grid grid-cols-2 gap-4">
              <FloatingInput
                label="Preferred Min Age"
                name="partnerAgeMin"
                type="number"
                value={form.partnerAgeMin}
                onChange={handleChange}
                min="18"
                max="100"
                error={validationErrors.partnerAgeMin}
              />
              <FloatingInput
                label="Preferred Max Age"
                name="partnerAgeMax"
                type="number"
                value={form.partnerAgeMax}
                onChange={handleChange}
                min="18"
                max="100"
                error={validationErrors.partnerAgeMax}
              />
            </div>
            {/* Age Guidelines */}
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-gray-700 space-y-1.5">
  <p className="font-semibold text-yellow-800 mb-1">📋 Age Guidelines:</p>
  <ul className="space-y-0.3 list-disc list-inside">
    <li>Age must match official ID proof (Aadhar / Passport / Driving License).</li>
    <li>Profiles with incorrect age details may be rejected.</li>
    <li>Age preference should be realistic and within culturally acceptable limits.</li>
    <li className="text-green-700">
      💡 <span className="font-medium">Tip:</span> Accurate age details improve your Tamil Bride Search or Tamil Groom Search results and increase profile visibility.
    </li>
  </ul>
</div>

            <FloatingInput
              label="Email ID (Gmail only)"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              error={validationErrors.email}
              placeholder="yourname@gmail.com"
            />
          </div>
        )}

        {/* Step 3: Religion Details */}
{step === 3 && (
  <div className="space-y-4">

        {/* ⭐ Mother Tongue Select with Other option */}
    <div>
      <label className="block mb-1 font-medium">Mother Tongue <span className="text-red-500">*</span></label>
      <Select
        value={form.motherTongue ? { value: form.motherTongue, label: form.motherTongue } : null}
        onChange={(e) => {
          handleChange({ target: { name: "motherTongue", value: e.value } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "motherTongueOther", value: "" } });
          }
        }}
        options={[
          "Other",
          "Tamil",
          "English",
          "Telugu",
          "Malayalam",
          "Kannada",
          "Hindi",
          "Urdu",
          "Marathi",
          "Bengali",
          "Gujarati"
        ].map((lang) => ({
          value: lang,
          label: lang,
        }))}
        placeholder="Select Mother Tongue"
      />
      {validationErrors.motherTongue && (
        <p className="text-red-500 text-sm">{validationErrors.motherTongue}</p>
      )}
      
      {/* Show text input when "Other" is selected */}
      {form.motherTongue === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your mother tongue"
            name="motherTongueOther"
            value={form.motherTongueOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your mother tongue"
            error={validationErrors.motherTongueOther}
          />
          {validationErrors.motherTongueOther && (
            <p className="text-red-500 text-sm">{validationErrors.motherTongueOther}</p>
          )}
        </div>
      )}
    </div>

        {/* ⭐ Religion Select with Other option */}
    <div>
     <label className="block mb-1 font-medium">Religion <span className="text-red-500">*</span></label>
      <Select
        value={form.religion ? { value: form.religion, label: form.religion } : null}
        onChange={(e) => {
          handleChange({ target: { name: "religion", value: e.value } });
          handleChange({ target: { name: "community", value: "" } });
          handleChange({ target: { name: "caste", value: "" } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "religionOther", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
          { value: "Hindu", label: "Hindu" },
          { value: "Muslim", label: "Muslim" },
          { value: "Christian", label: "Christian" },
          { value: "Sikh", label: "Sikh" },
          { value: "Jain", label: "Jain" },
          { value: "Buddhist", label: "Buddhist" },
          { value: "Jewish", label: "Jewish" },
          { value: "Parsi", label: "Parsi" },
          
        ]}
        placeholder="Select Religion"
      />
      {validationErrors.religion && (
        <p className="text-red-500 text-sm">{validationErrors.religion}</p>
      )}
      
      {/* Show text input when "Other" is selected */}
      {form.religion === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your religion"
            name="religionOther"
            value={form.religionOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your religion"
            error={validationErrors.religionOther}
          />
          {validationErrors.religionOther && (
            <p className="text-red-500 text-sm">{validationErrors.religionOther}</p>
          )}
        </div>
      )}
    </div>

    {/* Other Caste Checkbox */}
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      <input
        type="checkbox"
        name="willingOtherCaste"
        checked={form.willingOtherCaste}
        onChange={handleCheckbox}
        className="text-red-600 focus:ring-red-500"
      />
      <label className="text-gray-700">Willing to marry from other community/caste?</label>
    </div>

    {/* ⭐ Community Category Select (Tamil Nadu Government Categories) */}
    <div>
      <label className="block mb-1 font-medium">Community Category</label>
      <Select
        value={form.community ? { value: form.community, label: communityCategories.find(c => c.value === form.community)?.label || form.community } : null}
        onChange={(e) => {
          console.log("🏷️ Community selected:", e?.value);
          if (e && e.value) {
            handleChange({ target: { name: "community", value: e.value } });
            handleChange({ target: { name: "caste", value: "" } });
            handleChange({ target: { name: "subCaste", value: "" } });
            if (e.value !== "Other") {
              handleChange({ target: { name: "communityOther", value: "" } });
            }
          }
        }}
        options={communityCategories}
        placeholder="Select Community Category"
        isSearchable={true}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
      />
      {form.community === "Other" && (
  <div className="mt-2">
    <FloatingInput
      label="Please specify community category"
      name="communityOther"
      value={form.communityOther}
      onChange={handleChange}
    />
    {validationErrors.communityOther && (
      <p className="text-red-500 text-sm">{validationErrors.communityOther}</p>
    )}
  </div>
)}
      {validationErrors.community && (
        <p className="text-red-500 text-sm">{validationErrors.community}</p>
      )}
    </div>

    {/* ⭐ Caste/Subcaste Select */}
    <div>
      <label className="block mb-1 font-medium">Caste/Subcaste </label>
      <Select
        value={form.caste ? { value: form.caste, label: form.caste } : null}
        onChange={(e) => {
          console.log("🏷️ Caste selected:", e?.value);
          if (e && e.value) {
            handleChange({ target: { name: "caste", value: e.value } });
            // Set subCaste same as caste for backward compatibility
            handleChange({ target: { name: "subCaste", value: e.value } });
            if (e.value !== "Others") {
              handleChange({ target: { name: "subCasteOther", value: "" } });
            }
          }
        }}
        isDisabled={!form.community || form.community === "Other"}
        options={
          form.community && form.community !== "Other" && communityCasteData[form.community]
            ? communityCasteData[form.community].map((caste) => ({
                value: caste,
                label: caste,
              }))
            : []
        }
        placeholder={form.community === "Other" ? "Select community category first" : form.community ? "Select Caste/Subcaste" : "Select Community Category First"}
        isSearchable={true}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
      />
      {form.caste === "Others" && (
  <div className="mt-2">
    <FloatingInput
      label="Please specify caste/subcaste"
      name="subCasteOther"
      value={form.subCasteOther}
      onChange={handleChange}
    />
    {validationErrors.subCasteOther && (
      <p className="text-red-500 text-sm">{validationErrors.subCasteOther}</p>
    )}
  </div>
)}
{form.community === "Other" && (
  <div className="mt-2">
    <FloatingInput
      label="Please specify caste/subcaste"
      name="subCasteOther"
      value={form.subCasteOther}
      onChange={handleChange}
    />
    {validationErrors.subCasteOther && (
      <p className="text-red-500 text-sm">{validationErrors.subCasteOther}</p>
    )}
  </div>
)}
      {validationErrors.caste && (
        <p className="text-red-500 text-sm">{validationErrors.caste}</p>
      )}
    </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosham:
              </label>
              <div className="flex items-center space-x-4">
                {["Yes", "No", "Don't Know"].map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="dosham"
                      value={val}
                      checked={form.dosham === val}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{val}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Personal Details */}
        {step === 4 && (
          <div className="space-y-4">
            <FloatingInput
              label="Marital Status"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              required
              select
              error={validationErrors.maritalStatus}
            >
              <option value="Never Married">Never Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </FloatingInput>

            {(form.maritalStatus === "Divorced" ||
              form.maritalStatus === "Widowed") && (
              <FloatingInput
                label="No. of Children"
                name="childrenCount"
                value={form.childrenCount}
                onChange={handleChange}
                select
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3+">3+</option>
              </FloatingInput>
            )}

            {form.childrenCount && parseInt(form.childrenCount) > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  name="childrenWithYou"
                  checked={form.childrenWithYou}
                  onChange={handleCheckbox}
                  className="text-red-600 focus:ring-red-500"
                />
                <label className="text-gray-700">
                  Are children living with you?
                </label>
              </div>
            )}

            <FloatingInput
              label="Height (ft)"
              name="height"
              value={form.height}
              onChange={handleChange}
              required
              error={validationErrors.height}
              list="heights"
              placeholder="Select or enter height"
            />
            <datalist id="heights">
              {Array.from({ length: 31 }, (_, i) => 4 + i * 0.1).map((h) => {
                return <option key={h.toFixed(1)} value={h.toFixed(1)} />;
              })}
            </datalist>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Financial Status <span className="text-gray-400 font-normal">(Optional)</span>
  </label>
  <select
    name="familyStatus"
    value={form.familyStatus}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
  >
    <option value="Other">Other</option>
    <option value="Lower Middle Class">Lower Middle Class</option>
    <option value="Middle Class">Middle Class</option>
    <option value="Upper Middle Class">Upper Middle Class</option>
    <option value="Rich">Rich</option>
    <option value="Upper Rich">Upper Rich</option>
  </select>
  {form.familyStatus === "Other" && (
    <div className="mt-2">
      <FloatingInput
        label="Please specify financial status"
        name="familyStatusOther"
        value={form.familyStatusOther || ""}
        onChange={handleChange}
        placeholder="Enter your financial status"
      />
    </div>
  )}
  {validationErrors.familyStatus && (
    <p className="text-red-500 text-xs mt-1">{validationErrors.familyStatus}</p>
  )}
</div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Family Type <span className="text-gray-400 font-normal">(Optional)</span>
  </label>
  <select
    name="familyType"
    value={form.familyType}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
  >
    <option value="Other">Other</option>
    <option value="Joint">Joint Family</option>
    <option value="Nuclear">Nuclear Family</option>
  </select>
  {form.familyType === "Other" && (
    <div className="mt-2">
      <FloatingInput
        label="Please specify family type"
        name="familyTypeOther"
        value={form.familyTypeOther || ""}
        onChange={handleChange}
        placeholder="Enter your family type"
      />
    </div>
  )}
  {validationErrors.familyType && (
    <p className="text-red-500 text-xs mt-1">{validationErrors.familyType}</p>
  )}
</div>

            {/* Physically Challenged Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physically Challenged *
              </label>
              <div className="flex items-center space-x-6">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="physicallyChallenged"
                      value={option}
                      checked={form.physicallyChallenged === option}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {validationErrors.physicallyChallenged && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.physicallyChallenged}
                </p>
              )}
            </div>

            {/* Description box if Yes is selected */}
            {form.physicallyChallenged === "Yes" && (
              <FloatingInput
                label="Description"
                name="physicallyChallengedDescription"
                value={form.physicallyChallengedDescription}
                onChange={handleChange}
                textarea
                placeholder="Please describe your physical challenge"
                rows="3"
                error={validationErrors.physicallyChallengedDescription}
              />
            )}
          </div>
        )}

        {step === 5 && (
  <div className="space-y-4">
    
    {/* ⭐ Highest Education */}
    <div>
  <label className="block mb-1 font-medium">Highest Education</label>
  <Select
    value={form.education ? { value: form.education, label: form.education } : null}
    onChange={(e) => {
      handleChange({ target: { name: "education", value: e.value } });
      if (e.value !== "Other") {
        handleChange({ target: { name: "educationOther", value: "" } });
      }
    }}
    options={[
      { value: "Other", label: "Other" },
      { value: "High School", label: "High School" },
      { value: "Bachelor's", label: "Bachelor's Degree" },
      { value: "Master's", label: "Master's Degree" },
      { value: "PhD", label: "PhD" },
    ]}
    placeholder="Select Education"
  />
  {form.education === "Other" && (
  <div className="mt-2">
    <FloatingInput
      label="Please specify your education"
      name="educationOther"
      value={form.educationOther || ""}
      onChange={handleChange}
      required                    // ← ADDED
      placeholder="Enter your highest education"
      error={validationErrors.educationOther}   // ← ADDED
    />
  </div>
)}
  {validationErrors.education && (
    <p className="text-red-500 text-sm">{validationErrors.education}</p>
  )}
</div>

    {/* Educational Qualification */}
    <div>
  <label className="block mb-1 font-medium">Educational Qualification</label>
  <Select
    value={form.educationalQualification ? { value: form.educationalQualification, label: form.educationalQualification } : null}
    onChange={(e) => {
      handleChange({ target: { name: "educationalQualification", value: e.value } });
      if (e.value !== "Other") {
        handleChange({ target: { name: "educationalQualificationOther", value: "" } });
      }
    }}
    options={[
      { value: "Other", label: "Other" },
      { value: "10th Pass", label: "10th Pass" },
      { value: "12th Pass", label: "12th Pass" },
      { value: "Diploma", label: "Diploma" },
      { value: "Bachelor's Degree", label: "Bachelor's Degree" },
      { value: "Master's Degree", label: "Master's Degree" },
      { value: "M.Phil", label: "M.Phil" },
      { value: "PhD", label: "PhD" },
      { value: "Professional Degree (CA, CS, ICWA)", label: "Professional Degree (CA, CS, ICWA)" },
      { value: "Engineering", label: "Engineering" },
      { value: "Medical (MBBS, MD, etc.)", label: "Medical (MBBS, MD, etc.)" },
      { value: "Law (LLB, LLM)", label: "Law (LLB, LLM)" },
    ]}
    placeholder="Select Educational Qualification"
    isClearable
  />
  {form.educationalQualification === "Other" && (
  <div className="mt-2">
    <FloatingInput
      label="Please specify your qualification"
      name="educationalQualificationOther"
      value={form.educationalQualificationOther || ""}
      onChange={handleChange}
      required                    // ← ADDED
      placeholder="Enter your educational qualification"
      error={validationErrors.educationalQualificationOther}  // ← ADDED
    />
  </div>
)}
 {validationErrors.educationalQualification && (
    <p className="text-red-500 text-sm">{validationErrors.educationalQualification}</p>
  )} 
</div>
    
    {/* Specialization (normal input) */}
    <FloatingInput
      label="Specialization"
      name="specialization"
      value={form.specialization}
      onChange={handleChange}
      placeholder="e.g., Computer Science, Business Administration"
    />

    {/* Certificate Courses */}
    <FloatingInput
      label="Certificate Courses (if any)"
      name="certificateCourses"
      value={form.certificateCourses}
      onChange={handleChange}
      placeholder="e.g., AWS Certified, PMP, Digital Marketing, etc."
    />

       {/* ⭐ Employed In with Other option */}
    <div>
      <label className="block mb-1 font-medium">Employed In</label>
      <Select
        value={form.employedIn ? { value: form.employedIn, label: form.employedIn } : null}
        onChange={(e) => {
          handleChange({ target: { name: "employedIn", value: e.value } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "employedInOther", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
          { value: "Private", label: "Private Sector" },
          { value: "Government", label: "Government Sector" },
          { value: "Self-Employed", label: "Self-Employed" },
          { value: "Business", label: "Business" },
          { value: "Not Employed", label: "Not Employed" },
        ]}
        placeholder="Select Employment"
      />
      {validationErrors.employedIn && (
        <p className="text-red-500 text-sm">{validationErrors.employedIn}</p>
      )}
      
      {/* Show text input when "Other" is selected */}
      {form.employedIn === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your employment type"
            name="employedInOther"
            value={form.employedInOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your employment type"
            error={validationErrors.employedInOther}
          />
          {validationErrors.employedInOther && (
            <p className="text-red-500 text-sm">{validationErrors.employedInOther}</p>
          )}
        </div>
      )}
    </div>

        {/* ⭐ Occupation with Other option */}
    <div>
      <label className="block mb-1 font-medium">Occupation</label>
      <Select
        value={
          form.occupation
            ? { value: form.occupation, label: form.occupation }
            : null
        }
        onChange={(e) => {
          handleChange({ target: { name: "occupation", value: e.value } });
          // If not "Other", clear the other text field
          if (e.value !== "Other") {
            handleChange({ target: { name: "occupationOther", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
          ...professionOptions,
        ]}
        placeholder="Select Occupation"
      />
      
      {/* Show text input when "Other" is selected */}
      {form.occupation === "Other" && (
        <div className="mt-3">
          <FloatingInput
            label="Please specify your occupation"
            name="occupationOther"
            value={form.occupationOther || ""}
            onChange={handleChange}
            required
            placeholder="Enter your occupation"
            error={validationErrors.occupationOther}
          />
          {validationErrors.occupationOther && (
            <p className="text-red-500 text-sm">{validationErrors.occupationOther}</p>
          )}
        </div>
      )}
    </div>

    {/* ⭐ Annual Income */}
    <div>
  <label className="block mb-1 font-medium">Annual Income (Rs)</label>
  <Select
    value={form.annualIncome ? { value: form.annualIncome, label: form.annualIncome } : null}
    onChange={(e) => {
      handleChange({ target: { name: "annualIncome", value: e.value } });
      if (e.value !== "Other") {
        handleChange({ target: { name: "annualIncomeOther", value: "" } });
      }
    }}
    options={[
      { value: "0-2L", label: "0 - 2L" },
      { value: "2L-5L", label: "2L - 5L" },
      { value: "5L-10L", label: "5L - 10L" },
      { value: "10L-15L", label: "10L - 15L" },
      { value: "15L-20L", label: "15L - 20L" },
      { value: "20L-50L", label: "20L - 50L" },
      { value: "50L-75L", label: "50L - 75L" },
      { value: "75L-1Cr", label: "75L to 1Cr" },
      { value: "1Cr-3Cr", label: "1Cr - 3Cr" },
      { value: "3Cr-5Cr", label: "3Cr - 5Cr" },
      { value: "5Cr-10Cr", label: "5Cr - 10Cr" },
      { value: "10Cr-20Cr", label: "10Cr - 20Cr" },
      { value: "20Cr+", label: "20Cr and Above" },
      { value: "Other", label: "Other" },
    ]}
    placeholder="Select Income"
  />
  {form.annualIncome === "Other" && (
    <div className="mt-2">
      <FloatingInput
        label="Please specify your annual income"
        name="annualIncomeOther"
        value={form.annualIncomeOther || ""}
        onChange={handleChange}
        placeholder="e.g., 25,000/month or 3L per year"
      />
    </div>
  )}
  {validationErrors.annualIncome && (
    <p className="text-red-500 text-sm">{validationErrors.annualIncome}</p>
  )}
</div>

    {/* ⭐ COUNTRY SELECT - MOVED ABOVE STATE */}
    <div>
      <label className="block mb-1 font-medium">Country</label>
      <Select
        value={form.country ? { value: form.country, label: form.country } : null}
        onChange={(e) => {
          handleChange({ target: { name: "country", value: e.value } });
          // Reset state and district when country changes (only India has states/districts)
          if (e.value !== "India") {
            handleChange({ target: { name: "state", value: "" } });
            handleChange({ target: { name: "district", value: "" } });
          }
        }}
        options={[
          { value: "Other", label: "Other" },
          // South Asia
          { value: "India", label: "India" },
          { value: "Sri Lanka", label: "Sri Lanka" },
          
          // Southeast Asia
          { value: "Malaysia", label: "Malaysia" },
          { value: "Singapore", label: "Singapore" },
          { value: "Indonesia", label: "Indonesia" },
          { value: "Myanmar", label: "Myanmar" },
          { value: "Thailand", label: "Thailand" },
          
          // Middle East
          { value: "United Arab Emirates", label: "United Arab Emirates (UAE)" },
          { value: "Saudi Arabia", label: "Saudi Arabia" },
          { value: "Qatar", label: "Qatar" },
          { value: "Kuwait", label: "Kuwait" },
          { value: "Oman", label: "Oman" },
          { value: "Bahrain", label: "Bahrain" },
          
          // Africa
          { value: "South Africa", label: "South Africa" },
          { value: "Mauritius", label: "Mauritius" },
          { value: "Réunion", label: "Réunion (France)" },
          { value: "Kenya", label: "Kenya" },
          { value: "Tanzania", label: "Tanzania" },
          { value: "Uganda", label: "Uganda" },
          
          // Europe
          { value: "United Kingdom", label: "United Kingdom" },
          { value: "France", label: "France" },
          { value: "Germany", label: "Germany" },
          { value: "Switzerland", label: "Switzerland" },
          { value: "Netherlands", label: "Netherlands" },
          { value: "Norway", label: "Norway" },
          { value: "Sweden", label: "Sweden" },
          { value: "Denmark", label: "Denmark" },
          
          // North America
          { value: "Canada", label: "Canada" },
          { value: "United States", label: "United States" },
          
          // Oceania
          { value: "Australia", label: "Australia" },
          { value: "New Zealand", label: "New Zealand" },
          
          // Caribbean & South America
          { value: "Guyana", label: "Guyana" },
          { value: "Suriname", label: "Suriname" },
          { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
          { value: "Fiji", label: "Fiji" },
          
        ]}
        placeholder="Select Country"
      />
      {validationErrors.country && (
        <p className="text-red-500 text-sm">{validationErrors.country}</p>
      )}
    </div>

    {/* ⭐ STATE SELECT - Only show for India */}
    {(form.country === "India" || !form.country) && (
      <>
        <div>
          <label className="block mb-1 font-medium">State</label>
          <Select
            value={form.state ? { value: form.state, label: form.state } : null}
            onChange={(e) => {
              handleChange({ target: { name: "state", value: e.value } });
              handleChange({ target: { name: "district", value: "" } });
            }}
            options={indianStates.map((s) => ({ value: s, label: s }))}
            placeholder="Select State"
          />
          {validationErrors.state && (
            <p className="text-red-500 text-sm">{validationErrors.state}</p>
          )}
        </div>

        {/* ⭐ DISTRICT SELECT → dynamic for all states */}
        <div>
          <label className="block mb-1 font-medium">District</label>
          <Select
            value={
              form.district ? { value: form.district, label: form.district } : null
            }
            onChange={(e) =>
              handleChange({ target: { name: "district", value: e.value } })
            }
            isDisabled={!form.state}
            options={
              form.state && districtsByState[form.state]
                ? districtsByState[form.state].map((d) => ({
                    value: d,
                    label: d,
                  }))
                : []
            }
            placeholder={
              form.state ? "Select District" : "Select State First"
            }
          />
          {validationErrors.district && (
            <p className="text-red-500 text-sm">{validationErrors.district}</p>
          )}
        </div>
      </>
    )}
    
    {/* ⭐ ADD CITY INPUT FIELD HERE */}
        {/* ⭐ ADD CITY INPUT FIELD HERE with 15 character limit */}
    <FloatingInput
      label="City/Town"
      name="city"
      value={form.city}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 15) {
          handleChange(e);
        }
      }}
      placeholder="Enter your city or town (max 15 characters)"
      error={validationErrors.city}
      maxLength="15"
    />

    {/* Pincode */}
    <FloatingInput
      label="Pincode"
      name="pincode"
      value={form.pincode}
      onChange={handleChange}
      placeholder="6-digit pincode"
      maxLength="6"
    />

        {/* Address (Required) */}
<FloatingInput
  label="Address"
  name="address"
  value={form.address}
  onChange={handleChange}
  required
  textarea
  placeholder="Enter your complete address"
  rows="4"
  error={validationErrors.address}
/>

{/* Address Guidelines */}
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-gray-700 space-y-1.5">
  <p className="font-semibold text-yellow-800 mb-1">📋 Address Guidelines:</p>
  <ul className="space-y-0.3 list-disc list-inside">
    <li>Mention correct current residence.</li>
    <li>If working abroad, specify work country and native place separately in the Address message box.</li>
    <li>NRI profiles must clearly mention visa/work status in the <span className="font-medium">"About Yourself"</span> box.</li>
    <li className="text-green-700">
      💡 <span className="font-medium">Tip:</span> Selecting flexible location preferences increases better match suggestions in our Community Matrimony Tamil Nadu and global Tamil network.
    </li>
  </ul>
</div>

</div>

      )}

        {/* Step 6: About Yourself & Documents */}
        {step === 6 && (
          <div className="space-y-6">
                        {/* About Yourself with bold heading */}
            <div>
              <label className="block text-lg font-bold text-red-600 mb-3">
                📝 About Yourself
              </label>
              <FloatingInput
                label="About Yourself"
                name="about"
                value={form.about}
                onChange={handleChange}
                required
                textarea
                error={validationErrors.about}
                placeholder="Tell us about yourself, your interests, family background, and what you're looking for in a partner (50-1000 characters)"
                rows="5"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Share your personality, hobbies, and expectations</span>
                <span className={form.about?.length > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                  {form.about?.length || 0}/1000
                </span>
              </div>
            </div>

            {/* Photos Upload - Updated with green colors */}
            <div>
              <label className="block text-lg font-bold text-red-600 mb-1">
                📸 Profile Photos <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload clear, recent photos for better matches (Required)
              </p>
              {validationErrors.photos && (
                <p className="text-red-600 text-sm mb-2">{validationErrors.photos}</p>
              )}
              <div className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 ${
                validationErrors.photos 
                  ? "border-red-500 bg-red-50 hover:bg-red-100" 
                  : "border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50"
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={form.photos.length >= 3}
                  
                />
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-12 h-12 text-green-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    <span className="text-green-600 font-semibold">Click to upload photos</span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    PNG, JPG, JPEG up to 5MB each (Max 3 photos)
                  </p>
                </div>
              </div>

              {/* Uploaded Photos Preview */}
              {form.photos.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-green-700">
                      Uploaded Photos ({form.photos.length}/3)
                    </p>
                    {form.photos.length >= 3 && (
                      <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                        ✓ Maximum 3 photos reached
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {form.photos.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg border-2 border-green-200 group-hover:border-green-500 transition-colors shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                          title="Remove photo"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                          {idx === 0 ? "Main" : idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Photo Guidelines */}
             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-gray-700 space-y-1.5 mt-3">
             <p className="font-semibold text-yellow-800 mb-1">📋 Photo Guidelines:</p>
            <ul className="space-y-0.3 list-disc list-inside">
           <li>Upload a recent passport-size or clear portrait photo.</li>
           <li>Face must be clearly visible (no sunglasses or heavy filters).</li>
           <li>Neutral or traditional attire preferred.</li>
           <li>Minimum resolution: 400 x 400 pixels.</li>
           <li>Maximum file size: 5 MB per profile photo.</li>
          <li>Accepted formats: JPG, JPEG, PNG.</li>
         </ul>
     </div>

            </div>
 {/* ID Proof Upload - Changed from Aadhar */}
<div>
  <label className="block text-lg font-bold text-red-600 mb-1">
    🆔 Upload Any ID Proof <span className="text-red-500">*</span>
  </label>
  <p className="text-sm text-gray-600 mb-3">
    Upload for identity verification (Required)
  </p>
  {validationErrors.aadhar && (
    <p className="text-red-600 text-sm mb-2">{validationErrors.aadhar}</p>
  )}
  <div className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 ${
    validationErrors.aadhar 
      ? "border-red-500 bg-red-50 hover:bg-red-100" 
      : "border-gray-300 bg-green-50 hover:border-green-500 hover:bg-green-100"
  }`}>
    <input
      type="file"
      accept=".pdf,.PDF,.jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const validTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
          ];
          if (validTypes.includes(file.type)) {
            if (file.size > 10 * 1024 * 1024) {
              setError("ID Proof file too large (max 10MB)");
              return;
            }
            setForm((prev) => ({ ...prev, aadhar: file }));
            setError("");
            // Clear validation error when ID proof is uploaded
            if (validationErrors.aadhar) {
              setValidationErrors((prev) => ({ ...prev, aadhar: "" }));
            }
          } else {
            setError("Please upload PDF, JPG, or PNG for ID Proof");
          }
        }
      }}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="flex flex-col items-center justify-center">
      <svg
        className="w-12 h-12 text-green-400 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
      <p className="text-sm text-gray-600 font-medium">
        <span className="text-green-600 font-semibold">
          Click to upload ID Proof
        </span>{" "}
        or drag and drop
      </p>
      <p className="text-xs text-gray-500 mt-1">
        PDF, JPG, PNG (Max 10MB) • Upload any ID Proof (Driving License, Aadhar,Voter ID, Passport and Others)
      </p>
    </div>
  </div>

  {/* Uploaded Aadhar Preview */}
  {form.aadhar && (
    <div className="mt-4">
      <div className="flex items-center justify-between p-4 border border-green-200 rounded-xl bg-green-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">
              {form.aadhar.name}
            </p>
            <p className="text-xs text-gray-500">
              Aadhar Document • {(form.aadhar.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(form.aadhar);
              window.open(url, "_blank");
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Preview Aadhar"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </button>

          <button
            type="button"
            onClick={() => {
              setForm((prev) => ({ ...prev, aadhar: null }));
              // Re-validate when ID proof is removed
              setValidationErrors((prev) => ({ ...prev, aadhar: "ID proof is required for verification" }));
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Remove Aadhar"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Remove
          </button>
        </div>
      </div>

      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Your Aadhar is kept confidential and used only for identity verification
      </p>
    </div>
  )}
         {/* ID Proof Guidelines */}
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-gray-700 space-y-0.3 mt-3">
    <p className="font-semibold text-yellow-800 mb-1">📋 ID Proof Guidelines:</p>
    <ul className="space-y-0.3 list-disc list-inside">
      <li>Upload a clear and readable scanned copy or photo.</li>
      <li>Ensure name and date of birth are visible.</li>
      <li>Maximum file size: 5 MB (front page with address).</li>
      <li>Accepted formats: JPG, JPEG, PNG, PDF.</li>
    </ul>
    <div className="mt-2 pt-2 border-t border-yellow-300">
      <p className="font-semibold text-yellow-800 mb-1">📝 Notes:</p>
      <ul className="space-y-0.3 list-disc list-inside">
        <li>ID proof is used only for verification purposes.</li>
        <li>ID details will <span className="font-semibold">NOT</span> be displayed publicly on your profile.</li>
        <li>Profiles without verification may have limited visibility.</li>
        <li className="text-red-600 font-medium">Fake or tampered documents will lead to permanent account removal.</li>
      </ul>
    </div>
  </div>
</div>

            {/* Upload Summary */}
            {(form.photos.length > 0 || form.aadhar) && (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Upload Summary
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <div className="text-center p-2 bg-white rounded-lg border border-blue-100">
        <div className="font-semibold text-blue-600">
          {form.photos.length}
        </div>
        <div className="text-gray-600">Photos</div>
      </div>
      <div className="text-center p-2 bg-white rounded-lg border border-blue-100">
        <div className="font-semibold text-blue-600">
          {form.aadhar ? "✓" : "None"}
        </div>
        <div className="text-gray-600">Aadhar</div>
      </div>
    </div>
  </div>
)}

   {/* Membership Type - Updated with bold and 3 months */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-lg font-bold text-red-600">
                  Membership Type *
                </label>
                <button
                 type="button"
                 onClick={() => {}}
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-yellow-600"
               >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Update Currencies
                </button>
              </div>
              <div className="flex flex-col space-y-3">
                {[
                  { value: "SILVER", label: "SILVER", price: "₹299 + Tax/Per 3 Months" },
                  { value: "GOLD", label: "GOLD", price: "₹499 + Tax/Per 3 Months" },
                  { value: "DIAMOND", label: "DIAMOND", price: "₹749 + Tax/Per 3 Months" },
                ].map((membership) => (
                  <label
                    key={membership.value}
                    className="flex items-center gap-3 cursor-pointer p-3 border-2 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="membershipType"
                      value={membership.value}
                      checked={form.membershipType === membership.value}
                      onChange={handleChange}
                      className="text-green-600 focus:ring-green-500 w-4 h-5"
                    />
                    <span className="text-green-700 font-bold text-lg flex-1">{membership.label}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 font-bold text-base">{membership.price}</span>
                    </div>
                  </label>
                ))}
              </div>
              {validationErrors.membershipType && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.membershipType}
                </p>
              )}
            </div>
          </div>
        )}
        </form>
      </div>

      {/* Form controls - always visible at bottom */}
      <div className={inModal ? 'shrink-0 mt-4 px-6 pb-6' : 'mt-4'}>
        <StepperController
          currentStep={step}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          loading={loading}
          validationErrors={validationErrors}
        />
      </div>

      {step === 1 && onSwitch && (
        <div className={`text-center pt-4 border-t border-gray-200 ${inModal ? 'px-6 pb-6 shrink-0' : ''}`}>
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="text-red-600 hover:text-red-700 font-medium underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
