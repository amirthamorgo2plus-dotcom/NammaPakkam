'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'ta' | 'hi';

const dict = {
  en: {
    appName: 'Namma Pakkam',
    tagline: 'Your community, one tap away',
    directory: 'Directory',
    classifieds: 'Classifieds',
    ask: 'Ask Community',
    notices: 'Notices',
    blocks: 'Blocks',
    search: 'Search businesses, services…',
    openNow: 'Open now',
    topRated: 'Top rated',
    featured: 'Featured',
    categories: 'Categories',
    viewAll: 'View all',
    call: 'Call',
    whatsapp: 'WhatsApp',
    verified: 'Verified',
    login: 'Login',
    signup: 'Join',
    logout: 'Logout',
    admin: 'Admin',
    pending: 'Pending approval',
    addListing: 'Add your business',
    noResults: 'Nothing found. Try another category or keyword.',
    sortRating: 'Rating',
    sortNewest: 'Newest',
    allCategories: 'All categories',
    facilities: 'Facilities & services in this block',
    seeListings: 'See listings',
    pinned: 'Pinned',
    menu: 'Menu',
    achievers: 'Women Achievers',
    blog: 'Blog',
    social: 'Social Good',
    sponsors: 'Our Sponsors',
    sponsoredBy: 'Sponsored by',
    visitors: 'Visitors',
    addPhotos: 'Add photos',
    photosOptional: 'Photos optional · up to 3',
    more: 'More',
    schemes: "Women's Schemes",
    growTogether: 'We grow together',
    womenFocus: 'A community that puts its women entrepreneurs first',
    seeSchemes: 'Govt schemes for women',
  },
  ta: {
    appName: 'நம்ம பக்கம்',
    tagline: 'உங்கள் சமூகம், ஒரு தொடுதலில்',
    directory: 'பட்டியல்',
    classifieds: 'விற்பனை',
    ask: 'சமூகத்திடம் கேள்',
    notices: 'அறிவிப்புகள்',
    blocks: 'பிளாக்குகள்',
    search: 'வணிகம், சேவைகளைத் தேடு…',
    openNow: 'இப்போது திறந்துள்ளது',
    topRated: 'சிறந்த மதிப்பீடு',
    featured: 'சிறப்பு',
    categories: 'வகைகள்',
    viewAll: 'அனைத்தையும் பார்',
    call: 'அழை',
    whatsapp: 'வாட்ஸ்அப்',
    verified: 'சரிபார்க்கப்பட்டது',
    login: 'உள்நுழை',
    signup: 'இணை',
    logout: 'வெளியேறு',
    admin: 'நிர்வாகம்',
    pending: 'அனுமதிக்காக காத்திருக்கிறது',
    addListing: 'உங்கள் வணிகத்தைச் சேர்',
    noResults: 'எதுவும் கிடைக்கவில்லை. வேறு வகையை முயற்சிக்கவும்.',
    sortRating: 'மதிப்பீடு',
    sortNewest: 'புதியவை',
    allCategories: 'எல்லா வகைகளும்',
    facilities: 'இந்த பிளாக்கில் உள்ள சேவைகள்',
    seeListings: 'பட்டியலைப் பார்',
    pinned: 'பின் செய்யப்பட்டது',
    menu: 'மெனு',
    achievers: 'பெண் சாதனையாளர்கள்',
    blog: 'வலைப்பதிவு',
    social: 'சமூகப் பொறுப்பு',
    sponsors: 'எங்கள் நிதியுதவியாளர்கள்',
    sponsoredBy: 'நிதியுதவி',
    visitors: 'பார்வையாளர்கள்',
    addPhotos: 'படங்களைச் சேர்',
    photosOptional: 'படங்கள் விருப்பம் · 3 வரை',
    more: 'மேலும்',
    schemes: 'மகளிர் திட்டங்கள்',
    growTogether: 'ஒன்றாக வளர்வோம்',
    womenFocus: 'பெண் தொழில்முனைவோரை முதன்மைப்படுத்தும் சமூகம்',
    seeSchemes: 'பெண்களுக்கான அரசு திட்டங்கள்',
  },
  hi: {
    appName: 'नम्मा पक्कम',
    tagline: 'आपका समुदाय, एक टैप दूर',
    directory: 'निर्देशिका',
    classifieds: 'खरीद-बिक्री',
    ask: 'समुदाय से पूछें',
    notices: 'सूचनाएं',
    blocks: 'ब्लॉक',
    search: 'व्यवसाय, सेवाएं खोजें…',
    openNow: 'अभी खुला',
    topRated: 'शीर्ष रेटेड',
    featured: 'विशेष',
    categories: 'श्रेणियाँ',
    viewAll: 'सभी देखें',
    call: 'कॉल',
    whatsapp: 'व्हाट्सएप',
    verified: 'सत्यापित',
    login: 'लॉगिन',
    signup: 'शामिल हों',
    logout: 'लॉगआउट',
    admin: 'एडमिन',
    pending: 'स्वीकृति लंबित',
    addListing: 'अपना व्यवसाय जोड़ें',
    noResults: 'कुछ नहीं मिला। दूसरी श्रेणी या कीवर्ड आज़माएं।',
    sortRating: 'रेटिंग',
    sortNewest: 'नवीनतम',
    allCategories: 'सभी श्रेणियाँ',
    facilities: 'इस ब्लॉक की सेवाएं',
    seeListings: 'सूची देखें',
    pinned: 'पिन किया गया',
    menu: 'मेन्यू',
    achievers: 'महिला उपलब्धियाँ',
    blog: 'ब्लॉग',
    social: 'सामाजिक जिम्मेदारी',
    sponsors: 'हमारे प्रायोजक',
    sponsoredBy: 'प्रायोजक',
    visitors: 'आगंतुक',
    addPhotos: 'फ़ोटो जोड़ें',
    photosOptional: 'फ़ोटो वैकल्पिक · अधिकतम 3',
    more: 'और',
    schemes: 'महिला योजनाएं',
    growTogether: 'हम साथ बढ़ते हैं',
    womenFocus: 'महिला उद्यमियों को प्राथमिकता देने वाला समुदाय',
    seeSchemes: 'महिलाओं के लिए सरकारी योजनाएं',
  },
};

export type Dict = typeof dict.en;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: 'en',
  setLang: () => {},
  t: dict.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('pakkam-lang')) as Lang | null;
    if (saved === 'en' || saved === 'ta' || saved === 'hi') setLang(saved);
  }, []);
  const set = (l: Lang) => {
    setLang(l);
    if (typeof window !== 'undefined') localStorage.setItem('pakkam-lang', l);
  };
  return (
    <LangContext.Provider value={{ lang, setLang: set, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useI18n = () => useContext(LangContext);

// Pick the right category name for the active language (fall back to English).
export function catName(
  c: { name_en: string; name_ta: string | null; name_hi?: string | null },
  lang: Lang
) {
  if (lang === 'ta') return c.name_ta || c.name_en;
  if (lang === 'hi') return c.name_hi || c.name_en;
  return c.name_en;
}
