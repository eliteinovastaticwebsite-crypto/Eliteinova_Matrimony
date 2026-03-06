import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShieldAlt, FaGlobe } from "react-icons/fa";

const languages = [
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  { code: "ur", label: "اردو", flag: "🇵🇰", rtl: true },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
];

const content = {
  ta: {
    title: "எலீட்டினோவா மேட்ரிமோனி (Eliteinova Matrimony)",
    intro: `எலீட்டினோவா மேட்ரிமோனி என்பது உங்கள் வாழ்க்கைத் துணையை கண்டுபிடிக்க உதவும் ஒரு ஆன்லைன் மேடையாகும். எங்கள் சேவையின் மூலம், வயது, சமூகப் பின்னணி, இருப்பிடம், கல்வி, தொழில் போன்ற உங்கள் விருப்பங்களுக்கு ஏற்ப மணமகன் அல்லது மணமகளை தேடி தொடர்பு கொள்ளலாம்.

எந்தவொரு தனிப்பட்ட முடிவையும் எடுக்கும் முன், ஒவ்வொரு உறுப்பினரும் சரியான பின்னணி சரிபார்ப்பை மேற்கொள்ள வேண்டும் என்று நாங்கள் வலியுறுத்துகிறோம். இதில் குடும்ப பின்னணி, கல்வி, வேலை விவரங்கள், குணநலன் தொடர்பான தகவல்கள் மற்றும் உங்கள் பாதுகாப்பு மற்றும் நம்பிக்கைக்குத் தேவையான பிற தகவல்களை சரிபார்ப்பது அடங்கும்.`,
    noteTitle: "தயவுசெய்து கவனிக்கவும்:",
    notes: [
      "எலீட்டினோவா மேட்ரிமோனி ஒரு தொடர்பு ஏற்படுத்தும் தளமாக மட்டுமே செயல்படுகிறது. பயனர்கள் வழங்கும் தகவல்களின் உண்மைத் தன்மையை நாங்கள் தனிபட்ட விவரங்களில் உத்தரவாதம் அளிக்க முடியாது.",
      "பதிவு செய்த பிறகு அல்லது உறுப்பினர்கள் ஒருவருடன் ஒருவர் தொடர்பு கொண்ட பிறகு ஏற்படும் எந்தவொரு முடிவுகள் அல்லது அதன் விளைவுகளுக்கும் எலீட்டினோவா மேட்ரிமோனி தனிப்பட்ட பொறுப்பை ஏற்காது.",
      "உங்கள் பாதுகாப்பு, தனியுரிமை மற்றும் சிந்தித்து எடுக்கப்படும் முடிவுகள் மிகவும் முக்கியமானவை. எனவே தயவுசெய்து கவனமாகவும் பொறுப்புடன் செயல்படவும்.",
    ],
  },
  en: {
    title: "Eliteinova Matrimony",
    intro: `Eliteinova Matrimony is an online platform designed to help you find your ideal life partner. Through our service, you can search for and connect with potential brides or grooms based on your preferences such as age, community background, location, education, and profession.

Before making any personal decision, we strongly advise every member to conduct proper background verification. This includes checking family background, educational qualifications, employment details, character references, and any other information necessary for your confidence and safety.`,
    noteTitle: "Please Note:",
    notes: [
      "Eliteinova Matrimony functions only as a platform to facilitate connections between individuals. We cannot guarantee the authenticity of the personal details provided by users.",
      "Eliteinova Matrimony does not take personal responsibility for any decisions made or outcomes that arise after registration or after members begin communicating with each other.",
      "Your safety, privacy, and thoughtful decision-making are very important. Therefore, we request that you proceed carefully and responsibly.",
    ],
  },
  ml: {
    title: "എലിറ്റിനോവ മാട്രിമോണി (Eliteinova Matrimony)",
    intro: `എലിറ്റിനോവ മാട്രിമോണി നിങ്ങളുടെ ജീവിത പങ്കാളിയെ കണ്ടെത്താൻ സഹായിക്കുന്ന ഒരു ഓൺലൈൻ പ്ലാറ്റ്‌ഫോമാണ്. ഞങ്ങളുടെ സേവനത്തിലൂടെ പ്രായം, സമൂഹ പശ്ചാത്തലം, സ്ഥലം, വിദ്യാഭ്യാസം, തൊഴിൽ എന്നിവ പോലുള്ള നിങ്ങളുടെ ഇഷ്ടാനുസൃതമായ മാനദണ്ഡങ്ങളെ അടിസ്ഥാനമാക്കി അനുയോജ്യമായ വധുവിനെയോ വരനെയോ തിരഞ്ഞ് കണ്ടെത്തുകയും ബന്ധപ്പെടുകയും ചെയ്യാം.

ഏതെങ്കിലും വ്യക്തിഗത തീരുമാനങ്ങൾ എടുക്കുന്നതിന് മുമ്പ്, ഓരോ അംഗവും ശരിയായ പശ്ചാത്തല പരിശോധന നടത്തണമെന്ന് ഞങ്ങൾ ശക്തമായി നിർദ്ദേശിക്കുന്നു. ഇതിൽ കുടുംബ പശ്ചാത്തലം, വിദ്യാഭ്യാസ യോഗ്യതകൾ, തൊഴിൽ വിവരങ്ങൾ, സ്വഭാവ സംബന്ധമായ വിവരങ്ങൾ എന്നിവയും നിങ്ങളുടെ ആത്മവിശ്വാസത്തിനും സുരക്ഷയ്ക്കും ആവശ്യമായ മറ്റ് വിവരങ്ങളും പരിശോധിക്കുന്നത് ഉൾപ്പെടുന്നു.`,
    noteTitle: "ദയവായി ശ്രദ്ധിക്കുക:",
    notes: [
      "എലിറ്റിനോവ മാട്രിമോണി അംഗങ്ങൾ തമ്മിൽ ബന്ധം സ്ഥാപിക്കാൻ സഹായിക്കുന്ന ഒരു പ്ലാറ്റ്‌ഫോമായി മാത്രം പ്രവർത്തിക്കുന്നു. ഉപയോക്താക്കൾ നൽകുന്ന വ്യക്തിഗത വിവരങ്ങളുടെ സത്യസന്ധത ഞങ്ങൾ ഉറപ്പുനൽകാൻ കഴിയില്ല.",
      "രജിസ്ട്രേഷൻ നടത്തിയതിന് ശേഷം അല്ലെങ്കിൽ അംഗങ്ങൾ തമ്മിൽ ആശയവിനിമയം ആരംഭിച്ചതിന് ശേഷം ഉണ്ടാകുന്ന ഏതെങ്കിലും തീരുമാനങ്ങൾക്കും അതിന്റെ ഫലങ്ങൾക്കും എലിറ്റിനോവ മാട്രിമോണി വ്യക്തിപരമായ ഉത്തരവാദിത്വം ഏറ്റെടുക്കില്ല.",
      "നിങ്ങളുടെ സുരക്ഷയും സ്വകാര്യതയും ആലോചിച്ചെടുത്ത തീരുമാനങ്ങളും വളരെ പ്രധാനമാണ്. അതിനാൽ ദയവായി ശ്രദ്ധയോടെയും ഉത്തരവാദിത്തത്തോടെയും മുന്നോട്ട് പോകുക.",
    ],
  },
  hi: {
    title: "एलिटिनोवा मैट्रिमोनी (Eliteinova Matrimony)",
    intro: `एलिटिनोवा मैट्रिमोनी एक ऑनलाइन प्लेटफ़ॉर्म है जो आपको आपके आदर्श जीवनसाथी को खोजने में मदद करने के लिए बनाया गया है। हमारी सेवा के माध्यम से आप अपनी पसंद के अनुसार जैसे कि उम्र, समुदाय, स्थान, शिक्षा और पेशा के आधार पर संभावित दुल्हन या दूल्हे को खोज सकते हैं और उनसे संपर्क कर सकते हैं।

किसी भी व्यक्तिगत निर्णय लेने से पहले, हम प्रत्येक सदस्य को उचित पृष्ठभूमि सत्यापन करने की दृढ़ता से सलाह देते हैं। इसमें पारिवारिक पृष्ठभूमि, शैक्षणिक योग्यता, रोजगार विवरण, चरित्र संबंधी जानकारी और आपकी सुरक्षा व विश्वास के लिए आवश्यक अन्य जानकारी की जांच शामिल है।`,
    noteTitle: "कृपया ध्यान दें:",
    notes: [
      "एलिटिनोवा मैट्रिमोनी केवल एक ऐसा प्लेटफ़ॉर्म है जो लोगों को आपस में जोड़ने का कार्य करता है। उपयोगकर्ताओं द्वारा प्रदान की गई व्यक्तिगत जानकारी की प्रामाणिकता की हम गारंटी नहीं दे सकते।",
      "पंजीकरण के बाद या सदस्यों के बीच संचार शुरू होने के बाद होने वाले किसी भी निर्णय या उसके परिणामों के लिए एलिटिनोवा मैट्रिमोनी व्यक्तिगत रूप से जिम्मेदार नहीं होगा।",
      "आपकी सुरक्षा, गोपनीयता और सोच-समझकर लिए गए निर्णय बहुत महत्वपूर्ण हैं। इसलिए कृपया सावधानी और जिम्मेदारी के साथ आगे बढ़ें।",
    ],
  },
  te: {
    title: "ఎలీటినోవా మ్యాట్రిమోని (Eliteinova Matrimony)",
    intro: `ఎలీటినోవా మ్యాట్రిమోని మీకు సరైన జీవిత భాగస్వామిని కనుగొనడంలో సహాయపడే ఒక ఆన్‌లైన్ వేదిక. మా సేవ ద్వారా మీరు వయస్సు, సమాజ నేపథ్యం, స్థానం, విద్య మరియు వృత్తి వంటి మీ అభిరుచులకు అనుగుణంగా వరుడు లేదా వధువును వెతికి వారితో సంప్రదించవచ్చు.

ఏ వ్యక్తిగత నిర్ణయం తీసుకునే ముందు ప్రతి సభ్యుడు సరైన నేపథ్య పరిశీలన చేయాలని మేము బలంగా సూచిస్తున్నాము. ఇందులో కుటుంబ నేపథ్యం, విద్యా అర్హతలు, ఉద్యోగ వివరాలు, వ్యక్తిత్వానికి సంబంధించిన సమాచారం మరియు మీ భద్రత మరియు నమ్మకానికి అవసరమైన ఇతర వివరాలను పరిశీలించడం కూడా ఉంటుంది.`,
    noteTitle: "దయచేసి గమనించండి:",
    notes: [
      "ఎలీటినోవా మ్యాట్రిమోని సభ్యులను ఒకరితో ఒకరు కలిపే వేదికగా మాత్రమే పనిచేస్తుంది. వినియోగదారులు అందించే వ్యక్తిగత సమాచారపు నిజానిజాలను మేము హామీ ఇవ్వలేము.",
      "నమోదు చేసిన తరువాత లేదా సభ్యులు ఒకరితో ఒకరు సంభాషణ ప్రారంభించిన తరువాత తీసుకునే ఏ నిర్ణయాలు లేదా వాటి ఫలితాల పట్ల ఎలీటినోవా మ్యాట్రిమోని వ్యక్తిగత బాధ్యత వహించదు.",
      "మీ భద్రత, గోప్యత మరియు ఆలోచించి తీసుకునే నిర్ణయాలు చాలా ముఖ్యమైనవి. కాబట్టి దయచేసి జాగ్రత్తగా మరియు బాధ్యతతో ముందుకు సాగండి.",
    ],
  },
  kn: {
    title: "ಎಲಿಟಿನೋವಾ ಮ್ಯಾಟ್ರಿಮೋನಿ (Eliteinova Matrimony)",
    intro: `ಎಲಿಟಿನೋವಾ ಮ್ಯಾಟ್ರಿಮೋನಿ ನಿಮ್ಮ ಆದರ್ಶ ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸಹಾಯ ಮಾಡುವ ಒಂದು ಆನ್‌ಲೈನ್ ವೇದಿಕೆ. ನಮ್ಮ ಸೇವೆಯ ಮೂಲಕ ನೀವು ವಯಸ್ಸು, ಸಮುದಾಯ ಹಿನ್ನೆಲೆ, ಸ್ಥಳ, ಶಿಕ್ಷಣ ಮತ್ತು ವೃತ್ತಿ ಮುಂತಾದ ನಿಮ್ಮ ಇಚ್ಛೆಗಳ ಆಧಾರದ ಮೇಲೆ ವರ ಅಥವಾ ವಧುವನ್ನು ಹುಡುಕಿ ಸಂಪರ್ಕಿಸಬಹುದು.

ಯಾವುದೇ ವೈಯಕ್ತಿಕ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು, ಪ್ರತಿಯೊಬ್ಬ ಸದಸ್ಯರೂ ಸರಿಯಾದ ಹಿನ್ನೆಲೆ ಪರಿಶೀಲನೆ ಮಾಡಬೇಕು ಎಂದು ನಾವು ಬಲವಾಗಿ ಸಲಹೆ ನೀಡುತ್ತೇವೆ. ಇದರಲ್ಲಿ ಕುಟುಂಬ ಹಿನ್ನೆಲೆ, ಶಿಕ್ಷಣ ಅರ್ಹತೆಗಳು, ಉದ್ಯೋಗ ವಿವರಗಳು, ವ್ಯಕ್ತಿತ್ವ ಸಂಬಂಧಿತ ಮಾಹಿತಿ ಹಾಗೂ ನಿಮ್ಮ ಭದ್ರತೆ ಮತ್ತು ನಂಬಿಕೆಗೆ ಅಗತ್ಯವಾದ ಇತರ ಮಾಹಿತಿಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು ಒಳಗೊಂಡಿದೆ.`,
    noteTitle: "ದಯವಿಟ್ಟು ಗಮನಿಸಿ:",
    notes: [
      "ಎಲಿಟಿನೋವಾ ಮ್ಯಾಟ್ರಿಮೋನಿ ಸದಸ್ಯರನ್ನು ಪರಸ್ಪರ ಸಂಪರ್ಕಿಸುವ ವೇದಿಕೆಯಾಗಿ ಮಾತ್ರ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ಬಳಕೆದಾರರು ನೀಡುವ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯ ನಿಖರತೆಯನ್ನು ನಾವು ಖಚಿತಪಡಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      "ನೋಂದಣಿ ಮಾಡಿದ ನಂತರ ಅಥವಾ ಸದಸ್ಯರು ಪರಸ್ಪರ ಸಂಪರ್ಕ ಆರಂಭಿಸಿದ ನಂತರ ತೆಗೆದುಕೊಳ್ಳುವ ಯಾವುದೇ ನಿರ್ಧಾರಗಳು ಅಥವಾ ಅವುಗಳ ಪರಿಣಾಮಗಳಿಗೆ ಎಲಿಟಿನೋವಾ ಮ್ಯಾಟ್ರಿಮೋನಿ ವೈಯಕ್ತಿಕವಾಗಿ ಹೊಣೆಗಾರರಾಗುವುದಿಲ್ಲ.",
      "ನಿಮ್ಮ ಭದ್ರತೆ, ಗೌಪ್ಯತೆ ಮತ್ತು ಯೋಚಿಸಿ ತೆಗೆದುಕೊಳ್ಳುವ ನಿರ್ಧಾರಗಳು ಬಹಳ ಮುಖ್ಯ. ಆದ್ದರಿಂದ ದಯವಿಟ್ಟು ಜಾಗ್ರತೆಯಿಂದ ಮತ್ತು ಜವಾಬ್ದಾರಿಯಿಂದ ಮುಂದುವರಿಯಿರಿ.",
    ],
  },
  mr: {
    title: "एलिटिनोवा मॅट्रिमोनी (Eliteinova Matrimony)",
    intro: `एलिटिनोवा मॅट्रिमोनी हे तुमच्या आदर्श जीवनसाथीचा शोध घेण्यासाठी मदत करणारे एक ऑनलाइन प्लॅटफॉर्म आहे. आमच्या सेवेमार्फत तुम्ही वय, समाज पार्श्वभूमी, स्थान, शिक्षण आणि व्यवसाय यांसारख्या तुमच्या पसंतीनुसार संभाव्य वधू किंवा वर शोधू शकता आणि त्यांच्याशी संपर्क साधू शकता.

कोणताही वैयक्तिक निर्णय घेण्यापूर्वी प्रत्येक सदस्याने योग्य पार्श्वभूमी तपासणी करावी, अशी आम्ही जोरदार शिफारस करतो. यामध्ये कुटुंब पार्श्वभूमी, शैक्षणिक पात्रता, नोकरीची माहिती, स्वभावविषयक माहिती तसेच तुमच्या सुरक्षितता आणि विश्वासासाठी आवश्यक असलेली इतर माहिती तपासणे समाविष्ट आहे.`,
    noteTitle: "कृपया लक्षात घ्या:",
    notes: [
      "एलिटिनोवा मॅट्रिमोनी हे फक्त सदस्यांना एकमेकांशी जोडणारे एक प्लॅटफॉर्म म्हणून कार्य करते. वापरकर्त्यांनी दिलेल्या वैयक्तिक माहितीच्या सत्यतेची आम्ही हमी देऊ शकत नाही.",
      "नोंदणी केल्यानंतर किंवा सदस्यांमध्ये संवाद सुरू झाल्यानंतर घेतलेल्या कोणत्याही निर्णयांसाठी किंवा त्याच्या परिणामांसाठी एलिटिनोवा मॅट्रिमोनी वैयक्तिक जबाबदारी स्वीकारणार नाही.",
      "तुमची सुरक्षितता, गोपनीयता आणि विचारपूर्वक घेतलेले निर्णय अत्यंत महत्त्वाचे आहेत. त्यामुळे कृपया काळजीपूर्वक आणि जबाबदारीने पुढे जा.",
    ],
  },
  bn: {
    title: "এলিটিনোভা ম্যাট্রিমনি (Eliteinova Matrimony)",
    intro: `এলিটিনোভা ম্যাট্রিমনি একটি অনলাইন প্ল্যাটফর্ম যা আপনাকে আপনার আদর্শ জীবনসঙ্গী খুঁজে পেতে সহায়তা করার জন্য তৈরি করা হয়েছে। আমাদের সেবার মাধ্যমে আপনি বয়স, সামাজিক পটভূমি, অবস্থান, শিক্ষা এবং পেশা অনুযায়ী আপনার পছন্দের ভিত্তিতে সম্ভাব্য কনে বা বর খুঁজে পেতে এবং তাদের সাথে যোগাযোগ করতে পারবেন।

কোনও ব্যক্তিগত সিদ্ধান্ত নেওয়ার আগে আমরা প্রত্যেক সদস্যকে যথাযথ ব্যাকগ্রাউন্ড যাচাই করার জন্য জোরালোভাবে পরামর্শ দিই। এর মধ্যে পারিবারিক পটভূমি, শিক্ষাগত যোগ্যতা, চাকরির বিবরণ, চরিত্র সম্পর্কিত তথ্য এবং আপনার নিরাপত্তা ও বিশ্বাসের জন্য প্রয়োজনীয় অন্যান্য তথ্য যাচাই করা অন্তর্ভুক্ত।`,
    noteTitle: "অনুগ্রহ করে লক্ষ্য করুন:",
    notes: [
      "এলিটিনোভা ম্যাট্রিমনি শুধুমাত্র একটি সংযোগ স্থাপনের প্ল্যাটফর্ম হিসেবে কাজ করে। ব্যবহারকারীদের দেওয়া ব্যক্তিগত তথ্যের সত্যতা আমরা নিশ্চিত করতে পারি না।",
      "নিবন্ধনের পরে বা সদস্যদের মধ্যে যোগাযোগ শুরু হওয়ার পরে নেওয়া কোনও সিদ্ধান্ত বা তার ফলাফলের জন্য এলিটিনোভা ম্যাট্রিমনি ব্যক্তিগতভাবে দায়ী থাকবে না।",
      "আপনার নিরাপত্তা, গোপনীয়তা এবং চিন্তাভাবনা করে নেওয়া সিদ্ধান্ত অত্যন্ত গুরুত্বপূর্ণ। তাই অনুগ্রহ করে সতর্কতা ও দায়িত্বের সাথে এগিয়ে যান।",
    ],
  },
  ur: {
    title: "ایلیٹینووا میٹریمونی (Eliteinova Matrimony)",
    intro: `ایلیٹینووا میٹریمونی ایک آن لائن پلیٹ فارم ہے جو آپ کو آپ کے مثالی جیون ساتھی کو تلاش کرنے میں مدد دینے کے لیے بنایا گیا ہے۔ ہماری سروس کے ذریعے آپ اپنی ترجیحات جیسے عمر، سماجی پس منظر، مقام، تعلیم اور پیشے کی بنیاد پر ممکنہ دلہن یا دلہے کو تلاش کر سکتے ہیں اور ان سے رابطہ قائم کر سکتے ہیں۔

کسی بھی ذاتی فیصلہ کرنے سے پہلے ہم ہر رکن کو سختی سے مشورہ دیتے ہیں کہ وہ مناسب پس منظر کی جانچ پڑتال کریں۔ اس میں خاندانی پس منظر، تعلیمی قابلیت، ملازمت کی تفصیلات، کردار سے متعلق معلومات اور آپ کے اعتماد اور حفاظت کے لیے ضروری دیگر معلومات کی تصدیق شامل ہے۔`,
    noteTitle: "براہِ کرم نوٹ کریں:",
    notes: [
      "ایلیٹینووا میٹریمونی صرف ایک ایسا پلیٹ فارم ہے جو لوگوں کو آپس میں رابطہ قائم کرنے میں مدد دیتا ہے۔ صارفین کی جانب سے فراہم کردہ ذاتی معلومات کی صداقت کی ہم ضمانت نہیں دے سکتے۔",
      "رجسٹریشن کے بعد یا اراکین کے درمیان رابطہ شروع ہونے کے بعد کیے گئے کسی بھی فیصلے یا اس کے نتائج کے لیے ایلیٹینووا میٹریمونی ذاتی طور پر ذمہ دار نہیں ہوگا۔",
      "آپ کی حفاظت، رازداری اور سوچ سمجھ کر کیے گئے فیصلے بہت اہم ہیں۔ لہٰذا براہِ کرم احتیاط اور ذمہ داری کے ساتھ آگے بڑھیں۔",
    ],
  },
  gu: {
    title: "એલિટિનોવા મેટ્રિમોની (Eliteinova Matrimony)",
    intro: `એલિટિનોવા મેટ્રિમોની એક ઓનલાઈન પ્લેટફોર્મ છે જે તમને તમારા આદર્શ જીવનસાથીને શોધવામાં મદદ કરવા માટે બનાવવામાં આવ્યું છે. અમારી સેવા દ્વારા તમે વય, સમુદાય પૃષ્ઠભૂમિ, સ્થાન, શિક્ષણ અને વ્યવસાય જેવી તમારી પસંદગીઓના આધારે સંભવિત વર અથવા વધૂને શોધી શકો છો અને તેમનો સંપર્ક કરી શકો છો.

કોઈપણ વ્યક્તિગત નિર્ણય લેતા પહેલાં, દરેક સભ્યે યોગ્ય પૃષ્ઠભૂમિ ચકાસણી કરવી જોઈએ એવી અમે મજબૂત ભલામણ કરીએ છીએ. તેમાં પરિવારની પૃષ્ઠભૂમિ, શૈક્ષણિક લાયકાત, નોકરીની વિગતો, સ્વભાવ સંબંધિત માહિતી તેમજ તમારી સુરક્ષા અને વિશ્વાસ માટે જરૂરી અન્ય માહિતીની ચકાસણી શામેલ છે.`,
    noteTitle: "કૃપા કરીને નોંધ લો:",
    notes: [
      "એલિટિનોવા મેટ્રિમોની માત્ર સભ્યોને એકબીજા સાથે જોડવા માટેનું પ્લેટફોર્મ તરીકે કાર્ય કરે છે. વપરાશકર્તાઓ દ્વારા આપવામાં આવેલી વ્યક્તિગત માહિતીની સાચાઈની અમે ખાતરી આપી શકતા નથી।",
      "નોંધણી કર્યા પછી અથવા સભ્યો વચ્ચે સંચાર શરૂ થયા પછી લેવાયેલા કોઈપણ નિર્ણય અથવા તેના પરિણામ માટે એલિટિનોવા મેટ્રિમોની વ્યક્તિગત રીતે જવાબદાર રહેશે નહીં.",
      "તમારી સુરક્ષા, ગોપનીયતા અને વિચારપૂર્વક લેવામાં આવેલા નિર્ણયો ખૂબ જ મહત્વપૂર્ણ છે. તેથી કૃપા કરીને સાવચેતી અને જવાબદારી સાથે આગળ વધો.",
    ],
  },
  pa: {
    title: "ਐਲੀਟੀਨੋਵਾ ਮੈਟ੍ਰਿਮੋਨੀ (Eliteinova Matrimony)",
    intro: `ਐਲੀਟੀਨੋਵਾ ਮੈਟ੍ਰਿਮੋਨੀ ਇੱਕ ਆਨਲਾਈਨ ਪਲੇਟਫਾਰਮ ਹੈ ਜੋ ਤੁਹਾਨੂੰ ਆਪਣਾ ਜੀਵਨ ਸਾਥੀ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਸਾਡੀ ਸੇਵਾ ਰਾਹੀਂ ਤੁਸੀਂ ਆਪਣੀ ਪਸੰਦ ਦੇ ਅਨੁਸਾਰ ਉਮਰ, ਸਮਾਜਿਕ ਪਿਛੋਕੜ, ਸਥਾਨ, ਸਿੱਖਿਆ ਅਤੇ ਪੇਸ਼ੇ ਆਦਿ ਦੇ ਆਧਾਰ 'ਤੇ ਦੂਲ੍ਹਾ ਜਾਂ ਦੂਲ੍ਹਨ ਦੀ ਖੋਜ ਕਰ ਸਕਦੇ ਹੋ ਅਤੇ ਉਨ੍ਹਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕਦੇ ਹੋ।

ਕਿਸੇ ਵੀ ਨਿੱਜੀ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਹਰ ਮੈਂਬਰ ਨੂੰ ਢੰਗ ਨਾਲ ਪਿਛੋਕੜ ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ ਜ਼ੋਰ ਦੇ ਕੇ ਸਲਾਹ ਦਿੰਦੇ ਹਾਂ। ਇਸ ਵਿੱਚ ਪਰਿਵਾਰਕ ਪਿਛੋਕੜ, ਸਿੱਖਿਆ, ਨੌਕਰੀ ਦੇ ਵੇਰਵੇ, ਚਰਿਤਰ ਨਾਲ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਅਤੇ ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਅਤੇ ਭਰੋਸੇ ਲਈ ਜ਼ਰੂਰੀ ਹੋਰ ਜਾਣਕਾਰੀਆਂ ਦੀ ਜਾਂਚ ਸ਼ਾਮਲ ਹੈ।`,
    noteTitle: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ:",
    notes: [
      "ਐਲੀਟੀਨੋਵਾ ਮੈਟ੍ਰਿਮੋਨੀ ਸਿਰਫ਼ ਇੱਕ ਸੰਪਰਕ ਬਣਾਉਣ ਵਾਲਾ ਪਲੇਟਫਾਰਮ ਹੈ। ਉਪਭੋਗਤਾਵਾਂ ਵੱਲੋਂ ਦਿੱਤੀ ਗਈ ਜਾਣਕਾਰੀ ਦੀ ਸੱਚਾਈ ਲਈ ਅਸੀਂ ਨਿੱਜੀ ਤੌਰ 'ਤੇ ਕੋਈ ਗਾਰੰਟੀ ਨਹੀਂ ਦੇ ਸਕਦੇ।",
      "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਤੋਂਟ ਬਾਅਦ ਜਾਂ ਮੈਂਬਰਾਂ ਦੇ ਆਪਸ ਵਿੱਚ ਸੰਪਰਕ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹੋਣ ਵਾਲੇ ਕਿਸੇ ਵੀ ਫੈਸਲੇ ਜਾਂ ਉਸ ਦੇ ਨਤੀਜਿਆਂ ਲਈ ਐਲੀਟੀਨੋਵਾ ਮੈਟ੍ਰਿਮੋਨੀ ਕੋਈ ਨਿੱਜੀ ਜ਼ਿੰਮੇਵਾਰੀ ਨਹੀਂ ਲੈਂਦਾ।",
      "ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ, ਨਿੱਜਤਾ ਅਤੇ ਸੋਚ-ਸਮਝ ਕੇ ਲਏ ਗਏ ਫੈਸਲੇ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਹਨ। ਇਸ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਸਾਵਧਾਨੀ ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀ ਨਾਲ ਅੱਗੇ ਵਧੋ।",
    ],
  },
};

