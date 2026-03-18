// src/components/profiles/matrimonyUtils.js
// Small utility — only named exports, no default export, no JSX
// This avoids the Vite module resolution conflict with MatrimonyInterestFlow.jsx

/**
 * Generates a WhatsApp deep link to send interest notification.
 * @param {Object} targetProfile  - The profile card being viewed (recipient)
 * @param {Object} senderProfile  - The logged-in user's profile (sender)
 * @param {string} baseUrl        - e.g. window.location.origin
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppInterestLink(
  targetProfile,
  senderProfile,
  baseUrl
) {
  const resolvedBase = baseUrl || window.location.origin;

  const senderGender = (senderProfile?.gender || "").toLowerCase();
  const senderProfileType = senderGender.includes("female") ? "bride" : "groom";
  const senderUrl = `${resolvedBase}/${senderProfileType}-profile/${senderProfile?.id}`;
  const senderName = senderProfile?.name || senderProfile?.fullName || "Someone";

  const message =
    `\uD83D\uDC8D *Eliteinova Matrimony \u2014 Interest Received*\n\n` +
    `Hello! *${senderName}* has shown interest in your profile on Eliteinova Matrimony.\n\n` +
    `\uD83D\uDC64 *View their profile:*\n${senderUrl}\n\n` +
    `To respond, tap the link above and click *Interested* or *Not Interested*.\n\n` +
    `_Eliteinova \u2014 Connect with Life Partner and Two Families_`;

  const encodedMsg = encodeURIComponent(message);
  const phone = (targetProfile?.mobile || "").replace(/\D/g, "");

  return phone
    ? `https://wa.me/${phone}?text=${encodedMsg}`
    : `https://wa.me/?text=${encodedMsg}`;
}