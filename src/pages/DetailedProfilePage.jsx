import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import profileService from "../services/profileService";
import {
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  Download,
  FileText,
  User,
  Home,
  BookOpen,
  Cross,
  FileUp,
  Image as ImageIcon,
} from "lucide-react";

// Membership theme config
const membershipThemes = {
  SILVER: {
    headerBg: "bg-white",
    headerBorder: "border-b border-red-200",
    backBtn: "text-red-600 hover:text-red-800",
    shareBtn: "border border-red-300 text-red-600 hover:bg-red-50",
    interestBtn: "bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white",
    cardBorder: "border border-red-200",
    cardShadow: "shadow-lg hover:shadow-red-200",
    sectionTitle: "text-red-700",
    iconColor: "text-red-500",
    contactBtn: "bg-gradient-to-r from-red-700 to-red-500 text-white hover:from-red-800 hover:to-red-600",
    msgBtn: "border border-red-600 text-red-600 hover:bg-red-50",
    thumbnailActive: "border-red-500",
    badge: "bg-red-100 text-red-700",
    pageBg: "bg-gradient-to-br from-red-50 to-white",
    downloadBtn: "bg-red-600 text-white hover:bg-red-700",
    infoLabel: "text-red-400",
  },
  GOLD: {
    headerBg: "bg-amber-50",
    headerBorder: "border-b border-amber-300",
    backBtn: "text-amber-700 hover:text-amber-900",
    shareBtn: "border border-amber-400 text-amber-700 hover:bg-amber-50",
    interestBtn: "bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-500 hover:from-yellow-700 hover:to-amber-500 text-white font-bold",
    cardBorder: "border border-amber-300",
    cardShadow: "shadow-lg hover:shadow-amber-200",
    sectionTitle: "text-amber-800",
    iconColor: "text-amber-500",
    contactBtn: "bg-gradient-to-r from-yellow-600 to-amber-400 text-white hover:from-yellow-700 hover:to-amber-500 font-bold",
    msgBtn: "border border-amber-500 text-amber-700 hover:bg-amber-50",
    thumbnailActive: "border-amber-500",
    badge: "bg-amber-100 text-amber-800",
    pageBg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-white",
    downloadBtn: "bg-amber-500 text-white hover:bg-amber-600",
    infoLabel: "text-amber-500",
  },
  DIAMOND: {
    headerBg: "bg-pink-50",
    headerBorder: "border-b border-pink-300",
    backBtn: "text-pink-600 hover:text-pink-800",
    shareBtn: "border border-pink-400 text-pink-600 hover:bg-pink-50",
    interestBtn: "bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold",
    cardBorder: "border border-pink-200",
    cardShadow: "shadow-lg hover:shadow-pink-200",
    sectionTitle: "text-pink-700",
    iconColor: "text-pink-400",
    contactBtn: "bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:from-pink-500 hover:to-rose-500 font-bold",
    msgBtn: "border border-pink-400 text-pink-600 hover:bg-pink-50",
    thumbnailActive: "border-pink-400",
    badge: "bg-pink-100 text-pink-700",
    pageBg: "bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50",
    downloadBtn: "bg-pink-500 text-white hover:bg-pink-600",
    infoLabel: "text-pink-400",
  },
};