export default function TermsAndConditions() {
  const [activeLang, setActiveLang] = useState("en");
  const current = content[activeLang];
  const isRTL = languages.find((l) => l.code === activeLang)?.rtl;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fdf8f4 0%, #ffffff 40%, #fef9f0 70%, #fdf4f4 100%)" }}>

      {/* ── Hero Header ── */}
      <div
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #ef4444 45%, #eab308 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(234,179,8,0.2)" }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <FaShieldAlt className="text-white text-xl" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow" style={{ fontFamily: "'Georgia','Times New Roman',serif" }}>
            Terms & Conditions
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.5)" }} />
            <FaHeart className="text-white animate-pulse" />
            <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.5)" }} />
          </div>
          <p className="text-white/90 text-sm md:text-base font-semibold max-w-xl mx-auto">
            Eliteinova Matrimony — Where Trust Meets Tradition
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">

        {/* ── Language Selector ── */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{
            background: "linear-gradient(135deg,#ffffff 0%,#fffdf9 100%)",
            boxShadow: "0 4px 24px rgba(185,28,28,0.08)",
            border: "1px solid rgba(185,28,28,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaGlobe className="text-red-700" />
            <span className="font-bold text-red-800 text-sm md:text-base" style={{ fontFamily: "'Georgia',serif" }}>
              Select Language / மொழி தேர்ந்தெடுக்கவும்
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLang(lang.code)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all duration-200 border ${
                  activeLang === lang.code
                    ? "text-white border-transparent shadow-md scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-700"
                }`}
                style={
                  activeLang === lang.code
                    ? { background: "linear-gradient(135deg,#b91c1c,#d97706)" }
                    : {}
                }
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Card ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#ffffff 0%,#fffdf9 100%)",
            boxShadow: "0 8px 40px rgba(185,28,28,0.10), 0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid rgba(185,28,28,0.1)",
          }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(to right,#b91c1c,#d97706,#b91c1c)" }} />

          <div className="p-6 md:p-10">

            {/* Title */}
            <h2
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-6"
              style={{
                background: "linear-gradient(135deg,#7f1d1d 0%,#b91c1c 40%,#92400e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Georgia','Times New Roman',serif",
              }}
            >
              {current.title}
            </h2>

            {/* Intro text */}
            <div className="mb-6">
              {current.intro.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-gray-700 text-sm md:text-base leading-relaxed mb-4"
                  style={{ fontFamily: isRTL ? "inherit" : "'Georgia',serif" }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Note section */}
            <div
              className="rounded-xl p-5 md:p-6"
              style={{
                background: "linear-gradient(135deg,#fff7f7 0%,#fffbf0 100%)",
                border: "1px solid rgba(185,28,28,0.15)",
              }}
            >
              <h3
                className={`font-bold text-base md:text-lg mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                style={{ color: "#7f1d1d", fontFamily: "'Georgia',serif" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#b91c1c,#d97706)" }}
                >
                  !
                </span>
                {current.noteTitle}
              </h3>
              <ul className="space-y-3">
                {current.notes.map((note, i) => (
                  <li key={i} className={`flex gap-3 items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg,#b91c1c,#d97706)" }}
                    >
                      {i + 1}
                    </span>
                    <p className={`text-gray-600 text-sm md:text-base leading-relaxed ${isRTL ? "text-right" : ""}`}>{note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(to right,#b91c1c,#d97706,#b91c1c)" }} />
        </div>

        {/* ── All Languages at once (read-only, collapsible feel) ── */}
        <div className="mt-10">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-600 mb-2">✦ All Languages ✦</p>
            <h3
              className="text-xl md:text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg,#7f1d1d 0%,#b91c1c 40%,#92400e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Georgia',serif",
              }}
            >
              Terms in All Available Languages
            </h3>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(to right,transparent,#b91c1c)" }} />
              <FaHeart className="text-red-700 text-sm" />
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(to left,transparent,#b91c1c)" }} />
            </div>
          </div>

          <div className="space-y-4">
            {languages.map((lang) => {
              const c = content[lang.code];
              const rtl = lang.rtl;
              return (
                <div
                  key={lang.code}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg,#ffffff 0%,#fffdf9 100%)",
                    boxShadow: "0 2px 12px rgba(185,28,28,0.07)",
                    border: "1px solid rgba(185,28,28,0.09)",
                  }}
                  dir={rtl ? "rtl" : "ltr"}
                >
                  <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right,#b91c1c,#d97706,#b91c1c)" }} />
                  <div className="p-5 md:p-7">
                    {/* Language badge */}
                    <div className={`flex items-center gap-2 mb-3 ${rtl ? "flex-row-reverse" : ""}`}>
                      <span
                        className="px-3 py-1 rounded-full text-white text-xs font-bold"
                        style={{ background: "linear-gradient(135deg,#b91c1c,#d97706)" }}
                      >
                        {lang.flag} {lang.label}
                      </span>
                    </div>

                    <h4
                      className="font-bold text-base md:text-lg mb-3"
                      style={{ color: "#7f1d1d", fontFamily: "'Georgia',serif" }}
                    >
                      {c.title}
                    </h4>

                    {c.intro.split("\n\n").map((para, i) => (
                      <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">
                        {para}
                      </p>
                    ))}

                    <div
                      className="rounded-xl p-4 mt-2"
                      style={{ background: "linear-gradient(135deg,#fff7f7 0%,#fffbf0 100%)", border: "1px solid rgba(185,28,28,0.12)" }}
                    >
                      <p className={`font-bold text-sm mb-2 ${rtl ? "text-right" : ""}`} style={{ color: "#7f1d1d" }}>{c.noteTitle}</p>
                      <ul className="space-y-2">
                        {c.notes.map((note, i) => (
                          <li key={i} className={`flex gap-2 items-start ${rtl ? "flex-row-reverse" : ""}`}>
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5"
                              style={{ background: "linear-gradient(135deg,#b91c1c,#d97706)" }}
                            >
                              {i + 1}
                            </span>
                            <p className={`text-gray-600 text-xs leading-relaxed ${rtl ? "text-right" : ""}`}>{note}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right,#b91c1c,#d97706,#b91c1c)" }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-all duration-300 text-sm"
            style={{ background: "linear-gradient(135deg,#b91c1c,#d97706)" }}
          >
            <FaHeart className="text-sm" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}