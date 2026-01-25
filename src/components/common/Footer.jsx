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
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8 mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Brand & Contact */}
          <div className="space-y-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaHeart className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Eliteinova <span className="text-yellow-400">Matrimony</span>
                  </h3>
                  <p className="text-yellow-100 text-sm">Where Trust Meets Tradition</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Connecting hearts through verified, meaningful relationships. 
                Join thousands of successful matches in your journey to find the perfect life partner.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2 border border-yellow-500/20">
                <FaShieldAlt className="text-yellow-400 text-sm" />
                <span className="text-sm font-medium">100% Verified Profiles</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2 border border-red-500/20">
                <FaUsers className="text-red-400 text-sm" />
                <span className="text-sm font-medium">500+ Success Stories</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 transition-colors">
                <FaPhoneAlt className="text-red-400" />
                <span className="font-medium">+91 7845554882</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 transition-colors">
                <FaEnvelope className="text-red-400" />
                <span className="font-medium">info@eliteinovamatrimony.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FaMapMarkerAlt className="text-red-400" />
                <span className="font-medium">Eliteinova Tech Pvt Ltd</span>
              </div>
            </div>
          </div>

          {/* Right Column - Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Quick Links</span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.quick.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Services</span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Company</span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social & Newsletter Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-white font-semibold">Follow Us:</span>
              <div className="flex gap-4">
                {[
                  { icon: FaFacebookF, color: "hover:text-blue-400", label: "Facebook" },
                  { icon: FaTwitter, color: "hover:text-blue-300", label: "Twitter" },
                  { icon: FaInstagram, color: "hover:text-pink-400", label: "Instagram" },
                  { icon: FaLinkedinIn, color: "hover:text-blue-500", label: "LinkedIn" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/10 hover:scale-110 border border-gray-700 hover:border-gray-500`}
                  >
                    <social.icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-center sm:text-right">
                <p className="text-white font-semibold mb-1">Stay Updated</p>
                <p className="text-gray-400 text-sm">Get the latest matchmaking insights</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors min-w-[200px]"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>&copy; {new Date().getFullYear()} Eliteinova Matrimony. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/privacypolicy" className="hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-yellow-400 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-yellow-400 transition-colors">
                  Cookie Policy
                </Link>
                <a 
                  href="https://www.eliteinovatechpvtltd.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Digital Partner
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Made with</span>
              <FaHeart className="text-red-400 animate-pulse" />
              <span>for meaningful connections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div className="absolute top-10 left-10 w-16 h-16 bg-red-400/10 rounded-full blur-xl"></div>
    </footer>
  );
}