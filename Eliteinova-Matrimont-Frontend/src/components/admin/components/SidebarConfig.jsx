import {
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  FlagIcon,
  HeartIcon,
  StarIcon,
  TrophyIcon,
  CreditCardIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  PhotoIcon,
  GlobeAltIcon,
  ChartPieIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

export const menuItems = [
  {
    category: "MAIN",
    items: [
      { id: "overview", label: "Dashboard Overview", icon: <HomeIcon className="w-5 h-5" /> }
    ]
  },
  {
    category: "USER MANAGEMENT",
    items: [
      { id: "users", label: "All Users", icon: <UserGroupIcon className="w-5 h-5" /> },
      { id: "verification", label: "Profile Verification", icon: <ShieldCheckIcon className="w-5 h-5" /> },
      { id: "reports", label: "User Reports", icon: <FlagIcon className="w-5 h-5" /> }
    ]
  },
  {
    category: "MATCHMAKING",
    items: [
      { id: "matches", label: "Match Analytics", icon: <HeartIcon className="w-5 h-5" /> },
      { id: "compatibility", label: "Compatibility", icon: <StarIcon className="w-5 h-5" /> },
      { id: "success", label: "Success Stories", icon: <TrophyIcon className="w-5 h-5" /> }
    ]
  },
  {
    category: "FINANCIAL",
    items: [
      { id: "memberships", label: "Membership Plans", icon: <CreditCardIcon className="w-5 h-5" /> },
      { id: "payments", label: "Payments", icon: <CurrencyRupeeIcon className="w-5 h-5" /> },
      { id: "revenue", label: "Revenue Analytics", icon: <ChartBarIcon className="w-5 h-5" /> }
    ]
  },
  {
    category: "CONTENT",
    items: [
      { id: "moderation", label: "Content Moderation", icon: <ShieldExclamationIcon className="w-5 h-5" /> },
      { id: "profiles", label: "Profile Management", icon: <UserCircleIcon className="w-5 h-5" /> },
      { id: "photos", label: "Photo Approval", icon: <PhotoIcon className="w-5 h-5" /> }
    ]
  },
  {
    category: "ANALYTICS",
    items: [
      { id: "geography", label: "Geographic Data", icon: <GlobeAltIcon className="w-5 h-5" /> },
      { id: "behavior", label: "User Behavior", icon: <ChartPieIcon className="w-5 h-5" /> },
      { id: "engagement", label: "Engagement Metrics", icon: <FireIcon className="w-5 h-5" /> }
    ]
  }
];