'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'ta';

const dict = {
  en: {
    appName: 'Pakkam',
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
  },
  ta: {
    appName: 'பக்கம்',
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
    if (saved === 'en' || saved === 'ta') setLang(saved);
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

// Pick the right category name for the active language.
export function catName(c: { name_en: string; name_ta: string | null }, lang: Lang) {
  return lang === 'ta' && c.name_ta ? c.name_ta : c.name_en;
}
