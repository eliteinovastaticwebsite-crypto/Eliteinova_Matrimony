// src/components/common/Footer.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";
import { footerLinks } from "../../config/footerLinks";

export default function Footer({ onRegister, onLogin }) {
  const navigate = useNavigate();

  const handleRegister = () => {
    if (onRegister) onRegister();
    else navigate("/customer-registration");
  };

  const handleLogin = () => {
    if (onLogin) onLogin();
    else navigate("/customer-login");
  };

  return (
    <footer
      className="w-full text-white pt-10 pb-8 mt-auto relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f97316 0%, #ef4444 45%, #eab308 100%)" }}
    >
      {/* Soft radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 65%)" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── TOP GRID: Brand+Contact LEFT | Links RIGHT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">

          {/* Left Column - Brand & Contact */}
          <div className="space-y-5">

            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30 flex-shrink-0">
                <FaHeart className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                  Eliteinova <span className="text-white font-bold">Matrimony</span>
                </h3>
                <p className="text-white/90 text-sm font-bold">Where Trust Meets Tradition</p>
              </div>
            </div>

            <p className="text-white/85 leading-relaxed font-bold text-sm sm:text-base">
              Connecting hearts through verified, meaningful relationships.
              Join thousands of successful matches in your journey to find the perfect life partner.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/30">
                <FaShieldAlt className="text-white text-sm flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">100% Verified Profiles</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/30">
                <FaUsers className="text-white text-sm flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">500+ Success Stories</span>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-white/85 hover:text-white transition-colors">
                <FaPhoneAlt className="text-white flex-shrink-0 text-sm" />
                <span className="font-bold text-sm">+91 9940200736</span>
              </div>
              <div className="flex items-center space-x-3 text-white/85 hover:text-white transition-colors">
                <FaEnvelope className="text-white flex-shrink-0 text-sm" />
                <span className="font-bold text-sm break-all">info@eliteinovamatrimony.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white/85">
                <FaMapMarkerAlt className="text-white flex-shrink-0 text-sm" />
                <span className="font-bold text-sm">Eliteinova Tech Pvt Ltd</span>
              </div>
            </div>

          </div>

          {/* Right Column - Links + Follow Us + Stay Updated */}
          <div className="flex flex-col gap-6">

            {/* Links Grid - 3 cols */}
            <div className="grid grid-cols-3 xs:grid-cols-3 gap-4 sm:gap-8">

              {/* ── Eliteinova Matrimonial Services (was Quick Links) ── */}
              <div>
                <h4 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="font-bold">Matrimonial Services</span>
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {footerLinks.quick.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="flex items-center space-x-1.5 text-white/75 hover:text-white transition-all duration-300 hover:translate-x-1 group text-xs sm:text-sm font-bold"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                        <span className="font-bold">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Premium — Contact Us replaces Help & Support ── */}
              <div>
                <h4 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="font-bold">Premium</span>
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {footerLinks.premium.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="flex items-center space-x-1.5 text-white/75 hover:text-white transition-all duration-300 hover:translate-x-1 group text-xs sm:text-sm font-bold"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                        <span className="font-bold">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company — unchanged */}
              <div>
                <h4 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="font-bold">Company</span>
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="flex items-center space-x-1.5 text-white/75 hover:text-white transition-all duration-300 hover:translate-x-1 group text-xs sm:text-sm font-bold"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                        <span className="font-bold">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* ── Follow Us + Stay Updated BELOW LINKS ── */}
            <div className="border-t border-white/20 pt-5 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-5 sm:gap-8">

              {/* Follow Us */}
              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-sm whitespace-nowrap">Follow Us:</span>
                <div className="flex gap-2 sm:gap-3">
                  {[
                    { icon: FaFacebookF, label: "Facebook" },
                    { icon: FaTwitter, label: "Twitter" },
                    { icon: FaInstagram, label: "Instagram" },
                    { icon: FaLinkedinIn, label: "LinkedIn" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 hover:scale-110 border border-white/30"
                    >
                      <social.icon className="text-xs sm:text-sm" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Stay Updated */}
              <div className="flex flex-col gap-2 w-full sm:flex-1 sm:min-w-[260px]">
                <div>
                  <p className="text-white font-bold text-sm">Stay Updated</p>
                  <p className="text-white/75 text-xs font-bold">Get the latest matchmaking insights</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/30 transition-all flex-1 min-w-0 text-sm font-bold placeholder:font-bold"
                  />
                  <button className="px-3 sm:px-4 py-2 bg-white text-orange-600 rounded-lg font-bold hover:bg-yellow-50 transition-all duration-300 shadow-lg hover:scale-105 whitespace-nowrap text-sm">
                    Subscribe
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs sm:text-sm text-white/75">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2">
              <span className="font-bold text-center md:text-left">&copy; {new Date().getFullYear()} Eliteinova Matrimony. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/privacypolicy" className="hover:text-white transition-colors font-bold">Privacy Policy</Link>
                <Link to="/terms&conditions" className="hover:text-white transition-colors font-bold">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-white transition-colors font-bold">Cookie Policy</Link>
                <a
                  href="https://www.eliteinovatechpvtltd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-bold"
                >
                  Digital Partner by Eliteinova.Tech.Pvt.Ltd
                </a>
              </div>
              {/* Mobile only bottom links */}
              <div className="flex md:hidden flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
                <Link to="/privacypolicy" className="hover:text-white transition-colors font-bold text-xs">Privacy Policy</Link>
                <Link to="/terms&conditions" className="hover:text-white transition-colors font-bold text-xs">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-white transition-colors font-bold text-xs">Cookie Policy</Link>
                <a href="https://www.eliteinovatechpvtltd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-bold text-xs"
                >
                  Digital Partner by Eliteinova.Tech.Pvt.Ltd
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-white/75 whitespace-nowrap">
              <span>Made with</span>
              <FaHeart className="text-white animate-pulse" />
              <span>for meaningful connections</span>
            </div>
          </div>
        </div>

      </div>

      {/* Ambient glow effects */}
      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(234, 179, 8, 0.18)" }}
      ></div>
      <div
        className="absolute top-0 left-0 w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(255, 255, 255, 0.08)" }}
      ></div>
    </footer>
  );
}