// Helper component for info rows
const InfoRow = React.memo(({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="text-gray-600 text-sm">{label}:</span>
    <span className="font-medium text-gray-800 text-right text-sm ml-4">
      {value || "Not specified"}
    </span>
  </div>
));

const WARNING_TEXTS = {
  en: {
    title: "Eliteinova Matrimony",
    body: `Eliteinova Matrimony is an online platform designed to help you find your ideal life partner. Through our service, you can search and connect with potential brides and grooms based on your preferences such as age, community, location, education, and profession.

We strongly advise every member to conduct proper background verification before proceeding with any personal decision. This includes checking family background, education, employment details, character references, and any other information necessary for your confidence and safety.

Please note:
Eliteinova Matrimony acts only as a connecting platform. We do not verify or guarantee the authenticity of the information shared by users. We do not take personal responsibility for any interactions, decisions, or outcomes that occur after the registration or communication process.

Your safety, privacy, and thoughtful decision-making are important — please proceed carefully and responsibly.`,
    checkbox: "I have read and accept the above terms",
    confirm: "Confirm and Send Request",
    cancel: "Cancel",
  },

  hi: { // Hindi
    title: "एलीटीनोवा मैट्रिमोनी",
    body: `एलीटीनोवा मैट्रिमोनी एक ऑनलाइन प्लेटफ़ॉर्म है, जिसे आपकी पसंद और अपेक्षाओं के अनुसार जीवनसाथी खोजने में मदद करने के लिए बनाया गया है। हमारी सेवा के माध्यम से आप उम्र, समुदाय, स्थान, शिक्षा और पेशे जैसे मानदंडों के आधार पर दूल्हा या दुल्हन खोजकर उनसे संपर्क कर सकते हैं।

हम हर सदस्य को सलाह देते हैं कि किसी भी व्यक्तिगत निर्णय से पहले उचित पृष्ठभूमि जांच अवश्य करें। इसमें परिवार की जानकारी, शिक्षा, नौकरी का विवरण, चरित्र सत्यापन और आपकी सुरक्षा तथा विश्वास के लिए आवश्यक अन्य जानकारी की जांच शामिल है।

कृपया ध्यान दें:
एलीटीनोवा मैट्रिमोनी केवल एक कनेक्टिंग प्लेटफ़ॉर्म के रूप में कार्य करता है। उपयोगकर्ताओं द्वारा साझा की गई जानकारी की सत्यता की हम पुष्टि नहीं करते और न ही इसकी कोई गारंटी देते हैं। पंजीकरण, बातचीत या उसके बाद होने वाले किसी भी निर्णय, संपर्क या परिणाम के लिए हम व्यक्तिगत रूप से जिम्मेदार नहीं हैं।

आपकी सुरक्षा, गोपनीयता और सोच-समझकर लिए गए निर्णय बहुत महत्वपूर्ण हैं — कृपया सावधानी और जिम्मेदारी के साथ आगे बढ़ें।`,
    checkbox: "मैंने उपरोक्त शर्तों को पढ़ लिया है और स्वीकार करता/करती हूँ",
    confirm: "पुष्टि करें और अनुरोध भेजें",
    cancel: "रद्द करें",
  },

  ta: { // Tamil
    title: "எலிட்டிநோவா மேட்ரிமோனி",
    body: `எலிட்டிநோவா மேட்ரிமோனி என்பது உங்களுக்கான சரியான வாழ்க்கைத் துணையைத் தேடுவதற்கு வடிவமைக்கப்பட்ட ஆன்லைன் மணமுறையிடும் தளம் ஆகும். எங்கள் சேவையின் மூலம் வயது, சமூகம், இருப்பிடம், கல்வி, தொழில் போன்ற விருப்பங்களை அடிப்படையாகக் கொண்டு மணமுறைக்கு வருபவர் அல்லது மணமகளைத் தேடி தொடர்பு கொள்ளலாம்.

ஒவ்வொரு உறுப்பினரும் திருமணத் தீர்மானம் எடுப்பதற்கு முன் பின்னணி சரிபார்ப்பு மேற்கொள்ளும்படி எங்கள் வலியுறுத்தல். இதில் குடும்ப பின்னணி, கல்வி, வேலைநிலைத்தன்மை, குணநலம், மற்றும் தேவையான பிற விவரங்களைச் சரிபார்த்து உறுதிபடுத்துவது குறிபிடப்படுகிறது.

கவனிக்கவும்:
எலிட்டிநோவா மேட்ரிமோனி ஒரு இணைக்கும் தளமாக மட்டுமே செயல்படுகிறது. பயனர்கள் வழங்கும் தகவல்களின் உண்மைத்தன்மையை எங்கள் நிறுவனம் சரிபார்க்கவில்லை மற்றும் உறுதிப்படுத்துவதில்லை. பதிவு செய்தல், தொடர்பு கொள்ளுதல் அல்லது பின்னர் எடுக்கப்படும் எந்தவொரு தனிப்பட்ட முடிவுக்கும் எங்கள் நிறுவனம் பொறுப்பாகாது.

உங்கள் பாதுகாப்பு, தனியுரிமை மற்றும் சிந்தித்து எடுக்கும் முடிவுகள் மிக முக்கியமானவை — தயவுசெய்து கவனத்துடன் மற்றும் பொறுப்புடன் செயல்படுங்கள்.`,
    checkbox: "மேலே உள்ள நிபந்தனைகளை நான் படித்து ஏற்றுக்கொள்கிறேன்",
    confirm: "உறுதிசெய் மற்றும் கோரிக்கையை அனுப்பு",
    cancel: "ரத்து",
  },

  te: { // Telugu
    title: "ఎలైట్ ఇనోవా మ్యాట్రిమోని",
    body: `ఎలైట్ ఇనోవా మ్యాట్రిమోని మీకు సరైన జీవిత భాగస్వామిని కనుగొనడంలో సహాయం చేయడానికి రూపొందించిన ఆన్‌లైన్ మ్యాట్రిమోని ప్లాట్‌ఫార్మ్. మా సేవ ద్వారా వయస్సు, కులం, ప్రాంతం, విద్య, ఉద్యోగం వంటి మీకు కావలసిన ప్రమాణాల ఆధారంగా వరుడు లేదా వధువును వెతికి వారితో సంప్రదించవచ్చు.

ప్రతి సభ్యుడు ఏదైనా వ్యక్తిగత నిర్ణయం తీసుకునే ముందు సరైన బ్యాక్‌గ్రౌండ్ వేరిఫికేషన్ చేయాలని మేము బలంగా సూచిస్తున్నాము. ఇందులో కుటుంబ నేపథ్యం, విద్య, ఉద్యోగ వివరాలు, ప్రవర్తన, మరియు మీ నమ్మకానికి అవసరమైన ఇతర ముఖ్యమైన వివరాలను తనిఖీ చేయడం అవసరం.

దయచేసి గమనించండి:
ఎలైట్ ఇనోవా మ్యాట్రిమోని కేవలం పరిచయం కల్పించే ప్లాట్‌ఫార్మ్ మాత్రమే. వినియోగదారులు అందించే సమాచారం యొక్క నిజానిజాలపై మేము ధృవీకరించము లేదా హామీ ఇవ్వము. రిజిస్ట్రేషన్, కమ్యూనికేషన్ లేదా తదుపరి జరిగే వ్యక్తిగత నిర్ణయాలకు మేము ఎలాంటి వ్యక్తిగత బాధ్యత వహించము.

మీ భద్రత, గోప్యత మరియు ఆలోచించి తీసుకునే నిర్ణయాలు చాలా ముఖ్యం — దయచేసి జాగ్రత్తగా, బాధ్యతాయుతంగా ముందుకు సాగండి.`,
    checkbox: "పైన పేర్కొన్న షరతులను చదివి నేను అంగీకరించాను",
    confirm: "దృఢీకరించండి మరియు అభ్యర్థన పంపండి",
    cancel: "రద్దు",
  },

  kn: { // Kannada
    title: "ಎಲೈಟ್ ಇನೋವಾ ಮ್ಯಾಟ್ರಿಮೋನಿ",
    body: `ಎಲೈಟ್ ಇನೋವಾ ಮ್ಯಾಟ್ರಿಮೋನಿ ನಿಮ್ಮ идеал ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಆನ್‌ಲೈನ್ ಮ್ಯಾಟ್ರಿಮೋನಿ ವೇದಿಕೆ ಆಗಿದೆ. ನಮ್ಮ ಸೇವೆಯ ಮೂಲಕ, ವಯಸ್ಸು, ಜಾತಿ, ಸ್ಥಳ, ಶಿಕ್ಷಣ ಮತ್ತು ವೃತ್ತಿ ಮುಂತಾದ ನಿಮ್ಮ ಆಯ್ಕೆಯ ಆಧಾರದ ಮೇಲೆ ವರ ಅಥವಾ ವಧುವನ್ನು ಹುಡುಕಿ ಸಂಪರ್ಕಿಸಬಹುದು.

ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಪ್ರತಿಯೊಬ್ಬ ಸದಸ್ಯರೂ ಸರಿಯಾದ ಹಿನ್ನೆಲೆ ಪರಿಶೀಲನೆಯನ್ನು ಮಾಡಬೇಕೆಂದು ನಾವು ಬಲವಾಗಿ ಸಲಹೆ ನೀಡುತ್ತೇವೆ. ಇದರಲ್ಲಿ ಕುಟುಂಬ ಹಿನ್ನೆಲೆ, ಶಿಕ್ಷಣ, ಉದ್ಯೋಗದ ವಿವರಗಳು, ವ್ಯಕ್ತಿತ್ವದ ಮಾಹಿತಿ ಮತ್ತು ನಿಮ್ಮ ಸುರಕ್ಷತೆ ಹಾಗೂ ವಿಶ್ವಾಸಕ್ಕಾಗಿ ಅಗತ್ಯವಾದ ಇತರ ಮಾಹಿತಿಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು ಒಳಗೊಂಡಿದೆ.

ದಯವಿಟ್ಟು ಗಮನಿಸಿ:
ಎಲೈಟ್ ಇನೋವಾ ಮ್ಯಾಟ್ರಿಮೋನಿ ಕೇವಲ ಪರಿಚಯ ವೇದಿಕೆಯಾಗಿ ಮಾತ್ರ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ಬಳಕೆದಾರರು ನೀಡುವ ಮಾಹಿತಿಯ ನಿಜಾಸಕ್ತಿಯನ್ನು ನಾವು ಪರಿಶೀಲಿಸುವುದಿಲ್ಲ ಅಥವಾ ಖಾತರಿ ನೀಡುವುದಿಲ್ಲ. ನೋಂದಣಿ, ಸಂವಹನ ಅಥವಾ ಅದರ ನಂತರ ತೆಗೆದುಕೊಳ್ಳುವ ಯಾವುದೇ ವೈಯಕ್ತಿಕ ನಿರ್ಧಾರಗಳಿಗೆ ನಾವು ಯಾವುದೇ ರೀತಿಯ ಹೊಣೆಗಾರಿಕೆಯನ್ನು ವಹಿಸುವುದಿಲ್ಲ.

ನಿಮ್ಮ ಸುರಕ್ಷತೆ, ಗೌಪ್ಯತೆ ಮತ್ತು ಯೋಚಿಸಿ ತೆಗೆದುಕೊಳ್ಳುವ ನಿರ್ಧಾರಗಳು ಅತ್ಯಂತ ಮುಖ್ಯ — ದಯವಿಟ್ಟು ಜವಾಬ್ದಾರಿಯಿಂದ ಮತ್ತು ಎಚ್ಚರಿಕೆಯಿಂದ ಮುಂದುವರಿಯಿರಿ.`,
    checkbox: " ನಾನು ಮೇಲಿನ ನಿಯಮಗಳನ್ನು ಓದಿ ಒಪ್ಪಿಕೊಂಡಿದ್ದೇನೆ",
    confirm: "ನಿರ್ಧರಿಸಿ ಮತ್ತು ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
  },

  ml: { // Malayalam
    title: "എലിറ്റ് ഇൻഒവ മാട്രിമോണി",
    body: `എലിറ്റ് ഇൻഒവ മാട്രിമോണി നിങ്ങൾക്ക് അനുയോജ്യമായ ജീവിത പങ്കാളിയെ കണ്ടെത്തുന്നതിന് സഹായിക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്ത ഒരു ഓൺലൈൻ മാട്രിമോണി പ്ലാറ്റ്ഫോമാണ്. ഞങ്ങളുടെ സേവനത്തിലൂടെ പ്രായം, സമുദായം, സ്ഥലം, വിദ്യാഭ്യാസം, തൊഴിൽ തുടങ്ങിയ നിങ്ങളുടെ മുൻഗണനകളുടെ അടിസ്ഥാനത്തിൽ വധുവിനെയോ വരനെയോ തിരഞ്ഞ് ബന്ധപ്പെടാം.

വ്യക്തിഗതമായ ഒരു തീരുമാനത്തിലേക്ക് പോകുന്നതിന് മുമ്പായി ഓരോ അംഗവും ശരിയായ പശ്ചാത്തല പരിശോധന നടത്തണമെന്ന് ഞങ്ങൾ ശക്തമായി ശുപാർശ ചെയ്യുന്നു. ഇതിൽ കുടുംബ പശ്ചാത്തലവും, വിദ്യാഭ്യാസവും, തൊഴിൽ വിവരങ്ങളും, സ്വഭാവപരിശോധനയും, നിങ്ങളുടെ സുരക്ഷയ്ക്കും ആത്മവിശ്വാസത്തിനും ആവശ്യമായ മറ്റ് വിവരങ്ങളും പരിശോധിക്കുന്നതും ഉൾപ്പെടുന്നു.

ദയവായി ശ്രദ്ധിക്കുക:
എലിറ്റ് ഇൻഒവ മാട്രിമോണി ഒരു പരിചയപ്പെടുത്തൽ പ്ലാറ്റ്ഫോം മാത്രമാണ്. ഉപയോക്താക്കൾ നൽകുന്ന വിവരങ്ങളുടെ യാഥാർത്ഥ്യം ഞങ്ങൾ സ്ഥിരീകരിക്കുകയോ ഉറപ്പു നൽകുകയോ ചെയ്യുന്നില്ല. രജിസ്ട്രേഷൻ, ആശയവിനിമയം അല്ലെങ്കിൽ തുടർന്ന് ഉണ്ടാകുന്ന വ്യക്തിഗത തീരുമാനം എന്നിവയ്ക്ക് ഞങ്ങൾ വ്യക്തിപരമായ ഉത്തരവാദിത്തം ഏറ്റെടുക്കുന്നില്ല.

നിങ്ങളുടെ സുരക്ഷ, സ്വകാര്യത, ആലോചിച്ചെടുത്ത തീരുമാനങ്ങൾ എന്നിവ വളരെ പ്രധാനമാണ് — ദയവായി ഉത്തരവാദിത്തത്തോടെയും ശ്രദ്ധയോടെയും തുടരുക.`,
    checkbox: "മുകളിലുള്ള നിബന്ധനകൾ ഞാൻ വായിച്ചു അംഗീകരിക്കുന്നു",
    confirm: "സ്ഥിരീകരിച്ച് അഭ്യർത്ഥന അയക്കൂ",
    cancel: "റദ്ദ് ചെയ്യുക",
  },

  bn: { // Bengali
    title: "এলিটিনোভা ম্যাট্রিমনি",
    body: `এলিটিনোভা ম্যাট্রিমনি একটি অনলাইন প্ল্যাটফর্ম, যা আপনাকে আপনার উপযুক্ত জীবনসঙ্গী খুঁজে পেতে সহায়তা করার জন্য তৈরি করা হয়েছে। আমাদের পরিষেবার মাধ্যমে আপনি বয়স, সম্প্রদায়, অবস্থান, শিক্ষা এবং পেশা ইত্যাদি পছন্দের ভিত্তিতে সম্ভাব্য বর বা কনেকে খুঁজে তাদের সাথে যোগাযোগ করতে পারেন।

আমরা প্রতিটি সদস্যকে পরামর্শ দিই যে কোনো ব্যক্তিগত সিদ্ধান্ত নেওয়ার আগে সঠিক ব্যাকগ্রাউন্ড যাচাই করা উচিত। এর মধ্যে পারিবারিক তথ্য, শিক্ষা, চাকরির বিবরণ, চরিত্র যাচাই এবং আপনার নিরাপত্তা ও আত্মবিশ্বাসের জন্য প্রয়োজনীয় অন্যান্য তথ্য যাচাই অন্তর্ভুক্ত।

দয়া করে লক্ষ্য করুন:
এলিটিনোভা ম্যাট্রিমনি শুধুমাত্র একটি যোগাযোগ স্থাপনকারী প্ল্যাটফর্ম হিসেবে কাজ করে। ব্যবহারকারীরা যে তথ্য প্রদান করেন, তার সত্যতা আমরা যাচাই বা নিশ্চিত করি না। রেজিস্ট্রেশন, কথোপকথন বা তার পরবর্তী কোনো সিদ্ধান্ত, যোগাযোগ বা ফলাফলের জন্য আমরা ব্যক্তিগতভাবে দায়িত্ব নেব না।

আপনার নিরাপত্তা, ব্যক্তিগত গোপনীয়তা এবং চিন্তাশীল সিদ্ধান্ত নেওয়া অত্যন্ত গুরুত্বপূর্ণ — অনুগ্রহ করে সতর্কতার সাথে এবং দায়িত্বশীলভাবে এগিয়ে চলুন।`,
    checkbox: "উপরের শর্তাবলী আমি পড়েছি এবং মেনে নিচ্ছি",
    confirm: "নিশ্চিত করুন এবং অনুরোধ পাঠান",
    cancel: "বাতিল",
  },

  mr: { // Marathi
    title: "एलिटीनोव्हा मॅट्रिमोनी",
    body: `एलिटीनोव्हा मॅट्रिमोनी हे एक ऑनलाइन व्यासपीठ आहे, जे तुम्हाला तुमचा योग्य जीवनसाथी शोधण्यात मदत करण्यासाठी डिझाइन करण्यात आले आहे. आमच्या सेवेद्वारे तुम्ही वय, समुदाय, स्थान, शिक्षण आणि व्यवसाय यांसारख्या तुमच्या पसंतीनुसार संभाव्य वधू किंवा वर शोधू शकता आणि त्यांच्याशी संपर्क साधू शकता.

आम्ही प्रत्येक सदस्यास सूचित करतो की कोणताही वैयक्तिक निर्णय घेण्यापूर्वी योग्य पार्श्वभूमी पडताळणी करावी. यात कुटुंबाची माहिती, शिक्षण, नोकरीचे तपशील, चारित्र्य पडताळणी आणि तुमच्या सुरक्षितता व विश्वासासाठी आवश्यक असलेली इतर माहिती तपासणे यांचा समावेश होतो.

कृपया लक्षात घ्या:
एलिटीनोव्हा मॅट्रिमोनी फक्त एक संपर्क साधणारे व्यासपीठ आहे. वापरकर्त्यांनी दिलेल्या माहितीची सत्यता आम्ही तपासत नाही किंवा त्याची हमी देत नाही. नोंदणी, संवाद किंवा त्यानंतर होणाऱ्या कोणत्याही निर्णयासाठी, संपर्कासाठी किंवा परिणामांसाठी आम्ही वैयक्तिकरित्या जबाबदार राहणार नाही.

तुमची सुरक्षितता, गोपनीयता आणि विचारपूर्वक घेतलेले निर्णय अत्यंत महत्त्वाचे आहेत — कृपया जबाबदारीने आणि काळजीपूर्वक पुढे जा.`,
    checkbox: "मी वरील अटी वाचल्या आहेत आणि स्वीकारतो/स्वीकारते",
    confirm: "पुष्टी करा आणि विनंती पाठवा",
    cancel: "रद्द करा",
  },
};


export default function DetailedProfilePage() {
  const { profileType, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedMembershipType = location.state?.membershipType || null;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [interestLoading, setInterestLoading] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const [showWarningModal, setShowWarningModal] = useState(false);
const [acceptedWarning, setAcceptedWarning] = useState(false);
const [selectedLanguage, setSelectedLanguage] = useState("en");
const [contactRevealed, setContactRevealed] = useState(null); 
const [contactRequestId, setContactRequestId] = useState(null); 
const [contactLoading, setContactLoading] = useState(false);
const [contactRequestStatus, setContactRequestStatus] = useState(null);


  useEffect(() => {
    fetchProfile();
  }, [id, profileType]);

  

  // fetch the contact info / request status for this profile (frontend helper)
const fetchContact = useCallback(async () => {
  if (!profile?.id) return;

  try {
    // will call profileService.fetchContact(profile.id)
    const resp = await profileService.fetchContact(profile.id);
    // Expect resp e.g. { success: true, status: "ACCEPTED"|"PENDING"|"REJECTED", contact: { mobile: "...", name: "..." } }
    if (resp && resp.success) {
      if (resp.status === "ACCEPTED" && resp.contact) {
        setContactRevealed(resp.contact);
      } else {
        setContactRevealed(null);
      }
      setContactRequestStatus(resp.status || null);
      if (resp.requestId) setContactRequestId(resp.requestId);
    } else {
      // not found or no request yet
      setContactRequestStatus(resp?.status || null);
    }
  } catch (err) {
    console.error("fetchContact error:", err);
  }
}, [profile?.id]);


  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Fetching profile with ID:", id);

      const response = await profileService.getProfileById(id);
      console.log("✅ Raw backend profile response:", response);

      if (response && response.success) {
        // ✅ FIX: Access the profile data from response.profile
        const profileData = response.profile;
        console.log("✅ Profile data from backend:", profileData);

        if (profileData) {
          const mappedProfile = mapBackendProfileToFrontend(profileData);
          console.log("✅ Mapped frontend profile:", mappedProfile);
          setProfile(mappedProfile);
        } else {
          setError("Profile data is empty");
        }
      } else {
        setError(response?.error || "Profile not found");
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError(err.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD THIS: Debug function to see EXACTLY what's in the database
const debugProfilePhotos = () => {
  if (!profile) return;
  
  console.log("🔍 DEBUG - Profile photos analysis:");
  console.log("Profile ID:", profile.id);
  console.log("Profile name:", profile.name);
  console.log("Raw photos array from backend:", profile.photos);
  
  if (Array.isArray(profile.photos)) {
    profile.photos.forEach((photo, index) => {
      console.log(`Photo ${index}:`, {
        rawValue: photo,
        type: typeof photo,
        formattedUrl: formatImageUrl(photo)
      });
    });
  }
};


// Call this in your useEffect or after profile loads
useEffect(() => {
  if (profile) {
    debugProfilePhotos();
  }
}, [profile]);

  // ✅ FIXED: Map backend profile data (not the wrapper response)
  const mapBackendProfileToFrontend = (backendProfile) => {
    if (!backendProfile) {
      console.warn(
        "❌ mapBackendProfileToFrontend: backendProfile is null/undefined"
      );
      return null;
    }

    console.log("🔍 Mapping backend profile data:", backendProfile);
    console.log("🔍 Backend profile keys:", Object.keys(backendProfile));

    const mappedProfile = {
      // ✅ Basic Info - Direct mapping
      id: backendProfile.id,
      name: backendProfile.name,
      gender: backendProfile.gender,
      age: backendProfile.age,

      // ✅ Physical Attributes
      height: backendProfile.height,
      maritalStatus: backendProfile.maritalStatus,

      // ✅ Professional Info - Direct mapping
      education: backendProfile.education,
      profession: backendProfile.profession,
      employedIn: backendProfile.employedIn,
      annualIncome: backendProfile.annualIncome,
      occupation: backendProfile.occupation,

      // ✅ Location Info - Direct mapping
      city: backendProfile.city,
      district: backendProfile.district,
      state: backendProfile.state,
      country: backendProfile.country,

      // ✅ Religious Info - Direct mapping
      religion: backendProfile.religion,
      caste: backendProfile.caste,
      subCaste: backendProfile.subCaste,
      dosham: backendProfile.dosham,
      willingOtherCaste: backendProfile.willingOtherCaste,
      motherTongue: backendProfile.motherTongue,

      // ✅ Family Info - Direct mapping
      familyStatus: backendProfile.familyStatus,
      familyType: backendProfile.familyType,
      profileFor: backendProfile.profileFor,
      category: backendProfile.category,

      // ✅ About & Preferences
      about: backendProfile.about,
      minAge: backendProfile.minAge,
      maxAge: backendProfile.maxAge,

      // ✅ Media & Documents - Handle array of photos
      photos: Array.isArray(backendProfile.photos) ? backendProfile.photos : [],
      isVerified: backendProfile.isVerified,
      isPremium: backendProfile.isPremium,

      // ✅ Handle missing fields with defaults
      location:
        backendProfile.district ||
        backendProfile.city ||
        "Location not specified",
      nativeDistrict: backendProfile.district,
      preferredLocation: backendProfile.district || backendProfile.state,

      // ✅ Document fields (might be null in your entity)
      jathagamFileId: backendProfile.jathagamFileId,
      resumeFileId: backendProfile.resumeFileId,
      jathagam: backendProfile.jathagam,
      resume: backendProfile.resume,
    };

    // Log important fields for debugging
    console.log("📋 Mapped profile fields:");
    console.log("  - name:", mappedProfile.name);
    console.log("  - age:", mappedProfile.age);
    console.log("  - gender:", mappedProfile.gender);
    console.log("  - photos:", mappedProfile.photos);
    console.log("  - photos count:", mappedProfile.photos.length);

    return mappedProfile;
  };

  // ✅ FIXED: Enhanced getProfileImages function
  const getProfileImages = useCallback(() => {
    if (!profile) {
      console.log("📸 getProfileImages: profile is null");
      return [];
    }

    try {
      console.log(
        "📸 Processing profile images from profile.photos:",
        profile.photos
      );

      // Check if photos array exists and has items
      if (Array.isArray(profile.photos) && profile.photos.length > 0) {
        const validPhotos = profile.photos
          .filter(
            (photo) => photo && typeof photo === "string" && photo.trim() !== ""
          )
          .map((photo) => formatImageUrl(photo)); // ✅ Use the unified formatImageUrl

        console.log("✅ Processed photos URLs:", validPhotos);
        return validPhotos;
      }

      console.log("ℹ️ No photos found in profile.photos array");
      return [];
    } catch (error) {
      console.error("❌ Error processing profile images:", error);
      return [];
    }
  }, [profile]);

  // ✅ FIXED: Add formatImageUrl function to DetailedProfilePage
  const formatImageUrl = (url) => {
    if (!url || typeof url !== "string") return null;

    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;

    console.log("🔗 Formatting image URL:", trimmedUrl);

    // If it's already a full URL, use it directly
    if (trimmedUrl.startsWith("http")) {
      return trimmedUrl;
    }

    // If it's a backend-stored path like "users/15/photos/filename.jpg"
    if (trimmedUrl.includes("/") && !trimmedUrl.startsWith("/api/")) {
      return `http://localhost:8080/api/files/images/${trimmedUrl}`;
    }

    // If it's a relative path starting with /api/, construct full URL
    if (trimmedUrl.startsWith("/api/")) {
      return `http://localhost:8080${trimmedUrl}`;
    }

    // If it's just a filename, use the public image endpoint
    return `http://localhost:8080/api/files/public/images/${trimmedUrl}`;
  };

  const images = useMemo(() => getProfileImages(), [getProfileImages]);


  const handleConfirmRequestContact = useCallback(
  async (acceptedLanguage = "en") => {
    if (!profile?.id) {
      return alert("Profile information not available");
    }
    setContactLoading(true);
    try {
      const payload = { acceptedLanguage };

      const resp = await profileService.requestContact(profile.id, payload);
      // resp expected: { success, status, message, contact?, requestId? }

      // Normalize fallback
      const status = resp?.status || (resp.success ? "PENDING" : "FAILED");

      // ALWAYS update UI state from resp
      setContactRequestStatus(status);
      if (resp.requestId) setContactRequestId(resp.requestId);

      if (status === "ACCEPTED") {
        if (resp.contact) {
          setContactRevealed(resp.contact);
        } else {
          // ensure we have the latest contact if backend didn't include it
          await fetchContact();
        }
        alert(resp.message || "Contact revealed");
      } else if (status === "PENDING") {
        // show pending locally and keep button disabled
        alert(resp.message || "Request sent. Waiting for owner approval.");
      } else if (status === "REJECTED") {
        alert(resp.message || "User rejected your request.");
      } else {
        alert(resp.message || `Request result: ${status}`);
      }
    } catch (err) {
      console.error("request contact error", err);
      alert(err?.response?.data?.message || err.message || "Failed to request contact");
    } finally {
      setContactLoading(false);
    }
  },
  [profile?.id, fetchContact]
);



  // Rest of your functions remain the same...
  const handleExpressInterest = useCallback(async () => {
    if (!profile?.id) {
      alert("Profile information not available");
      return;
    }

    setInterestLoading(true);
    try {
      console.log("💝 Expressing interest in profile:", profile.id);

      await profileService.expressInterest(profile.id);
      alert("Interest expressed successfully! 💝");
    } catch (err) {
      console.error("❌ Error expressing interest:", err);
      alert(err.message || "Failed to express interest. Please try again.");
    } finally {
      setInterestLoading(false);
    }
  }, [profile?.id]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleShareProfile = useCallback(() => {
    if (!profile) return;

    const shareData = {
      title: `${profile.name}'s Profile - Eliteinova Matrimony`,
      text: `Check out ${profile.name}'s profile on Eliteinova Matrimony`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      navigator.share(shareData).catch((err) => {
        console.error("Error sharing:", err);
        fallbackCopyToClipboard();
      });
    } else {
      fallbackCopyToClipboard();
    }

    function fallbackCopyToClipboard() {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Profile link copied to clipboard!");
        })
        .catch(() => {
          const textArea = document.createElement("textarea");
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert("Profile link copied to clipboard!");
        });
    }
  }, [profile]);

  const handleImageError = useCallback(
    (index) => {
      console.error(`❌ Failed to load image at index: ${index}`);
      setFailedImages((prev) => new Set(prev).add(index));

      if (images.length > 1 && index === activeImage) {
        const nextIndex = images.findIndex(
          (_, i) => i !== index && !failedImages.has(i)
        );
        if (nextIndex !== -1) {
          setActiveImage(nextIndex);
        }
      }
    },
    [images.length, activeImage, failedImages]
  );

  // Document handling functions...
  const downloadFile = useCallback(
    async (documentType, filename) => {
      try {
        if (documentType === "jathagam" && profile?.jathagamFileId) {
          const response = await fetch(
            `http://localhost:8080/api/files/documents/${profile.jathagamFileId}`
          );
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || `Jathagam_${profile.name}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
          } else {
            alert("Jathagam file not available for download");
          }
        } else if (documentType === "resume" && profile?.resumeFileId) {
          const response = await fetch(
            `http://localhost:8080/api/files/documents/${profile.resumeFileId}`
          );
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || `Resume_${profile.name}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
          } else {
            alert("Resume file not available for download");
          }
        } else {
          alert("Document not available for download");
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download file. Please try again.");
      }
    },
    [profile]
  );

  const previewFile = useCallback(
    async (documentType) => {
      try {
        let fileUrl = "";

        if (documentType === "jathagam" && profile?.jathagamFileId) {
          fileUrl = `http://localhost:8080/api/files/documents/${profile.jathagamFileId}`;
        } else if (documentType === "resume" && profile?.resumeFileId) {
          fileUrl = `http://localhost:8080/api/files/documents/${profile.resumeFileId}`;
        } else {
          alert("Document not available for preview");
          return;
        }

        window.open(fileUrl, "_blank");
      } catch (error) {
        console.error("Error previewing file:", error);
        alert("Failed to preview file. Please try again.");
      }
    },
    [profile]
  );

  const getFileTypeIcon = useCallback((documentType) => {
    if (documentType === "jathagam") {
      return <FileText size={20} className="text-red-500" />;
    } else if (documentType === "resume") {
      return <FileText size={20} className="text-blue-500" />;
    }
    return <FileUp size={20} className="text-gray-500" />;
  }, []);

  const getFileTypeText = useCallback((documentType) => {
    if (documentType === "jathagam") {
      return "PDF Document";
    } else if (documentType === "resume") {
      return "Resume Document";
    }
    return "Document";
  }, []);

  // Helper functions
  const getHeightInFeet = useCallback((height) => {
    if (!height) return "Not specified";

    if (typeof height === "number") {
      const feet = height / 30.48;
      return `${feet.toFixed(1)} ft (${height} cm)`;
    }

    return `${height}`;
  }, []);

  const getAnnualIncomeDisplay = useCallback((income) => {
    if (!income) return "Not specified";

    if (typeof income === "number") {
      if (income >= 100000) return `${(income / 100000).toFixed(1)} LPA`;
      return `${(income / 1000).toFixed(0)}K`;
    }

    return income;
  }, []);

  // Safe value getter with fallback
  const getSafeValue = useCallback((value, fallback = "Not specified") => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : fallback;
  }, []);

  // Check if documents exist
  const hasJathagam = profile?.jathagamFileId || profile?.jathagam;
  const hasResume = profile?.resumeFileId || profile?.resume;

  const membershipType = (
    passedMembershipType ||
    profile?.membershipType ||
    profile?.user?.membership ||
    profile?.membership ||
    "SILVER"
  ).toUpperCase();
  const t = membershipThemes[membershipType] || membershipThemes.SILVER;

  // Debug current state
  console.log("🔄 Component state:", {
    loading,
    error,
    profile: profile
      ? {
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          photosCount: profile.photos?.length || 0,
        }
      : "No profile",
    images: images.length,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
          <p className="text-sm text-gray-500 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Profile Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            The profile you're looking for doesn't exist or cannot be loaded.
          </p>
          <p className="text-sm text-gray-500 mb-6">Profile ID: {id}</p>
          <button
            onClick={handleGoBack}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasImages =
    images.length > 0 && images.some((_, index) => !failedImages.has(index));
  const profileName = getSafeValue(profile.name, "Unknown User");
  const profileAge = getSafeValue(profile.age, "Not specified");

  console.log(
    "🎯 Rendering profile:",
    profileName,
    profileAge,
    "Images:",
    images.length
  );

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      {/* Header */}
      <div className={`${t.headerBg} shadow-sm ${t.headerBorder} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className={`flex items-center gap-2 ${t.backBtn} transition-colors`}
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={20} />
              <span>Back to Search</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShareProfile}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${t.shareBtn} transition-colors`}
                aria-label="Share profile"
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                onClick={handleExpressInterest}
                disabled={interestLoading}
                className={`flex items-center gap-2 ${t.interestBtn} px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                aria-label={
                  interestLoading
                    ? "Sending interest request"
                    : `Express interest in ${profileName}`
                }
              >
                <Heart size={18} />
                {interestLoading ? "Sending..." : "Express Interest"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image Gallery */}
            <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} overflow-hidden`}>
              <div className="relative h-80 bg-gray-100">
                {hasImages ? (
                  <img
                    src={images[activeImage]}
                    alt={profileName}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setShowFullImage(true)}
                    onError={() => handleImageError(activeImage)}
                    width={400}
                    height={320}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-6xl font-bold ${
                      profile.gender === "FEMALE"
                        ? "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600"
                        : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                    }`}
                  >
                    {profileName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "US"}
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map(
                      (img, index) =>
                        !failedImages.has(index) && (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                              activeImage === index
                                ? t.thumbnailActive
                                : "border-gray-300"
                            }`}
                          >
                            <img
                              src={img}
                              alt={`${profileName} - Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(index)}
                              width={64}
                              height={64}
                              loading="lazy"
                            />
                          </button>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Info Card */}
            <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
              <h3 className={`text-lg font-bold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                <User size={20} />
                Quick Info
              </h3>

              <div className="space-y-3">
                <InfoRow label="Profile ID" value={`#${profile.id || "N/A"}`} />
                <InfoRow label="Age" value={profileAge} />
                <InfoRow
                  label="Height"
                  value={getHeightInFeet(profile.height)}
                />
                <InfoRow label="Marital Status" value={profile.maritalStatus} />
                <InfoRow
                  label="Location"
                  value={profile.district || profile.location}
                />
                <InfoRow
                  label="Profile For"
                  value={profile.profileFor || "Self"}
                />
              </div>
            </div>

            {/* Warning Modal with language selection */}
{showWarningModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-3xl w-full p-6 overflow-auto max-h-[90vh]">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold">
          {WARNING_TEXTS[selectedLanguage]?.title || WARNING_TEXTS.en.title}
        </h2>
        <button onClick={() => setShowWarningModal(false)} className="text-gray-600">
          <Cross size={18} />
        </button>
      </div>

      {/* Language select */}
      <div className="mt-3 flex items-center gap-3">
        <label className="text-sm text-gray-600">Select language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="ml">മലയാളം</option>
          <option value="bn">বাংলা</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      <div className="mt-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
        {WARNING_TEXTS[selectedLanguage]?.body || WARNING_TEXTS.en.body}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          id="acceptWarning"
          type="checkbox"
          checked={acceptedWarning}
          onChange={(e) => setAcceptedWarning(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="acceptWarning" className="text-sm text-gray-700">
          {WARNING_TEXTS[selectedLanguage]?.checkbox ||
            WARNING_TEXTS.en.checkbox}
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => setShowWarningModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {WARNING_TEXTS[selectedLanguage]?.cancel || "Cancel"}
        </button>

        <button
          onClick={async () => {
            // Confirm handler
            if (!acceptedWarning) {
              alert(
                (WARNING_TEXTS[selectedLanguage]?.checkbox ||
                  WARNING_TEXTS.en.checkbox) +
                  " — Please accept to continue."
              );
              return;
            }

            // Close modal then call request flow
            setShowWarningModal(false);
            await handleConfirmRequestContact(selectedLanguage);
          }}
          className={`px-4 py-2 bg-red-600 text-white rounded-lg ${!acceptedWarning ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={!acceptedWarning || contactLoading}
        >
          {contactLoading ? "Sending..." : (WARNING_TEXTS[selectedLanguage]?.confirm || "Confirm and Send Request")}
        </button>
      </div>
    </div>
  </div>
)}

            {/* Contact Preferences */}
            <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
              <h3 className={`text-lg font-bold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                <Phone size={20} />
                Contact
              </h3>

              <div className="space-y-3">
                <button
  onClick={() => {
    console.log("DEBUG: Request Contact button clicked", { contactLoading, contactRequestStatus });
    setAcceptedWarning(false);
    setSelectedLanguage("en");
    setShowWarningModal(true);
  }}
  disabled={contactLoading || contactRequestStatus === "PENDING" || contactRequestStatus === "ACCEPTED"}
  className={`w-full ${t.contactBtn} py-3 rounded-lg transition-colors font-semibold`}
  aria-label="Request contact information"
>
  <Phone size={18} className="inline mr-2" />
  {contactLoading
    ? "Requesting..."
    : contactRevealed
      ? `Contact: ${contactRevealed.mobile || contactRevealed.phone || contactRevealed.contact}`
      : contactRequestStatus === "PENDING"
        ? "Request Sent (Pending)"
        : contactRequestStatus === "ACCEPTED"
          ? "Contact Revealed"
          : "Request Contact"}
</button>


                <button
                  className={`w-full ${t.msgBtn} py-3 rounded-lg transition-colors font-semibold`}
                  aria-label="Send message"
                >
                  <Mail size={18} className="inline mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Documents Quick Access */}
            {(hasJathagam || hasResume) && (
              <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
                <h3 className={`text-lg font-bold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                  <FileText size={20} />
                  Documents
                </h3>

                <div className="space-y-3">
                  {hasJathagam && (
                    <button
                      onClick={() => setActiveDocument("jathagam")}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="View jathagam document"
                    >
                      <div className="flex items-center gap-3">
                        {getFileTypeIcon("jathagam")}
                        <div className="text-left">
                          <p className="font-medium text-gray-800">Jathagam</p>
                          <p className="text-xs text-gray-500">Horoscope PDF</p>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-400" />
                    </button>
                  )}

                  {hasResume && (
                    <button
                      onClick={() => setActiveDocument("resume")}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="View resume document"
                    >
                      <div className="flex items-center gap-3">
                        {getFileTypeIcon("resume")}
                        <div className="text-left">
                          <p className="font-medium text-gray-800">Resume</p>
                          <p className="text-xs text-gray-500">
                            Professional Bio-data
                          </p>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {profileName}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {profile.district && profile.state
                    ? `${profile.district}, ${profile.state}`
                    : profile.location || "Location not specified"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.gender === "FEMALE"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {profile.gender || "Not specified"}
                </span>
                {profile.isPremium && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Premium
                  </span>
                )}
                {profile.isVerified && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Verified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h2 className={`text-lg font-semibold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                    <User size={20} />
                    Personal Details
                  </h2>

                  <div className="space-y-3">
                    <InfoRow label="Age" value={profileAge} />
                    <InfoRow
                      label="Height"
                      value={getHeightInFeet(profile.height)}
                    />
                    <InfoRow
                      label="Marital Status"
                      value={profile.maritalStatus}
                    />
                    <InfoRow label="Religion" value={profile.religion} />
                    <InfoRow label="Caste" value={profile.caste} />
                    <InfoRow label="Subcaste" value={profile.subCaste} />
                    <InfoRow
                      label="Mother Tongue"
                      value={profile.motherTongue}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h2 className={`text-lg font-semibold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                    <BookOpen size={20} />
                    Professional Details
                  </h2>

                  <div className="space-y-3">
                    <InfoRow label="Education" value={profile.education} />
                    <InfoRow label="Profession" value={profile.profession} />
                    <InfoRow label="Occupation" value={profile.occupation} />
                    <InfoRow label="Employed In" value={profile.employedIn} />
                    <InfoRow
                      label="Annual Income"
                      value={getAnnualIncomeDisplay(profile.annualIncome)}
                    />
                    <InfoRow label="Dosham" value={profile.dosham} />
                    <InfoRow
                      label="Willing Other Caste"
                      value={profile.willingOtherCaste ? "Yes" : "No"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Family & Location Details */}
            <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Family Information */}
                <div>
                  <h2 className={`text-lg font-semibold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                    <Home size={20} />
                    Family Details
                  </h2>

                  <div className="space-y-3">
                    <InfoRow
                      label="Family Status"
                      value={profile.familyStatus}
                    />
                    <InfoRow label="Family Type" value={profile.familyType} />
                    <InfoRow label="Profile For" value={profile.profileFor} />
                    <InfoRow label="Category" value={profile.category} />
                    <InfoRow label="Native District" value={profile.district} />
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h2 className={`text-lg font-semibold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                    <MapPin size={20} />
                    Location
                  </h2>

                  <div className="space-y-3">
                    <InfoRow label="City" value={profile.city} />
                    <InfoRow label="District" value={profile.district} />
                    <InfoRow label="State" value={profile.state} />
                    <InfoRow label="Country" value={profile.country} />
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            {profile.about && (
              <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  About {profileName}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.about}
                </p>
              </div>
            )}

            {/* Documents Section */}
            {(hasJathagam || hasResume) && (
              <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
                <h2 className={`text-lg font-semibold ${t.sectionTitle} mb-4 flex items-center gap-2`}>
                  <FileText size={20} />
                  Documents & Files
                </h2>

                <div className="space-y-4">
                  {hasJathagam && (
                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileTypeIcon("jathagam")}
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Jathagam / Horoscope
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getFileTypeText("jathagam")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => previewFile("jathagam")}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <FileText size={16} />
                            Preview
                          </button>
                          <button
                            onClick={() =>
                              downloadFile(
                                "jathagam",
                                `Jathagam_${profileName}.pdf`
                              )
                            }
                            className={`flex items-center gap-2 px-3 py-2 ${t.downloadBtn} rounded-lg transition-colors text-sm`}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasResume && (
                    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileTypeIcon("resume")}
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Resume / Bio-data
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getFileTypeText("resume")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => previewFile("resume")}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <FileText size={16} />
                            Preview
                          </button>
                          <button
                            onClick={() =>
                              downloadFile(
                                "resume",
                                `Resume_${profileName}.pdf`
                              )
                            }
                            className={`flex items-center gap-2 px-3 py-2 ${t.downloadBtn} rounded-lg transition-colors text-sm`}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Partner Preferences */}
            {(profile.minAge || profile.maxAge) && (
              <div className={`bg-white rounded-xl ${t.cardShadow} ${t.cardBorder} p-6`}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Partner Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <InfoRow
                    label="Age Range"
                    value={`${profile.minAge || "25"} - ${
                      profile.maxAge || "35"
                    } years`}
                  />
                  <InfoRow
                    label="Location"
                    value={profile.preferredLocation || "Anywhere"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && hasImages && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close full screen image"
            >
              <Cross size={24} />
            </button>
            <img
              src={images[activeImage]}
              alt={`${profileName} - Full screen view`}
              className="max-w-full max-h-full object-contain"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map(
                  (_, index) =>
                    !failedImages.has(index) && (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`w-3 h-3 rounded-full ${
                          activeImage === index
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                        aria-label={`Go to photo ${index + 1}`}
                      />
                    )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Download Modal */}
      {activeDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Download {activeDocument === "jathagam" ? "Jathagam" : "Resume"}
            </h2>
            <p className="text-gray-600 mb-6">
              Would you like to download or preview the{" "}
              {activeDocument === "jathagam" ? "Jathagam PDF" : "Resume"}?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActiveDocument(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  previewFile(activeDocument);
                  setActiveDocument(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview
              </button>
              <button
                onClick={() => {
                  downloadFile(
                    activeDocument,
                    `${
                      activeDocument === "jathagam" ? "Jathagam" : "Resume"
                    }_${profileName}.pdf`
                  );
                  setActiveDocument(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
