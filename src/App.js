import React, { useEffect, useState } from 'react';
import './index.css';
import LandingPage from './LandingPage';
import RegisterPage from './RegisterPage';
import SearchPage from './SearchPage';
import PropertyPage from './PropertyPage';
import AddPropertyPage from './AddPropertyPage';
import { properties as defaultProperties } from './data';

const LANG_FLAGS = { 'עברית':'🇮🇱','English':'🇬🇧','רוסית':'🇷🇺','אוקראינית':'🇺🇦','ספרדית':'🇪🇸','צרפתית':'🇫🇷','אמהרית':'🇪🇹','ערבית':'🇸🇦' };
const LANGS = [
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const translations = {
  he: {
    searchProperties: 'חיפוש דירות',
    addProperty: 'הוסף דירה',
    register: 'הרשמה',
    login: 'כניסה',
    logout: 'התנתק',
    landlord: 'בעל דירה',
    tenant: 'דייר',
    welcome: 'ברוך הבא ל-Olim Home',
    language: 'שפה',
    addNewProperty: 'הוספת נכס חדש',
    backToSearch: 'חזור לחיפוש',
    submitProperty: 'פרסם נכס',
    noPropertySelected: 'לא נבחר נכס',
    myProfile: 'הפרופיל שלי',
  },
  en: {
    searchProperties: 'Search Listings',
    addProperty: 'Add Property',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    landlord: 'Landlord',
    tenant: 'Tenant',
    welcome: 'Welcome to Olim Home',
    language: 'Language',
    addNewProperty: 'Add New Property',
    backToSearch: 'Back to search',
    submitProperty: 'Publish Property',
    noPropertySelected: 'No property selected',
    myProfile: 'My profile',
  },
};

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('properties');
    return saved ? JSON.parse(saved) : defaultProperties;
  });
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'he');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => translations[lang][key] || key;

  const handleRegister = (formData) => {
    setUser(formData);
    setPage('search');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  const handleAddProperty = (property) => {
    setProperties((prev) => [property, ...prev]);
    setPage('search');
  };

  const navigate = (p) => setPage(p);
  const isLandlord = user?.role === 'landlord';

  return (
    <div>
      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('landing')}>🏠 Olim Home</div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('search')}>{t('searchProperties')}</span>
          {isLandlord && (
            <span className="nav-link" onClick={() => navigate('addProperty')}>{t('addProperty')}</span>
          )}
          {!user ? (
            <>
              <span className="nav-link" onClick={() => navigate('register')}>{t('register')}</span>
              <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={() => navigate('register')}>
                {t('login')}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {user.languages?.slice(0, 2).map((l) => (
                <span key={l} style={{ fontSize: '18px' }}>{LANG_FLAGS[l] || l}</span>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '14px', color: '#0F1B2D', fontWeight: '600' }}>{user.fullName}</div>
                <button className="link-button" onClick={handleLogout}>{t('logout')}</button>
              </div>
            </div>
          )}
          <select
            className="language-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {LANGS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.flag} {option.label}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {page === 'landing' && <LandingPage onNavigate={navigate} t={t} lang={lang} />}
      {page === 'register' && <RegisterPage onNavigate={navigate} onRegister={handleRegister} t={t} lang={lang} />}
      {page === 'search' && (
        <SearchPage
          onNavigate={navigate}
          onSelectProperty={setSelectedProperty}
          user={user}
          properties={properties}
          t={t}
          lang={lang}
        />
      )}
      {page === 'addProperty' && <AddPropertyPage onAddProperty={handleAddProperty} user={user} t={t} lang={lang} />}
      {page === 'property' && <PropertyPage property={selectedProperty} onNavigate={navigate} user={user} t={t} lang={lang} />}
    </div>
  );
}
