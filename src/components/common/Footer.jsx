// src/components/common/Footer.jsx
import { Link } from "react-router-dom";
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

export default function Footer() {
  return (
    <footer
      className="w-full text-white pt-16 pb-8 mt-auto relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f97316 0%, #ef4444 45%, #eab308 100%)" }}
    >
      {/* Soft radial highlight for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 65%)" }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

          {/* Left Column - Brand & Contact */}
          <div className="space-y-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                  <FaHeart className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow">
                    Eliteinova <span className="text-white">Matrimony</span>
                  </h3>
                  <p className="text-white/90 text-sm font-medium">Where Trust Meets Tradition</p>
                </div>
              </div>
              <p className="text-white/85 max-w-md leading-relaxed">
                Connecting hearts through verified, meaningful relationships.
                Join thousands of successful matches in your journey to find the perfect life partner.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <FaShieldAlt className="text-white text-sm" />
                <span className="text-sm font-semibold text-white">100% Verified Profiles</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <FaUsers className="text-white text-sm" />
                <span className="text-sm font-semibold text-white">500+ Success Stories</span>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/85 hover:text-white transition-colors">
                <FaPhoneAlt className="text-white flex-shrink-0" />
                <span className="font-medium">+91 9940200736</span>
              </div>
              <div className="flex items-center space-x-3 text-white/85 hover:text-white transition-colors">
                <FaEnvelope className="text-white flex-shrink-0" />
                <span className="font-medium">info@eliteinovamatrimony.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white/85">
                <FaMapMarkerAlt className="text-white flex-shrink-0" />
                <span className="font-medium">Eliteinova Tech Pvt Ltd</span>
              </div>
            </div>
          </div>

          {/* Right Column - Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Quick Links</span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.quick.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-2 text-white/75 hover:text-white transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Services</span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-2 text-white/75 hover:text-white transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Company</span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-2 text-white/75 hover:text-white transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social & Newsletter Section */}
        <div className="border-t border-white/30 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-white font-semibold">Follow Us:</span>
              <div className="flex gap-4">
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
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 hover:scale-110 border border-white/30"
                  >
                    <social.icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-center sm:text-right">
                <p className="text-white font-semibold mb-1">Stay Updated</p>
                <p className="text-white/75 text-sm">Get the latest matchmaking insights</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/30 transition-all min-w-[200px]"
                />
                <button className="px-6 py-2 bg-white text-orange-600 rounded-lg font-bold hover:bg-yellow-50 transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/75">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span>&copy; {new Date().getFullYear()} Eliteinova Matrimony. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/privacypolicy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                <a
                  href="https://www.eliteinovatechpvtltd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Digital Partner
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-white/75">
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