import React from 'react';
import silverBanner from '../../assets/membershipBanner/silver.png';
import goldBanner from '../../assets/membershipBanner/gold.png';
import diamondBanner from '../../assets/membershipBanner/diamond.png';

const MembershipBanner = ({ membershipType, className = '' }) => {
  // Normalize membership type to uppercase
  const normalizedType = membershipType?.toUpperCase() || 'SILVER';
  
  // Get banner image based on membership type
  const getBannerImage = () => {
    switch (normalizedType) {
      case 'GOLD':
        return goldBanner;
      case 'DIAMOND':
        return diamondBanner;
      case 'SILVER':
      default:
        return silverBanner;
    }
  };

  const bannerImage = getBannerImage();

  return (
    <div 
      className={`relative w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg ${className}`}
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      
      {/* Membership Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold uppercase shadow-lg">
          {normalizedType} Member
        </span>
      </div>
      
      {/* Content overlay (optional - can be customized) */}
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-xl md:text-2xl font-bold mb-1">
          {normalizedType} Membership
        </h3>
        <p className="text-sm md:text-base text-white/90">
          {normalizedType === 'DIAMOND' && 'Premium Experience • Exclusive Features'}
          {normalizedType === 'GOLD' && 'Enhanced Features • Priority Matching'}
          {normalizedType === 'SILVER' && 'Essential Features • Get Started'}
        </p>
      </div>
    </div>
  );
};

export default MembershipBanner;

