// Theme Decorations Component - Adds creative elements based on membership type
import React from 'react';

// Sparkle SVG Component
const Sparkle = ({ x, y, size, delay, color }) => (
  <g
    transform={`translate(${x}, ${y})`}
    style={{
      animation: `sparkle 2s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.7
    }}
  >
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill={color}
      transform={`scale(${size})`}
      transformOrigin="12 10"
    />
  </g>
);

// Coin SVG Component (Gold)
const GoldCoin = ({ x, y, size, delay }) => (
  <g
    transform={`translate(${x}, ${y})`}
    style={{
      animation: `float 4s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.5
    }}
  >
    <circle
      cx="0"
      cy="0"
      r={size * 10}
      fill="#FCD34D"
      stroke="#F59E0B"
      strokeWidth="2"
      filter="url(#glow)"
    />
    <text
      x="0"
      y="0"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={size * 12}
      fill="#B45309"
      fontWeight="bold"
      fontFamily="Arial"
    >
      ₹
    </text>
  </g>
);

// Diamond SVG Component
const Diamond = ({ x, y, size, delay, color }) => (
  <g
    transform={`translate(${x}, ${y})`}
    style={{
      animation: `rotate 6s linear infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.6
    }}
  >
    <path
      d="M12 2L22 12L12 22L2 12Z"
      fill={color}
      stroke="#C084FC"
      strokeWidth="1.5"
      transform={`scale(${size})`}
      transformOrigin="12 12"
      filter="url(#glow)"
    />
    <path
      d="M12 6L18 12L12 18L6 12Z"
      fill="none"
      stroke="#A855F7"
      strokeWidth="1"
      transform={`scale(${size * 0.7})`}
      transformOrigin="12 12"
    />
  </g>
);

// Silver Coin Component
const SilverCoin = ({ x, y, size, delay }) => (
  <g
    transform={`translate(${x}, ${y})`}
    style={{
      animation: `float 5s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.4
    }}
  >
    <circle
      cx="0"
      cy="0"
      r={size * 10}
      fill="#9CA3AF"
      stroke="#6B7280"
      strokeWidth="2"
    />
    <text
      x="0"
      y="0"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={size * 10}
      fill="#4B5563"
      fontWeight="bold"
      fontFamily="Arial"
    >
      ₹
    </text>
  </g>
);

export default function ThemeDecorations({ membershipType, colors }) {
  const decorations = [];

  if (membershipType === 'SILVER') {
    // Silver theme: Sparkles and silver coins
    for (let i = 0; i < 20; i++) {
      decorations.push(
        <Sparkle
          key={`sparkle-${i}`}
          x={10 + Math.random() * 80}
          y={10 + Math.random() * 80}
          size={0.4 + Math.random() * 0.5}
          delay={Math.random() * 2}
          color={colors.blob1 || '#9CA3AF'}
        />
      );
    }
    for (let i = 0; i < 10; i++) {
      decorations.push(
        <SilverCoin
          key={`coin-${i}`}
          x={15 + Math.random() * 70}
          y={15 + Math.random() * 70}
          size={0.5 + Math.random() * 0.4}
          delay={Math.random() * 5}
        />
      );
    }
  } else if (membershipType === 'GOLD') {
    // Gold theme: Gold coins and sparkles
    for (let i = 0; i < 25; i++) {
      decorations.push(
        <Sparkle
          key={`sparkle-${i}`}
          x={10 + Math.random() * 80}
          y={10 + Math.random() * 80}
          size={0.5 + Math.random() * 0.6}
          delay={Math.random() * 2}
          color={colors.blob1 || '#FBBF24'}
        />
      );
    }
    for (let i = 0; i < 15; i++) {
      decorations.push(
        <GoldCoin
          key={`coin-${i}`}
          x={15 + Math.random() * 70}
          y={15 + Math.random() * 70}
          size={0.6 + Math.random() * 0.5}
          delay={Math.random() * 4}
        />
      );
    }
  } else if (membershipType === 'DIAMOND') {
    // Diamond theme: Diamonds and premium sparkles
    for (let i = 0; i < 30; i++) {
      decorations.push(
        <Sparkle
          key={`sparkle-${i}`}
          x={10 + Math.random() * 80}
          y={10 + Math.random() * 80}
          size={0.6 + Math.random() * 0.7}
          delay={Math.random() * 2}
          color={colors.blob1 || '#A78BFA'}
        />
      );
    }
    for (let i = 0; i < 18; i++) {
      decorations.push(
        <Diamond
          key={`diamond-${i}`}
          x={15 + Math.random() * 70}
          y={15 + Math.random() * 70}
          size={0.4 + Math.random() * 0.6}
          delay={Math.random() * 6}
          color={colors.blob2 || '#8B5CF6'}
        />
      );
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>{`
          @keyframes sparkle {
            0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
            50% { transform: translateY(-15px) rotate(180deg); opacity: 0.7; }
          }
          @keyframes rotate {
            0% { transform: rotate(0deg); opacity: 0.5; }
            50% { opacity: 0.8; }
            100% { transform: rotate(360deg); opacity: 0.5; }
          }
        `}</style>
      </defs>
      {decorations}
    </svg>
  );
}

